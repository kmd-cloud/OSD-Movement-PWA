# OSD Connect — Native Android WebView Wrapper

A production-ready, self-contained Android wrapper project designed to load the **OSD Connect** Progressive Web App with complete native Android hardware & file chooser integration:

- **Target URL**: `https://kmd-cloud.github.io/OSD-Movement-PWA/`
- **Native Photo & Camera Picker**: Full implementation of `WebChromeClient.onShowFileChooser(...)` with camera intent, gallery intent, and AndroidX `ActivityResultLauncher`.
- **ValueCallback Cleanup**: Guarantees `mFilePathCallback.onReceiveValue(null)` on cancellation, preventing file chooser lockups on subsequent taps.
- **FileProvider Security**: Secure content URI generation (`content://org.osd.connect.fileprovider/...`) for camera photos without `FileUriExposedException`.
- **Hardware & PWA Storage**: Full DOM storage, IndexedDB, JavaScript execution, and base64 download support (for ID card PNGs and CSV logs).
- **Navigation**: Swipe-to-refresh (`SwipeRefreshLayout`) and hardware back-button navigation within the WebView history.

---

## Prerequisites (Already installed on your PC)
- **Android Studio**: Installed at `C:\Program Files\Android\Android Studio`
- **Android SDK**: Installed at `C:\Users\kmdas\AppData\Local\Android\Sdk`
- **Java (JBR)**: Bundled with Android Studio at `C:\Program Files\Android\Android Studio\jbr`

---

## Method 1: Build APK via Android Studio (Recommended)

1. **Open the Project**:
   - Launch **Android Studio**.
   - Click **File** > **Open...**
   - Browse to `c:\Users\kmdas\OSD Movememt\stitch_osd_citizen_movement_app\stitch_osd_citizen_movement_app\android-wrapper` (or `C:\Users\kmdas\OneDrive\Documents\GitHub\OSD Connect\android-wrapper`).
   - Click **OK**. Android Studio will sync the Gradle project automatically.

2. **Run on a Device / Emulator**:
   - Connect your Android phone via USB (with **USB Debugging** enabled in Developer Options) or start an Android Emulator.
   - Click the green **Run** button (or press `Shift + F10`).
   - The app will install and open `https://kmd-cloud.github.io/OSD-Movement-PWA/`.

3. **Generate a Signed or Debug APK**:
   - In Android Studio menu, click **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**.
   - Once compilation finishes, click the **locate** link in the bottom-right notification pop-up.
   - Your APK file is ready at:
     `android-wrapper/app/build/outputs/apk/debug/app-debug.apk`
   - You can copy this APK directly to your phone and install it!

---

## Method 2: Build APK from Windows Command Line (PowerShell)

You can compile the APK directly without even opening Android Studio:

```powershell
# 1. Open PowerShell and navigate to the android-wrapper directory
cd "C:\Users\kmdas\OneDrive\Documents\GitHub\OSD Connect\android-wrapper"

# 2. Set JAVA_HOME and PATH to Android Studio's bundled Java
$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
$env:PATH = "$env:JAVA_HOME\bin;" + $env:PATH
$env:ANDROID_HOME = "C:\Users\kmdas\AppData\Local\Android\Sdk"

# 3. Build the Debug APK using Gradle
# (If gradlew is present, run: .\gradlew assembleDebug)
```

---

## Method 3: Using PWABuilder / WebIntoApp Online Generators

If you prefer using an online tool like [PWABuilder.com](https://www.pwabuilder.com/) or [WebIntoApp.com](https://www.webintoapp.com/):

1. Enter your URL: `https://kmd-cloud.github.io/OSD-Movement-PWA/`
2. **Crucial Setting**: Under **Permissions / Hardware Features**, ensure **Camera** and **File Upload / Media Access** are checked:
   - `android.permission.CAMERA`
   - `android.permission.READ_EXTERNAL_STORAGE` / `READ_MEDIA_IMAGES`
3. Generate the Android package. Modern PWABuilder packages (TWA / Trusted Web Activities) automatically delegate file inputs to the system Chrome browser engine, which supports `<input type="file" accept="image/*">` natively.

---

## Why File / Camera Upload Works in This Wrapper
1. **`onShowFileChooser` Implementation**: Overrides `WebChromeClient.onShowFileChooser(...)` so Android intercepts web file input clicks.
2. **Unified Intent Chooser**: Launches a system dialog presenting both **Camera** (taking a live photo) and **Files/Gallery** (selecting an existing image).
3. **Resilient Callback Handling**: Regardless of whether the user captures a photo, selects a file, or presses the back button to cancel, `mFilePathCallback.onReceiveValue(...)` is always resolved and reset to `null`. This prevents the file chooser from freezing or ignoring taps on subsequent attempts.
4. **Transparent Input Overlay**: In the PWA frontend (`app.js`), buttons and preview boxes feature a full-sized transparent `<input type="file" accept="image/*">` overlay, ensuring native touch recognition across all Android WebView versions.
