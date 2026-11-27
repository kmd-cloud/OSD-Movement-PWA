package org.osd.connect;

import android.Manifest;
import android.content.ClipData;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.provider.MediaStore;
import android.util.Base64;
import android.view.View;
import android.webkit.DownloadListener;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.ProgressBar;
import android.widget.Toast;

import androidx.activity.OnBackPressedCallback;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.ContextCompat;
import androidx.core.content.FileProvider;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;

public class MainActivity extends AppCompatActivity {

    private static final String DEFAULT_URL = "https://kmd-cloud.github.io/OSD-Movement-PWA/";

    private WebView mWebView;
    private SwipeRefreshLayout mSwipeRefresh;
    private ProgressBar mProgressBar;

    // File Chooser state
    private ValueCallback<Uri[]> mFilePathCallback;
    private Uri mCameraPhotoUri;

    // Activity Result Launcher for File & Camera Chooser
    private ActivityResultLauncher<Intent> mFileChooserLauncher;
    private ActivityResultLauncher<String[]> mPermissionLauncher;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        initViews();
        initLaunchers();
        setupWebView();
        setupBackNavigation();

        if (savedInstanceState == null) {
            mWebView.loadUrl(DEFAULT_URL);
        } else {
            mWebView.restoreState(savedInstanceState);
        }
    }

    private void initViews() {
        mWebView = findViewById(R.id.web_view);
        mSwipeRefresh = findViewById(R.id.swipe_refresh);
        mProgressBar = findViewById(R.id.progress_bar);

        mSwipeRefresh.setColorSchemeResources(R.color.primary, R.color.accent, R.color.gold);
        mSwipeRefresh.setOnRefreshListener(() -> mWebView.reload());
    }

    private void initLaunchers() {
        // Modern ActivityResultLauncher for File & Camera Chooser
        mFileChooserLauncher = registerForActivityResult(
            new ActivityResultContracts.StartActivityForResult(),
            result -> {
                if (mFilePathCallback == null) return;

                Uri[] results = null;
                if (result.getResultCode() == RESULT_OK) {
                    Intent data = result.getData();

                    if (data != null && (data.getData() != null || data.getClipData() != null)) {
                        // User selected file(s) from Gallery / Files app
                        if (data.getClipData() != null) {
                            ClipData clipData = data.getClipData();
                            int count = clipData.getItemCount();
                            List<Uri> uriList = new ArrayList<>();
                            for (int i = 0; i < count; i++) {
                                uriList.add(clipData.getItemAt(i).getUri());
                            }
                            results = uriList.toArray(new Uri[0]);
                        } else if (data.getData() != null) {
                            results = new Uri[]{ data.getData() };
                        }
                    } else if (mCameraPhotoUri != null) {
                        // User captured photo via Camera
                        results = new Uri[]{ mCameraPhotoUri };
                    }
                }

                // Deliver results (or null on cancel) to WebView WebChromeClient
                mFilePathCallback.onReceiveValue(results);

                // ALWAYS reset callback to null so subsequent taps work reliably
                mFilePathCallback = null;
                mCameraPhotoUri = null;
            }
        );

        // Permission launcher for Camera & Storage
        mPermissionLauncher = registerForActivityResult(
            new ActivityResultContracts.RequestMultiplePermissions(),
            permissions -> {
                // Permissions handled gracefully; camera or gallery will proceed accordingly
            }
        );

        // Proactively request camera/storage permissions if not yet granted
        checkAndRequestPermissions();
    }

    private void checkAndRequestPermissions() {
        List<String> needed = new ArrayList<>();
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED) {
            needed.add(Manifest.permission.CAMERA);
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.READ_MEDIA_IMAGES) != PackageManager.PERMISSION_GRANTED) {
                needed.add(Manifest.permission.READ_MEDIA_IMAGES);
            }
        } else if (Build.VERSION.SDK_INT <= Build.VERSION_CODES.S_V2) {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.READ_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED) {
                needed.add(Manifest.permission.READ_EXTERNAL_STORAGE);
            }
        }

        if (!needed.isEmpty()) {
            mPermissionLauncher.launch(needed.toArray(new String[0]));
        }
    }

    private void setupWebView() {
        WebSettings settings = mWebView.getSettings();

        // Core PWA & JavaScript capabilities
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);

        // File & Content Access
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);

        // Security & Mixed Content
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        }

        // Viewport & Scaling
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(true);
        settings.setSupportZoom(false);
        settings.setBuiltInZoomControls(false);

        // Performance & Cache
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);
        settings.setMediaPlaybackRequiresUserGesture(false);

        // Append custom user agent identifier
        String defaultUa = settings.getUserAgentString();
        settings.setUserAgentString(defaultUa + " OSDConnectApp/1.0");

        // WebChromeClient: Handles File Chooser, Progress & Alerts
        mWebView.setWebChromeClient(new WebChromeClient() {

            // Android 5.0+ (API 21+) File Chooser Handler
            @Override
            public boolean onShowFileChooser(WebView webView, ValueCallback<Uri[]> filePathCallback, FileChooserParams fileChooserParams) {
                // If a previous callback is still pending, cancel it safely
                if (mFilePathCallback != null) {
                    mFilePathCallback.onReceiveValue(null);
                    mFilePathCallback = null;
                }

                mFilePathCallback = filePathCallback;

                // 1. Prepare Camera Capture Intent
                Intent takePictureIntent = null;
                if (ContextCompat.checkSelfPermission(MainActivity.this, Manifest.permission.CAMERA) == PackageManager.PERMISSION_GRANTED) {
                    takePictureIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
                    if (takePictureIntent.resolveActivity(getPackageManager()) != null) {
                        File photoFile = null;
                        try {
                            photoFile = createImageFile();
                        } catch (IOException ex) {
                            ex.printStackTrace();
                        }

                        if (photoFile != null) {
                            mCameraPhotoUri = FileProvider.getUriForFile(
                                MainActivity.this,
                                getPackageName() + ".fileprovider",
                                photoFile
                            );
                            takePictureIntent.putExtra(MediaStore.EXTRA_OUTPUT, mCameraPhotoUri);
                            takePictureIntent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_GRANT_WRITE_URI_PERMISSION);
                        }
                    }
                }

                // 2. Prepare Gallery / File Selection Intent
                Intent contentSelectionIntent = new Intent(Intent.ACTION_GET_CONTENT);
                contentSelectionIntent.addCategory(Intent.CATEGORY_OPENABLE);
                contentSelectionIntent.setType("image/*");

                // Support multiple selection if requested by web input
                if (fileChooserParams != null && fileChooserParams.getMode() == FileChooserParams.MODE_OPEN_MULTIPLE) {
                    contentSelectionIntent.putExtra(Intent.EXTRA_ALLOW_MULTIPLE, true);
                }

                // 3. Combine into Unified Chooser Intent
                Intent chooserIntent = new Intent(Intent.ACTION_CHOOSER);
                chooserIntent.putExtra(Intent.EXTRA_INTENT, contentSelectionIntent);
                chooserIntent.putExtra(Intent.EXTRA_TITLE, getString(R.string.chooser_title));

                if (takePictureIntent != null) {
                    chooserIntent.putExtra(Intent.EXTRA_INITIAL_INTENTS, new Intent[]{ takePictureIntent });
                }

                try {
                    mFileChooserLauncher.launch(chooserIntent);
                    return true;
                } catch (Exception e) {
                    e.printStackTrace();
                    if (mFilePathCallback != null) {
                        mFilePathCallback.onReceiveValue(null);
                        mFilePathCallback = null;
                    }
                    return false;
                }
            }

            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                if (newProgress < 100) {
                    mProgressBar.setVisibility(View.VISIBLE);
                    mProgressBar.setProgress(newProgress);
                } else {
                    mProgressBar.setVisibility(View.GONE);
                    mSwipeRefresh.setRefreshing(false);
                }
            }
        });

        // WebViewClient: Handles Navigation, External Links & Error Pages
        mWebView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                String url = request.getUrl().toString();
                return handleSpecialUrls(url);
            }

            @Override
            @SuppressWarnings("deprecation")
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                return handleSpecialUrls(url);
            }

            private boolean handleSpecialUrls(String url) {
                if (url.startsWith("tel:") || url.startsWith("whatsapp:") || url.startsWith("mailto:") || url.startsWith("sms:")) {
                    try {
                        Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                        startActivity(intent);
                        return true;
                    } catch (Exception e) {
                        Toast.makeText(MainActivity.this, "App not available to handle link", Toast.LENGTH_SHORT).show();
                        return true;
                    }
                }
                return false;
            }

            @Override
            public void onPageStarted(WebView view, String url, Bitmap favicon) {
                mProgressBar.setVisibility(View.VISIBLE);
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                mProgressBar.setVisibility(View.GONE);
                mSwipeRefresh.setRefreshing(false);
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                super.onReceivedError(view, request, error);
                mSwipeRefresh.setRefreshing(false);
            }

            @Override
            @SuppressWarnings("deprecation")
            public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
                super.onReceivedError(view, errorCode, description, failingUrl);
                mSwipeRefresh.setRefreshing(false);
            }
        });

        // Download Listener: Handles ID Card PNG & CSV Exports
        mWebView.setDownloadListener(new DownloadListener() {
            @Override
            public void onDownloadStart(String url, String userAgent, String contentDisposition, String mimeType, long contentLength) {
                if (url.startsWith("data:")) {
                    handleDataUriDownload(url);
                } else {
                    try {
                        Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                        startActivity(intent);
                    } catch (Exception e) {
                        Toast.makeText(MainActivity.this, "Download failed: " + e.getMessage(), Toast.LENGTH_SHORT).show();
                    }
                }
            }
        });
    }

    private File createImageFile() throws IOException {
        String timeStamp = new SimpleDateFormat("yyyyMMdd_HHmmss", Locale.getDefault()).format(new Date());
        String imageFileName = "JPEG_" + timeStamp + "_";
        File storageDir = new File(getCacheDir(), "camera_photos");
        if (!storageDir.exists()) {
            storageDir.mkdirs();
        }
        return File.createTempFile(imageFileName, ".jpg", storageDir);
    }

    private void handleDataUriDownload(String dataUri) {
        try {
            int commaIndex = dataUri.indexOf(',');
            if (commaIndex == -1) return;

            String meta = dataUri.substring(0, commaIndex);
            String base64Data = dataUri.substring(commaIndex + 1);
            byte[] fileBytes = Base64.decode(base64Data, Base64.DEFAULT);

            String ext = ".png";
            if (meta.contains("image/jpeg") || meta.contains("image/jpg")) ext = ".jpg";
            else if (meta.contains("text/csv")) ext = ".csv";

            String fileName = "OSD_Download_" + System.currentTimeMillis() + ext;
            File downloadDir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS);
            if (!downloadDir.exists()) downloadDir.mkdirs();

            File outFile = new File(downloadDir, fileName);
            FileOutputStream fos = new FileOutputStream(outFile);
            fos.write(fileBytes);
            fos.flush();
            fos.close();

            Toast.makeText(this, "Saved to Downloads: " + fileName, Toast.LENGTH_LONG).show();
        } catch (Exception e) {
            e.printStackTrace();
            Toast.makeText(this, "Failed to save downloaded file", Toast.LENGTH_SHORT).show();
        }
    }

    private void setupBackNavigation() {
        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                if (mWebView != null && mWebView.canGoBack()) {
                    mWebView.goBack();
                } else {
                    finish();
                }
            }
        });
    }

    @Override
    protected void onSaveInstanceState(@NonNull Bundle outState) {
        super.onSaveInstanceState(outState);
        if (mWebView != null) {
            mWebView.saveState(outState);
        }
    }
}
