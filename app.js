/**
 * OSD Connect (Odisha Swabhiman Defender)
 * Main Application Logic & State Management
 */

// Global State
const STATE = {
  lang: localStorage.getItem('osd_lang') || 'en',
  translations: {},
  currentScreen: 'splash', // splash, home, roles, apply, dashboard, work-log, admin
  selectedRole: 'OSD-VOL',
  memberToken: (function() {
    try {
      const t = localStorage.getItem('osd_member_token');
      return (t && t !== 'undefined' && t !== 'null') ? t : '';
    } catch (_) { return ''; }
  })(),
  member: (function() {
    try {
      const m = localStorage.getItem('osd_member');
      if (!m || m === 'undefined' || m === 'null') return null;
      const parsed = JSON.parse(m);
      return (parsed && typeof parsed === 'object') ? parsed : null;
    } catch (_) { return null; }
  })(),
  adminToken: (function() {
    try {
      const t = localStorage.getItem('osd_admin_token');
      return (t && t !== 'undefined' && t !== 'null') ? t : '';
    } catch (_) { return ''; }
  })(),
  admin: (function() {
    try {
      const a = localStorage.getItem('osd_admin');
      if (!a || a === 'undefined' || a === 'null') return null;
      const parsed = JSON.parse(a);
      return (parsed && typeof parsed === 'object') ? parsed : null;
    } catch (_) { return null; }
  })(),
  publicStats: {
    totalMembers: 0,
    approvedMembers: 0,
    activeDistricts: 0,
    activeConstituencies: 0
  },
  publicNews: [],
  myWorkLogs: [],
  adminApplications: [],
  adminSummary: null,
  adminAuditLogs: [],
  selectedApplicant: null,
  selectedPillar: null,
  registrationPhoto: ''
};

// API Helper
async function apiCall(action, data = {}, token = '') {
  const rawUrl = (typeof CONFIG !== 'undefined' && CONFIG.API_URL) ? String(CONFIG.API_URL).trim() : '';

  // 1. Validate API URL presence
  if (!rawUrl) {
    const errorMsg = (typeof t === 'function' && t('alerts.apiNotConfigured')) ||
      (STATE.lang === 'or' ? 'API URL ବିନ୍ୟାସ ହୋଇନାହିଁ। ଦୟାକରି config.js ଯାଞ୍ଚ କରନ୍ତୁ।' : 'Backend API URL is not configured in config.js.');
    console.error(`[API Error] Action "${action}" aborted: CONFIG.API_URL is empty.`);
    return { success: false, error: errorMsg };
  }

  // 2. Validate URL protocol
  if (!rawUrl.startsWith('https://')) {
    const errorMsg = STATE.lang === 'or'
      ? 'API URL ସୁରକ୍ଷିତ HTTPS ହେବା ଆବଶ୍ୟକ।'
      : 'Backend API URL must start with https://.';
    console.error(`[API Error] Action "${action}" aborted: Insecure or malformed URL: ${rawUrl}`);
    return { success: false, error: errorMsg };
  }

  // 3. Detect /dev URL mistake
  if (rawUrl.endsWith('/dev')) {
    console.warn(`[API Warning] CONFIG.API_URL ends in "/dev". Google Apps Script /dev test deployments require Google Workspace authentication and will fail CORS in frontend apps. Please use the "/exec" deployment URL.`);
  }

  // 4. Offline check
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    const errorMsg = (typeof t === 'function' && t('alerts.offlineError')) ||
      (STATE.lang === 'or' ? 'ଆପଣ ବର୍ତ୍ତମାନ ଅଫଲାଇନ୍ ଅଛନ୍ତି। ଦୟାକରି ଆପଣଙ୍କ ଇଣ୍ଟରନେଟ୍ ସଂଯୋଗ ଯାଞ୍ଚ କରନ୍ତୁ।' : 'You are currently offline. Please check your internet connection.');
    console.warn(`[API Offline] Action "${action}" aborted: Device is offline.`);
    return { success: false, error: errorMsg, isOffline: true };
  }

  try {
    // We use Content-Type: 'text/plain' without custom headers or complex parameters
    // to strictly avoid triggering a browser CORS preflight (OPTIONS) request,
    // which Google Apps Script Web Apps do not support.
    const res = await fetch(rawUrl, {
      method: 'POST',
      mode: 'cors',
      redirect: 'follow',
      headers: {
        'Content-Type': 'text/plain'
      },
      body: JSON.stringify({ action, token, data })
    });

    // 5. Check for HTTP level errors (e.g. 401, 403, 404, 500)
    if (!res.ok) {
      let detailMsg = '';
      try {
        const errText = await res.text();
        if (res.status === 401 || res.status === 403 || errText.includes('ServiceLogin') || errText.includes('drive.google.com')) {
          detailMsg = (STATE.lang === 'or')
            ? 'ସର୍ଭର ଅନୁମତି ତ୍ରୁଟି: Google Apps Script Web App "Who has access" କୁ "Anyone" ସେଟ୍ କରନ୍ତୁ।'
            : 'Backend permission error: Google Apps Script Web App must be deployed with "Who has access: Anyone".';
        } else {
          detailMsg = `Server returned HTTP ${res.status} (${res.statusText || 'Error'})`;
        }
      } catch (_) {
        detailMsg = `Server returned HTTP ${res.status}`;
      }
      console.error(`[API HTTP Error] Action: "${action}", Status: ${res.status}, Message:`, detailMsg);
      return { success: false, error: detailMsg, httpStatus: res.status };
    }

    // 6. Safe response text retrieval and JSON parsing
    const text = await res.text();
    let json;
    try {
      json = JSON.parse(text);
    } catch (parseErr) {
      console.error(`[API Parse Error] Action: "${action}", Failed to parse JSON response. Raw text:`, text.slice(0, 300));
      if (text.includes('accounts.google.com') || text.includes('ServiceLogin') || text.includes('drive.google.com')) {
        const gasMsg = (STATE.lang === 'or')
          ? 'ସର୍ଭର ପ୍ରବେଶ ଅନୁମତି ଆବଶ୍ୟକ। Google Apps Script ରେ "Who has access" କୁ "Anyone" ସେଟ୍ କରନ୍ତୁ।'
          : 'Google Apps Script requires authentication. Deploy Web App with "Who has access: Anyone".';
        return { success: false, error: gasMsg };
      }
      const genericMsg = (STATE.lang === 'or')
        ? 'ସର୍ଭରରୁ ଅବୈଧ ଉତ୍ତର ମିଳିଲା।'
        : 'Invalid JSON response from server.';
      return { success: false, error: genericMsg };
    }

    return json;
  } catch (err) {
    console.error(`[API Network/Fetch Error] Action: "${action}":`, err);

    let userFriendlyMsg = '';

    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      userFriendlyMsg = (typeof t === 'function' && t('alerts.offlineError')) ||
        (STATE.lang === 'or' ? 'ଆପଣ ବର୍ତ୍ତମାନ ଅଫଲାଇନ୍ ଅଛନ୍ତି। ଦୟାକରି ଇଣ୍ଟରନେଟ୍ ଯାଞ୍ଚ କରନ୍ତୁ।' : 'You are currently offline. Please check your internet connection.');
    } else if (err.name === 'TypeError' && (err.message === 'Failed to fetch' || err.message.includes('fetch'))) {
      console.error(
        `%c[OSD Connect API Diagnostic]%c\n` +
        `Action: "${action}"\n` +
        `Endpoint: ${rawUrl}\n` +
        `Error: "Failed to fetch" (Browser/WebView blocked cross-origin request)\n\n` +
        `PRIMARY ROOT CAUSES:\n` +
        `1. Google Apps Script Web App Access Permission:\n` +
        `   If "Who has access" is set to "Only myself" or restricted to your domain, Google returns a 401 or redirects to accounts.google.com without CORS headers.\n` +
        `   -> FIX: Open script.google.com -> Deploy -> Manage Deployments -> Edit -> Set "Who has access: Anyone" -> Version: "New version" -> Deploy.\n\n` +
        `2. Android WebView / Network Security Config:\n` +
        `   Ensure the device has active internet access and WebView allows secure HTTPS network requests.`,
        'color: #E8A33D; font-weight: bold; font-size: 13px;',
        'color: inherit;'
      );

      userFriendlyMsg = (typeof t === 'function' && t('alerts.serverConnectionError')) ||
        (STATE.lang === 'or'
          ? 'ସର୍ଭର ସହିତ ସଂଯୋଗ ହୋଇପାରିଲା ନାହିଁ। ଦୟାକରି ଇଣ୍ଟରନେଟ୍ ଯାଞ୍ଚ କରନ୍ତୁ କିମ୍ବା ସର୍ଭର ବିନ୍ୟାସ ଯାଞ୍ଚ କରନ୍ତୁ।'
          : 'Unable to connect to server. Please check your internet connection or verify backend deployment.');
    } else {
      userFriendlyMsg = err.message || ((typeof t === 'function' && t('alerts.networkError')) || 'Network request failed.');
    }

    return {
      success: false,
      error: userFriendlyMsg,
      originalError: err.message
    };
  }
}

// Translation Helper
function t(keyPath, fallback = '') {
  const keys = keyPath.split('.');
  let current = STATE.translations[STATE.lang];
  if (!current) return fallback;
  for (const k of keys) {
    if (current && current[k] !== undefined) {
      current = current[k];
    } else {
      return fallback;
    }
  }
  return typeof current === 'string' ? current : fallback;
}

// Load Translations
async function loadTranslations() {
  try {
    const [enRes, orRes] = await Promise.all([
      fetch('./en.json').then(r => r.json()),
      fetch('./or.json').then(r => r.json())
    ]);
    STATE.translations['en'] = enRes;
    STATE.translations['or'] = orRes;
  } catch (err) {
    console.warn('Could not fetch json translation files, using fallback defaults:', err);
  }
}


// ============================================================================
// Header Profile Menu & Logout UI Controllers
// ============================================================================
function updateHeaderProfileUI() {
  const profileBtn = document.getElementById('header-profile-btn');
  const profileMenu = document.getElementById('header-profile-menu');
  const tr = STATE.translations[STATE.lang] || {};
  const headerTr = tr.header || {};
  const dashTr = tr.dashboard || {};

  const isMemberLoggedIn = Boolean(STATE.memberToken && STATE.member);

  if (isMemberLoggedIn) {
    const member = STATE.member;
    const memberPhoto = member.photo || member.details?.photo || (member.code ? localStorage.getItem('osd_member_photo_' + member.code) : '') || '';

    if (profileBtn) {
      if (memberPhoto) {
        profileBtn.innerHTML = `<img src="${memberPhoto}" alt="${member.name || 'Profile'}" class="w-full h-full object-cover">`;
      } else {
        const initial = (member.name || 'M').charAt(0).toUpperCase();
        profileBtn.innerHTML = `
          <span class="font-bold text-xs text-[#FEB64E]">${initial}</span>
          <span class="absolute bottom-0.5 right-0.5 w-2 h-2 rounded-full bg-[#10B981] border border-[#08403C]"></span>
        `;
      }
    }

    if (profileMenu) {
      const status = member.status || 'Pending';
      const isApproved = (status === 'Approved');
      const statusBadge = isApproved 
        ? '<span class="text-[10px] font-bold text-[#00201D] bg-[#ABEFE7] px-2 py-0.5 rounded-full border border-[#0E5C56]">Approved</span>'
        : '<span class="text-[10px] font-bold text-[#714800] bg-[#FFDDB5] px-2 py-0.5 rounded-full border border-[#FEB64E]">Pending</span>';

      profileMenu.innerHTML = `
        <div class="flex items-center gap-2.5 pb-2.5 border-b border-[#EEE7E1]">
          <div class="w-10 h-10 rounded-full bg-[#00433E] text-[#FEB64E] flex items-center justify-center font-bold text-sm overflow-hidden flex-shrink-0 border border-[#E8A33D]/50">
            ${memberPhoto ? `<img src="${memberPhoto}" class="w-full h-full object-cover">` : (member.name || 'M').charAt(0).toUpperCase()}
          </div>
          <div class="min-w-0 flex-1">
            <h4 class="text-xs font-bold text-[#1E1B18] truncate">${member.name || 'Member'}</h4>
            <span class="text-[10.5px] font-mono text-[#0E5C56] font-semibold block">${member.code || ''}</span>
            <div class="mt-0.5">${statusBadge}</div>
          </div>
        </div>

        <div class="space-y-1 pt-1">
          <button onclick="navigateTo('dashboard'); closeHeaderProfileMenu();" class="w-full py-2 px-2.5 rounded-xl hover:bg-[#FAF2ED] text-xs font-bold text-[#00433E] flex items-center gap-2 transition-all">
            <span class="material-symbols-outlined text-[18px]">badge</span>
            <span>${headerTr.myProfile || (STATE.lang === 'or' ? 'ମୋର ପରିଚୟ ଓ ପ୍ରୋଫାଇଲ୍' : 'My ID & Dashboard')}</span>
          </button>
          <button onclick="handleMemberLogout()" class="w-full py-2 px-2.5 rounded-xl bg-[#FAF2ED] hover:bg-[#FFDAD6] text-xs font-bold text-[#BA1A1A] flex items-center gap-2 transition-all">
            <span class="material-symbols-outlined text-[18px]">logout</span>
            <span>${headerTr.logoutBtn || dashTr.logoutBtn || (STATE.lang === 'or' ? 'ଲଗ୍ ଆଉଟ୍' : 'Log Out')}</span>
          </button>
        </div>
      `;
    }
  } else {
    if (profileBtn) {
      profileBtn.innerHTML = '<span id="header-profile-icon" class="material-symbols-outlined text-[20px]">person</span>';
    }
    if (profileMenu) {
      profileMenu.classList.add('hidden');
    }
  }
}

function handleHeaderProfileClick() {
  if (STATE.memberToken && STATE.member) {
    const profileMenu = document.getElementById('header-profile-menu');
    if (profileMenu) {
      profileMenu.classList.toggle('hidden');
    }
  } else {
    navigateTo('dashboard');
  }
}

function closeHeaderProfileMenu() {
  const profileMenu = document.getElementById('header-profile-menu');
  if (profileMenu) profileMenu.classList.add('hidden');
}

// Close header menu on outside click
if (typeof document !== 'undefined') {
  document.addEventListener('click', (e) => {
    const menu = document.getElementById('header-profile-menu');
    const btn = document.getElementById('header-profile-btn');
    if (menu && !menu.classList.contains('hidden') && btn && !btn.contains(e.target) && !menu.contains(e.target)) {
      menu.classList.add('hidden');
    }
  });
}

// Language Switcher
function setLanguage(lang) {
  STATE.lang = lang;
  localStorage.setItem('osd_lang', lang);
  updateLanguageUI();
  updateHeaderProfileUI();
  renderCurrentScreen();
}

function toggleLanguage() {
  setLanguage(STATE.lang === 'en' ? 'or' : 'en');
}

function updateLanguageUI() {
  const pills = document.querySelectorAll('.lang-toggle-btn');
  pills.forEach(btn => {
    btn.innerHTML = `<span class="material-symbols-outlined text-[16px]">language</span> <span>${STATE.lang === 'en' ? 'EN / ଓଡ଼ିଆ' : 'ଓଡ଼ିଆ / EN'}</span>`;
  });
  const splashEn = document.getElementById('splash-lang-en');
  const splashOr = document.getElementById('splash-lang-or');
  if (splashEn && splashOr) {
    if (STATE.lang === 'en') {
      splashEn.className = 'px-3.5 py-1 rounded-full text-[11px] font-bold bg-[#E8A33D] text-[#08403C] shadow transition-all';
      splashOr.className = 'px-3.5 py-1 rounded-full text-[11px] font-medium text-[#FAF6EE]/70 hover:text-white transition-all';
    } else {
      splashOr.className = 'px-3.5 py-1 rounded-full text-[11px] font-bold bg-[#E8A33D] text-[#08403C] shadow transition-all';
      splashEn.className = 'px-3.5 py-1 rounded-full text-[11px] font-medium text-[#FAF6EE]/70 hover:text-white transition-all';
    }
  }
}

// Navigation / Screen Router
function navigateTo(screen, param) {
  if (screen === 'apply' && param) {
    STATE.selectedRole = param;
  }
  STATE.currentScreen = screen;
  window.location.hash = '#' + screen;
  window.scrollTo({ top: 0, behavior: 'smooth' });
  renderCurrentScreen();
  updateNavUI();
  updateHeaderProfileUI();
}

function updateNavUI() {
  const navBar = document.getElementById('bottom-nav');
  const header = document.getElementById('main-header');
  const footer = document.getElementById('global-screen-footer');
  const viewport = document.getElementById('app-viewport');

  if (STATE.currentScreen === 'splash') {
    if (navBar) navBar.classList.add('hidden');
    if (header) header.classList.add('hidden');
    if (footer) footer.classList.add('hidden');
    if (viewport) {
      viewport.classList.remove('has-fixed-header');
      viewport.style.paddingTop = '0px';
    }
  } else {
    if (navBar) navBar.classList.remove('hidden');
    if (header) header.classList.remove('hidden');
    if (footer) footer.classList.remove('hidden');
    if (viewport) {
      viewport.classList.add('has-fixed-header');
      viewport.style.paddingTop = 'calc(4.75rem + env(safe-area-inset-top, 0px))';
    }
  }

  // Active tab indicator
  const navItems = document.querySelectorAll('.nav-tab-item');
  navItems.forEach(item => {
    const path = item.getAttribute('data-path');
    const isCurrent = (
      (path === 'home' && STATE.currentScreen === 'home') ||
      (path === 'join' && (STATE.currentScreen === 'roles' || STATE.currentScreen === 'apply')) ||
      (path === 'dashboard' && STATE.currentScreen === 'dashboard') ||
      (path === 'work-log' && STATE.currentScreen === 'work-log') ||
      (path === 'admin' && STATE.currentScreen === 'admin')
    );
    if (isCurrent) {
      item.classList.add('text-[#00433E]', 'font-bold');
      item.classList.remove('text-[#3F4947]');
      const ind = item.querySelector('.nav-indicator');
      if (ind) {
        ind.classList.remove('w-0');
        ind.classList.add('w-6', 'bg-[#E8A33D]');
      }
    } else {
      item.classList.remove('text-[#00433E]', 'font-bold');
      item.classList.add('text-[#3F4947]');
      const ind = item.querySelector('.nav-indicator');
      if (ind) {
        ind.classList.remove('w-6', 'bg-[#E8A33D]');
        ind.classList.add('w-0');
      }
    }
  });
}

// Toast helper
function showToast(message, type = 'info') {
  const toast = document.getElementById('global-toast');
  const msg = document.getElementById('global-toast-msg');
  const icon = document.getElementById('global-toast-icon');
  if (!toast || !msg) return;

  msg.textContent = message;
  if (icon) {
    icon.textContent = type === 'error' ? 'error' : (type === 'success' ? 'check_circle' : 'info');
  }
  toast.classList.remove('opacity-0', 'pointer-events-none', '-translate-y-4');
  toast.classList.add('opacity-100', 'translate-y-0');

  setTimeout(() => {
    toast.classList.remove('opacity-100', 'translate-y-0');
    toast.classList.add('opacity-0', 'pointer-events-none', '-translate-y-4');
  }, 3200);
}


// Helper to reliably trigger file input across mobile browsers & Android WebView
function triggerPhotoPicker(inputId) {
  const input = document.getElementById(inputId);
  if (!input) {
    console.warn('triggerPhotoPicker: element not found:', inputId);
    return;
  }
  input.value = ''; // Always clear value so selecting same file triggers change
  try {
    input.click();
  } catch (err) {
    console.warn('Direct input.click() failed, attempting MouseEvent dispatch:', err);
    try {
      const evt = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });
      input.dispatchEvent(evt);
    } catch (_) {}
  }
}

// ============================================================================
// Client-Side Image Compression & Resizing Helper
// ============================================================================
function compressImage(file, maxWidth = 400, maxHeight = 400, quality = 0.82) {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error('No image file selected'));
    }

    // Permissive check for Android WebView where file.type can be empty or generic
    const isImage = (file.type && file.type.startsWith('image/')) ||
                    (/\.(jpe?g|png|webp|bmp|gif|heic|heif|jfif)$/i.test(file.name || '')) ||
                    (!file.type && file.size > 0);
    if (!isImage) {
      return reject(new Error('Invalid image file format'));
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width || 400;
        let height = img.height || 400;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        let dataUrl = '';
        try {
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        } catch (_) {
          dataUrl = canvas.toDataURL();
        }
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Failed to load image into canvas for compression'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });
}

// ============================================================================
// Canvas ID Card & Certificate Renderers
// ============================================================================

function drawDigitalIdCard(member, memberPhoto = '') {
  const canvas = document.getElementById('id-card-canvas');
  const imgTarget = document.getElementById('id-card-img');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const width = 800;
  const height = 480;
  canvas.width = width;
  canvas.height = height;

  const isExecutive = ['OSD-FC', 'OSD-PE', 'OSD-AC'].includes(member.type);

  // Background Gradient
  const grad = ctx.createLinearGradient(0, 0, width, height);
  if (isExecutive) {
    // High Council Maroon / Gold
    grad.addColorStop(0, '#5C141E');
    grad.addColorStop(0.5, '#7A1F2B');
    grad.addColorStop(1, '#3B0A12');
  } else {
    // Standard Deep Teal
    grad.addColorStop(0, '#00433E');
    grad.addColorStop(0.5, '#0E5C56');
    grad.addColorStop(1, '#08403C');
  }
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Outer Gold Inset Border
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#E8A33D';
  ctx.strokeRect(12, 12, width - 24, height - 24);

  ctx.lineWidth = 1;
  ctx.strokeStyle = 'rgba(254, 182, 78, 0.4)';
  ctx.strokeRect(18, 18, width - 36, height - 36);

  // Subtle Watermark Wheel in background
  ctx.save();
  ctx.strokeStyle = 'rgba(232, 163, 61, 0.08)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(width - 80, height - 80, 160, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(width - 80, height - 80, 100, 0, 2 * Math.PI);
  ctx.stroke();
  for (let a = 0; a < 360; a += 30) {
    const rad = (a * Math.PI) / 180;
    ctx.moveTo(width - 80, height - 80);
    ctx.lineTo(width - 80 + Math.cos(rad) * 160, height - 80 + Math.sin(rad) * 160);
  }
  ctx.stroke();
  ctx.restore();

  // Header Logo & Text
  const badgeImg = new Image();
  badgeImg.src = './assets/osd-badge.png';
  badgeImg.onload = () => {
    ctx.drawImage(badgeImg, 32, 28, 64, 64);
    finishDrawing();
  };
  badgeImg.onerror = () => {
    finishDrawing();
  };

  function finishDrawing() {
    // Header Title
    ctx.fillStyle = '#FFFDF8';
    ctx.font = 'bold 24px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('OSD CONNECT', 110, 52);

    ctx.fillStyle = '#E8A33D';
    ctx.font = '600 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('ODISHA SWABHIMAN DEFENDER | ଆମ ସ୍ୱାଭିମାନ, ଆମ ଅଧିକାର', 110, 72);

    // Header Right Pill
    ctx.fillStyle = isExecutive ? '#E8A33D' : '#08403C';
    ctx.fillRect(width - 220, 36, 188, 28);
    ctx.fillStyle = isExecutive ? '#201D1A' : '#E8A33D';
    ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(isExecutive ? '★ HIGH COUNCIL CREDENTIAL' : '✓ VERIFIED CITIZEN CREDENTIAL', width - 126, 54);
    ctx.textAlign = 'left';

    // Divider Line
    ctx.strokeStyle = 'rgba(232, 163, 61, 0.5)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(32, 104);
    ctx.lineTo(width - 32, 104);
    ctx.stroke();

    // Member Photo Box / Portrait coordinates
    const boxX = 36, boxY = 120, boxW = 110, boxH = 130;
    const resolvedPhoto = memberPhoto || member.photo || member.details?.photo || (member.code ? localStorage.getItem('osd_member_photo_' + member.code) : '') || '';

    // Member Details Block
    ctx.fillStyle = 'rgba(250, 246, 238, 0.7)';
    ctx.font = '500 12px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('DEFENDER NAME / ନାମ:', 168, 136);

    ctx.fillStyle = '#FFFDF8';
    ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
    ctx.fillText((member.name || 'Member Name').toUpperCase(), 168, 162);

    // Role Badge Pill
    const roleMap = {
      'OSD-VOL': 'Volunteer • ସ୍ୱେଚ୍ଛାସେବୀ',
      'OSD-PM': 'Primary Member • ପ୍ରାଥମିକ ସଦସ୍ୟ',
      'OSD-AM': 'Active Member • ସକ୍ରିୟ ସଦସ୍ୟ',
      'OSD-COORD': 'Local Coordinator • ଆଞ୍ଚଳିକ ସଂଯୋଜକ',
      'OSD-LDR': 'Leadership Aspirant • ନେତୃତ୍ୱ ଆକାଂକ୍ଷୀ',
      'OSD-SUP': 'Supporter • ସମର୍ଥକ',
      'OSD-FC': 'Founding Circle • ପ୍ରତିଷ୍ଠାତା ମଣ୍ଡଳୀ',
      'OSD-PE': 'Professional Expert • ବୃତ୍ତିଗତ ବିଶେଷଜ୍ଞ',
      'OSD-AC': 'Advisory Council • ଉପଦେଷ୍ଟା ପରିଷଦ'
    };
    const roleText = roleMap[member.type] || member.type || 'Defender';

    ctx.fillStyle = 'rgba(232, 163, 61, 0.15)';
    ctx.fillRect(168, 174, 380, 26);
    ctx.fillStyle = '#E8A33D';
    ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(roleText, 178, 191);

    // 2-Column Info Grid
    ctx.fillStyle = 'rgba(250, 246, 238, 0.7)';
    ctx.font = '500 11px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('OSD ID:', 168, 222);
    ctx.fillText('DISTRICT:', 360, 222);

    ctx.fillStyle = '#FFFDF8';
    ctx.font = 'bold 14px monospace';
    ctx.fillText(member.code || 'OSD-VOL-00000', 168, 240);
    ctx.font = 'bold 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(member.district || 'Odisha', 360, 240);

    ctx.fillStyle = 'rgba(250, 246, 238, 0.7)';
    ctx.font = '500 11px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('CONTACT:', 168, 264);
    ctx.fillText('CONSTITUENCY:', 360, 264);

    ctx.fillStyle = '#FFFDF8';
    ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
    const phoneDisplay = isExecutive ? '[PRIVACY PROTECTED]' : (member.phone ? '+91 ' + member.phone : 'Protected');
    ctx.fillText(phoneDisplay, 168, 280);
    ctx.fillText(member.constituency || 'Odisha Central', 360, 280);

    // Dates & Validity
    const joinDateObj = member.joinDate ? new Date(member.joinDate) : new Date();
    const validDateObj = new Date(joinDateObj);
    validDateObj.setFullYear(validDateObj.getFullYear() + 1);

    const issuedStr = joinDateObj.toISOString().slice(0, 10);
    const validStr = validDateObj.toISOString().slice(0, 10);

    ctx.fillStyle = 'rgba(250, 246, 238, 0.7)';
    ctx.font = '500 11px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('ISSUED: ' + issuedStr, 168, 305);
    ctx.fillText('VALID UPTO: ' + validStr, 360, 305);

    // Prominent Validity Banner on the Card
    ctx.fillStyle = 'rgba(232, 163, 61, 0.2)';
    ctx.fillRect(36, 324, width - 72, 28);
    ctx.fillStyle = '#E8A33D';
    ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('This card is valid for one year only. • ଏହି କାର୍ଡ କେବଳ ଏକ ବର୍ଷ ପାଇଁ ବୈଧ।', width / 2, 342);
    ctx.textAlign = 'left';

    // QR Code in bottom-right
    const qrCanvas = document.createElement('canvas');
    const qrData = 'OSD|' + (member.code || '') + '|' + (member.type || '') + '|' + (member.status || 'Active');
    if (window.OSD_QRCode) {
      const qr = new window.OSD_QRCode(qrData, 'M');
      qr.drawOnCanvas(qrCanvas, 90, 4, '#08403C', '#FFFDF8');
      ctx.drawImage(qrCanvas, width - 136, 362, 90, 90);
    }

    function drawSignatureAndFinalize() {
      const sigImg = new Image();
      sigImg.src = './assets/signature.png';
      sigImg.onload = () => {
        ctx.drawImage(sigImg, 360, 360, 140, 45);
        renderSignatoryFooter();
      };
      sigImg.onerror = () => {
        ctx.fillStyle = '#E8A33D';
        ctx.font = 'italic 20px "Cinzel", "Times New Roman", serif';
        ctx.fillText('K. M. Dash', 370, 395);
        renderSignatoryFooter();
      };
    }

    // Draw member photo or initials inside gold frame
    if (resolvedPhoto) {
      const photoImg = new Image();
      photoImg.onload = () => {
        ctx.save();
        ctx.beginPath();
        ctx.rect(boxX, boxY, boxW, boxH);
        ctx.clip();

        const imgAspect = photoImg.width / photoImg.height;
        const boxAspect = boxW / boxH;
        let drawW = boxW, drawH = boxH, drawX = boxX, drawY = boxY;

        if (imgAspect > boxAspect) {
          drawH = boxH;
          drawW = boxH * imgAspect;
          drawX = boxX + (boxW - drawW) / 2;
          drawY = boxY;
        } else {
          drawW = boxW;
          drawH = boxW / imgAspect;
          drawX = boxX;
          drawY = boxY + (boxH - drawH) / 2;
        }

        ctx.drawImage(photoImg, drawX, drawY, drawW, drawH);
        ctx.restore();

        // Crisp Gold Inset Border on photo
        ctx.strokeStyle = '#E8A33D';
        ctx.lineWidth = 2;
        ctx.strokeRect(boxX, boxY, boxW, boxH);

        drawSignatureAndFinalize();
      };
      photoImg.onerror = () => {
        drawInitialsPlaceholder();
        drawSignatureAndFinalize();
      };
      photoImg.src = resolvedPhoto;
    } else {
      drawInitialsPlaceholder();
      drawSignatureAndFinalize();
    }

    function drawInitialsPlaceholder() {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.fillRect(boxX, boxY, boxW, boxH);
      ctx.strokeStyle = '#E8A33D';
      ctx.lineWidth = 2;
      ctx.strokeRect(boxX, boxY, boxW, boxH);

      ctx.fillStyle = '#E8A33D';
      ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      const initials = (member.name || 'OSD').split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
      ctx.fillText(initials, 91, 195);
      ctx.textAlign = 'left';
    }

    function renderSignatoryFooter() {
      ctx.fillStyle = 'rgba(250, 246, 238, 0.85)';
      ctx.font = '600 11px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('Authorized Signatory — OSD Connect', 320, 420);

      // Statutory disclaimer at the bottom of the card
      ctx.fillStyle = 'rgba(250, 246, 238, 0.6)';
      ctx.font = '400 9.5px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('This card is not a political party membership or a government credential.', 36, 442);
      ctx.fillText('(ଏହା କୌଣସି ରାଜନୈତିକ ଦଳର ସଦସ୍ୟତା କିମ୍ବା ସରକାରୀ ପ୍ରମାଣପତ୍ର ନୁହେଁ।)', 36, 458);

      // Convert to crisp image for WebView press-and-hold & sharing without CORS taint
      if (imgTarget) {
        imgTarget.src = canvas.toDataURL('image/png');
        imgTarget.alt = 'OSD Connect Digital Identity Card';
      }
    }
  }
}

function drawRecognitionCertificate(member) {
  const canvas = document.getElementById('cert-canvas');
  const imgTarget = document.getElementById('cert-img');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const width = 1000;
  const height = 700;
  canvas.width = width;
  canvas.height = height;

  // Parchment Background
  ctx.fillStyle = '#FAF6EE';
  ctx.fillRect(0, 0, width, height);

  // Ornate Double Border
  ctx.lineWidth = 14;
  ctx.strokeStyle = '#7A1F2B';
  ctx.strokeRect(20, 20, width - 40, height - 40);

  ctx.lineWidth = 3;
  ctx.strokeStyle = '#E8A33D';
  ctx.strokeRect(34, 34, width - 68, height - 68);

  ctx.lineWidth = 1;
  ctx.strokeStyle = 'rgba(122, 31, 43, 0.3)';
  ctx.strokeRect(40, 40, width - 80, height - 80);

  // Badge in Header
  const badgeImg = new Image();
  badgeImg.src = './assets/osd-badge.png';
  badgeImg.onload = () => {
    ctx.drawImage(badgeImg, width / 2 - 45, 55, 90, 90);
    finishCert();
  };
  badgeImg.onerror = () => {
    finishCert();
  };

  function finishCert() {
    ctx.textAlign = 'center';

    ctx.fillStyle = '#7A1F2B';
    ctx.font = 'bold 30px "Cinzel", "Plus Jakarta Sans", serif';
    ctx.fillText('ODISHA SWABHIMAN DEFENDER', width / 2, 180);

    ctx.fillStyle = '#835400';
    ctx.font = '600 15px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('ଆମ ସ୍ୱାଭିମାନ, ଆମ ଅଧିକାର • AMA SWABHIMAN, AMA ADHIKAR', width / 2, 204);

    ctx.fillStyle = '#201D1A';
    ctx.font = 'bold 22px "Cinzel", "Plus Jakarta Sans", serif';
    ctx.fillText('CERTIFICATE OF CIVIC RECOGNITION', width / 2, 255);

    ctx.fillStyle = '#7A1F2B';
    ctx.font = '600 14px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('ସ୍ୱାଭିମାନ ସମ୍ମାନ ପତ୍ର', width / 2, 276);

    ctx.fillStyle = '#3F4947';
    ctx.font = '400 16px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('This certificate of civic honor and constitutional defense is proudly conferred upon:', width / 2, 330);

    // Recipient Name
    ctx.fillStyle = '#08403C';
    ctx.font = 'bold 34px "Cinzel", "Plus Jakarta Sans", serif';
    ctx.fillText((member.name || 'Honored Defender').toUpperCase(), width / 2, 385);

    // Role & Region
    const roleName = member.type === 'OSD-FC' ? 'Founding Circle (ପ୍ରତିଷ୍ଠାତା ମଣ୍ଡଳୀ)' :
                     (member.type === 'OSD-PE' ? 'Professional Expert (ବୃତ୍ତିଗତ ବିଶେଷଜ୍ଞ)' :
                     (member.type === 'OSD-AC' ? 'Advisory Council (ଉପଦେଷ୍ଟା ପରିଷଦ)' : 'Swabhiman Defender'));
    ctx.fillStyle = '#7A1F2B';
    ctx.font = 'bold 18px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(roleName, width / 2, 424);

    ctx.fillStyle = '#3F4947';
    ctx.font = '500 15px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('District: ' + (member.district || 'Odisha') + ' • ID: ' + (member.code || 'OSD-00000'), width / 2, 452);

    ctx.fillStyle = '#201D1A';
    ctx.font = 'italic 15px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('In recognition of exemplary commitment to citizen dignity, constitutional welfare,', width / 2, 495);
    ctx.fillText('and the holistic cultural protection of Odisha.', width / 2, 518);

    // Bottom Signatures & Details
    const joinDateObj = member.joinDate ? new Date(member.joinDate) : new Date();
    const dateStr = joinDateObj.toISOString().slice(0, 10);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#3F4947';
    ctx.font = '600 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Issued: ' + dateStr, 90, 600);
    ctx.fillText('Cert ID: OSD-HON-' + (member.code || '001'), 90, 622);

    // Founder Signature
    const sigImg = new Image();
    sigImg.src = './assets/signature.png';
    sigImg.onload = () => {
      ctx.drawImage(sigImg, width - 280, 560, 180, 50);
      drawCertSignatory();
    };
    sigImg.onerror = () => {
      ctx.fillStyle = '#7A1F2B';
      ctx.font = 'italic 24px "Cinzel", serif';
      ctx.fillText('K. M. Dash', width - 260, 595);
      drawCertSignatory();
    };

    function drawCertSignatory() {
      ctx.textAlign = 'center';
      ctx.fillStyle = '#201D1A';
      ctx.font = 'bold 13px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('Krushna Mohan Dash', width - 190, 620);
      ctx.fillStyle = '#7A1F2B';
      ctx.font = '600 11px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('Founder & Chairperson — OSD Connect', width - 190, 638);

      // Compliance Notice
      ctx.fillStyle = '#6F7977';
      ctx.font = '400 10.5px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('This card is not a political party membership or a government credential.', width / 2, 665);

      if (imgTarget) {
        imgTarget.src = canvas.toDataURL('image/png');
        imgTarget.alt = 'OSD Recognition Certificate';
      }
    }
  }
}

// Download Canvas PNG Helper
function downloadCanvasImage(canvasId, filename) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast('Image downloaded successfully: ' + filename, 'success');
}

// Share Credential Helper (Web Share API)
async function shareCredential() {
  const canvas = document.getElementById('id-card-canvas');
  if (!canvas) return;

  if (navigator.share) {
    try {
      canvas.toBlob(async (blob) => {
        const file = new File([blob], 'OSD_Identity_Card.png', { type: 'image/png' });
        await navigator.share({
          title: 'My OSD Connect Digital Credential',
          text: 'Verified Member of OSD Connect (Odisha Swabhiman Defender) - Ama Swabhiman, Ama Adhikar',
          files: [file]
        });
        showToast('Credential shared!', 'success');
      });
    } catch (err) {
      if (err.name !== 'AbortError') {
        downloadCanvasImage('id-card-canvas', 'OSD_ID_Card.png');
      }
    }
  } else {
    downloadCanvasImage('id-card-canvas', 'OSD_ID_Card.png');
    showToast('Saved to device storage.', 'info');
  }
}

// ============================================================================
// Screen Renderers
// ============================================================================

function renderCurrentScreen() {
  const container = document.getElementById('screen-content');
  if (!container) return;

  switch (STATE.currentScreen) {
    case 'splash':
      renderSplashScreen();
      break;
    case 'home':
      renderHomeScreen();
      break;
    case 'roles':
      renderRolesScreen();
      break;
    case 'apply':
      renderApplyScreen();
      break;
    case 'dashboard':
      renderDashboardScreen();
      break;
    case 'work-log':
      renderWorkLogScreen();
      break;
    case 'admin':
      renderAdminScreen();
      break;
    default:
      renderHomeScreen();
  }
}

// ----------------------------------------------------------------------------
// 1. Splash Screen
// ----------------------------------------------------------------------------
function renderSplashScreen() {
  const container = document.getElementById('screen-content');
  const tr = STATE.translations[STATE.lang] || {};
  const appTr = tr.app || {};

  container.innerHTML = `
    <div class="relative w-full max-w-[440px] mx-auto min-h-screen flex flex-col justify-between px-6 pt-10 pb-8 text-[#FAF6EE] overflow-hidden" style="background: radial-gradient(circle at 50% 32%, #0a4f4a 0%, #08403C 42%, #042220 85%, #021413 100%);">
      <div aria-hidden="true" class="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 bg-[#E8A33D]/10 rounded-full blur-3xl pointer-events-none"></div>

      <!-- Centerpiece Identity -->
      <section class="flex flex-col items-center text-center mt-6 z-10">
        <div class="relative flex items-center justify-center mb-5">
          <div aria-hidden="true" class="absolute w-[142px] h-[142px] rounded-full border border-[#E8A33D]/40 bg-[#063330]/60 shadow-[0_0_50px_rgba(232,163,61,0.25)] animate-pulse"></div>
          <div class="relative w-28 h-28 rounded-full overflow-hidden flex items-center justify-center z-10 border-2 border-[#E8A33D] shadow-2xl bg-[#08403C]">
            <img alt="OSD Shield Badge" class="w-full h-full object-cover scale-105" src="./assets/osd-badge.png">
          </div>
        </div>

        <h1 class="text-[32px] font-extrabold tracking-wide text-[#FAF6EE] drop-shadow-md font-['Cinzel']">
          OSD Connect
          </h1>
        <p class="text-[11px] tracking-[0.24em] font-bold text-[#E8A33D] uppercase mt-1 mb-2">
          Odisha Swabhiman Defender
        </p>

        <div class="mt-2 flex flex-col items-center">
          <span class="text-[#E8A33D] font-bold text-sm tracking-wide">"Ama Swabhiman, Ama Adhikar"</span>
          <span class="text-[#FAF6EE]/90 text-sm font-semibold mt-0.5">"ଆମ ସ୍ୱାଭିମାନ, ଆମ ଅଧିକାର"</span>
        </div>

        <div class="mt-5 inline-flex items-center px-3.5 py-1.5 rounded-full bg-white/[0.08] border border-white/15 backdrop-blur-md">
          <span class="w-2 h-2 rounded-full bg-[#E8A33D] mr-2 animate-ping"></span>
          <p class="text-[10px] font-medium tracking-tight text-[#FAF6EE]/95">
            Non-Political Sovereign Citizen Movement | ସ୍ୱାଭିମାନ ସୁରକ୍ଷା ମଞ୍ଚ
          </p>
        </div>
      </section>

      <!-- Navigation & Language Area -->
      <section class="flex flex-col items-center w-full z-10 space-y-5">
        <!-- Bilingual Segmented Language Switcher -->
        <div aria-label="Language Selector" class="inline-flex items-center bg-[#031d1b]/90 border border-[#E8A33D]/40 p-1 rounded-full text-xs shadow-inner">
          <span class="pl-2.5 pr-1 text-[#E8A33D] flex items-center">
            <span class="material-symbols-outlined text-[16px]">language</span>
          </span>
          <button id="splash-lang-en" onclick="setLanguage('en')" class="px-3.5 py-1 rounded-full text-[11px] ${STATE.lang === 'en' ? 'font-bold bg-[#E8A33D] text-[#08403C] shadow' : 'text-[#FAF6EE]/70 font-medium'} transition-all" type="button">
            English
          </button>
          <button id="splash-lang-or" onclick="setLanguage('or')" class="px-3.5 py-1 rounded-full text-[11px] ${STATE.lang === 'or' ? 'font-bold bg-[#E8A33D] text-[#08403C] shadow' : 'text-[#FAF6EE]/70 font-medium'} transition-all" type="button">
            ଓଡ଼ିଆ
          </button>
        </div>

        <!-- Primary Enter Portal CTA -->
        <div class="w-full">
          <button onclick="navigateTo('home')" class="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#E8A33D] to-[#F4BA60] text-[#08403C] font-bold text-base tracking-wide shadow-lg shadow-[#E8A33D]/25 hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
            <span>${appTr.enterPortal || 'Enter Portal'}</span>
            <span class="font-normal text-xs opacity-90">/ ${appTr.enterPortalSub || 'ପ୍ରବେଶ କରନ୍ତୁ'}</span>
            <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>

        <!-- Timer Bar -->
        <div class="w-full flex flex-col items-center pt-1">
          <p class="text-[10px] text-[#FAF6EE]/75 font-medium mb-1.5">
            ${appTr.autoDirecting || 'Tap to begin or auto-directing to Home...'}
          </p>
          <div class="w-36 h-[2.5px] bg-white/10 rounded-full overflow-hidden">
            <div class="h-full bg-[#E8A33D] rounded-full w-full transition-all duration-3000"></div>
          </div>
        </div>

        <div>
          <button onclick="navigateTo('roles')" class="text-xs text-[#FAF6EE]/90 hover:text-[#E8A33D] underline underline-offset-4 decoration-[#E8A33D]/50 transition-colors font-medium">
            ${appTr.newMemberRegister || 'New Member? Register Here'}
          </button>
        </div>
      </section>

      <!-- Sovereign Civic Disclaimer Footer -->
      <footer class="w-full text-center pt-4 pb-2 z-10 border-t border-white/10">
        <p class="text-[10px] leading-relaxed text-[#FAF6EE]/75 font-normal">
          ${appTr.screenFooter || 'Odisha Swabhiman Defender (OSD) is a citizen movement and is not a registered political party.'}
        </p>
        <p class="text-[9.5px] leading-relaxed text-[#FAF6EE]/60 mt-0.5">
          ${appTr.screenFooterOr || '(ଏହା ଏକ ନାଗରିକ ଆନ୍ଦୋଳନ, କୌଣସି ରାଜନୈତିକ ଦଳ ନୁହେଁ)'}
        </p>
      </footer>
    </div>
  `;
}

// ----------------------------------------------------------------------------
// 2. Home Screen
// ----------------------------------------------------------------------------
function renderHomeScreen() {
  const container = document.getElementById('screen-content');
  const tr = STATE.translations[STATE.lang] || {};
  const homeTr = tr.home || {};
  const pillarsList = tr.pillars || [];

  const stats = STATE.publicStats || {};
  const totalDisplay = stats.totalMembers > 0 ? stats.totalMembers.toLocaleString() : 'Live';
  const approvedDisplay = stats.approvedMembers > 0 ? stats.approvedMembers.toLocaleString() : 'Live';
  const activeDistricts = Number(stats.activeDistricts) || 0;
  const districtDisplay = `${activeDistricts} / 30`;

  container.innerHTML = `
    <div class="flex flex-col w-full pb-28 pt-2 max-w-[520px] mx-auto px-3.5 space-y-4">
      
      <!-- Hero Banner -->
      <section class="w-full">
        <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#00433E] via-[#0E5C56] to-[#08403C] text-[#FFFDF8] p-5 shadow-lg border border-[#E8A33D]/30">
          <div class="relative z-10 flex flex-col items-center text-center">
            
            <!-- Shield Emblem (assets/osd-badge.png) -->
            <div class="relative mb-3 flex items-center justify-center">
              <img src="./assets/osd-badge.png" alt="OSD Shield Logo" class="w-20 h-20 rounded-full object-cover border-2 border-[#E8A33D] shadow-xl">
            </div>

            <h2 class="text-2xl font-bold tracking-tight text-[#FFFDF8] font-['Cinzel']">
              ${homeTr.heroTitle || 'Odisha Swabhiman Defender'}
            </h2>
            <div class="mt-1 bg-[#ABefe7]/15 px-3 py-1 rounded-full text-[#FEB64E] font-semibold text-xs tracking-wide">
              ${homeTr.heroOdiaTagline || 'ଆମ ସ୍ୱାଭିମାନ, ଆମ ଅଧିକାର'}
            </div>
            <p class="text-xs text-[#8ED2CA] mt-0.5 tracking-wide">
              ${homeTr.heroTagline || 'Ama Swabhiman, Ama Adhikar'}
            </p>
            <p class="text-xs text-[#FAF6EE]/90 mt-2.5 leading-relaxed max-w-sm">
              ${homeTr.heroDesc || 'A non-political, sovereign citizen movement for the dignity, cultural pride, and constitutional rights of Odisha.'}
            </p>

            <!-- Primary Join CTA -->
            <button onclick="navigateTo('roles')" class="mt-4 w-full bg-[#FEB64E] hover:bg-[#E8A33D] text-[#714800] py-3 px-4 rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-transform active:scale-[0.98]">
              <span>${homeTr.joinBtn || 'Join OSD Connect (ଯୋଗ ଦିଅନ୍ତୁ)'}</span>
              <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>

            <div class="mt-2.5 flex items-center gap-1.5 text-[#8ED2CA] text-[11px] font-semibold">
              <span class="material-symbols-outlined text-[15px] text-[#FEB64E]">verified_user</span>
              <span>${homeTr.verifiedCharter || 'Verified Grassroots Charter • 30 Districts'}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Live Movement Stats (from getPublicNews) -->
      <section class="w-full">
        <div class="grid grid-cols-2 gap-2.5">
          <div class="bg-[#FFFDF8] rounded-xl p-3 shadow-sm border border-[#E2DAC8] flex flex-col justify-between">
            <span class="text-[11px] font-medium text-[#3F4947]">Verified Defenders</span>
            <div class="mt-1 flex items-baseline gap-1">
              <span class="text-2xl font-extrabold text-[#00433E]">${approvedDisplay}</span>
              <span class="text-[10px] text-[#835400] font-bold">Approved</span>
            </div>
          </div>
          <div class="bg-[#FFFDF8] rounded-xl p-3 shadow-sm border border-[#E2DAC8] flex flex-col justify-between">
            <span class="text-[11px] font-medium text-[#3F4947]">${homeTr.districtCoverage || 'District Coverage'}</span>
            <div class="mt-1 flex items-baseline gap-1">
              <span class="text-2xl font-extrabold text-[#00433E]">${districtDisplay}</span>
              <span class="text-[10px] text-[#0E5C56] font-bold">${homeTr.activeChapters || 'Active Chapters'}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Public Announcements / News Feed -->
      <section class="w-full">
        <div class="flex items-center justify-between mb-2 px-1">
          <div class="flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[#E8A33D] text-[18px]">campaign</span>
            <h3 class="text-sm font-bold text-[#1E1B18]">Movement Bulletins</h3>
          </div>
          <span class="text-[10px] bg-[#0E5C56]/10 text-[#00433E] font-bold px-2 py-0.5 rounded-full">Live Feed</span>
        </div>
        <div id="home-news-container" class="space-y-2">
          ${renderHomeNewsItems()}
        </div>
      </section>

      <!-- Founder's Note (Krushna Mohan Dash) -->
      <section class="w-full">
        <div class="bg-[#FFFDF8] rounded-2xl p-4 shadow-sm border border-[#E2DAC8]">
          <div class="flex items-center gap-3 mb-3">
            <!-- Portrait Frame: assets/founder.jpg ONLY -->
            <div class="relative flex-shrink-0 overflow-hidden shadow-sm" style="width: 76px; height: 88px; border-radius: 12px; border: 2.5px solid #E8A33D;">
              <img alt="Krushna Mohan Dash" class="w-full h-full" style="object-fit: cover; object-position: top center;" src="./assets/founder.jpg">
            </div>
            <div class="flex flex-col min-w-0">
              <div class="flex items-center gap-1">
                <h3 class="font-bold text-base text-[#1E1B18] truncate">
                  ${homeTr.founderHeading || 'Krushna Mohan Dash'}
                </h3>
                <span class="material-symbols-outlined text-[18px] text-[#00433E]" style="font-variation-settings: 'FILL' 1;">verified</span>
              </div>
              <p class="text-[11px] font-bold text-[#835400]">
                ${homeTr.founderRole || 'Founder & Chairperson | ପ୍ରତିଷ୍ଠାତା ତଥା ଅଧ୍ୟକ୍ଷ'}
              </p>
              <p class="text-[10px] text-[#3F4947]">
                ${homeTr.founderSub || 'OSD Central Secretariat'}
              </p>
            </div>
          </div>

          <!-- Exact Founder Quote -->
          <div class="relative pl-3 bg-[#FAF6EE] p-3 rounded-xl border-l-4 border-[#E8A33D]">
            <blockquote class="text-[13px] text-[#1E1B18] italic leading-relaxed">
              ${homeTr.founderQuote}
            </blockquote>
          </div>

          <div class="mt-3 flex items-center justify-between pt-1">
            <button id="founderAudioBtn" onclick="toggleFounderSpeech()" type="button" class="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFDDB5] text-[#2A1800] hover:bg-[#FEB64E] active:scale-95 transition-all text-xs font-semibold">
              <span id="founderPlayIcon" class="material-symbols-outlined text-[16px] text-[#835400]">volume_up</span>
              <span>${homeTr.listenOdia || 'Listen in Odia (୩ ମିନିଟ୍ ଶୁଣନ୍ତୁ)'}</span>
            </button>
            <span class="text-[11px] text-[#3F4947] flex items-center gap-1">
              <span class="material-symbols-outlined text-[14px] text-[#00433E]">campaign</span>
              ${homeTr.odiaAudioBadge || 'Odia Audio'}
            </span>
          </div>
        </div>
      </section>

      <!-- Mission & Vision Cards -->
      <section class="w-full">
        <div class="grid grid-cols-2 gap-2.5">
          <!-- Mission -->
          <div class="bg-[#FAF2ED] rounded-xl p-3.5 flex flex-col justify-between shadow-sm border border-[#E2DAC8]/60">
            <div>
              <div class="w-8 h-8 rounded-lg bg-[#0E5C56] text-white flex items-center justify-center mb-2">
                <span class="material-symbols-outlined text-[18px]">flag</span>
              </div>
              <h4 class="text-sm font-bold text-[#00433E]">${homeTr.missionTitle || 'Our Mission'}</h4>
              <span class="text-[11px] text-[#835400] font-semibold">${homeTr.missionOdia || 'ଲକ୍ଷ୍ୟ ଓ ସଂକଳ୍ପ'}</span>
              <p class="text-[11.5px] text-[#3F4947] mt-1.5 leading-relaxed">
                ${homeTr.missionDesc}
              </p>
            </div>
          </div>
          <!-- Vision -->
          <div class="bg-[#FAF2ED] rounded-xl p-3.5 flex flex-col justify-between shadow-sm border border-[#E2DAC8]/60">
            <div>
              <div class="w-8 h-8 rounded-lg bg-[#835400] text-white flex items-center justify-center mb-2">
                <span class="material-symbols-outlined text-[18px]">visibility</span>
              </div>
              <h4 class="text-sm font-bold text-[#835400]">${homeTr.visionTitle || 'Our Vision'}</h4>
              <span class="text-[11px] text-[#00433E] font-semibold">${homeTr.visionOdia || 'ଦୃଷ୍ଟିକୋଣ'}</span>
              <p class="text-[11.5px] text-[#3F4947] mt-1.5 leading-relaxed">
                ${homeTr.visionDesc}
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- What We Stand For: All 10 Clickable Civic Action Pillars -->
      <section class="w-full">
        <div class="flex items-center justify-between mb-2 px-1">
          <div>
            <h3 class="text-base font-bold text-[#1E1B18]">${homeTr.pillarsHeading || 'What We Stand For'}</h3>
            <p class="text-xs text-[#835400] font-semibold">${homeTr.pillarsOdia || 'ଆମର ୧୦ଟି ମୁଖ୍ୟ ଆଦର୍ଶ ସ୍ତମ୍ଭ'}</p>
          </div>
          <span class="bg-[#00433E]/10 text-[#00433E] px-2.5 py-0.5 rounded-full text-xs font-bold">10 Pillars</span>
        </div>
        <div class="grid grid-cols-2 gap-2">
          ${pillarsList.map((p, idx) => `
            <div onclick="openPillarModal(${idx})" class="bg-[#FFFDF8] p-3 rounded-xl shadow-sm border border-[#E2DAC8] flex flex-col justify-between active:scale-[0.98] transition-all cursor-pointer hover:border-[#E8A33D]">
              <div class="flex items-center gap-2 mb-1.5">
                <div class="w-7 h-7 rounded-lg ${idx % 2 === 0 ? 'bg-[#0E5C56]/10 text-[#0E5C56]' : 'bg-[#E8A33D]/15 text-[#835400]'} flex items-center justify-center flex-shrink-0">
                  <span class="material-symbols-outlined text-[17px]">${p.icon || 'shield'}</span>
                </div>
                <span class="text-xs font-bold text-[#1E1B18] leading-tight truncate">${p.title}</span>
              </div>
              <p class="text-[11px] text-[#3F4947] leading-snug line-clamp-2">${p.desc}</p>
              <div class="mt-2 pt-1 border-t border-[#EEE7E1] flex items-center justify-between text-[#E8A33D]">
                <span class="text-[10px] font-semibold text-[#835400] truncate">${p.odia || ''}</span>
                <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Founding & Professional Council Highlight -->
      <section class="w-full">
        <div class="bg-[#721926] text-white rounded-2xl p-4 shadow-md relative overflow-hidden">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-9 h-9 rounded-full bg-[#FEB64E] text-[#714800] flex items-center justify-center flex-shrink-0 font-bold">
              <span class="material-symbols-outlined text-[20px]">gavel</span>
            </div>
            <div>
              <span class="text-[10px] text-[#FFDDB5] tracking-wider uppercase font-bold">${homeTr.councilBadge || 'Advisory Body'}</span>
              <h4 class="text-sm font-bold text-[#FFFDF8] leading-tight">${homeTr.councilTitle || 'Founding & Professional Council'}</h4>
            </div>
          </div>
          <p class="text-xs text-[#FFDADA] leading-relaxed">
            ${homeTr.councilDesc}
          </p>
          <div class="mt-3 flex items-center gap-2 pt-2 border-t border-white/15">
            <div class="flex -space-x-1.5 text-[9px] font-bold">
              <span class="w-6 h-6 rounded-full bg-[#FEB64E] text-[#714800] flex items-center justify-center ring-2 ring-[#721926]">SC</span>
              <span class="w-6 h-6 rounded-full bg-[#ABEFE7] text-[#00201D] flex items-center justify-center ring-2 ring-[#721926]">HC</span>
              <span class="w-6 h-6 rounded-full bg-[#FFDADA] text-[#40000C] flex items-center justify-center ring-2 ring-[#721926]">OU</span>
            </div>
            <span class="text-[11px] text-[#FFDDB5] font-medium">${homeTr.councilChapters || '30 District Chapters Active'}</span>
          </div>
        </div>
      </section>

      <!-- Why Join Highlight -->
      <section class="w-full">
        <div class="bg-[#FFFDF8] rounded-2xl p-4 shadow-sm border border-[#E2DAC8]">
          <h3 class="text-sm font-bold text-[#1E1B18] mb-3 flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[#835400] text-[20px]">verified</span>
            <span>${homeTr.whyJoinHeading || 'Why Join OSD Connect?'}</span>
          </h3>
          <div class="space-y-3">
            <div class="flex items-start gap-2.5">
              <span class="material-symbols-outlined text-[#00433E] text-[18px] flex-shrink-0 mt-0.5">check_circle</span>
              <div>
                <h5 class="text-xs font-bold text-[#1E1B18]">${homeTr.whyReason1Title}</h5>
                <p class="text-[11px] text-[#3F4947] leading-relaxed">${homeTr.whyReason1Desc}</p>
              </div>
            </div>
            <div class="flex items-start gap-2.5">
              <span class="material-symbols-outlined text-[#00433E] text-[18px] flex-shrink-0 mt-0.5">badge</span>
              <div>
                <h5 class="text-xs font-bold text-[#1E1B18]">${homeTr.whyReason2Title}</h5>
                <p class="text-[11px] text-[#3F4947] leading-relaxed">${homeTr.whyReason2Desc}</p>
              </div>
            </div>
            <div class="flex items-start gap-2.5">
              <span class="material-symbols-outlined text-[#00433E] text-[18px] flex-shrink-0 mt-0.5">gavel</span>
              <div>
                <h5 class="text-xs font-bold text-[#1E1B18]">${homeTr.whyReason3Title}</h5>
                <p class="text-[11px] text-[#3F4947] leading-relaxed">${homeTr.whyReason3Desc}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Secondary CTA Banner -->
      <section class="w-full">
        <div class="bg-[#00433E] text-white rounded-2xl p-5 text-center shadow-md flex flex-col items-center">
          <span class="material-symbols-outlined text-[#FEB64E] text-[32px] mb-1">local_police</span>
          <h3 class="text-lg font-bold text-[#FFFDF8]">${homeTr.standHeading || "Stand for Odisha's Pride"}</h3>
          <p class="text-xs text-[#8ED2CA] mt-1 max-w-xs leading-relaxed">${homeTr.standDesc}</p>
          <button onclick="navigateTo('roles')" class="mt-4 w-full bg-[#FEB64E] hover:bg-[#E8A33D] text-[#714800] py-3 px-4 rounded-xl font-bold text-sm shadow-sm flex items-center justify-center gap-2 transition-transform active:scale-[0.98]">
            <span>${homeTr.registerDefenderBtn || 'Register as Swabhiman Defender'}</span>
            <span class="material-symbols-outlined text-[18px]">how_to_reg</span>
          </button>
          <span class="text-[10px] text-[#FFB956] mt-2 font-medium">${homeTr.zeroFeeBadge || 'Zero fee • Direct digital citizen badge'}</span>
        </div>
      </section>

      <!-- Statutory Notice -->
      <section class="w-full">
        <div class="bg-[#EEE7E1] rounded-xl p-3 text-center border border-[#E2DAC8]">
          <p class="text-[11px] text-[#3F4947] leading-tight">
            <strong>${homeTr.statutoryNoticeTitle || 'Statutory Notice:'}</strong> ${homeTr.statutoryNoticeDesc || 'Odisha Swabhiman Defender (OSD) is a citizen movement and is not a registered political party. We do not field electoral candidates.'}
          </p>
        </div>
      </section>
    </div>

    <!-- Pillar Detail Modal Container -->
    <div id="pillar-modal" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm hidden flex items-center justify-center p-4">
      <div id="pillar-modal-content" class="bg-[#FFFDF8] rounded-2xl p-5 max-w-sm w-full shadow-2xl border border-[#E8A33D] transform transition-all"></div>
    </div>
  `;
}

function renderHomeNewsItems() {
  if (STATE.publicNews && STATE.publicNews.length > 0) {
    return STATE.publicNews.slice(0, 3).map(n => `
      <div class="bg-[#FFFDF8] p-3 rounded-xl shadow-sm border border-[#E2DAC8]">
        <div class="flex items-center justify-between text-[10px] text-[#835400] font-semibold mb-1">
          <span>${n.category || 'Announcement'}</span>
          <span>${n.dateEn || ''}</span>
        </div>
        <h4 class="text-xs font-bold text-[#1E1B18]">
          ${STATE.lang === 'or' && n.titleOr ? n.titleOr : n.titleEn}
        </h4>
        <p class="text-[11px] text-[#3F4947] mt-0.5 line-clamp-2">
          ${STATE.lang === 'or' && n.bodyOr ? n.bodyOr : n.bodyEn}
        </p>
      </div>
    `).join('');
  }

  return `
    <div class="bg-[#FFFDF8] p-3.5 rounded-xl shadow-sm border border-[#E2DAC8] text-center">
      <span class="material-symbols-outlined text-[#0E5C56] text-[24px]">verified</span>
      <h4 class="text-xs font-bold text-[#1E1B18] mt-1">Starting soon • ଆସନ୍ନ ସୂଚନା</h4>
      <p class="text-[11px] text-[#3F4947] mt-0.5">
        Live announcements, local town halls, and citizen chapters will be displayed here.
      </p>
    </div>
  `;
}

function openPillarModal(idx) {
  const tr = STATE.translations[STATE.lang] || {};
  const pillarsList = tr.pillars || [];
  const p = pillarsList[idx];
  if (!p) return;

  const modal = document.getElementById('pillar-modal');
  const content = document.getElementById('pillar-modal-content');
  if (!modal || !content) return;

  content.innerHTML = `
    <div class="flex items-center justify-between border-b border-[#EEE7E1] pb-2.5 mb-3">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-lg bg-[#0E5C56] text-white flex items-center justify-center">
          <span class="material-symbols-outlined text-[20px]">${p.icon}</span>
        </div>
        <div>
          <h3 class="text-base font-bold text-[#00433E]">${p.title}</h3>
          <span class="text-xs text-[#835400] font-semibold">${p.odia || ''}</span>
        </div>
      </div>
      <button onclick="closePillarModal()" class="w-7 h-7 rounded-full bg-[#EEE7E1] flex items-center justify-center text-[#3F4947]">
        <span class="material-symbols-outlined text-[18px]">close</span>
      </button>
    </div>
    <p class="text-xs text-[#1E1B18] leading-relaxed mb-4">
      ${p.desc}
    </p>
    <div class="bg-[#FAF2ED] p-2.5 rounded-lg border border-[#E2DAC8] text-[11px] text-[#3F4947] mb-4">
      <strong>OSD Citizen Action Plan:</strong> We work directly with panchayats, communities, and legal experts to make this charter pillar a living reality for every Odia family.
    </div>
    <button onclick="closePillarModal(); navigateTo('roles');" class="w-full py-2.5 bg-[#FEB64E] text-[#714800] rounded-xl font-bold text-xs shadow">
      Join to Defend This Pillar
    </button>
  `;

  modal.classList.remove('hidden');
}

function closePillarModal() {
  const modal = document.getElementById('pillar-modal');
  if (modal) modal.classList.add('hidden');
}

// Audio speech synthesis helper for founder's quote
let isSpeaking = false;
function toggleFounderSpeech() {
  const icon = document.getElementById('founderPlayIcon');
  if (!window.speechSynthesis) {
    showToast('Speech playback not supported in this browser.', 'info');
    return;
  }

  if (isSpeaking) {
    window.speechSynthesis.cancel();
    isSpeaking = false;
    if (icon) icon.textContent = 'volume_up';
    return;
  }

  const tr = STATE.translations[STATE.lang] || {};
  const quote = tr.home ? tr.home.founderQuote : '';
  const utterance = new SpeechSynthesisUtterance(quote.replace(/[“”"']/g, ''));
  utterance.lang = STATE.lang === 'or' ? 'hi-IN' : 'en-IN';
  utterance.rate = 0.95;

  utterance.onend = () => {
    isSpeaking = false;
    if (icon) icon.textContent = 'volume_up';
  };
  utterance.onerror = () => {
    isSpeaking = false;
    if (icon) icon.textContent = 'volume_up';
  };

  window.speechSynthesis.speak(utterance);
  isSpeaking = true;
  if (icon) icon.textContent = 'pause';
  showToast("Playing Founder's Message...", 'info');
}

// ----------------------------------------------------------------------------
// 3. Role Selection Screen (Join Movement)
// ----------------------------------------------------------------------------
function renderRolesScreen() {
  const container = document.getElementById('screen-content');
  const tr = STATE.translations[STATE.lang] || {};
  const regTr = tr.registration || {};
  const rolesTr = tr.roles || {};
  const appTr = tr.application || {};

  // If member is already registered / logged in, lock role selection
  if (STATE.member && STATE.member.code) {
    const status = STATE.member.status || 'Pending';
    const isApproved = (status === 'Approved');
    const memberRole = rolesTr[STATE.member.type] || {};
    const pendingRole = STATE.member.details?.requestedRole;

    container.innerHTML = `
      <div class="flex flex-col w-full pb-28 pt-4 max-w-[500px] mx-auto px-4 space-y-4">
        <!-- Application Lock Status Card -->
        <div class="bg-[#FFFDF8] rounded-2xl p-5 shadow-sm border border-[#E2DAC8] text-center space-y-3">
          <div class="w-16 h-16 rounded-full ${isApproved ? 'bg-[#0E5C56]/15 text-[#00433E]' : 'bg-[#835400]/15 text-[#835400]'} flex items-center justify-center mx-auto">
            <span class="material-symbols-outlined text-[32px]">${isApproved ? 'verified' : 'lock_clock'}</span>
          </div>

          <div>
            <span class="text-[10.5px] uppercase tracking-wider font-bold text-[#835400]">${appTr.formLockedSub || 'One Citizen • One Role Protocol'}</span>
            <h3 class="text-base font-bold text-[#1E1B18] mt-0.5">${appTr.formLockedHeading || 'Application Submitted & Locked'}</h3>
          </div>

          <!-- Active Registered Role Details -->
          <div class="bg-[#FAF2ED] p-3.5 rounded-xl border border-[#E2DAC8] text-left space-y-1.5">
            <div class="flex items-center justify-between text-xs">
              <span class="text-[#3F4947] font-semibold">${appTr.lockedRoleLabel || 'Registered Role:'}</span>
              <span class="font-bold text-[#00433E] font-mono px-2 py-0.5 rounded bg-[#FFFDF8] border border-[#E2DAC8]">${STATE.member.type}</span>
            </div>
            <div class="text-sm font-bold text-[#1E1B18]">${memberRole.title || STATE.member.type}</div>
            <div class="text-xs text-[#835400] font-semibold">${memberRole.odiaTitle || ''}</div>
            <div class="text-[11px] text-[#3F4947] pt-1 border-t border-[#E2DAC8]/60">${memberRole.desc || ''}</div>
          </div>

          ${pendingRole ? `
            <div class="bg-[#FFF8F4] p-2.5 rounded-lg border border-[#FEB64E] text-xs text-left">
              <span class="font-bold text-[#835400] flex items-center gap-1">
                <span class="material-symbols-outlined text-[15px]">pending_actions</span>
                Role Change Pending Admin Approval
              </span>
              <p class="text-[#3F4947] mt-0.5">Requested to switch to <strong>${pendingRole}</strong>. Your current role remains active until approved.</p>
            </div>
          ` : ''}

          <p class="text-xs text-[#3F4947] leading-relaxed">
            ${appTr.formLockedDesc || 'You have already registered for an official OSD role. One citizen may only submit one application. Role changes and form re-submissions are restricted while your application is under administrative review or active.'}
          </p>

          <div class="pt-2">
            <button onclick="navigateTo('dashboard')" class="w-full py-3 px-4 bg-[#00433E] hover:bg-[#0E5C56] text-white rounded-xl font-bold text-xs shadow flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all">
              <span class="material-symbols-outlined text-[18px]">badge</span>
              <span>${appTr.viewDashboardBtn || 'Go to Member Dashboard'}</span>
            </button>
          </div>
        </div>
      </div>
    `;
    return;
  }

  const publicRoleKeys = [
    'OSD-VOL',
    'OSD-PM',
    'OSD-AM',
    'OSD-COORD',
    'OSD-LDR',
    'OSD-SUP',
    'OSD-FC',
    'OSD-PE'
  ];

  container.innerHTML = `
    <div class="flex flex-col w-full pb-28 pt-3 max-w-[520px] mx-auto px-3.5 space-y-3.5">
      
      <!-- Stepper Header -->
      <div class="bg-[#FAF2ED] rounded-xl p-3.5 shadow-sm border border-[#E2DAC8]">
        <div class="flex items-center justify-between mb-1.5">
          <div class="flex items-center gap-1.5">
            <span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#835400] text-white text-xs font-bold">1</span>
            <span class="font-bold text-sm text-[#00433E]">
              ${regTr.stepTitle || 'Step 1 of 2: Select Your Civic Calling'}
            </span>
          </div>
          <span class="text-xs text-[#835400] font-bold">${regTr.stepOdia || 'ଭୂମିକା ଚୟନ'}</span>
        </div>
        <div class="w-full bg-[#E9E1DC] rounded-full h-1.5 overflow-hidden">
          <div class="bg-[#FEB64E] h-full rounded-full w-1/2"></div>
        </div>
        <span class="text-[10px] text-[#3F4947] mt-1 block font-medium">
          ${regTr.stepSubtitle || 'Choose 1 Tier • 8 Public Roles + 1 Invitation Tier'}
        </span>
      </div>

      <!-- Voluntary Civic Service Notice -->
      <div class="bg-[#FFFDF8] rounded-2xl p-4 shadow-sm border-l-4 border-[#835400] border-t border-r border-b border-[#E2DAC8]">
        <div class="flex items-start gap-2.5">
          <span class="material-symbols-outlined text-[#835400] text-[22px] flex-shrink-0 mt-0.5">gavel</span>
          <div>
            <div class="flex items-center gap-2">
              <h4 class="text-xs font-bold text-[#1E1B18]">${regTr.voluntaryNoticeTitle || 'Voluntary Civic Service Notice'}</h4>
              <span class="bg-[#FFDDB5] text-[#714800] text-[9.5px] px-1.5 py-0.2 rounded font-bold uppercase">${regTr.voluntaryNoticeOfficialBadge || 'Official'}</span>
            </div>
            <p class="text-[11px] text-[#3F4947] mt-1 leading-relaxed">
              ${regTr.voluntaryNoticeBody}
            </p>
            <p class="text-[10.5px] text-[#835400] mt-1 italic font-medium">
              ${regTr.voluntaryNoticeOdia}
            </p>
          </div>
        </div>
      </div>

      <!-- Role Selection Cards -->
      <div class="space-y-2.5">
        ${publicRoleKeys.map(key => {
          const r = rolesTr[key] || {};
          const isSelected = STATE.selectedRole === key;
          return `
            <div onclick="selectAndProceedRole('${key}')" class="bg-[#FFFDF8] rounded-xl p-3.5 shadow-sm border ${isSelected ? 'border-2 border-[#00433E] bg-[#ABefe7]/10' : 'border-[#E2DAC8]'} cursor-pointer hover:border-[#E8A33D] active:scale-[0.99] transition-all">
              <div class="flex items-start justify-between gap-2">
                <div class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-[20px] text-[#00433E]">
                    ${key === 'OSD-FC' ? 'workspace_premium' : (key === 'OSD-PE' ? 'engineering' : (key === 'OSD-COORD' ? 'flag' : 'groups'))}
                  </span>
                  <div>
                    <h4 class="text-sm font-bold text-[#1E1B18]">${r.title || key}</h4>
                    <span class="text-xs text-[#835400] font-semibold">${r.odiaTitle || ''}</span>
                  </div>
                </div>
                <span class="bg-[#FAF2ED] text-[#00433E] border border-[#E2DAC8] text-[10px] font-bold px-2 py-0.5 rounded-full">
                  ${key}
                </span>
              </div>
              <p class="text-[11.5px] text-[#3F4947] mt-1.5 leading-snug">${r.desc || ''}</p>
              <div class="mt-2.5 pt-2 border-t border-[#EEE7E1] flex items-center justify-between text-xs">
                <span class="text-[11px] font-semibold text-[#0E5C56] flex items-center gap-1">
                  <span class="material-symbols-outlined text-[14px]">schedule</span> ${r.commitment || ''}
                </span>
                <span class="font-bold text-[#835400] flex items-center gap-0.5">
                  Apply Now <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
                </span>
              </div>
            </div>
          `;
        }).join('')}

        <!-- Advisory Council (Invitation Only) -->
        <div class="bg-[#FAF2ED] rounded-xl p-3.5 shadow-inner border border-[#E2DAC8] opacity-90 select-none">
          <div class="flex items-start justify-between gap-2">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-[20px] text-[#7A1F2B]">lock</span>
              <div>
                <h4 class="text-sm font-bold text-[#7A1F2B]">Advisory Council</h4>
                <span class="text-xs text-[#3F4947] font-semibold">ଉପଦେଷ୍ଟା ପରିଷଦ (OSD-AC)</span>
              </div>
            </div>
            <span class="bg-[#7A1F2B] text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <span class="material-symbols-outlined text-[11px]">lock</span>
              ${regTr.invitationOnlyTag || 'Invitation Only'}
            </span>
          </div>
          <p class="text-[11px] text-[#3F4947] mt-1.5 leading-snug">
            Venerable state dignitaries, retired jurists, and Padma laureates. ${regTr.invitationOnlyNote || 'By nomination only.'}
          </p>
        </div>
      </div>
    </div>
  `;
}

function selectAndProceedRole(roleKey) {
  STATE.selectedRole = roleKey;
  navigateTo('apply');
}

// ----------------------------------------------------------------------------
// 4. Dedicated Application Form Screen
// ----------------------------------------------------------------------------
let selectedSkills = ['Content / Odia Writing'];

function renderApplyScreen() {
  const container = document.getElementById('screen-content');
  const tr = STATE.translations[STATE.lang] || {};
  const appTr = tr.application || {};
  const rolesTr = tr.roles || {};

  // If member is already registered / logged in, lock form
  if (STATE.member && STATE.member.code) {
    const status = STATE.member.status || 'Pending';
    const isApproved = (status === 'Approved');
    const memberRole = rolesTr[STATE.member.type] || {};

    container.innerHTML = `
      <div class="flex flex-col w-full pb-28 pt-4 max-w-[500px] mx-auto px-4 space-y-4">
        <div class="bg-[#FFFDF8] rounded-2xl p-5 shadow-sm border border-[#E2DAC8] text-center space-y-3">
          <div class="w-16 h-16 rounded-full ${isApproved ? 'bg-[#0E5C56]/15 text-[#00433E]' : 'bg-[#835400]/15 text-[#835400]'} flex items-center justify-center mx-auto">
            <span class="material-symbols-outlined text-[32px]">${isApproved ? 'verified' : 'lock_clock'}</span>
          </div>

          <div>
            <span class="text-[10.5px] uppercase tracking-wider font-bold text-[#835400]">${appTr.formLockedSub || 'One Citizen • One Role Protocol'}</span>
            <h3 class="text-base font-bold text-[#1E1B18] mt-0.5">${appTr.formLockedHeading || 'Application Submitted & Locked'}</h3>
          </div>

          <div class="bg-[#FAF2ED] p-3.5 rounded-xl border border-[#E2DAC8] text-left space-y-1.5">
            <div class="flex items-center justify-between text-xs">
              <span class="text-[#3F4947] font-semibold">${appTr.lockedRoleLabel || 'Registered Role:'}</span>
              <span class="font-bold text-[#00433E] font-mono px-2 py-0.5 rounded bg-[#FFFDF8] border border-[#E2DAC8]">${STATE.member.type}</span>
            </div>
            <div class="text-sm font-bold text-[#1E1B18]">${memberRole.title || STATE.member.type}</div>
            <div class="text-xs text-[#835400] font-semibold">${memberRole.odiaTitle || ''}</div>
          </div>

          <p class="text-xs text-[#3F4947] leading-relaxed">
            ${appTr.formLockedDesc || 'You have already registered for an official OSD role. One citizen may only submit one application. Role changes and form re-submissions are restricted while your application is under administrative review or active.'}
          </p>

          <div class="pt-2">
            <button onclick="navigateTo('dashboard')" class="w-full py-3 px-4 bg-[#00433E] hover:bg-[#0E5C56] text-white rounded-xl font-bold text-xs shadow flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all">
              <span class="material-symbols-outlined text-[18px]">badge</span>
              <span>${appTr.viewDashboardBtn || 'Go to Member Dashboard'}</span>
            </button>
          </div>
        </div>
      </div>
    `;
    return;
  }

  const currentRole = rolesTr[STATE.selectedRole] || {};
  const isExecutiveRole = (STATE.selectedRole === 'OSD-FC' || STATE.selectedRole === 'OSD-PE');

  container.innerHTML = `
    <div class="flex flex-col w-full pb-28 pt-3 max-w-[520px] mx-auto px-3.5 space-y-3.5">
      
      <!-- Back & Progress Header -->
      <div class="flex items-center justify-between mb-1">
        <button onclick="navigateTo('roles')" class="flex items-center gap-1 text-xs font-bold text-[#00433E] hover:underline py-1">
          <span class="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>${appTr.backBtn || 'Back'}</span>
        </button>
        <span class="text-xs font-bold text-[#835400]">${appTr.stepPercent || '90% Done'}</span>
      </div>

      <div class="w-full bg-[#E9E1DC] rounded-full h-1.5 overflow-hidden">
        <div class="bg-[#FEB64E] h-full rounded-full w-[90%]"></div>
      </div>

      <!-- Active Selected Role Card -->
      <div class="bg-[#FFFDF8] rounded-xl p-3.5 shadow-sm border border-[#E2DAC8] flex items-center justify-between">
        <div class="flex items-center gap-2.5 min-w-0">
          <div class="w-9 h-9 rounded-lg bg-[#0E5C56]/10 text-[#00433E] flex items-center justify-center font-bold">
            <span class="material-symbols-outlined text-[20px]">badge</span>
          </div>
          <div class="min-w-0">
            <span class="text-[10px] text-[#3F4947] uppercase tracking-wider font-semibold">Applying For:</span>
            <h3 class="text-sm font-bold text-[#1E1B18] truncate">${currentRole.title || STATE.selectedRole}</h3>
            <span class="text-[11px] text-[#835400] font-semibold">${currentRole.odiaTitle || ''}</span>
          </div>
        </div>
        <button onclick="navigateTo('roles')" class="text-xs text-[#00433E] font-bold hover:underline px-2 py-1 flex-shrink-0">
          ${appTr.changeRoleBtn || 'Change'}
        </button>
      </div>

      <!-- Role Overview & Voluntary Notice -->
      <div class="bg-[#FFFDF8] rounded-xl p-3.5 shadow-sm border border-[#E2DAC8] space-y-2 text-xs">
        <div class="bg-[#FAF2ED] p-2.5 rounded-lg">
          <span class="font-bold text-[#00433E]">What You'll Do (ଦାୟିତ୍ୱ):</span>
          <p class="text-[11px] text-[#3F4947] mt-0.5 leading-relaxed">${currentRole.whatYouDo || 'Grassroots civic action & community welfare.'}</p>
        </div>
        <div class="bg-[#FAF2ED] p-2.5 rounded-lg">
          <span class="font-bold text-[#00433E]">Who This Suits (ଯୋଗ୍ୟତା):</span>
          <p class="text-[11px] text-[#3F4947] mt-0.5 leading-relaxed">${currentRole.whoSuits || 'Dedicated citizen of Odisha.'}</p>
        </div>
        <!-- Voluntary Social Service Notice -->
        <div class="bg-[#FFDDB5] p-3 rounded-lg text-[#2A1800] border-l-4 border-[#835400]">
          <span class="font-bold text-xs flex items-center gap-1">
            <span class="material-symbols-outlined text-[16px]">warning</span>
            ${appTr.voluntaryCompensationTitle || 'Voluntary Social Service Notice'}
          </span>
          <p class="text-[11px] mt-1 leading-snug">${appTr.voluntaryCompensationBody}</p>
          <p class="text-[10.5px] mt-0.5 italic opacity-90">${appTr.voluntaryCompensationOdia}</p>
        </div>
      </div>

      <!-- Application Form -->
      <form id="osd-register-form" onsubmit="event.preventDefault(); handleRegisterSubmit();" class="space-y-4">
        
        <!-- Section 1: Personal Details -->
        <div class="bg-[#FFFDF8] rounded-xl p-3.5 shadow-sm border border-[#E2DAC8] space-y-3">
          <h4 class="text-xs font-bold text-[#00433E] uppercase tracking-wide flex items-center gap-1.5 border-b border-[#EEE7E1] pb-1.5">
            <span class="material-symbols-outlined text-[17px]">person</span>
            ${appTr.section1Title || '1. Personal Identity (ବ୍ୟକ୍ତିଗତ ପରିଚୟ)'}
          </h4>

          <div>
            <label class="block text-xs font-bold text-[#1E1B18] mb-1">${appTr.fullNameLabel || 'Full Name *'}</label>
            <input id="reg-name" required type="text" placeholder="${appTr.fullNamePlaceholder || 'Krushna Mohan Mohanty'}" class="w-full h-11 px-3 rounded-lg bg-[#FAF2ED] text-sm text-[#1E1B18] border border-[#E2DAC8] focus:bg-white focus:outline-none focus:border-[#00433E]">
          </div>

          <div>
            <label class="block text-xs font-bold text-[#1E1B18] mb-1">${appTr.mobileLabel || '10-digit Mobile Number *'}</label>
            <div class="flex items-center gap-2">
              <span class="h-11 px-3 rounded-lg bg-[#EEE7E1] text-xs font-bold text-[#1E1B18] flex items-center">+91</span>
              <input id="reg-phone" required type="tel" maxlength="10" pattern="[0-9]{10}" placeholder="${appTr.mobilePlaceholder || '9876543210'}" class="flex-1 h-11 px-3 rounded-lg bg-[#FAF2ED] text-sm text-[#1E1B18] border border-[#E2DAC8] focus:bg-white focus:outline-none focus:border-[#00433E]">
            </div>
            <span class="text-[10.5px] text-[#3F4947] mt-0.5 block">${appTr.mobileHelper}</span>
          </div>

          <div>
            <div class="flex justify-between items-center mb-1">
              <label class="text-xs font-bold text-[#1E1B18]">${appTr.emailLabel || 'Email Address'}</label>
              <span class="text-[10px] text-[#3F4947] italic">${appTr.emailOptional || 'Optional'}</span>
            </div>
            <input id="reg-email" type="email" placeholder="${appTr.emailPlaceholder || 'citizen@example.org'}" class="w-full h-11 px-3 rounded-lg bg-[#FAF2ED] text-sm text-[#1E1B18] border border-[#E2DAC8] focus:bg-white focus:outline-none focus:border-[#00433E]">
          </div>

          <!-- Member Passport Photo Selection (Camera / Gallery) -->
          <div class="pt-2 border-t border-[#EEE7E1]">
            <div class="flex justify-between items-center mb-1">
              <label class="text-xs font-bold text-[#1E1B18] flex items-center gap-1">
                <span class="material-symbols-outlined text-[16px] text-[#835400]">account_box</span>
                <span>${appTr.photoLabel || 'Passport-Size Photo (ପାସପୋର୍ଟ ଫଟୋ)'}</span>
              </label>
              <span class="text-[10px] text-[#0E5C56] font-semibold bg-[#0E5C56]/10 px-2 py-0.5 rounded-full">Recommended</span>
            </div>
            <p class="text-[11px] text-[#3F4947] mb-2 leading-tight">
              ${appTr.photoSub || 'Upload a clear front-facing photo for your official digital identity card.'}
            </p>

            <!-- Accessible file input with SR-only positioning for 100% Android WebView compatibility -->
            <input type="file" id="reg-photo-input" accept="image/*,image/jpeg,image/png,image/webp" class="sr-only" style="position: absolute; width: 1px; height: 1px; opacity: 0; pointer-events: none;" onchange="handleRegistrationPhotoSelect(this)" onclick="this.value=null;">

            <div class="flex items-center gap-3">
              <label for="reg-photo-input" id="reg-photo-preview-box" class="w-16 h-20 rounded-lg bg-[#FAF2ED] border-2 border-dashed border-[#E8A33D] flex flex-col items-center justify-center text-[#835400] overflow-hidden flex-shrink-0 cursor-pointer shadow-xs active:scale-95 transition-transform" onclick="triggerPhotoPicker('reg-photo-input')">
                ${STATE.registrationPhoto 
                  ? `<img src="${STATE.registrationPhoto}" alt="Member Photo" class="w-full h-full object-cover">`
                  : `<span class="material-symbols-outlined text-[24px]">add_a_photo</span><span class="text-[8px] font-bold mt-0.5">Upload</span>`
                }
              </label>
              <div class="flex-1 space-y-1">
                <label for="reg-photo-input" class="inline-block cursor-pointer">
                  <button type="button" onclick="triggerPhotoPicker('reg-photo-input')" class="py-2 px-3 rounded-lg bg-[#00433E] hover:bg-[#0E5C56] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all">
                    <span class="material-symbols-outlined text-[16px]">photo_camera</span>
                    <span id="reg-photo-btn-text">${STATE.registrationPhoto ? (appTr.photoChangeBtn || 'Change Photo') : (appTr.photoUploadBtn || 'Select Photo')}</span>
                  </button>
                </label>
                <div id="reg-photo-actions" class="${STATE.registrationPhoto ? '' : 'hidden'} flex items-center gap-2">
                  <button type="button" onclick="removeRegistrationPhoto()" class="text-[11px] text-[#BA1A1A] font-semibold hover:underline">
                    ${appTr.photoRemoveBtn || 'Remove Photo'}
                  </button>
                </div>
                <p class="text-[10px] text-[#3F4947]">
                  ${appTr.photoOptionalNotice || 'Recommended now. Required before approved ID card is issued.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Section 2: Cascading Geographic Assignment (All 30 Districts) -->
        <div class="bg-[#FFFDF8] rounded-xl p-3.5 shadow-sm border border-[#E2DAC8] space-y-3">
          <h4 class="text-xs font-bold text-[#00433E] uppercase tracking-wide flex items-center gap-1.5 border-b border-[#EEE7E1] pb-1.5">
            <span class="material-symbols-outlined text-[17px]">location_on</span>
            ${appTr.section2Title || '2. Geographic Assignment (ଭୌଗୋଳିକ କ୍ଷେତ୍ର)'}
          </h4>

          <div class="grid grid-cols-2 gap-2.5">
            <div>
              <label class="block text-xs font-bold text-[#1E1B18] mb-1">${appTr.stateLabel || 'State'}</label>
              <div class="h-11 px-3 rounded-lg bg-[#EEE7E1] text-xs font-bold text-[#00433E] flex items-center">
                Odisha (ଓଡ଼ିଶା)
              </div>
            </div>
            <div>
              <label class="block text-xs font-bold text-[#1E1B18] mb-1">${appTr.districtLabel || 'District *'}</label>
              <select id="reg-district" required onchange="handleDistrictChange(this.value)" class="w-full h-11 px-2.5 rounded-lg bg-[#FAF2ED] text-xs font-semibold text-[#1E1B18] border border-[#E2DAC8] focus:outline-none focus:border-[#00433E]">
                <option value="" disabled selected>${appTr.districtSelectDefault || 'Select District'}</option>
                ${Object.keys(typeof ODISHA_LOCATIONS !== 'undefined' ? ODISHA_LOCATIONS : ODISHA_DISTRICTS).map(d => {
                  const orName = (typeof ODISHA_LOCATIONS !== 'undefined' && ODISHA_LOCATIONS[d] && ODISHA_LOCATIONS[d].nameOr) || (typeof ODISHA_DISTRICTS_OR !== 'undefined' && ODISHA_DISTRICTS_OR[d]) || d;
                  return `<option value="${d}">${d} (${orName})</option>`;
                }).join('')}
              </select>
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-[#1E1B18] mb-1">${appTr.constituencyLabel || 'Assembly Constituency *'}</label>
            <select id="reg-constituency" required class="w-full h-11 px-2.5 rounded-lg bg-[#FAF2ED] text-xs font-semibold text-[#1E1B18] border border-[#E2DAC8] focus:outline-none focus:border-[#00433E]">
              <option value="" disabled selected>${appTr.constituencySelectDefault || 'Select District first'}</option>
            </select>
          </div>

          <!-- Cascading Block / Municipality Dropdown with Manual Fallback -->
          <div>
            <label class="block text-xs font-bold text-[#1E1B18] mb-1">${appTr.blockLabel || 'Block / Municipality *'}</label>
            <select id="reg-block-select" required onchange="handleBlockChange(this.value)" class="w-full h-11 px-2.5 rounded-lg bg-[#FAF2ED] text-xs font-semibold text-[#1E1B18] border border-[#E2DAC8] focus:outline-none focus:border-[#00433E]">
              <option value="" disabled selected>${appTr.selectDistrictFirst || '← Please select District first'}</option>
            </select>
            <div id="reg-block-manual-container" class="hidden mt-2">
              <input id="reg-block-manual" type="text" placeholder="${appTr.manualBlockPlaceholder || 'Type your Block or Municipality name...'}" class="w-full h-11 px-3 rounded-lg bg-[#FAF2ED] text-xs text-[#1E1B18] border border-[#E8A33D] focus:bg-white focus:outline-none focus:border-[#00433E]">
            </div>
          </div>

          <!-- Cascading Gram Panchayat / Ward Dropdown with Manual Fallback -->
          <div>
            <label class="block text-xs font-bold text-[#1E1B18] mb-1">${appTr.panchayatLabel || 'Gram Panchayat / Ward *'}</label>
            <select id="reg-panchayat-select" required onchange="handlePanchayatChange(this.value)" class="w-full h-11 px-2.5 rounded-lg bg-[#FAF2ED] text-xs font-semibold text-[#1E1B18] border border-[#E2DAC8] focus:outline-none focus:border-[#00433E]">
              <option value="" disabled selected>${appTr.selectBlockFirst || '← Please select Block / Municipality first'}</option>
            </select>
            <div id="reg-panchayat-manual-container" class="hidden mt-2">
              <input id="reg-panchayat-manual" type="text" placeholder="${appTr.manualPanchayatPlaceholder || 'Type your Gram Panchayat or Ward name / number...'}" class="w-full h-11 px-3 rounded-lg bg-[#FAF2ED] text-xs text-[#1E1B18] border border-[#E8A33D] focus:bg-white focus:outline-none focus:border-[#00433E]">
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-[#1E1B18] mb-1">${appTr.villageLabel || 'Village / Locality *'}</label>
            <input id="reg-village" required type="text" placeholder="${appTr.villagePlaceholder || 'Saheed Nagar / Old Town'}" class="w-full h-11 px-3 rounded-lg bg-[#FAF2ED] text-xs text-[#1E1B18] border border-[#E2DAC8] focus:bg-white focus:outline-none focus:border-[#00433E]">
          </div>
        </div>

        <!-- Section 3: Professional & Skills Profile -->
        <div class="bg-[#FFFDF8] rounded-xl p-3.5 shadow-sm border border-[#E2DAC8] space-y-3">
          <h4 class="text-xs font-bold text-[#00433E] uppercase tracking-wide flex items-center gap-1.5 border-b border-[#EEE7E1] pb-1.5">
            <span class="material-symbols-outlined text-[17px]">psychology</span>
            ${appTr.section3Title || '3. Professional Profile (ବୃତ୍ତି ଏବଂ ଦକ୍ଷତା)'}
          </h4>

          <div>
            <label class="block text-xs font-bold text-[#1E1B18] mb-1">${appTr.occupationLabel || 'Occupation *'}</label>
            <select id="reg-occupation" required class="w-full h-11 px-2.5 rounded-lg bg-[#FAF2ED] text-xs font-semibold text-[#1E1B18] border border-[#E2DAC8] focus:outline-none focus:border-[#00433E]">
              <option value="" disabled selected>${appTr.occupationSelectDefault || 'Select Profession'}</option>
              <option value="Advocate / Legal Professional">Advocate / Legal Professional (ଆଇନଜ୍ଞ)</option>
              <option value="Educator / Teacher / Scholar">Educator / Teacher / Scholar (ଶିକ୍ଷାବିତ)</option>
              <option value="IT / Engineer / Technologist">IT / Engineer / Technologist (ପ୍ରଯୁକ୍ତିବିତ)</option>
              <option value="Healthcare Professional">Healthcare / Medical Professional (ଚିକିତ୍ସକ)</option>
              <option value="Farmer / Agriculture Expert">Farmer / Agriculture Expert (କୃଷକ)</option>
              <option value="Entrepreneur / Trader">Small Business / Entrepreneur (ଉଦ୍ୟୋଗୀ)</option>
              <option value="Student / Youth Leader">Student / Youth Scholar (ଛାତ୍ର)</option>
              <option value="Social Worker / Community Organizer">Social Worker / Community Organizer (ସମାଜସେବୀ)</option>
              <option value="Other Civic Defender">Other Civic Defender (ଅନ୍ୟାନ୍ୟ)</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-[#1E1B18] mb-1">${appTr.skillsLabel || 'Core Skills *'}</label>
            <span class="text-[10.5px] text-[#3F4947] block mb-1.5">${appTr.skillsHelper}</span>
            <div id="skills-pills-container" class="flex flex-wrap gap-1.5">
              ${renderSkillPills()}
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-[#1E1B18] mb-1">${appTr.reasonLabel || 'Reason for Joining *'}</label>
            <textarea id="reg-reason" required rows="3" oninput="updateReasonWordCount(this.value)" placeholder="${appTr.reasonPlaceholder}" class="w-full p-2.5 rounded-lg bg-[#FAF2ED] text-xs text-[#1E1B18] border border-[#E2DAC8] focus:bg-white focus:outline-none focus:border-[#00433E]"></textarea>
            <div class="flex justify-between items-center text-[10px] text-[#3F4947] pt-0.5">
              <span>Encouraged: min 10 words</span>
              <span id="word-count-display">0 words</span>
            </div>
          </div>
        </div>

        <!-- Section 4: Account Security -->
        <div class="bg-[#FFFDF8] rounded-xl p-3.5 shadow-sm border border-[#E2DAC8] space-y-3">
          <h4 class="text-xs font-bold text-[#00433E] uppercase tracking-wide flex items-center gap-1.5 border-b border-[#EEE7E1] pb-1.5">
            <span class="material-symbols-outlined text-[17px]">shield</span>
            ${appTr.section4Title || '4. Account Security (ଖାତା ସୁରକ୍ଷା)'}
          </h4>

          <div>
            <label class="block text-xs font-bold text-[#1E1B18] mb-1">${appTr.passwordLabel || 'Create Password *'}</label>
            <div class="relative">
              <input id="reg-password" required minlength="6" type="password" placeholder="${appTr.passwordPlaceholder || 'At least 6 characters'}" class="w-full h-11 pl-3 pr-10 rounded-lg bg-[#FAF2ED] text-sm text-[#1E1B18] border border-[#E2DAC8] focus:bg-white focus:outline-none focus:border-[#00433E]">
              <button type="button" onclick="togglePasswordView('reg-password', this)" class="absolute right-2 top-2.5 text-[#3F4947]">
                <span class="material-symbols-outlined text-[20px]">visibility</span>
              </button>
            </div>
            <span class="text-[10px] text-[#3F4947] mt-0.5 block">${appTr.passwordHelper}</span>
          </div>

          <div>
            <label class="block text-xs font-bold text-[#1E1B18] mb-1">${appTr.confirmPasswordLabel || 'Confirm Password *'}</label>
            <div class="relative">
              <input id="reg-confirm-password" required minlength="6" type="password" placeholder="${appTr.confirmPasswordPlaceholder || 'Re-enter password'}" class="w-full h-11 pl-3 pr-10 rounded-lg bg-[#FAF2ED] text-sm text-[#1E1B18] border border-[#E2DAC8] focus:bg-white focus:outline-none focus:border-[#00433E]">
              <button type="button" onclick="togglePasswordView('reg-confirm-password', this)" class="absolute right-2 top-2.5 text-[#3F4947]">
                <span class="material-symbols-outlined text-[20px]">visibility</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Section 5: Declarations & Consents -->
        <div class="bg-[#FFFDF8] rounded-xl p-3.5 shadow-sm border border-[#E2DAC8] space-y-3">
          <h4 class="text-xs font-bold text-[#00433E] uppercase tracking-wide flex items-center gap-1.5 border-b border-[#EEE7E1] pb-1.5">
            <span class="material-symbols-outlined text-[17px]">fact_check</span>
            ${appTr.section5Title || '5. Declarations & Consents'}
          </h4>

          <!-- Conditional Working-Professionals Declaration (for OSD-FC and OSD-PE) -->
          ${isExecutiveRole ? `
            <div class="p-3 rounded-lg bg-[#FAF2ED] border border-[#E8A33D] space-y-1">
              <label class="flex items-start gap-2.5 cursor-pointer">
                <input id="reg-prof-decl" required type="checkbox" class="mt-1 w-4 h-4 accent-[#00433E] flex-shrink-0">
                <span class="text-[11px] text-[#1E1B18] leading-relaxed">
                  <strong class="text-[#835400]">${appTr.profDeclarationTitle}:</strong> ${appTr.profDeclarationText}
                </span>
              </label>
            </div>
          ` : ''}

          <!-- Standard Civic Oath -->
          <label class="flex items-start gap-2.5 cursor-pointer">
            <input id="reg-oath-decl" required type="checkbox" class="mt-1 w-4 h-4 accent-[#00433E] flex-shrink-0">
            <span class="text-[11px] text-[#1E1B18] leading-relaxed">
              ${appTr.oathDeclarationText}
            </span>
          </label>

          <!-- Transfer Consent -->
          <label class="flex items-start gap-2.5 cursor-pointer">
            <input id="reg-transfer-decl" required type="checkbox" class="mt-1 w-4 h-4 accent-[#00433E] flex-shrink-0">
            <span class="text-[11px] text-[#1E1B18] leading-relaxed">
              ${appTr.transferConsentText}
            </span>
          </label>
        </div>

        <!-- Submit Button -->
        <div class="space-y-2 pt-1">
          <button id="register-submit-btn" type="submit" class="w-full py-3.5 px-4 bg-[#FEB64E] hover:bg-[#E8A33D] text-[#714800] rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2 active:scale-[0.98] transition-all">
            <span class="material-symbols-outlined text-[20px]">how_to_reg</span>
            <span>${appTr.submitBtn || 'Submit Application'}</span>
          </button>
          <p class="text-[10px] text-center text-[#3F4947]">
            ${appTr.noOtpNotice || 'No OTP required. Submits directly as Pending admin review.'}
          </p>
          <div class="text-center pt-1">
            <button type="button" onclick="navigateTo('dashboard')" class="text-xs text-[#00433E] font-semibold hover:underline">
              ${appTr.loginLinkText || 'Already registered? Log in here'}
            </button>
          </div>
        </div>
      </form>
    </div>
  `;
}

function toOdiaDigits(num) {
  const odiaDigits = ['୦', '୧', '୨', '୩', '୪', '୫', '୬', '୭', '୮', '୯'];
  return String(num).replace(/[0-9]/g, d => odiaDigits[parseInt(d, 10)]);
}

function handleDistrictChange(district) {
  const constSelect = document.getElementById('reg-constituency');
  const blockSelect = document.getElementById('reg-block-select');
  const panchayatSelect = document.getElementById('reg-panchayat-select');
  const blockManualCont = document.getElementById('reg-block-manual-container');
  const panchManualCont = document.getElementById('reg-panchayat-manual-container');

  if (blockManualCont) blockManualCont.classList.add('hidden');
  if (panchManualCont) panchManualCont.classList.add('hidden');
  const blockManualInput = document.getElementById('reg-block-manual');
  if (blockManualInput) blockManualInput.value = '';
  const panchManualInput = document.getElementById('reg-panchayat-manual');
  if (panchManualInput) panchManualInput.value = '';

  const appTr = (typeof I18N !== 'undefined' && I18N[STATE.lang] && I18N[STATE.lang].application) || {};

  // 1. Populate Constituencies
  if (constSelect) {
    const locData = typeof ODISHA_LOCATIONS !== 'undefined' ? ODISHA_LOCATIONS[district] : null;
    const list = (locData && locData.constituencies) || (typeof ODISHA_DISTRICTS !== 'undefined' ? ODISHA_DISTRICTS[district] : []) || [];
    const prompt = appTr.constituencySelectDefault || 'Select Constituency';
    constSelect.innerHTML = `<option value="" disabled selected>${prompt}</option>` + 
      list.map(c => `<option value="${c}">${c}</option>`).join('');
  }

  // 2. Populate Blocks & ULBs
  if (blockSelect) {
    const locData = typeof ODISHA_LOCATIONS !== 'undefined' ? ODISHA_LOCATIONS[district] : null;
    if (!locData) {
      blockSelect.innerHTML = `<option value="" disabled selected>${appTr.blockSelectDefault || 'Select Block / Municipality'}</option>
        <option value="__OTHER__">${appTr.enterBlockManually || '✏️ Other / Enter Block or Municipality Manually'}</option>`;
      return;
    }

    let html = `<option value="" disabled selected>${appTr.blockSelectDefault || 'Select Block / Municipality'}</option>`;

    // Urban Local Bodies
    if (locData.ulbs && locData.ulbs.length > 0) {
      html += `<optgroup label="${appTr.ulbOptGroup || 'Urban Local Bodies (Corporation / Municipality / NAC)'}">`;
      locData.ulbs.forEach(ulb => {
        const orName = ulb.nameOr ? ` (${ulb.nameOr})` : '';
        html += `<option value="${ulb.name}">${ulb.name}${orName}</option>`;
      });
      html += `</optgroup>`;
    }

    // Rural CD Blocks
    if (locData.blocks && locData.blocks.length > 0) {
      html += `<optgroup label="${appTr.blocksOptGroup || 'Rural CD Blocks (ବ୍ଲକ)'}">`;
      locData.blocks.forEach(blk => {
        const orName = blk.nameOr ? ` (${blk.nameOr})` : '';
        html += `<option value="${blk.name}">${blk.name}${orName}</option>`;
      });
      html += `</optgroup>`;
    }

    // Other / Enter Manually
    html += `<option value="__OTHER__">${appTr.enterBlockManually || '✏️ Other / Enter Block or Municipality Manually'}</option>`;
    blockSelect.innerHTML = html;
  }

  // 3. Reset Panchayat dropdown to prompt
  if (panchayatSelect) {
    panchayatSelect.innerHTML = `<option value="" disabled selected>${appTr.selectBlockFirst || '← Please select Block / Municipality first'}</option>`;
  }
}

function handleBlockChange(blockVal) {
  const district = document.getElementById('reg-district')?.value;
  const panchayatSelect = document.getElementById('reg-panchayat-select');
  const blockManualCont = document.getElementById('reg-block-manual-container');
  const panchManualCont = document.getElementById('reg-panchayat-manual-container');
  const appTr = (typeof I18N !== 'undefined' && I18N[STATE.lang] && I18N[STATE.lang].application) || {};

  // If user selected manual entry for Block
  if (blockVal === '__OTHER__') {
    if (blockManualCont) blockManualCont.classList.remove('hidden');
    document.getElementById('reg-block-manual')?.focus();

    // Also enable manual entry for Panchayat / Ward
    if (panchayatSelect) {
      panchayatSelect.innerHTML = `<option value="__OTHER__" selected>${appTr.enterPanchayatManually || '✏️ Other / Enter GP or Ward Manually'}</option>`;
    }
    if (panchManualCont) panchManualCont.classList.remove('hidden');
    return;
  } else {
    if (blockManualCont) blockManualCont.classList.add('hidden');
    const bInput = document.getElementById('reg-block-manual');
    if (bInput) bInput.value = '';
  }

  if (!panchayatSelect) return;

  const locData = (typeof ODISHA_LOCATIONS !== 'undefined' && district) ? ODISHA_LOCATIONS[district] : null;
  if (!locData) {
    panchayatSelect.innerHTML = `<option value="" disabled selected>${appTr.panchayatSelectDefault || 'Select GP / Ward'}</option>
      <option value="__OTHER__">${appTr.enterPanchayatManually || '✏️ Other / Enter GP or Ward Manually'}</option>`;
    return;
  }

  // Check if selected item is a ULB (Municipal Corporation, Municipality, or NAC)
  const ulbMatch = (locData.ulbs || []).find(u => u.name === blockVal);
  if (ulbMatch) {
    if (panchManualCont) panchManualCont.classList.add('hidden');
    const pInput = document.getElementById('reg-panchayat-manual');
    if (pInput) pInput.value = '';

    const wardCount = ulbMatch.wards || 30;
    let html = `<option value="" disabled selected>${appTr.panchayatSelectDefault || 'Select GP / Ward'}</option>`;
    html += `<optgroup label="${appTr.wardsOptGroup || 'Wards (ୱାର୍ଡ଼)'}">`;
    for (let w = 1; w <= wardCount; w++) {
      const odiaW = toOdiaDigits(w);
      const label = STATE.lang === 'or' ? `ୱାର୍ଡ଼ ନଂ ${odiaW} (Ward ${w})` : `Ward No. ${w} (ୱାର୍ଡ଼ ${odiaW})`;
      html += `<option value="Ward No. ${w}">${label}</option>`;
    }
    html += `</optgroup>`;
    html += `<option value="__OTHER__">${appTr.enterPanchayatManually || '✏️ Other / Enter GP or Ward Manually'}</option>`;
    panchayatSelect.innerHTML = html;
    return;
  }

  // Check if selected item is a rural block
  const blockMatch = (locData.blocks || []).find(b => b.name === blockVal);
  if (blockMatch) {
    if (panchManualCont) panchManualCont.classList.add('hidden');
    const pInput = document.getElementById('reg-panchayat-manual');
    if (pInput) pInput.value = '';

    let html = `<option value="" disabled selected>${appTr.panchayatSelectDefault || 'Select GP / Ward'}</option>`;
    if (blockMatch.gps && blockMatch.gps.length > 0) {
      html += `<optgroup label="${appTr.gpsOptGroup || 'Gram Panchayats (ଗ୍ରାମ ପଞ୍ଚାୟତ)'}">`;
      blockMatch.gps.forEach(gp => {
        html += `<option value="${gp} GP">${gp} GP</option>`;
      });
      html += `</optgroup>`;
    }
    html += `<option value="__OTHER__">${appTr.enterPanchayatManually || '✏️ Other / Enter GP or Ward Manually'}</option>`;
    panchayatSelect.innerHTML = html;
    return;
  }

  // Fallback
  panchayatSelect.innerHTML = `<option value="" disabled selected>${appTr.panchayatSelectDefault || 'Select GP / Ward'}</option>
    <option value="__OTHER__">${appTr.enterPanchayatManually || '✏️ Other / Enter GP or Ward Manually'}</option>`;
}

function handlePanchayatChange(panchVal) {
  const panchManualCont = document.getElementById('reg-panchayat-manual-container');
  if (panchVal === '__OTHER__') {
    if (panchManualCont) panchManualCont.classList.remove('hidden');
    document.getElementById('reg-panchayat-manual')?.focus();
  } else {
    if (panchManualCont) panchManualCont.classList.add('hidden');
    const pInput = document.getElementById('reg-panchayat-manual');
    if (pInput) pInput.value = '';
  }
}

const ALL_SKILLS = [
  'Legal Aid & RTI',
  'Content / Odia Writing',
  'Ground Mobilization',
  'Healthcare / First Aid',
  'Event Logistics',
  'Digital Advocacy',
  'Youth Mentorship',
  'Farmer Outreach'
];

function renderSkillPills() {
  return ALL_SKILLS.map(skill => {
    const isSelected = selectedSkills.includes(skill);
    return `
      <button type="button" onclick="toggleSkillSelection('${skill}')" class="px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1 ${isSelected ? 'bg-[#00433E] text-white shadow-sm' : 'bg-[#FAF2ED] text-[#3F4947] border border-[#E2DAC8]'}">
        <span class="material-symbols-outlined text-[14px]">${isSelected ? 'check' : 'add'}</span>
        <span>${skill}</span>
      </button>
    `;
  }).join('');
}

function toggleSkillSelection(skill) {
  if (selectedSkills.includes(skill)) {
    selectedSkills = selectedSkills.filter(s => s !== skill);
  } else {
    selectedSkills.push(skill);
  }
  const container = document.getElementById('skills-pills-container');
  if (container) container.innerHTML = renderSkillPills();
}

function updateReasonWordCount(val) {
  const words = val.trim() ? val.trim().split(/\s+/).length : 0;
  const disp = document.getElementById('word-count-display');
  if (disp) {
    disp.textContent = words + ' words';
    if (words >= 10) {
      disp.className = 'text-[#00433E] font-bold';
    } else {
      disp.className = 'text-[#3F4947]';
    }
  }
}

function togglePasswordView(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;
  const icon = btn.querySelector('.material-symbols-outlined');
  if (input.type === 'password') {
    input.type = 'text';
    if (icon) icon.textContent = 'visibility_off';
  } else {
    input.type = 'password';
    if (icon) icon.textContent = 'visibility';
  }
}


// Handle registration photo selection
async function handleRegistrationPhotoSelect(input) {
  if (!input || !input.files || !input.files[0]) return;
  const file = input.files[0];
  try {
    showToast(STATE.lang === 'or' ? 'ଫଟୋ ପ୍ରକ୍ରିୟାକରଣ ହେଉଛି...' : 'Compressing photo...', 'info');
    const base64 = await compressImage(file, 400, 400, 0.82);
    STATE.registrationPhoto = base64;
    const previewBox = document.getElementById('reg-photo-preview-box');
    if (previewBox) {
      previewBox.innerHTML = `<img src="${base64}" alt="Selected Photo" class="w-full h-full object-cover">`;
    }
    const btnText = document.getElementById('reg-photo-btn-text');
    if (btnText) {
      btnText.textContent = t('application.photoChangeBtn', 'Change Photo');
    }
    const actions = document.getElementById('reg-photo-actions');
    if (actions) {
      actions.classList.remove('hidden');
    }
    showToast(t('alerts.photoUploadedSuccess', 'Photo selected and compressed.'), 'info');
  } catch (err) {
    console.error('Registration photo error:', err);
    showToast(t('alerts.photoSizeError', 'Image could not be processed.'), 'error');
  } finally {
    if (input) input.value = '';
  }
}

function removeRegistrationPhoto() {
  STATE.registrationPhoto = '';
  const input = document.getElementById('reg-photo-input');
  if (input) input.value = '';
  const previewBox = document.getElementById('reg-photo-preview-box');
  if (previewBox) {
    previewBox.innerHTML = `<span class="material-symbols-outlined text-[24px]">add_a_photo</span><span class="text-[8px] font-bold mt-0.5">Upload</span>`;
  }
  const btnText = document.getElementById('reg-photo-btn-text');
  if (btnText) {
    btnText.textContent = t('application.photoUploadBtn', 'Select Photo');
  }
  const actions = document.getElementById('reg-photo-actions');
  if (actions) {
    actions.classList.add('hidden');
  }
}

// Handle Registration Submission (action: register)
async function handleRegisterSubmit() {
  if (STATE.member && STATE.member.code) {
    showToast(t('alerts.alreadyRegistered', 'You have already submitted an application. One application per citizen is permitted.'), 'warning');
    navigateTo('dashboard');
    return;
  }
  const name = document.getElementById('reg-name')?.value.trim();
  const phone = document.getElementById('reg-phone')?.value.trim();
  const email = document.getElementById('reg-email')?.value.trim();
  const district = document.getElementById('reg-district')?.value;
  const constituency = document.getElementById('reg-constituency')?.value;

  // Extract Block / Municipality (from cascading dropdown or manual fallback)
  let block = '';
  const blockSelect = document.getElementById('reg-block-select');
  if (blockSelect) {
    if (blockSelect.value === '__OTHER__') {
      block = document.getElementById('reg-block-manual')?.value.trim() || '';
    } else {
      block = blockSelect.value.trim();
    }
  } else {
    block = document.getElementById('reg-block')?.value.trim() || '';
  }

  // Extract Gram Panchayat / Ward (from cascading dropdown or manual fallback)
  let panchayat = '';
  const panchayatSelect = document.getElementById('reg-panchayat-select');
  if (panchayatSelect) {
    if (panchayatSelect.value === '__OTHER__') {
      panchayat = document.getElementById('reg-panchayat-manual')?.value.trim() || '';
    } else {
      panchayat = panchayatSelect.value.trim();
    }
  } else {
    panchayat = document.getElementById('reg-panchayat')?.value.trim() || '';
  }

  const village = document.getElementById('reg-village')?.value.trim();
  const occupation = document.getElementById('reg-occupation')?.value;
  const reason = document.getElementById('reg-reason')?.value.trim();
  const password = document.getElementById('reg-password')?.value;
  const confirmPassword = document.getElementById('reg-confirm-password')?.value;

  const oathConsent = document.getElementById('reg-oath-decl')?.checked;
  const transferConsent = document.getElementById('reg-transfer-decl')?.checked;
  const profDecl = document.getElementById('reg-prof-decl')?.checked;

  const isExecutiveRole = (STATE.selectedRole === 'OSD-FC' || STATE.selectedRole === 'OSD-PE');

  // Validations
  if (!name || !phone || !district || !constituency || !block || !panchayat || !password) {
    showToast(t('alerts.fillRequired', 'Please fill in all required fields.'), 'error');
    return;
  }
  if (phone.length !== 10) {
    showToast(t('alerts.phoneInvalid', 'Please enter a valid 10-digit mobile number.'), 'error');
    return;
  }
  if (password.length < 6) {
    showToast(t('alerts.passwordShort', 'Password must be at least 6 characters.'), 'error');
    return;
  }
  if (password !== confirmPassword) {
    showToast(t('alerts.passwordsMismatch', 'Passwords do not match.'), 'error');
    return;
  }
  if (!oathConsent) {
    showToast(t('alerts.oathRequired', 'Please accept the civic oath declaration.'), 'error');
    return;
  }
  if (!transferConsent) {
    showToast(t('alerts.transferRequired', 'Please confirm the organization transfer consent.'), 'error');
    return;
  }
  if (isExecutiveRole && !profDecl) {
    showToast(t('alerts.profDeclRequired', 'Working-professionals declaration is required for this role.'), 'error');
    return;
  }

  const submitBtn = document.getElementById('register-submit-btn');
  const btnOriginalContent = submitBtn ? submitBtn.innerHTML : '';
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="material-symbols-outlined text-[18px] animate-spin">sync</span> <span>${STATE.lang === 'or' ? 'ଦାଖଲ ହେଉଛି...' : 'Submitting...'}</span>`;
  }

  const payload = {
    name,
    phone,
    password,
    type: STATE.selectedRole,
    role: STATE.selectedRole,
    email,
    district,
    constituency,
    block,
    panchayat,
    village,
    occupation,
    skills: selectedSkills.join(', '),
    reason,
    standardDeclaration: true,
    leadershipDeclaration: (STATE.selectedRole === 'OSD-LDR' || STATE.selectedRole === 'OSD-COORD'),
    workingProfessionalDeclaration: Boolean(profDecl),
    transferConsent: Boolean(transferConsent),
    photo: STATE.registrationPhoto || ''
  };

  const res = await apiCall('register', payload);

  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.innerHTML = btnOriginalContent || `<span class="material-symbols-outlined text-[20px]">how_to_reg</span> <span>${t('application.submitBtn', 'Submit Application')}</span>`;
  }

  if (res && res.success) {
    showToast((t('alerts.registrationSuccess') || 'Registration submitted! OSD Code: ') + res.code, 'success');
    STATE.memberToken = res.token || '';
    STATE.member = res.member || {
      code: res.code,
      name,
      phone,
      type: STATE.selectedRole,
      status: 'Pending',
      district,
      constituency
    };
    if (STATE.registrationPhoto) {
      localStorage.setItem('osd_member_photo_' + res.code, STATE.registrationPhoto);
      if (STATE.member) STATE.member.photo = STATE.registrationPhoto;
      STATE.registrationPhoto = '';
    }
    localStorage.setItem('osd_member_token', STATE.memberToken);
    localStorage.setItem('osd_member', JSON.stringify(STATE.member));
    updateHeaderProfileUI();
    navigateTo('dashboard');
  } else {
    showToast(res && res.error ? res.error : 'Registration submission failed. Please try again.', 'error');
  }
}

// ----------------------------------------------------------------------------
// 5. Member Dashboard & Digital ID Screen
// ----------------------------------------------------------------------------
function renderDashboardScreen() {
  const container = document.getElementById('screen-content');
  const tr = STATE.translations[STATE.lang] || {};
  const dashTr = tr.dashboard || {};
  const rolesTr = tr.roles || {};

  // If not logged in, show Member Login Form
  if (!STATE.memberToken || !STATE.member) {
    container.innerHTML = `
      <div class="flex flex-col w-full pb-28 pt-2 max-w-[440px] mx-auto px-4 space-y-4">
        <div class="bg-[#FFFDF8] rounded-2xl p-5 shadow-sm border border-[#E2DAC8] text-center">
          <div class="w-14 h-14 rounded-full bg-[#00433E]/10 text-[#00433E] flex items-center justify-center mx-auto mb-2 border border-[#E8A33D]/30">
            <span class="material-symbols-outlined text-[28px]">lock</span>
          </div>
          <h3 class="text-lg font-bold text-[#1E1B18]">${dashTr.loginTitle || 'Member Login'}</h3>
          <p class="text-xs text-[#3F4947] mt-0.5">${dashTr.loginSub || 'Access your verified identity and grassroots log'}</p>
        </div>

        <form id="member-login-form" onsubmit="event.preventDefault(); handleMemberLogin();" class="bg-[#FFFDF8] rounded-2xl p-5 shadow-sm border border-[#E2DAC8] space-y-3.5">
          <div>
            <label class="block text-xs font-bold text-[#1E1B18] mb-1">${dashTr.mobileInput || '10-Digit Mobile Number'}</label>
            <div class="flex items-center gap-2">
              <span class="h-11 px-3 rounded-lg bg-[#EEE7E1] text-xs font-bold text-[#1E1B18] flex items-center">+91</span>
              <input id="login-phone" required type="tel" maxlength="10" pattern="[0-9]{10}" placeholder="9876543210" class="flex-1 h-11 px-3 rounded-lg bg-[#FAF2ED] text-sm text-[#1E1B18] border border-[#E2DAC8] focus:bg-white focus:outline-none focus:border-[#00433E]">
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-[#1E1B18] mb-1">${dashTr.passwordInput || 'Password'}</label>
            <input id="login-password" required type="password" placeholder="••••••••" class="w-full h-11 px-3 rounded-lg bg-[#FAF2ED] text-sm text-[#1E1B18] border border-[#E2DAC8] focus:bg-white focus:outline-none focus:border-[#00433E]">
          </div>

          <button id="member-login-btn" type="submit" class="w-full py-3 px-4 bg-[#FEB64E] hover:bg-[#E8A33D] text-[#714800] rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2 active:scale-[0.98] transition-all">
            <span class="material-symbols-outlined text-[18px]">login</span>
            <span>${dashTr.loginBtn || 'Log In to Portal'}</span>
          </button>

          <div class="text-center pt-2 border-t border-[#EEE7E1]">
            <span class="text-xs text-[#3F4947]">${dashTr.noAccountPrompt || "Don't have an account yet?"}</span>
            <button type="button" onclick="navigateTo('roles')" class="text-xs font-bold text-[#00433E] hover:underline ml-1">
              ${dashTr.registerNow || 'Apply to Join'}
            </button>
          </div>
        </form>
      </div>
    `;
    return;
  }

  // Member is Logged In
  const member = STATE.member;
  const status = member.status || 'Pending';
  const isApproved = (status === 'Approved');
  const isExecutive = ['OSD-FC', 'OSD-PE', 'OSD-AC'].includes(member.type);
  const memberPhoto = member.photo || member.details?.photo || (member.code ? localStorage.getItem('osd_member_photo_' + member.code) : '') || '';
  const hasPhoto = Boolean(memberPhoto);

  // Status Badge Colors & Info
  let statusBadgeColor = 'bg-[#FFDDB5] text-[#714800] border-[#FEB64E]';
  if (status === 'Approved') statusBadgeColor = 'bg-[#ABEFE7] text-[#00201D] border-[#0E5C56]';
  else if (status === 'Under Verification') statusBadgeColor = 'bg-[#FFF8F4] text-[#835400] border-[#E8A33D]';
  else if (status === 'Rejected') statusBadgeColor = 'bg-[#FFDAD6] text-[#93000A] border-[#BA1A1A]';

  const statusLabel = dashTr.statuses ? (dashTr.statuses[status] || status) : status;
  const statusExpl = dashTr.statusExplanations ? (dashTr.statusExplanations[status] || '') : '';

  container.innerHTML = `
    <div class="flex flex-col w-full pb-28 pt-3 max-w-[520px] mx-auto px-3.5 space-y-3.5">
      
      <!-- Welcome Header -->
      <div class="bg-[#FFFDF8] rounded-xl p-3.5 shadow-sm border border-[#E2DAC8] flex items-center justify-between">
        <div class="flex items-center gap-2.5 min-w-0">
          <div class="w-10 h-10 rounded-full bg-[#00433E] text-[#FFFDF8] flex items-center justify-center font-bold text-sm shadow">
            ${(member.name || 'M').charAt(0).toUpperCase()}
          </div>
          <div class="min-w-0">
            <span class="text-[10px] text-[#3F4947] uppercase font-semibold">${dashTr.welcomeBack || 'Welcome, Defender'}</span>
            <h3 class="text-sm font-bold text-[#1E1B18] truncate">${member.name || 'Member'}</h3>
            <span class="text-[11px] font-mono text-[#0E5C56] font-bold">${member.code || ''}</span>
          </div>
        </div>
        <button onclick="handleMemberLogout()" class="px-2.5 py-1.5 rounded-lg bg-[#FAF2ED] text-xs font-semibold text-[#BA1A1A] hover:bg-[#FFDAD6] active:scale-95 transition-all flex items-center gap-1">
          <span class="material-symbols-outlined text-[15px]">logout</span>
          <span>${dashTr.logoutBtn || 'Log Out'}</span>
        </button>
      </div>

      <!-- Live Application Status Badge Card -->
      <div class="bg-[#FFFDF8] rounded-xl p-4 shadow-sm border border-[#E2DAC8] space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-[#3F4947]">${dashTr.statusBadge || 'Application Status:'}</span>
          <span class="px-3 py-1 rounded-full text-xs font-bold border ${statusBadgeColor} flex items-center gap-1">
            <span class="w-2 h-2 rounded-full ${isApproved ? 'bg-[#0E5C56]' : 'bg-[#E8A33D]'} animate-pulse"></span>
            ${statusLabel}
          </span>
        </div>
        <p class="text-xs text-[#3F4947] leading-relaxed">${statusExpl}</p>
        ${member.adminNotes ? `
          <div class="bg-[#FAF2ED] p-2.5 rounded-lg border border-[#E2DAC8] text-xs mt-2">
            <span class="font-bold text-[#835400]">${dashTr.adminNotesLabel || 'Administrative Remarks:'}</span>
            <p class="text-[#1E1B18] mt-0.5">${member.adminNotes}</p>
          </div>
        ` : ''}
      </div>

      <!-- Official OSD Broadcast Channels & Copy Phone Helper Card -->
      <div id="osd-broadcast-channels-card" class="bg-[#FFFDF8] rounded-xl p-4 shadow-sm border border-[#E2DAC8] space-y-3">
        <div class="flex items-start gap-2.5">
          <div class="w-9 h-9 rounded-lg bg-[#00433E]/10 text-[#00433E] flex items-center justify-center flex-shrink-0 mt-0.5">
            <span class="material-symbols-outlined text-[20px]">campaign</span>
          </div>
          <div class="min-w-0">
            <h4 class="text-xs font-bold text-[#1E1B18] uppercase tracking-wide">
              ${dashTr.channelsHeading || 'Official OSD Broadcast Channels'}
            </h4>
            <p class="text-[11px] text-[#3F4947] mt-0.5 leading-snug">
              ${dashTr.channelsSub || 'Join our verified WhatsApp and Telegram channels for daily grassroots alerts, district directives, and community updates.'}
            </p>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2 pt-0.5">
          <!-- WhatsApp Channel One-Tap Button -->
          <a href="https://whatsapp.com/channel/0029VbD0nRkI1rcak5DUSt3j" target="_blank" rel="noopener noreferrer" class="py-2.5 px-2.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all text-center">
            <svg class="w-4 h-4 fill-current flex-shrink-0" viewBox="0 0 24 24">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.18-2.587-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.173.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.043.073.043.419-.101.824z"/>
            </svg>
            <span class="truncate">${dashTr.joinWhatsApp || 'Join WhatsApp'}</span>
          </a>

          <!-- Telegram Channel One-Tap Button -->
          <a href="https://t.me/OSDOffice" target="_blank" rel="noopener noreferrer" class="py-2.5 px-2.5 rounded-xl bg-[#229ED9] hover:bg-[#1E88E5] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all text-center">
            <svg class="w-4 h-4 fill-current flex-shrink-0" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
            </svg>
            <span class="truncate">${dashTr.joinTelegram || 'Join Telegram'}</span>
          </a>
        </div>

        <!-- Copy Registered Phone Number Helper -->
        <div class="bg-[#FAF2ED] p-2.5 rounded-lg border border-[#E2DAC8] flex items-center justify-between gap-2">
          <div class="flex items-center gap-2 min-w-0">
            <span class="material-symbols-outlined text-[17px] text-[#835400] flex-shrink-0">call</span>
            <div class="min-w-0">
              <span class="text-[9.5px] text-[#3F4947] block font-medium leading-none">${dashTr.registeredPhoneLabel || 'Registered Mobile:'}</span>
              <span class="text-xs font-bold text-[#1E1B18] font-mono leading-tight truncate block mt-0.5">+91 ${member.phone || '-'}</span>
            </div>
          </div>
          <button id="copy-phone-btn" type="button" onclick="copyRegisteredPhone('${member.phone || ''}')" class="px-2.5 py-1.5 rounded-lg bg-[#FFFDF8] hover:bg-[#EEE7E1] text-[11px] font-bold text-[#00433E] border border-[#E2DAC8] flex items-center gap-1 active:scale-95 transition-all flex-shrink-0">
            <span class="material-symbols-outlined text-[14px]">content_copy</span>
            <span id="copy-phone-text">${dashTr.copyPhoneBtn || 'Copy Number'}</span>
          </button>
        </div>
      </div>

      <!-- Digital ID Card Section: STRICTLY GATED -->
      ${!isApproved ? `
        <!-- Locked ID Card Issuance: Under Verification -->
        <div class="space-y-2">
          <div class="flex items-center justify-between px-1">
            <div>
              <h3 class="text-sm font-bold text-[#1E1B18]">${dashTr.idCardHeading || 'Digital Identity Card'}</h3>
              <p class="text-[10px] text-[#3F4947]">${dashTr.idCardSub || 'QR-verified canvas credential'}</p>
            </div>
            <span class="text-[10px] bg-[#835400]/15 text-[#835400] font-bold px-2 py-0.5 rounded-full border border-[#835400]/30 flex items-center gap-1">
              <span class="material-symbols-outlined text-[11px]">lock</span>
              Issuance Locked
            </span>
          </div>

          <div class="bg-[#FFFDF8] rounded-2xl p-5 shadow-sm border border-[#E2DAC8] space-y-3.5 text-center">
            <div class="w-14 h-14 rounded-full bg-[#835400]/10 text-[#835400] flex items-center justify-center mx-auto border border-[#E8A33D]/40">
              <span class="material-symbols-outlined text-[28px]">lock_clock</span>
            </div>
            <div>
              <h4 class="text-sm font-bold text-[#1E1B18]">${dashTr.idCardLockedHeading || 'ID Card Issuance Locked • Pending Verification'}</h4>
              <p class="text-xs text-[#3F4947] mt-1 leading-relaxed max-w-sm mx-auto">
                ${dashTr.idCardLockedDesc || 'Your official OSD Digital ID Card will be issued immediately upon verification and approval by the administrative council.'}
              </p>
            </div>

            <!-- Advance Photo Upload for Immediate Issuance Upon Approval -->
            <input type="file" id="member-photo-file-input" accept="image/*,image/jpeg,image/png,image/webp" class="sr-only" style="position: absolute; width: 1px; height: 1px; opacity: 0; pointer-events: none;" onchange="handleMemberPhotoUpload(this)" onclick="this.value=null;">
            
            ${hasPhoto ? `
              <div class="bg-[#FAF2ED] p-3 rounded-xl border border-[#0E5C56]/30 text-center space-y-2 max-w-sm mx-auto">
                <div class="flex items-center justify-center gap-1.5 text-xs font-bold text-[#0E5C56]">
                  <span class="material-symbols-outlined text-[16px]">check_circle</span>
                  <span>${dashTr.photoUploadedReadyBadge || 'Passport photo uploaded — ready for issuance upon approval'}</span>
                </div>
                <div>
                  <button type="button" onclick="triggerPhotoPicker('member-photo-file-input')" class="text-xs text-[#00433E] font-bold hover:underline inline-flex items-center gap-1 py-1 px-3 rounded-lg bg-white border border-[#E2DAC8] active:scale-95 transition-all">
                    <span class="material-symbols-outlined text-[14px]">edit</span>
                    <span>${dashTr.changePhotoBtn || 'Change Photo'}</span>
                  </button>
                </div>
              </div>
            ` : `
              <div class="bg-[#FAF2ED] p-3 rounded-xl border border-[#E8A33D]/40 text-center space-y-2 max-w-sm mx-auto">
                <p class="text-xs font-semibold text-[#835400]">
                  ${dashTr.idCardUploadAdvanceTip || 'Upload your passport photo in advance so your verified credential is generated immediately upon approval.'}
                </p>
                <button type="button" onclick="triggerPhotoPicker('member-photo-file-input')" class="py-2.5 px-4 bg-[#FEB64E] hover:bg-[#E8A33D] text-[#714800] rounded-xl font-bold text-xs inline-flex items-center gap-1.5 active:scale-95 transition-all shadow-xs">
                  <span class="material-symbols-outlined text-[17px]">photo_camera</span>
                  <span>${dashTr.uploadPhotoBtn || 'Upload Passport Photo'}</span>
                </button>
              </div>
            `}
          </div>
        </div>
      ` : (!hasPhoto) ? `
        <!-- Approved Member: Photo Upload Required Before Issuance -->
        <div class="space-y-2">
          <div class="flex items-center justify-between px-1">
            <div>
              <h3 class="text-sm font-bold text-[#1E1B18]">${dashTr.idCardHeading || 'Digital Identity Card'}</h3>
              <p class="text-[10px] text-[#3F4947]">${dashTr.idCardSub || 'QR-verified canvas credential'}</p>
            </div>
            <span class="text-[10px] bg-[#E8A33D]/20 text-[#835400] font-bold px-2 py-0.5 rounded-full border border-[#E8A33D]/50">
              Action Required
            </span>
          </div>

          <div class="bg-[#FFFDF8] rounded-2xl p-5 shadow-sm border-2 border-dashed border-[#E8A33D] space-y-3.5 text-center">
            <div class="w-16 h-16 rounded-full bg-[#FEB64E]/20 text-[#835400] flex items-center justify-center mx-auto border border-[#E8A33D] shadow-xs">
              <span class="material-symbols-outlined text-[32px]">add_a_photo</span>
            </div>
            <div>
              <h4 class="text-sm font-bold text-[#1E1B18]">${dashTr.photoRequiredHeading || 'Passport Photo Required to Issue ID Card'}</h4>
              <p class="text-xs text-[#3F4947] mt-1 leading-relaxed max-w-sm mx-auto">
                ${dashTr.photoRequiredDesc || 'Your membership application has been approved! Please upload a front-facing passport-style photo to generate and issue your official OSD Digital ID Card.'}
              </p>
            </div>

            <!-- Accessible file input with SR-only positioning for 100% Android WebView compatibility -->
            <input type="file" id="member-photo-file-input" accept="image/*,image/jpeg,image/png,image/webp" class="sr-only" style="position: absolute; width: 1px; height: 1px; opacity: 0; pointer-events: none;" onchange="handleMemberPhotoUpload(this)" onclick="this.value=null;">

            <div class="pt-1 max-w-xs mx-auto">
              <label for="member-photo-file-input" class="w-full block cursor-pointer">
                <button type="button" onclick="triggerPhotoPicker('member-photo-file-input')" class="w-full py-3 px-4 bg-[#FEB64E] hover:bg-[#E8A33D] text-[#714800] rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2 active:scale-[0.98] transition-all">
                  <span class="material-symbols-outlined text-[20px]">photo_camera</span>
                  <span>${dashTr.uploadPhotoBtn || 'Upload Passport Photo'}</span>
                </button>
              </label>
              <p class="text-[10.5px] text-[#3F4947] mt-2">
                ${dashTr.photoUploadTip || 'Photo must be front-facing, clear, and well-lit. Supports camera and gallery.'}
              </p>
            </div>
          </div>
        </div>
      ` : `
        <!-- Approved Member with Photo: Active Digital ID Card -->
        <div class="space-y-2">
          <div class="flex items-center justify-between px-1">
            <div>
              <h3 class="text-sm font-bold text-[#1E1B18]">${dashTr.idCardHeading || 'Digital Identity Card'}</h3>
              <p class="text-[10px] text-[#3F4947]">${dashTr.idCardSub || 'QR-verified canvas credential'}</p>
            </div>
            <span class="text-[10px] bg-[#ABEFE7] text-[#00201D] font-bold px-2 py-0.5 rounded-full border border-[#0E5C56]">
              Active Official Credential
            </span>
          </div>

          <!-- Hidden canvas for rendering crisp ID card -->
          <canvas id="id-card-canvas" class="hidden"></canvas>

          <!-- Displayed Crisp Image for Mobile WebView -->
          <div class="relative rounded-2xl overflow-hidden shadow-lg border border-[#E8A33D]/40 bg-[#08403C]">
            <img id="id-card-img" alt="OSD Digital ID Card" class="w-full h-auto block" src="">
          </div>

          <!-- Upload / Change Photo Option -->
          <input type="file" id="member-photo-file-input" accept="image/*,image/jpeg,image/png,image/webp" class="sr-only" style="position: absolute; width: 1px; height: 1px; opacity: 0; pointer-events: none;" onchange="handleMemberPhotoUpload(this)" onclick="this.value=null;">
          <div class="text-center pt-0.5">
            <label for="member-photo-file-input" class="inline-block cursor-pointer">
              <button type="button" onclick="triggerPhotoPicker('member-photo-file-input')" class="text-xs text-[#00433E] font-bold hover:underline inline-flex items-center gap-1 py-1 px-3 rounded-lg bg-[#FAF2ED] border border-[#E2DAC8] active:scale-95 transition-all">
                <span class="material-symbols-outlined text-[15px]">edit</span>
                <span>${dashTr.changePhotoBtn || 'Change Photo'}</span>
              </button>
            </label>
          </div>

          <!-- Action Buttons for ID Card -->
          <div class="grid grid-cols-2 gap-2 pt-1">
            <button onclick="downloadCanvasImage('id-card-canvas', 'OSD_ID_Card_' + (STATE.member.code || 'ID') + '.png')" class="py-2.5 px-3 rounded-xl bg-[#00433E] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow active:scale-95 transition-all">
              <span class="material-symbols-outlined text-[17px]">download</span>
              <span>${dashTr.downloadPngBtn || 'Download ID PNG'}</span>
            </button>
            <button onclick="shareCredential()" class="py-2.5 px-3 rounded-xl bg-[#FEB64E] text-[#714800] font-bold text-xs flex items-center justify-center gap-1.5 shadow active:scale-95 transition-all">
              <span class="material-symbols-outlined text-[17px]">share</span>
              <span>${dashTr.shareCardBtn || 'Share Credential'}</span>
            </button>
          </div>
          <p class="text-[10px] text-center text-[#3F4947]">${dashTr.pressToSaveNotice || 'Tip: Tap and hold image on mobile to save directly.'}</p>
        </div>
      `}

      <!-- Civic Role & Designation / Role Change Section (For Approved Members) -->
      ${isApproved ? `
        <div class="bg-[#FFFDF8] rounded-xl p-4 shadow-sm border border-[#E2DAC8] space-y-3">
          <div class="flex items-center justify-between border-b border-[#EEE7E1] pb-2">
            <h4 class="text-xs font-bold text-[#00433E] uppercase tracking-wide flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[17px]">military_tech</span>
              <span>${dashTr.roleSectionHeading || 'Civic Role & Designation'}</span>
            </h4>
            <span class="bg-[#0E5C56]/10 text-[#00433E] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#0E5C56]/20">
              ${member.type}
            </span>
          </div>

          <div class="flex items-center justify-between text-xs">
            <div>
              <span class="text-[10px] text-[#3F4947] block font-medium">${dashTr.currentApprovedRole || 'Current Approved Role:'}</span>
              <span class="font-bold text-[#1E1B18] text-sm">${rolesTr[member.type]?.title || member.type}</span>
              <span class="text-xs text-[#835400] font-semibold block">${rolesTr[member.type]?.odiaTitle || ''}</span>
            </div>
          </div>

          ${(member.details?.requestedRole && member.details?.roleChangeStatus === 'Pending Approval') ? `
            <!-- Pending Role Change Alert -->
            <div class="bg-[#FFF8F4] p-3 rounded-xl border border-[#FEB64E] space-y-1.5">
              <div class="flex items-center gap-1.5 text-xs font-bold text-[#835400]">
                <span class="material-symbols-outlined text-[17px] animate-spin">sync</span>
                <span>${dashTr.roleChangePendingTitle || 'Role Change Request Pending Admin Approval'}</span>
              </div>
              <p class="text-xs text-[#3F4947] leading-relaxed">
                ${(dashTr.roleChangePendingDesc || 'You requested to switch to {role}. Your current role remains active and official until approved by the council.').replace('{role}', `<strong>${member.details.requestedRole}</strong>`)}
              </p>
              ${member.details?.roleChangeReason ? `
                <p class="text-[11px] text-[#1E1B18] italic bg-white/60 p-2 rounded-lg border border-[#E2DAC8]">
                  "${member.details.roleChangeReason}"
                </p>
              ` : ''}
            </div>
          ` : `
            <!-- Request Role Change Collapsible Form -->
            <div class="pt-1">
              <button id="role-change-toggle-btn" type="button" onclick="toggleRoleChangeForm()" class="w-full py-2 px-3 rounded-lg bg-[#FAF2ED] hover:bg-[#EEE7E1] text-[#00433E] font-bold text-xs border border-[#E2DAC8] flex items-center justify-between active:scale-[0.99] transition-all">
                <span class="flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-[16px] text-[#835400]">swap_horiz</span>
                  <span>${dashTr.requestRoleChangeBtn || 'Request Role Change (Requires Admin Approval)'}</span>
                </span>
                <span id="role-change-toggle-icon" class="material-symbols-outlined text-[16px]">expand_more</span>
              </button>

              <form id="role-change-form" onsubmit="event.preventDefault(); handleRoleChangeSubmit();" class="hidden space-y-2.5 pt-2.5">
                <div>
                  <label class="block text-[11px] font-bold text-[#1E1B18] mb-1">
                    ${dashTr.selectTargetRoleLabel || 'Select Desired New Role *'}
                  </label>
                  <select id="role-change-target" required class="w-full h-9 px-2 rounded-lg bg-[#FAF2ED] text-xs font-bold text-[#1E1B18] border border-[#E2DAC8] focus:bg-white focus:outline-none focus:border-[#00433E]">
                    <option value="">-- Choose New Role --</option>
                    ${['OSD-VOL', 'OSD-PM', 'OSD-AM', 'OSD-COORD', 'OSD-LDR', 'OSD-SUP', 'OSD-FC', 'OSD-PE'].filter(k => k !== member.type).map(rKey => `
                      <option value="${rKey}">${rolesTr[rKey]?.title || rKey} (${rKey})</option>
                    `).join('')}
                  </select>
                </div>

                <div>
                  <label class="block text-[11px] font-bold text-[#1E1B18] mb-1">
                    ${dashTr.roleChangeReasonLabel || 'Reason for Requesting Role Change *'}
                  </label>
                  <textarea id="role-change-reason" required rows="2" placeholder="${dashTr.roleChangeReasonPlaceholder || 'Explain why you wish to change your role and how you will serve in the new capacity...'}" class="w-full p-2 rounded-lg bg-[#FAF2ED] text-xs text-[#1E1B18] border border-[#E2DAC8] focus:bg-white focus:outline-none focus:border-[#00433E]"></textarea>
                </div>

                <p class="text-[10px] text-[#3F4947] italic">
                  ${dashTr.roleChangeNotice || 'Note: One citizen applies for one role. Role changes are reviewed and approved by the State Secretariat. Your current ID card remains active until approved.'}
                </p>

                <div class="flex gap-2 pt-1">
                  <button id="role-change-submit-btn" type="submit" class="flex-1 py-2 bg-[#835400] text-white rounded-lg font-bold text-xs shadow active:scale-95 transition-all">
                    ${dashTr.submitRoleChangeBtn || 'Submit Request for Admin Review'}
                  </button>
                  <button type="button" onclick="toggleRoleChangeForm()" class="px-3 py-2 bg-[#EEE7E1] text-[#1E1B18] rounded-lg font-bold text-xs">
                    ${dashTr.cancelRoleChangeBtn || 'Cancel'}
                  </button>
                </div>
              </form>
            </div>
          `}
        </div>
      ` : ''}

      <!-- Recognition Certificate Section (Unlocked for Executive & Advisory roles) -->
      ${isExecutive ? `
        <div class="space-y-2 pt-2 border-t border-[#EEE7E1]">
          <div class="flex items-center justify-between px-1">
            <div>
              <h3 class="text-sm font-bold text-[#7A1F2B]">${dashTr.recognitionCertificateHeading || 'Recognition Certificate'}</h3>
              <p class="text-[10px] text-[#3F4947]">${dashTr.recognitionCertificateSub || 'High Council Distinction'}</p>
            </div>
            <span class="text-[10px] bg-[#7A1F2B]/10 text-[#7A1F2B] font-bold px-2 py-0.5 rounded-full">Executive</span>
          </div>

          <!-- Hidden Certificate Canvas -->
          <canvas id="cert-canvas" class="hidden"></canvas>
          <div class="rounded-xl overflow-hidden shadow-md border border-[#E8A33D]/50 bg-[#FAF6EE]">
            <img id="cert-img" alt="OSD Recognition Certificate" class="w-full h-auto block" src="">
          </div>

          <button onclick="downloadCanvasImage('cert-canvas', 'OSD_Certificate_' + (STATE.member.code || 'CERT') + '.png')" class="w-full py-2.5 px-3 rounded-xl bg-[#7A1F2B] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow active:scale-95 transition-all">
            <span class="material-symbols-outlined text-[17px]">workspace_premium</span>
            <span>${dashTr.downloadCertBtn || 'Download Certificate PNG'}</span>
          </button>
        </div>
      ` : ''}

      <!-- Profile Details & Editable Fields -->
      <div class="bg-[#FFFDF8] rounded-xl p-4 shadow-sm border border-[#E2DAC8] space-y-3">
        <div class="flex items-center justify-between border-b border-[#EEE7E1] pb-2">
          <h4 class="text-xs font-bold text-[#00433E] uppercase tracking-wide flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[17px]">account_circle</span>
            <span>Member Profile Details</span>
          </h4>
          <button id="profile-edit-toggle-btn" onclick="toggleProfileEdit()" class="text-xs font-bold text-[#835400] hover:underline flex items-center gap-1">
            <span class="material-symbols-outlined text-[14px]">edit</span>
            <span id="profile-edit-text">${dashTr.editProfileBtn || 'Edit Profile'}</span>
          </button>
        </div>

        <div id="profile-view-mode" class="grid grid-cols-2 gap-2.5 text-xs">
          <div>
            <span class="text-[10px] text-[#3F4947] block">District / Area</span>
            <span class="font-bold text-[#1E1B18]">${member.district || '-'} (${member.constituency || '-'})</span>
          </div>
          <div>
            <span class="text-[10px] text-[#3F4947] block">Block / Panchayat</span>
            <span class="font-bold text-[#1E1B18]">${member.block || '-'}/ ${member.panchayat || '-'}</span>
          </div>
          <div>
            <span class="text-[10px] text-[#3F4947] block">Occupation</span>
            <span class="font-bold text-[#1E1B18]">${member.details?.occupation || member.occupation || '-'}</span>
          </div>
          <div>
            <span class="text-[10px] text-[#3F4947] block">Phone Number</span>
            <span class="font-bold text-[#1E1B18]">+${member.phone || '-'}</span>
          </div>
        </div>

        <!-- Editable Form (Hidden by default) -->
        <form id="profile-edit-mode" onsubmit="event.preventDefault(); handleProfileUpdate();" class="hidden space-y-2.5 pt-1">
          <div>
            <label class="block text-[11px] font-bold text-[#1E1B18] mb-0.5">Email</label>
            <input id="edit-email" type="email" value="${member.email || ''}" class="w-full h-9 px-2.5 rounded-lg bg-[#FAF2ED] text-xs text-[#1E1B18] border border-[#E2DAC8]">
          </div>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-[11px] font-bold text-[#1E1B18] mb-0.5">Block</label>
              <input id="edit-block" type="text" value="${member.block || ''}" class="w-full h-9 px-2.5 rounded-lg bg-[#FAF2ED] text-xs text-[#1E1B18] border border-[#E2DAC8]">
            </div>
            <div>
              <label class="block text-[11px] font-bold text-[#1E1B18] mb-0.5">Panchayat</label>
              <input id="edit-panchayat" type="text" value="${member.panchayat || ''}" class="w-full h-9 px-2.5 rounded-lg bg-[#FAF2ED] text-xs text-[#1E1B18] border border-[#E2DAC8]">
            </div>
          </div>
          <div>
            <label class="block text-[11px] font-bold text-[#1E1B18] mb-0.5">Village / Locality</label>
            <input id="edit-village" type="text" value="${member.village || ''}" class="w-full h-9 px-2.5 rounded-lg bg-[#FAF2ED] text-xs text-[#1E1B18] border border-[#E2DAC8]">
          </div>
          <div>
            <label class="block text-[11px] font-bold text-[#1E1B18] mb-0.5">Skills</label>
            <input id="edit-skills" type="text" value="${member.details?.skills || member.skills || ''}" class="w-full h-9 px-2.5 rounded-lg bg-[#FAF2ED] text-xs text-[#1E1B18] border border-[#E2DAC8]">
          </div>
          <div class="flex gap-2 pt-1">
            <button type="submit" class="flex-1 py-2 bg-[#00433E] text-white rounded-lg font-bold text-xs shadow">
              ${dashTr.saveProfileBtn || 'Save Changes'}
            </button>
            <button type="button" onclick="toggleProfileEdit()" class="px-3 py-2 bg-[#EEE7E1] text-[#1E1B18] rounded-lg font-bold text-xs">
              ${dashTr.cancelEditBtn || 'Cancel'}
            </button>
          </div>
        </form>
      </div>

      <!-- Quick Action: Grassroots Log Link -->
      <button onclick="navigateTo('work-log')" class="w-full py-3 px-4 bg-[#FAF2ED] hover:bg-[#EEE7E1] text-[#00433E] rounded-xl font-bold text-xs border border-[#E2DAC8] flex items-center justify-between shadow-sm">
        <span class="flex items-center gap-2">
          <span class="material-symbols-outlined text-[18px] text-[#835400]">history_edu</span>
          <span>Record or View Grassroots Work Log</span>
        </span>
        <span class="material-symbols-outlined text-[16px]">chevron_right</span>
      </button>
    </div>
  `;

  // Draw the Digital ID Card & Certificate right after DOM is ready (gated on approval)
  setTimeout(() => {
    if (isApproved && hasPhoto) {
      drawDigitalIdCard(member, memberPhoto);
    }
    if (isExecutive && isApproved) {
      drawRecognitionCertificate(member);
    }
  }, 100);
}

function toggleProfileEdit() {
  const viewMode = document.getElementById('profile-view-mode');
  const editMode = document.getElementById('profile-edit-mode');
  const btnText = document.getElementById('profile-edit-text');
  if (!viewMode || !editMode) return;

  const isEditing = !editMode.classList.contains('hidden');
  if (isEditing) {
    editMode.classList.add('hidden');
    viewMode.classList.remove('hidden');
    if (btnText) btnText.textContent = t('dashboard.editProfileBtn', 'Edit Profile');
  } else {
    viewMode.classList.add('hidden');
    editMode.classList.remove('hidden');
    if (btnText) btnText.textContent = t('dashboard.cancelEditBtn', 'Cancel');
  }
}

// Member Login (action: login)
async function handleMemberLogin() {
  const phone = document.getElementById('login-phone')?.value.trim();
  const password = document.getElementById('login-password')?.value;
  const btn = document.getElementById('member-login-btn');

  if (!phone || !password) {
    showToast(t('alerts.fillRequired', 'Please fill in both mobile number and password.'), 'error');
    return;
  }

  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<span class="material-symbols-outlined text-[16px] animate-spin">sync</span> Logging in...';
  }

  const res = await apiCall('login', { phone, password });

  if (btn) {
    btn.disabled = false;
    btn.innerHTML = '<span class="material-symbols-outlined text-[18px]">login</span> Log In to Portal';
  }

  if (res && res.success) {
    STATE.memberToken = res.token;
    STATE.member = res.member;
    const localPhoto = (STATE.member && STATE.member.code) ? localStorage.getItem('osd_member_photo_' + STATE.member.code) : '';
    if (localPhoto && !STATE.member.photo && !(STATE.member.details && STATE.member.details.photo)) {
      STATE.member.photo = localPhoto;
    } else if (STATE.member && STATE.member.photo && STATE.member.code) {
      localStorage.setItem('osd_member_photo_' + STATE.member.code, STATE.member.photo);
    }
    localStorage.setItem('osd_member_token', STATE.memberToken);
    localStorage.setItem('osd_member', JSON.stringify(STATE.member));
    updateHeaderProfileUI();
    showToast(t('alerts.loginSuccess', 'Logged in successfully.'), 'success');
    renderDashboardScreen();
  } else {
    showToast(res && res.error ? res.error : t('alerts.loginFailed', 'Login failed.'), 'error');
  }
}


// Handle Member Photo Upload on Dashboard / My ID Screen
async function handleMemberPhotoUpload(input) {
  if (!input || !input.files || !input.files[0]) return;
  const file = input.files[0];
  try {
    showToast(STATE.lang === 'or' ? 'ଫଟୋ ପ୍ରକ୍ରିୟାକରଣ ହେଉଛି...' : 'Compressing photo...', 'info');
    const base64 = await compressImage(file, 400, 400, 0.82);

    if (STATE.member) {
      STATE.member.photo = base64;
      if (!STATE.member.details) STATE.member.details = {};
      STATE.member.details.photo = base64;
      if (STATE.member.code) {
        localStorage.setItem('osd_member_photo_' + STATE.member.code, base64);
      }
      localStorage.setItem('osd_member', JSON.stringify(STATE.member));
    }

    // Persist to backend via updateMyProfile (non-blocking)
    if (STATE.memberToken) {
      apiCall('updateMyProfile', { photo: base64 }, STATE.memberToken).catch((err) => {
        console.warn('Backend photo update non-blocking:', err);
      });
    }

    showToast(t('alerts.photoUploadedSuccess', 'Photo uploaded and ID card issued successfully!'), 'success');
    renderDashboardScreen();
    updateHeaderProfileUI();
  } catch (err) {
    console.error('Member photo upload error:', err);
    showToast(t('alerts.photoSizeError', 'Image could not be processed. Please try another image.'), 'error');
  } finally {
    if (input) input.value = '';
  }
}

// Member Logout (action: logout)
async function handleMemberLogout() {
  if (STATE.memberToken) {
    apiCall('logout', {}, STATE.memberToken).catch(() => {});
  }
  STATE.memberToken = '';
  STATE.member = null;
  localStorage.removeItem('osd_member_token');
  localStorage.removeItem('osd_member');
  sessionStorage.clear();

  closeHeaderProfileMenu();
  updateHeaderProfileUI();
  showToast(t('alerts.logoutSuccess', 'Logged out successfully.'), 'info');
  navigateTo('dashboard');
}

// Copy Registered Phone Helper for Broadcast Channels
function copyRegisteredPhone(phone) {
  if (!phone) return;
  const numToCopy = phone.startsWith('+91') ? phone : ('+91' + phone);
  if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(numToCopy).then(() => {
      showToast(t('alerts.phoneCopied', 'Registered mobile number copied to clipboard!'), 'success');
      const btnText = document.getElementById('copy-phone-text');
      if (btnText) {
        const orig = btnText.textContent;
        btnText.textContent = t('dashboard.phoneCopiedNotice', 'Copied!');
        setTimeout(() => { if (btnText) btnText.textContent = orig; }, 2000);
      }
    }).catch(() => {
      fallbackCopyText(numToCopy);
    });
  } else {
    fallbackCopyText(numToCopy);
  }
}

function fallbackCopyText(text) {
  try {
    const input = document.createElement('input');
    input.setAttribute('value', text);
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    showToast(t('alerts.phoneCopied', 'Registered mobile number copied to clipboard!'), 'success');
  } catch (e) {
    showToast('Phone: ' + text, 'info');
  }
}

// Toggle Role Change Request Form
function toggleRoleChangeForm() {
  const form = document.getElementById('role-change-form');
  const icon = document.getElementById('role-change-toggle-icon');
  if (!form) return;
  const isHidden = form.classList.contains('hidden');
  if (isHidden) {
    form.classList.remove('hidden');
    if (icon) icon.textContent = 'expand_less';
  } else {
    form.classList.add('hidden');
    if (icon) icon.textContent = 'expand_more';
  }
}

// Handle Role Change Request Submission
async function handleRoleChangeSubmit() {
  if (!STATE.member || !STATE.memberToken) {
    showToast(t('alerts.loginFailed', 'Please log in to submit a role change request.'), 'error');
    return;
  }
  const targetRole = document.getElementById('role-change-target')?.value;
  const reason = document.getElementById('role-change-reason')?.value.trim();

  if (!targetRole || targetRole === STATE.member.type) {
    showToast(t('alerts.roleChangeSelectRole', 'Please select a different target role.'), 'error');
    return;
  }
  if (!reason || reason.length < 5) {
    showToast(t('alerts.roleChangeReasonRequired', 'Please provide a reason for the role change request.'), 'error');
    return;
  }

  const btn = document.getElementById('role-change-submit-btn');
  const originalHtml = btn ? btn.innerHTML : '';
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<span class="material-symbols-outlined text-[16px] animate-spin">sync</span> <span>Submitting...</span>';
  }

  const payload = {
    requestedRole: targetRole,
    roleChangeReason: reason,
    roleChangeStatus: 'Pending Approval',
    roleChangeDate: new Date().toISOString()
  };

  const res = await apiCall('updateMyProfile', payload, STATE.memberToken);

  if (btn) {
    btn.disabled = false;
    btn.innerHTML = originalHtml;
  }

  if (res && res.success) {
    if (!STATE.member.details) STATE.member.details = {};
    STATE.member.details.requestedRole = targetRole;
    STATE.member.details.roleChangeReason = reason;
    STATE.member.details.roleChangeStatus = 'Pending Approval';
    STATE.member.details.roleChangeDate = payload.roleChangeDate;
    if (res.member) {
      STATE.member = { ...STATE.member, ...res.member, details: { ...STATE.member.details, ...(res.member.details || {}) } };
    }
    localStorage.setItem('osd_member', JSON.stringify(STATE.member));
    showToast(t('alerts.roleChangeSubmitted', 'Role change request submitted for administrative approval.'), 'success');
    renderDashboardScreen();
  } else {
    showToast(res && res.error ? res.error : 'Failed to submit role change request.', 'error');
  }
}

// Update Profile (action: updateMyProfile)
async function handleProfileUpdate() {
  const email = document.getElementById('edit-email')?.value.trim();
  const block = document.getElementById('edit-block')?.value.trim();
  const panchayat = document.getElementById('edit-panchayat')?.value.trim();
  const village = document.getElementById('edit-village')?.value.trim();
  const skills = document.getElementById('edit-skills')?.value.trim();

  const res = await apiCall('updateMyProfile', {
    email,
    block,
    panchayat,
    village,
    skills
  }, STATE.memberToken);

  if (res && res.success) {
    STATE.member = res.member || { ...STATE.member, email, block, panchayat, village, skills };
    localStorage.setItem('osd_member', JSON.stringify(STATE.member));
    showToast(t('alerts.profileUpdated', 'Profile updated successfully.'), 'success');
    renderDashboardScreen();
  } else {
    showToast(res && res.error ? res.error : 'Profile update failed.', 'error');
  }
}

// ----------------------------------------------------------------------------
// 6. Grassroots Work Log Screen (logWork, getMyWorkLogs)
// ----------------------------------------------------------------------------
let selectedWorkDomain = 'Heritage Protection';

function renderWorkLogScreen() {
  const container = document.getElementById('screen-content');
  const tr = STATE.translations[STATE.lang] || {};
  const workTr = tr.workLog || {};

  // If member is not logged in, prompt login
  if (!STATE.memberToken || !STATE.member) {
    container.innerHTML = `
      <div class="flex flex-col w-full pb-28 pt-2 max-w-[440px] mx-auto px-4 space-y-4">
        <div class="bg-[#FFFDF8] rounded-2xl p-5 shadow-sm border border-[#E2DAC8] text-center">
          <div class="w-14 h-14 rounded-full bg-[#835400]/10 text-[#835400] flex items-center justify-center mx-auto mb-2">
            <span class="material-symbols-outlined text-[28px]">history_edu</span>
          </div>
          <h3 class="text-base font-bold text-[#1E1B18]">${workTr.heading || 'Defender Activity Tracker'}</h3>
          <p class="text-xs text-[#3F4947] mt-1">${workTr.intro || 'Record grassroots civic interventions and community welfare initiatives across Odisha.'}</p>
          <div class="mt-4 pt-3 border-t border-[#EEE7E1]">
            <p class="text-xs text-[#1E1B18] font-semibold mb-2">Please log in as a registered member to log and track your grassroots activities.</p>
            <button onclick="navigateTo('dashboard')" class="w-full py-2.5 bg-[#00433E] text-white rounded-xl font-bold text-xs shadow">
              Log In to My Portal
            </button>
          </div>
        </div>
      </div>
    `;
    return;
  }

  // Member is Logged in
  container.innerHTML = `
    <div class="flex flex-col w-full pb-28 pt-3 max-w-[520px] mx-auto px-3.5 space-y-3.5">
      
      <!-- Header -->
      <div class="bg-[#FFFDF8] rounded-xl p-3.5 shadow-sm border border-[#E2DAC8]">
        <div class="flex items-center gap-2 mb-1">
          <span class="w-7 h-7 rounded-full bg-[#835400]/15 text-[#835400] flex items-center justify-center">
            <span class="material-symbols-outlined text-[17px]">history_edu</span>
          </span>
          <div>
            <h2 class="text-sm font-bold text-[#00433E]">${workTr.heading || 'Defender Activity Tracker'}</h2>
            <span class="text-xs text-[#835400] font-semibold">${workTr.subheading || 'ସ୍ୱାଭିମାନ କାର୍ଯ୍ୟ ବିବରଣୀ'}</span>
          </div>
        </div>
        <p class="text-[11px] text-[#3F4947] leading-relaxed">${workTr.intro}</p>
      </div>

      <!-- Log New Action Form Card -->
      <div class="bg-[#FFFDF8] rounded-xl p-4 shadow-sm border border-[#E2DAC8]">
        <div class="flex items-center gap-2 mb-3 border-b border-[#EEE7E1] pb-2">
          <span class="material-symbols-outlined text-[18px] text-[#00433E]">add_task</span>
          <h3 class="text-xs font-bold text-[#1E1B18] uppercase tracking-wide">${workTr.formTitle || 'Log New Civic Action'}</h3>
        </div>

        <form id="work-log-form" onsubmit="event.preventDefault(); handleWorkLogSubmit();" class="space-y-3">
          <!-- Domain Categories -->
          <div>
            <label class="block text-xs font-bold text-[#1E1B18] mb-1.5">${workTr.domainLabel || 'Action Domain *'}</label>
            <div class="grid grid-cols-2 gap-1.5" id="domain-chips-group">
              ${renderDomainChips()}
            </div>
          </div>

          <!-- Date & Hours Grid -->
          <div class="grid grid-cols-2 gap-2.5">
            <div>
              <label class="block text-xs font-bold text-[#1E1B18] mb-1">${workTr.dateLabel || 'Action Date *'}</label>
              <input id="work-date" required type="date" value="${new Date().toISOString().slice(0, 10)}" class="w-full h-10 px-2.5 rounded-lg bg-[#FAF2ED] text-xs text-[#1E1B18] border border-[#E2DAC8]">
            </div>
            <div>
              <label class="block text-xs font-bold text-[#1E1B18] mb-1">${workTr.hoursLabel || 'Hours Contributed *'}</label>
              <input id="work-hours" required type="number" min="0.5" max="24" step="0.5" value="2" class="w-full h-10 px-2.5 rounded-lg bg-[#FAF2ED] text-xs text-[#1E1B18] border border-[#E2DAC8]">
            </div>
          </div>

          <!-- District & Constituency -->
          <div class="grid grid-cols-2 gap-2.5">
            <div>
              <label class="block text-xs font-bold text-[#1E1B18] mb-1">${workTr.districtLabel || 'District *'}</label>
              <input id="work-district" required type="text" value="${STATE.member.district || 'Khordha'}" class="w-full h-10 px-2.5 rounded-lg bg-[#FAF2ED] text-xs text-[#1E1B18] border border-[#E2DAC8]">
            </div>
            <div>
              <label class="block text-xs font-bold text-[#1E1B18] mb-1">${workTr.constituencyLabel || 'Constituency'}</label>
              <input id="work-constituency" type="text" value="${STATE.member.constituency || ''}" class="w-full h-10 px-2.5 rounded-lg bg-[#FAF2ED] text-xs text-[#1E1B18] border border-[#E2DAC8]">
            </div>
          </div>

          <!-- Activity Description -->
          <div>
            <label class="block text-xs font-bold text-[#1E1B18] mb-1">${workTr.activityLabel || 'Activity Summary *'}</label>
            <textarea id="work-activity" required rows="2" placeholder="${workTr.activityPlaceholder || 'Cleanliness drive / RTI clinic...'}" class="w-full p-2.5 rounded-lg bg-[#FAF2ED] text-xs text-[#1E1B18] border border-[#E2DAC8] focus:bg-white focus:outline-none focus:border-[#00433E]"></textarea>
          </div>

          <!-- Additional Notes & Impact -->
          <div>
            <label class="block text-xs font-bold text-[#1E1B18] mb-1">${workTr.notesLabel || 'Additional Notes & Beneficiary Impact'}</label>
            <input id="work-notes" type="text" placeholder="${workTr.notesPlaceholder || 'Number of attendees, outcomes...'}" class="w-full h-10 px-2.5 rounded-lg bg-[#FAF2ED] text-xs text-[#1E1B18] border border-[#E2DAC8]">
          </div>

          <button id="work-submit-btn" type="submit" class="w-full py-3 bg-[#00433E] hover:bg-[#0E5C56] text-white rounded-xl font-bold text-xs shadow flex items-center justify-center gap-1.5 active:scale-95 transition-all">
            <span class="material-symbols-outlined text-[17px]">send</span>
            <span>${workTr.submitBtn || 'Submit Work Log Entry'}</span>
          </button>
        </form>
      </div>

      <!-- History List -->
      <div class="space-y-2">
        <div class="flex items-center justify-between px-1">
          <h3 class="text-xs font-bold text-[#1E1B18] uppercase tracking-wide">${workTr.historyHeading || 'My Logged Grassroots History'}</h3>
          <button onclick="fetchMyWorkLogs(true)" class="text-xs text-[#00433E] font-bold hover:underline flex items-center gap-1">
            <span class="material-symbols-outlined text-[14px]">refresh</span> Refresh
          </button>
        </div>
        <div id="work-history-list" class="space-y-2">
          ${renderWorkLogsList()}
        </div>
      </div>
    </div>
  `;

  fetchMyWorkLogs();
}

const DOMAIN_CATEGORIES = [
  'Heritage Protection',
  'Grievance & RTI',
  'Health / Blood Drive',
  'Swachhata Seva',
  'Sabuja Odisha Drive',
  'Legal & Language Awareness',
  'Youth Mobilization',
  'Disaster Support'
];

function renderDomainChips() {
  return DOMAIN_CATEGORIES.map(domain => {
    const isSelected = (selectedWorkDomain === domain);
    return `
      <button type="button" onclick="selectWorkDomain('${domain}')" class="p-2 rounded-lg text-left text-xs font-semibold flex items-center gap-1.5 transition-all ${isSelected ? 'bg-[#00433E] text-white shadow-sm' : 'bg-[#FAF2ED] text-[#1E1B18] border border-[#E2DAC8]'}">
        <span class="material-symbols-outlined text-[16px] ${isSelected ? 'text-[#FEB64E]' : 'text-[#0E5C56]'}">
          ${domain.includes('Heritage') ? 'account_balance' : (domain.includes('RTI') ? 'gavel' : (domain.includes('Health') ? 'favorite' : 'verified'))}
        </span>
        <span class="truncate">${domain}</span>
      </button>
    `;
  }).join('');
}

function selectWorkDomain(domain) {
  selectedWorkDomain = domain;
  const group = document.getElementById('domain-chips-group');
  if (group) group.innerHTML = renderDomainChips();
}

function renderWorkLogsList() {
  if (!STATE.myWorkLogs || STATE.myWorkLogs.length === 0) {
    return `
      <div class="bg-[#FFFDF8] p-4 rounded-xl shadow-sm border border-[#E2DAC8] text-center text-xs text-[#3F4947]">
        ${t('workLog.noLogsYet', 'No work activities logged yet. Record your first civic contribution above!')}
      </div>
    `;
  }

  return STATE.myWorkLogs.map(log => `
    <div class="bg-[#FFFDF8] p-3 rounded-xl shadow-sm border border-[#E2DAC8] text-xs space-y-1">
      <div class="flex items-center justify-between text-[11px] font-bold">
        <span class="text-[#00433E] flex items-center gap-1">
          <span class="material-symbols-outlined text-[14px]">event</span>
          ${log.date || ''}
        </span>
        <span class="text-[#835400] bg-[#FAF2ED] px-2 py-0.5 rounded-full border border-[#E2DAC8]">
          ${log.hours || 0} hrs
        </span>
      </div>
      <p class="font-bold text-[#1E1B18]">${log.activity || ''}</p>
      <div class="flex items-center justify-between text-[10.5px] text-[#3F4947] pt-1 border-t border-[#EEE7E1]">
        <span>${log.district || ''} ${log.constituency ? '• ' + log.constituency : ''}</span>
        ${log.notes ? `<span class="italic text-[10px] text-[#835400]">"${log.notes}"</span>` : ''}
      </div>
    </div>
  `).join('');
}

async function fetchMyWorkLogs(showToastMsg = false) {
  if (!STATE.memberToken) return;
  const res = await apiCall('getMyWorkLogs', {}, STATE.memberToken);
  if (res && res.success) {
    STATE.myWorkLogs = res.workLogs || [];
    const container = document.getElementById('work-history-list');
    if (container) container.innerHTML = renderWorkLogsList();
    if (showToastMsg) showToast('Work logs refreshed.', 'info');
  }
}

async function handleWorkLogSubmit() {
  const date = document.getElementById('work-date')?.value;
  const hours = document.getElementById('work-hours')?.value;
  const district = document.getElementById('work-district')?.value.trim();
  const constituency = document.getElementById('work-constituency')?.value.trim();
  const activityDesc = document.getElementById('work-activity')?.value.trim();
  const notes = document.getElementById('work-notes')?.value.trim();

  if (!activityDesc) {
    showToast(t('alerts.fillRequired', 'Activity summary is required.'), 'error');
    return;
  }

  const fullActivity = '[' + selectedWorkDomain + '] ' + activityDesc;
  const btn = document.getElementById('work-submit-btn');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<span class="material-symbols-outlined text-[16px] animate-spin">sync</span> Submitting...';
  }

  const res = await apiCall('logWork', {
    activity: fullActivity,
    date,
    hours: Number(hours) || 2,
    district,
    constituency,
    notes
  }, STATE.memberToken);

  if (btn) {
    btn.disabled = false;
    btn.innerHTML = '<span class="material-symbols-outlined text-[17px]">send</span> Submit Work Log Entry';
  }

  if (res && res.success) {
    showToast(t('alerts.workLogSuccess', 'Work activity logged successfully.'), 'success');
    document.getElementById('work-activity').value = '';
    document.getElementById('work-notes').value = '';
    fetchMyWorkLogs();
  } else {
    showToast(res && res.error ? res.error : 'Failed to log work.', 'error');
  }
}

// ----------------------------------------------------------------------------
// 7. Admin Console Screen (9 Admin Actions Wired)
// ----------------------------------------------------------------------------
let currentAdminFilter = 'all';

function renderAdminScreen() {
  const container = document.getElementById('screen-content');
  const tr = STATE.translations[STATE.lang] || {};
  const admTr = tr.admin || {};

  // Check admin authentication state safely
  const hasToken = Boolean(STATE.adminToken && STATE.adminToken !== 'undefined' && STATE.adminToken !== 'null');
  const hasAdmin = Boolean(STATE.admin && typeof STATE.admin === 'object');

  // If not logged in as Admin, show Admin Login Form
  if (!hasToken || !hasAdmin) {
    container.innerHTML = `
      <div class="flex flex-col w-full pb-28 pt-2 max-w-[440px] mx-auto px-4 space-y-4">
        <div class="bg-[#FFFDF8] rounded-2xl p-5 shadow-sm border border-[#E2DAC8] text-center">
          <div class="w-14 h-14 rounded-full bg-[#721926]/10 text-[#721926] flex items-center justify-center mx-auto mb-2 border border-[#E8A33D]/40">
            <span class="material-symbols-outlined text-[28px]">admin_panel_settings</span>
          </div>
          <h3 class="text-lg font-bold text-[#1E1B18]">${admTr.loginTitle || 'Admin Authentication'}</h3>
          <p class="text-xs text-[#3F4947] mt-0.5">${admTr.subheading || 'OSD Central Command & District Operations'}</p>
        </div>

        <form id="admin-login-form" onsubmit="event.preventDefault(); handleAdminLogin();" class="bg-[#FFFDF8] rounded-2xl p-5 shadow-sm border border-[#E2DAC8] space-y-3.5">
          <div>
            <label class="block text-xs font-bold text-[#1E1B18] mb-1">${admTr.usernameLabel || 'Admin Username'}</label>
            <input id="admin-username" required type="text" autocomplete="username" placeholder="admin" class="w-full h-11 px-3 rounded-lg bg-[#FAF2ED] text-sm text-[#1E1B18] border border-[#E2DAC8] focus:bg-white focus:outline-none focus:border-[#721926]">
          </div>

          <div>
            <label class="block text-xs font-bold text-[#1E1B18] mb-1">${admTr.passwordLabel || 'Password'}</label>
            <input id="admin-password" required type="password" autocomplete="current-password" placeholder="••••••••" class="w-full h-11 px-3 rounded-lg bg-[#FAF2ED] text-sm text-[#1E1B18] border border-[#E2DAC8] focus:bg-white focus:outline-none focus:border-[#721926]">
          </div>

          <button id="admin-login-btn" type="submit" class="w-full py-3 px-4 bg-[#721926] hover:bg-[#91303B] text-white rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2 active:scale-[0.98] transition-all">
            <span class="material-symbols-outlined text-[18px]">verified_user</span>
            <span>${admTr.loginBtn || 'Authenticate Admin Session'}</span>
          </button>
        </form>
      </div>
    `;
    return;
  }

  // Admin Logged In
  const admin = STATE.admin || {};
  const summary = STATE.adminSummary || { totals: {} };
  const totals = summary.totals || {};

  container.innerHTML = `
    <div class="flex flex-col w-full pb-28 pt-2 max-w-[540px] mx-auto px-3.5 space-y-3.5">
      
      <!-- Admin Context Banner -->
      <div class="bg-[#00433E] rounded-xl p-4 shadow-md text-white relative overflow-hidden">
        <div class="flex items-center justify-between text-xs mb-2">
          <div class="flex items-center gap-1.5 text-[#FEB64E] font-bold uppercase">
            <span class="material-symbols-outlined text-[16px]">admin_panel_settings</span>
            <span>${admTr.heading || 'State Oversight Portal'}</span>
          </div>
          <span class="bg-white/10 px-2 py-0.5 rounded-full text-[10px] font-semibold text-[#8ED2CA]">
            ${admin.role === 'super_admin' ? 'Super Admin' : (admin.assignedDistrict || 'District Admin')}
          </span>
        </div>
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-base font-bold text-white">${admin.username}</h3>
            <span class="text-xs text-[#8ED2CA]">${admTr.subheading}</span>
          </div>
          <button onclick="handleAdminLogout()" class="px-2.5 py-1.5 rounded-lg bg-[#721926] text-white text-xs font-bold hover:bg-[#91303B] active:scale-95 transition-all flex items-center gap-1 shadow">
            <span class="material-symbols-outlined text-[15px]">logout</span>
            <span>Exit</span>
          </button>
        </div>
      </div>

      <!-- Live KPI 2x2 Grid (adminOrgSummary) -->
      <div class="grid grid-cols-2 gap-2.5">
        <div class="bg-[#FFFDF8] rounded-xl p-3 shadow-sm border border-[#E2DAC8] flex flex-col justify-between">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-medium text-[#3F4947]">Total Defenders</span>
            <span class="material-symbols-outlined text-[16px] text-[#00433E]">groups</span>
          </div>
          <div class="mt-1">
            <span class="text-2xl font-extrabold text-[#00433E]" id="kpi-total">${totals.total || 0}</span>
            <span class="text-[10px] text-[#835400] block">Registered applicants</span>
          </div>
        </div>

        <div class="bg-[#FFFDF8] rounded-xl p-3 shadow-sm border border-[#E2DAC8] flex flex-col justify-between">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-medium text-[#3F4947]">Approved IDs</span>
            <span class="material-symbols-outlined text-[16px] text-[#0E5C56]">verified</span>
          </div>
          <div class="mt-1">
            <span class="text-2xl font-extrabold text-[#0E5C56]" id="kpi-approved">${totals.approved || 0}</span>
            <span class="text-[10px] text-[#0E5C56] block">Active credentials</span>
          </div>
        </div>

        <div class="bg-[#FFFDF8] rounded-xl p-3 shadow-sm border border-[#E2DAC8] flex flex-col justify-between">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-medium text-[#3F4947]">Pending Verify</span>
            <span class="material-symbols-outlined text-[16px] text-[#835400]">pending_actions</span>
          </div>
          <div class="mt-1">
            <span class="text-2xl font-extrabold text-[#835400]" id="kpi-pending">${totals.pending || 0}</span>
            <span class="text-[10px] text-[#835400] block">Awaiting review</span>
          </div>
        </div>

        <div class="bg-[#FFFDF8] rounded-xl p-3 shadow-sm border border-[#E2DAC8] flex flex-col justify-between">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-medium text-[#3F4947]">${admTr.kpiActiveDistricts || 'Active Chapters'}</span>
            <span class="material-symbols-outlined text-[16px] text-[#00433E]">map</span>
          </div>
          <div class="mt-1">
            <span class="text-2xl font-extrabold text-[#00433E]">${(summary && summary.activeDistricts != null ? summary.activeDistricts : (STATE.publicStats.activeDistricts || 0))} / 30</span>
            <span class="text-[10px] text-[#00433E] block">Districts active</span>
          </div>
        </div>
      </div>

      <!-- Approvals Queue Section (adminListApplications) -->
      <div class="bg-[#FFFDF8] rounded-xl p-4 shadow-sm border border-[#E2DAC8] space-y-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[#00433E] text-[18px]">assignment_turned_in</span>
            <h3 class="text-xs font-bold text-[#1E1B18] uppercase tracking-wide">${admTr.queueHeading || 'Approvals Queue'}</h3>
          </div>
          <button onclick="fetchAdminApplications(true)" class="text-xs text-[#00433E] font-bold hover:underline flex items-center gap-1">
            <span class="material-symbols-outlined text-[14px]">refresh</span> Reload
          </button>
        </div>

        <!-- Search Bar -->
        <div class="relative">
          <span class="material-symbols-outlined absolute left-3 top-2.5 text-[#3F4947] text-[18px]">search</span>
          <input id="admin-search-input" oninput="filterAdminQueue()" type="text" placeholder="${admTr.searchPlaceholder || 'Search by Code, Name, Phone...'}" class="w-full h-10 pl-9 pr-3 rounded-lg bg-[#FAF2ED] text-xs text-[#1E1B18] border border-[#E2DAC8]">
        </div>

        <!-- Filter Chips -->
        <div class="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          <button onclick="setAdminFilter('all')" class="admin-filter-btn px-3 py-1 rounded-full font-bold transition-all ${currentAdminFilter === 'all' ? 'bg-[#00433E] text-white shadow-sm' : 'bg-[#FAF2ED] text-[#3F4947] border border-[#E2DAC8]'}" data-f="all">All</button>
          <button onclick="setAdminFilter('Pending')" class="admin-filter-btn px-3 py-1 rounded-full font-bold transition-all ${currentAdminFilter === 'Pending' ? 'bg-[#00433E] text-white shadow-sm' : 'bg-[#FAF2ED] text-[#3F4947] border border-[#E2DAC8]'}" data-f="Pending">Pending</button>
          <button onclick="setAdminFilter('Under Verification')" class="admin-filter-btn px-3 py-1 rounded-full font-bold transition-all ${currentAdminFilter === 'Under Verification' ? 'bg-[#00433E] text-white shadow-sm' : 'bg-[#FAF2ED] text-[#3F4947] border border-[#E2DAC8]'}" data-f="Under Verification">In Verification</button>
          <button onclick="setAdminFilter('Approved')" class="admin-filter-btn px-3 py-1 rounded-full font-bold transition-all ${currentAdminFilter === 'Approved' ? 'bg-[#00433E] text-white shadow-sm' : 'bg-[#FAF2ED] text-[#3F4947] border border-[#E2DAC8]'}" data-f="Approved">Approved</button>
          <button onclick="setAdminFilter('Rejected')" class="admin-filter-btn px-3 py-1 rounded-full font-bold transition-all ${currentAdminFilter === 'Rejected' ? 'bg-[#00433E] text-white shadow-sm' : 'bg-[#FAF2ED] text-[#3F4947] border border-[#E2DAC8]'}" data-f="Rejected">Rejected</button>
        </div>

        <!-- Applications Cards List -->
        <div id="admin-queue-list" class="space-y-2 pt-1 max-h-[380px] overflow-y-auto pr-1">
          ${renderAdminQueueList()}
        </div>
      </div>

      <!-- District Breakdown Section (adminOrgSummary) -->
      <div class="bg-[#FFFDF8] rounded-xl p-4 shadow-sm border border-[#E2DAC8] space-y-2">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[#00433E] text-[18px]">bar_chart</span>
            <h3 class="text-xs font-bold text-[#1E1B18] uppercase tracking-wide">${admTr.districtBreakdownHeading || 'District & Constituency Breakdown'}</h3>
          </div>
        </div>
        <div id="admin-district-accordion" class="space-y-1.5 pt-1">
          ${renderDistrictAccordion()}
        </div>
      </div>

      <!-- Bilingual News Publisher (adminAddNews) -->
      <div class="bg-[#FFFDF8] rounded-xl p-4 shadow-sm border border-[#E2DAC8] space-y-3">
        <div class="flex items-center gap-1.5 border-b border-[#EEE7E1] pb-2">
          <span class="material-symbols-outlined text-[#00433E] text-[18px]">post_add</span>
          <h3 class="text-xs font-bold text-[#1E1B18] uppercase tracking-wide">${admTr.newsPublisherHeading || 'Publish Movement Announcement'}</h3>
        </div>

        <form id="admin-news-form" onsubmit="event.preventDefault(); handlePublishNews();" class="space-y-2.5">
          <div>
            <label class="block text-[11px] font-bold text-[#1E1B18] mb-0.5">${admTr.newsTitleEnLabel || 'Headline (English) *'}</label>
            <input id="news-title-en" required type="text" placeholder="State Conference Announced" class="w-full h-9 px-2.5 rounded-lg bg-[#FAF2ED] text-xs text-[#1E1B18] border border-[#E2DAC8]">
          </div>
          <div>
            <label class="block text-[11px] font-bold text-[#1E1B18] mb-0.5">${admTr.newsBodyEnLabel || 'Announcement Content (English) *'}</label>
            <textarea id="news-body-en" required rows="2" placeholder="Details of the announcement..." class="w-full p-2 rounded-lg bg-[#FAF2ED] text-xs text-[#1E1B18] border border-[#E2DAC8]"></textarea>
          </div>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-[11px] font-bold text-[#1E1B18] mb-0.5">${admTr.newsTitleOrLabel || 'Headline (ଓଡ଼ିଆ)'}</label>
              <input id="news-title-or" type="text" placeholder="ଶିରୋନାମା..." class="w-full h-9 px-2.5 rounded-lg bg-[#FAF2ED] text-xs text-[#1E1B18] border border-[#E2DAC8]">
            </div>
            <div>
              <label class="block text-[11px] font-bold text-[#1E1B18] mb-0.5">${admTr.newsCategoryLabel || 'Category'}</label>
              <select id="news-category" class="w-full h-9 px-2 rounded-lg bg-[#FAF2ED] text-xs text-[#1E1B18] border border-[#E2DAC8]">
                <option value="Announcement">Announcement</option>
                <option value="Press Release">Press Release</option>
                <option value="District Drive">District Drive</option>
                <option value="Legal Clinic">Legal Clinic</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-[11px] font-bold text-[#1E1B18] mb-0.5">${admTr.newsBodyOrLabel || 'Content (ଓଡ଼ିଆ)'}</label>
            <textarea id="news-body-or" rows="2" placeholder="ବିସ୍ତୃତ ବିବରଣୀ..." class="w-full p-2 rounded-lg bg-[#FAF2ED] text-xs text-[#1E1B18] border border-[#E2DAC8]"></textarea>
          </div>
          <button id="admin-publish-news-btn" type="submit" class="w-full py-2.5 bg-[#00433E] hover:bg-[#0E5C56] text-white rounded-lg font-bold text-xs shadow flex items-center justify-center gap-1.5 active:scale-95 transition-all">
            <span class="material-symbols-outlined text-[16px]">campaign</span>
            <span>${admTr.publishNewsBtn || 'Publish Official Announcement'}</span>
          </button>
        </form>
      </div>

      <!-- Compliance, Export & Audit Log Actions (adminExport, adminListAuditLog) -->
      <div class="bg-[#FFFDF8] rounded-xl p-4 shadow-sm border border-[#E2DAC8] space-y-3">
        <h4 class="text-xs font-bold text-[#1E1B18] uppercase tracking-wide">${admTr.exportHeading || 'Data Export & Compliance'}</h4>
        <div class="grid grid-cols-2 gap-2">
          <button onclick="handleExportCsv()" class="py-2.5 px-3 rounded-lg bg-[#FEB64E] text-[#714800] font-bold text-xs flex items-center justify-center gap-1.5 shadow active:scale-95 transition-all">
            <span class="material-symbols-outlined text-[17px]">download</span>
            <span>${admTr.downloadCsvBtn || 'Download CSV'}</span>
          </button>
          <button onclick="toggleAuditLogModal()" class="py-2.5 px-3 rounded-lg bg-[#EEE7E1] text-[#1E1B18] font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-[#E9E1DC] active:scale-95 transition-all">
            <span class="material-symbols-outlined text-[17px]">receipt_long</span>
            <span>Audit Log</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Applicant Detail Dossier Modal -->
    <div id="applicant-modal" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm hidden flex items-center justify-center p-3.5">
      <div id="applicant-modal-content" class="bg-[#FFFDF8] rounded-2xl p-5 max-w-md w-full shadow-2xl border border-[#E8A33D] max-h-[90vh] overflow-y-auto"></div>
    </div>

    <!-- Audit Log Modal -->
    <div id="audit-modal" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm hidden flex items-center justify-center p-3.5">
      <div class="bg-[#FFFDF8] rounded-2xl p-5 max-w-lg w-full shadow-2xl border border-[#00433E] max-h-[85vh] flex flex-col">
        <div class="flex items-center justify-between border-b border-[#EEE7E1] pb-2 mb-3">
          <h3 class="text-sm font-bold text-[#00433E] flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[18px]">security</span>
            <span>Immutable System Audit Log</span>
          </h3>
          <button onclick="toggleAuditLogModal()" class="w-7 h-7 rounded-full bg-[#EEE7E1] flex items-center justify-center text-[#3F4947]">
            <span class="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
        <div id="audit-log-table-container" class="flex-1 overflow-y-auto text-xs space-y-2">
          <!-- Populated by loadAuditLogs -->
        </div>
      </div>
    </div>
  `;

  // Fetch admin summary & queue
  fetchAdminSummary();
  fetchAdminApplications();
}

// Admin Login
async function handleAdminLogin() {
  const username = document.getElementById('admin-username')?.value.trim();
  const password = document.getElementById('admin-password')?.value;
  const btn = document.getElementById('admin-login-btn');

  if (!username || !password) {
    showToast(t('alerts.adminFillRequired', 'Username and password are required.'), 'error');
    return;
  }

  const origBtnContent = btn ? btn.innerHTML : '';
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<span class="material-symbols-outlined text-[16px] animate-spin">sync</span> <span>${STATE.lang === 'or' ? 'ପ୍ରାମାଣିକରଣ ଚାଲିଛି...' : 'Authenticating...'}</span>`;
  }

  try {
    const res = await apiCall('adminLogin', { username, password });

    if (btn) {
      btn.disabled = false;
      btn.innerHTML = origBtnContent || '<span class="material-symbols-outlined text-[18px]">verified_user</span> Authenticate Admin Session';
    }

    if (res && res.success) {
      // Robust token extraction across all possible key shapes (token, adminToken, sessionToken)
      const token = res.token || res.adminToken || res.sessionToken || 
                    (res.data && (res.data.token || res.data.adminToken || res.data.sessionToken)) || 
                    ('adm_' + Date.now());

      // Robust admin object extraction (admin, user, adminUser)
      let adminObj = res.admin || res.user || res.adminUser || (res.data && (res.data.admin || res.data.user || res.data.adminUser));
      if (!adminObj || typeof adminObj !== 'object') {
        adminObj = {
          username: username,
          role: (typeof adminObj === 'string' ? adminObj : 'super_admin'),
          assignedDistrict: ''
        };
      }
      if (!adminObj.username) adminObj.username = username;
      if (!adminObj.role) adminObj.role = 'super_admin';

      STATE.adminToken = token;
      STATE.admin = adminObj;
      localStorage.setItem('osd_admin_token', token);
      localStorage.setItem('osd_admin', JSON.stringify(adminObj));

      showToast(t('alerts.adminAuthSuccess', 'Admin session authenticated successfully.'), 'success');
      
      // Explicitly re-render admin view and scroll cleanly to top
      renderAdminScreen();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const errMsg = (res && res.error) 
        ? res.error 
        : t('alerts.adminLoginFailed', 'Invalid admin credentials or unauthorized account.');
      showToast(errMsg, 'error');
    }
  } catch (err) {
    console.error('Admin authentication exception:', err);
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = origBtnContent || '<span class="material-symbols-outlined text-[18px]">verified_user</span> Authenticate Admin Session';
    }
    showToast(t('alerts.networkError', 'Network request error. Please verify your connection.'), 'error');
  }
}

function handleAdminLogout() {
  STATE.adminToken = '';
  STATE.admin = null;
  STATE.adminSummary = null;
  STATE.adminApplications = [];
  localStorage.removeItem('osd_admin_token');
  localStorage.removeItem('osd_admin');
  showToast(t('alerts.adminLoggedOut', 'Admin session terminated.'), 'info');
  renderAdminScreen();
}

async function fetchAdminSummary() {
  if (!STATE.adminToken) return;
  const res = await apiCall('adminOrgSummary', {}, STATE.adminToken);
  if (res && res.success) {
    STATE.adminSummary = res;
    const totals = res.totals || {};
    const tEl = document.getElementById('kpi-total');
    const aEl = document.getElementById('kpi-approved');
    const pEl = document.getElementById('kpi-pending');
    if (tEl) tEl.textContent = totals.total || 0;
    if (aEl) aEl.textContent = totals.approved || 0;
    if (pEl) pEl.textContent = totals.pending || 0;

    const acc = document.getElementById('admin-district-accordion');
    if (acc) acc.innerHTML = renderDistrictAccordion();
  }
}

async function fetchAdminApplications(showToastMsg = false) {
  if (!STATE.adminToken) return;
  const res = await apiCall('adminListApplications', {}, STATE.adminToken);
  if (res && res.success) {
    STATE.adminApplications = res.applications || [];
    filterAdminQueue();
    if (showToastMsg) showToast('Approvals queue refreshed (' + STATE.adminApplications.length + ' records).', 'info');
  }
}

function setAdminFilter(f) {
  currentAdminFilter = f;
  document.querySelectorAll('.admin-filter-btn').forEach(btn => {
    if (btn.getAttribute('data-f') === f) {
      btn.className = 'admin-filter-btn px-3 py-1 rounded-full font-bold transition-all bg-[#00433E] text-white shadow-sm';
    } else {
      btn.className = 'admin-filter-btn px-3 py-1 rounded-full font-bold transition-all bg-[#FAF2ED] text-[#3F4947] border border-[#E2DAC8]';
    }
  });
  filterAdminQueue();
}

function filterAdminQueue() {
  const query = document.getElementById('admin-search-input')?.value.toLowerCase().trim() || '';
  const filtered = STATE.adminApplications.filter(app => {
    const matchFilter = (currentAdminFilter === 'all' || app.status === currentAdminFilter);
    if (!matchFilter) return false;
    if (!query) return true;
    const haystack = (app.code + ' ' + app.name + ' ' + app.phone + ' ' + app.district + ' ' + app.type).toLowerCase();
    return haystack.includes(query);
  });

  const container = document.getElementById('admin-queue-list');
  if (!container) return;

  if (filtered.length === 0) {
    container.innerHTML = '<div class="text-center text-xs text-[#3F4947] py-4">No matching applications in queue.</div>';
    return;
  }

  container.innerHTML = filtered.map(app => {
    let statusColor = 'bg-[#FFDDB5] text-[#714800]';
    if (app.status === 'Approved') statusColor = 'bg-[#ABEFE7] text-[#00201D]';
    else if (app.status === 'Rejected') statusColor = 'bg-[#FFDAD6] text-[#93000A]';

    return `
      <div onclick="openApplicantDossier('${app.code}')" class="bg-[#FAF2ED] p-3 rounded-xl border border-[#E2DAC8] cursor-pointer hover:border-[#00433E] transition-all space-y-1.5">
        <div class="flex items-center justify-between text-xs">
          <div class="flex items-center gap-1.5 min-w-0">
            <span class="font-bold text-[#1E1B18] truncate">${app.name}</span>
            <span class="text-[10px] font-bold px-1.5 py-0.2 rounded ${statusColor}">${app.status}</span>
          </div>
          <span class="font-mono text-[10.5px] text-[#0E5C56] font-bold flex-shrink-0">${app.code}</span>
        </div>
        <div class="flex items-center justify-between text-[11px] text-[#3F4947]">
          <span>${app.district} • ${app.type}</span>
          <span class="text-[#00433E] font-semibold flex items-center gap-0.5">
            View <span class="material-symbols-outlined text-[14px]">chevron_right</span>
          </span>
        </div>
      </div>
    `;
  }).join('');
}

// Applicant Dossier Modal (adminGetApplication)
async function openApplicantDossier(code) {
  const modal = document.getElementById('applicant-modal');
  const content = document.getElementById('applicant-modal-content');
  if (!modal || !content) return;

  content.innerHTML = '<div class="text-center py-6 text-xs text-[#3F4947]"><span class="material-symbols-outlined animate-spin text-[24px]">sync</span><p class="mt-2">Loading application dossier...</p></div>';
  modal.classList.remove('hidden');

  const res = await apiCall('adminGetApplication', { code }, STATE.adminToken);
  if (!res || !res.success) {
    content.innerHTML = '<div class="text-center py-4 text-xs text-[#BA1A1A]">Failed to load dossier. ' + (res?.error || '') + '</div>';
    return;
  }

  const app = res.application;
  const workLogs = res.workLogs || [];
  STATE.selectedApplicant = app;

  content.innerHTML = `
    <div class="flex items-center justify-between border-b border-[#EEE7E1] pb-2.5 mb-3">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-lg bg-[#00433E] text-white flex items-center justify-center font-bold text-xs">
          ${(app.name || 'A').charAt(0)}
        </div>
        <div>
          <h3 class="text-sm font-bold text-[#1E1B18]">${app.name}</h3>
          <span class="text-xs font-mono text-[#0E5C56] font-bold">${app.code}</span>
        </div>
      </div>
      <button onclick="closeApplicantDossier()" class="w-7 h-7 rounded-full bg-[#EEE7E1] flex items-center justify-center text-[#3F4947]">
        <span class="material-symbols-outlined text-[18px]">close</span>
      </button>
    </div>

    <!-- Application Details Grid -->
    <div class="space-y-2 text-xs">
      <div class="grid grid-cols-2 gap-2 bg-[#FAF2ED] p-2.5 rounded-lg border border-[#E2DAC8]">
        <div>
          <span class="text-[10px] text-[#3F4947] block">Phone Number</span>
          <span class="font-bold text-[#1E1B18]">+${app.phone}</span>
        </div>
        <div>
          <span class="text-[10px] text-[#3F4947] block">Email</span>
          <span class="font-bold text-[#1E1B18] truncate">${app.email || 'N/A'}</span>
        </div>
        <div>
          <span class="text-[10px] text-[#3F4947] block">District & AC</span>
          <span class="font-bold text-[#1E1B18]">${app.district} • ${app.constituency}</span>
        </div>
        <div>
          <span class="text-[10px] text-[#3F4947] block">Block & Ward</span>
          <span class="font-bold text-[#1E1B18]">${app.block} / ${app.panchayat}</span>
        </div>
      </div>

      <div class="bg-[#FAF2ED] p-2.5 rounded-lg border border-[#E2DAC8] space-y-1">
        <div>
          <span class="text-[10px] text-[#3F4947] block">Occupation & Skills</span>
          <span class="font-bold text-[#1E1B18]">${app.details?.occupation || '-'} • ${app.details?.skills || '-'}</span>
        </div>
        <div>
          <span class="text-[10px] text-[#3F4947] block">Reason for Joining</span>
          <p class="text-[11px] text-[#1E1B18] italic leading-snug">"${app.details?.reason || '-'}"</p>
        </div>
      </div>

      <!-- Action 1: Update Status (adminUpdateStatus) -->
      <div class="bg-[#FFFDF8] p-3 rounded-lg border border-[#0E5C56]/40 space-y-2">
        <label class="block font-bold text-xs text-[#00433E]">Update Status</label>
        <select id="modal-status-select" class="w-full h-9 px-2 rounded-lg bg-[#FAF2ED] text-xs font-bold text-[#1E1B18] border border-[#E2DAC8]">
          <option value="Pending" ${app.status === 'Pending' ? 'selected' : ''}>Pending</option>
          <option value="Under Verification" ${app.status === 'Under Verification' ? 'selected' : ''}>Under Verification</option>
          <option value="More Info Required" ${app.status === 'More Info Required' ? 'selected' : ''}>More Info Required</option>
          <option value="Approved" ${app.status === 'Approved' ? 'selected' : ''}>Approved</option>
          <option value="Rejected" ${app.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
          <option value="Inactive" ${app.status === 'Inactive' ? 'selected' : ''}>Inactive</option>
        </select>
        <input id="modal-admin-notes" type="text" placeholder="Add administrative notes..." value="${app.adminNotes || ''}" class="w-full h-8 px-2.5 rounded-lg bg-[#FAF2ED] text-xs text-[#1E1B18] border border-[#E2DAC8]">
        <button onclick="handleDossierStatusUpdate('${app.code}')" class="w-full py-2 bg-[#00433E] text-white rounded-lg font-bold text-xs shadow active:scale-95 transition-all">
          Save Status Update
        </button>
      </div>

      ${app.details?.requestedRole ? `
        <!-- Role Change Request Notice in Admin Dossier -->
        <div class="bg-[#FFF8F4] p-3 rounded-lg border border-[#FEB64E] text-xs space-y-1">
          <div class="flex items-center gap-1 font-bold text-[#835400]">
            <span class="material-symbols-outlined text-[16px]">pending_actions</span>
            <span>Applicant Requested Role Change:</span>
          </div>
          <p class="text-[#1E1B18]">Requested Target: <strong class="font-mono bg-white px-1.5 py-0.5 rounded border border-[#E2DAC8]">${app.details.requestedRole}</strong></p>
          ${app.details?.roleChangeReason ? `<p class="text-[#3F4947] italic">"${app.details.roleChangeReason}"</p>` : ''}
          <p class="text-[10px] text-[#835400] font-semibold">Select this role below and click "Reassign Role & Approve" to grant approval.</p>
        </div>
      ` : ''}

      <!-- Action 2: Change Category / Role (adminChangeCategory, includes OSD-AC) -->
      <div class="bg-[#FFFDF8] p-3 rounded-lg border border-[#835400]/40 space-y-2">
        <label class="block font-bold text-xs text-[#835400]">Reassign / Promote Role</label>
        <select id="modal-role-select" class="w-full h-9 px-2 rounded-lg bg-[#FAF2ED] text-xs font-bold text-[#1E1B18] border border-[#E2DAC8]">
          <option value="OSD-VOL" ${app.type === 'OSD-VOL' ? 'selected' : ''}>Volunteer (OSD-VOL)</option>
          <option value="OSD-PM" ${app.type === 'OSD-PM' ? 'selected' : ''}>Primary Member (OSD-PM)</option>
          <option value="OSD-AM" ${app.type === 'OSD-AM' ? 'selected' : ''}>Active Member (OSD-AM)</option>
          <option value="OSD-COORD" ${app.type === 'OSD-COORD' ? 'selected' : ''}>Local Coordinator (OSD-COORD)</option>
          <option value="OSD-LDR" ${app.type === 'OSD-LDR' ? 'selected' : ''}>Leadership Aspirant (OSD-LDR)</option>
          <option value="OSD-SUP" ${app.type === 'OSD-SUP' ? 'selected' : ''}>Supporter (OSD-SUP)</option>
          <option value="OSD-FC" ${app.type === 'OSD-FC' ? 'selected' : ''}>Founding Circle (OSD-FC)</option>
          <option value="OSD-PE" ${app.type === 'OSD-PE' ? 'selected' : ''}>Professional Expert (OSD-PE)</option>
          ${STATE.admin.role === 'super_admin' ? `
            <option value="OSD-AC" ${app.type === 'OSD-AC' ? 'selected' : ''}>★ Advisory Council (OSD-AC - Super Admin Only)</option>
          ` : ''}
        </select>
        <button onclick="handleDossierCategoryChange('${app.code}')" class="w-full py-2 bg-[#835400] text-white rounded-lg font-bold text-xs shadow active:scale-95 transition-all">
          Reassign Role & Approve
        </button>
      </div>

      <!-- Grassroots Work History in Dossier -->
      <div class="pt-1">
        <span class="text-xs font-bold text-[#1E1B18] block mb-1">Logged Work History (${workLogs.length})</span>
        <div class="space-y-1.5 max-h-36 overflow-y-auto">
          ${workLogs.length > 0 ? workLogs.map(w => `
            <div class="bg-[#FAF2ED] p-2 rounded text-[11px] border border-[#E2DAC8]">
              <span class="font-bold text-[#00433E]">${w.date} (${w.hours}h)</span>: ${w.activity}
            </div>
          `).join('') : '<span class="text-[10.5px] text-[#3F4947] italic">No work activities recorded yet.</span>'}
        </div>
      </div>
    </div>
  `;
}

function closeApplicantDossier() {
  const modal = document.getElementById('applicant-modal');
  if (modal) modal.classList.add('hidden');
}

async function handleDossierStatusUpdate(code) {
  const status = document.getElementById('modal-status-select')?.value;
  const adminNotes = document.getElementById('modal-admin-notes')?.value.trim();

  const res = await apiCall('adminUpdateStatus', { code, status, adminNotes }, STATE.adminToken);
  if (res && res.success) {
    showToast('Status for ' + code + ' updated to ' + status, 'success');
    closeApplicantDossier();
    fetchAdminApplications();
    fetchAdminSummary();
  } else {
    showToast(res && res.error ? res.error : 'Failed to update status.', 'error');
  }
}

async function handleDossierCategoryChange(code) {
  const newCategory = document.getElementById('modal-role-select')?.value;
  const adminNotes = document.getElementById('modal-admin-notes')?.value.trim();

  const res = await apiCall('adminChangeCategory', {
    code,
    newCategory,
    adminNotes,
    approveIfPromoting: true
  }, STATE.adminToken);

  if (res && res.success) {
    showToast('Role for ' + code + ' updated to ' + newCategory, 'success');
    closeApplicantDossier();
    fetchAdminApplications();
    fetchAdminSummary();
  } else {
    showToast(res && res.error ? res.error : 'Failed to change category.', 'error');
  }
}

function renderDistrictAccordion() {
  const summary = STATE.adminSummary;
  const districtsData = (summary && summary.districts) ? summary.districts : {};

  return Object.keys(ODISHA_DISTRICTS).map(d => {
    const data = districtsData[d] || { total: 0, approved: 0, pending: 0, constituencies: {} };
    const constList = ODISHA_DISTRICTS[d] || [];

    return `
      <div class="border border-[#E2DAC8] rounded-lg overflow-hidden bg-[#FAF2ED]">
        <button onclick="toggleDistrictItem('${d}')" class="w-full p-2.5 flex items-center justify-between text-left hover:bg-[#EEE7E1] transition-colors text-xs">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-[#00433E]"></span>
            <span class="font-bold text-[#1E1B18]">${d} (${ODISHA_DISTRICTS_OR[d] || d})</span>
          </div>
          <div class="flex items-center gap-2 font-mono font-bold text-[#00433E]">
            <span>${data.total} Defenders</span>
            <span class="material-symbols-outlined text-[16px] text-[#3F4947]" id="chevron-${d}">expand_more</span>
          </div>
        </button>
        <div id="content-${d}" class="hidden p-2.5 bg-white border-t border-[#E2DAC8] text-xs space-y-1">
          <div class="flex gap-4 text-[11px] font-semibold text-[#3F4947] mb-1">
            <span>Approved: <strong class="text-[#0E5C56]">${data.approved}</strong></span>
            <span>Pending: <strong class="text-[#835400]">${data.pending}</strong></span>
          </div>
          <div class="grid grid-cols-2 gap-1 text-[11px]">
            ${constList.map(c => {
              const cCount = (data.constituencies && data.constituencies[c]) ? data.constituencies[c].total : 0;
              return `
                <div class="p-1 rounded bg-[#FAF2ED] flex justify-between">
                  <span class="truncate">${c}:</span>
                  <span class="font-bold text-[#00433E]">${cCount}</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function toggleDistrictItem(d) {
  const content = document.getElementById('content-' + d);
  const chevron = document.getElementById('chevron-' + d);
  if (!content) return;
  const isHidden = content.classList.contains('hidden');
  if (isHidden) {
    content.classList.remove('hidden');
    if (chevron) chevron.textContent = 'expand_less';
  } else {
    content.classList.add('hidden');
    if (chevron) chevron.textContent = 'expand_more';
  }
}

// Publish Movement Announcement (adminAddNews)
async function handlePublishNews() {
  const titleEn = document.getElementById('news-title-en')?.value.trim();
  const bodyEn = document.getElementById('news-body-en')?.value.trim();
  const titleOr = document.getElementById('news-title-or')?.value.trim();
  const bodyOr = document.getElementById('news-body-or')?.value.trim();
  const category = document.getElementById('news-category')?.value;

  const btn = document.getElementById('admin-publish-news-btn');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<span class="material-symbols-outlined text-[16px] animate-spin">sync</span> Publishing...';
  }

  const res = await apiCall('adminAddNews', {
    titleEn,
    bodyEn,
    titleOr,
    bodyOr,
    category
  }, STATE.adminToken);

  if (btn) {
    btn.disabled = false;
    btn.innerHTML = '<span class="material-symbols-outlined text-[16px]">campaign</span> Publish Official Announcement';
  }

  if (res && res.success) {
    showToast(t('alerts.newsPublished', 'Official announcement published.'), 'success');
    document.getElementById('news-title-en').value = '';
    document.getElementById('news-body-en').value = '';
    document.getElementById('news-title-or').value = '';
    document.getElementById('news-body-or').value = '';
    fetchPublicData();
  } else {
    showToast(res && res.error ? res.error : 'Failed to publish news.', 'error');
  }
}

// CSV Export (adminExport)
async function handleExportCsv() {
  showToast('Generating state verification CSV report...', 'info');
  const res = await apiCall('adminExport', { status: 'All' }, STATE.adminToken);
  if (res && res.success && res.csv) {
    const blob = new Blob([res.csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = res.filename || 'OSD_Members_Export.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('CSV downloaded: ' + res.rowCount + ' records.', 'success');
  } else {
    showToast(res && res.error ? res.error : 'CSV export failed.', 'error');
  }
}

// Audit Log (adminListAuditLog)
async function toggleAuditLogModal() {
  const modal = document.getElementById('audit-modal');
  if (!modal) return;
  const isHidden = modal.classList.contains('hidden');
  if (isHidden) {
    modal.classList.remove('hidden');
    loadAuditLogs();
  } else {
    modal.classList.add('hidden');
  }
}

async function loadAuditLogs() {
  const container = document.getElementById('audit-log-table-container');
  if (!container) return;
  container.innerHTML = '<div class="text-center py-4 text-xs text-[#3F4947]">Loading immutable audit logs...</div>';

  const res = await apiCall('adminListAuditLog', { limit: 100 }, STATE.adminToken);
  if (res && res.success && res.auditLog) {
    const logs = res.auditLog;
    if (logs.length === 0) {
      container.innerHTML = '<div class="text-center py-4 text-xs text-[#3F4947]">No audit logs recorded yet.</div>';
      return;
    }
    container.innerHTML = logs.map(l => `
      <div class="bg-[#FAF2ED] p-2.5 rounded-lg border border-[#E2DAC8] space-y-0.5">
        <div class="flex justify-between items-center text-[10px] text-[#3F4947]">
          <span class="font-bold text-[#00433E]">${l.actorUsername} (${l.actorRole})</span>
          <span>${l.timestamp ? l.timestamp.slice(0, 19).replace('T', ' ') : ''}</span>
        </div>
        <div class="font-bold text-[#1E1B18] text-[11px]">${l.action} • ${l.targetCode}</div>
        <div class="text-[10.5px] text-[#3F4947]">${l.details}</div>
      </div>
    `).join('');
  } else {
    container.innerHTML = '<div class="text-center py-4 text-xs text-[#BA1A1A]">Failed to load audit logs.</div>';
  }
}

// ----------------------------------------------------------------------------
// Startup & Public Data Fetch (getPublicNews)
// ----------------------------------------------------------------------------
async function fetchPublicData() {
  const res = await apiCall('getPublicNews');
  if (res && res.success) {
    STATE.publicNews = res.news || [];
    if (res.stats) {
      STATE.publicStats = res.stats;
    }
    if (STATE.currentScreen === 'home') {
      renderHomeScreen();
    }
  }
}

// Initialize App
async function initApp() {
  await loadTranslations();
  updateLanguageUI();

  // Hash route parsing
  const hash = window.location.hash.replace('#', '');
  if (['home', 'roles', 'apply', 'dashboard', 'work-log', 'admin'].includes(hash)) {
    navigateTo(hash);
  } else {
    navigateTo('splash');
  }

  fetchPublicData();

  // Auto transition from splash to home after 4 seconds if user hasn't clicked
  setTimeout(() => {
    if (STATE.currentScreen === 'splash') {
      navigateTo('home');
    }
  }, 4200);

  // Register Service Worker for offline PWA support
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').then(() => {
      console.log('OSD Service Worker active');
    }).catch(err => {
      console.warn('Service Worker registration skipped:', err);
    });
  }
}

window.addEventListener('DOMContentLoaded', initApp);
