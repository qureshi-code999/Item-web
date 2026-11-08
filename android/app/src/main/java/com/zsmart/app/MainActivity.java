package com.zsmart.app;

import android.content.ContentValues;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.print.PrintAttributes;
import android.print.PrintDocumentAdapter;
import android.print.PrintManager;
import android.provider.MediaStore;
import android.util.Base64;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;
import androidx.core.content.FileProvider;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;
import com.getcapacitor.BridgeActivity;
import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;

public class MainActivity extends BridgeActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Window window = getWindow();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            window.clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
            window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
            window.setStatusBarColor(Color.parseColor("#030712"));
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                window.setNavigationBarColor(Color.parseColor("#030712"));
            }
        }

        // Keep Status Bar icons crisp WHITE on dark navy app background
        WindowInsetsControllerCompat initInsetsController = WindowCompat.getInsetsController(window, window.getDecorView());
        if (initInsetsController != null) {
            initInsetsController.setAppearanceLightStatusBars(false); // false = WHITE icons (time, battery, wifi)
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                initInsetsController.setAppearanceLightNavigationBars(false);
            }
        }

        // Apply native Status Bar & Navigation Bar insets padding to the root view so WebView, Cart, and Menu NEVER overlap
        // Fix for Android 15 (API 35) Edge-to-Edge: system navigation bar (3-button or gesture pill) no longer overlaps bottom tabs or checkout
        View rootView = findViewById(android.R.id.content);
        if (rootView != null) {
            window.getDecorView().setBackgroundColor(Color.parseColor("#030712"));
            ViewCompat.setOnApplyWindowInsetsListener(rootView, (v, insets) -> {
                Insets statusBarInsets = insets.getInsets(WindowInsetsCompat.Type.statusBars());
                Insets navBarInsets = insets.getInsets(WindowInsetsCompat.Type.navigationBars());
                Insets displayCutoutInsets = insets.getInsets(WindowInsetsCompat.Type.displayCutout());

                int left = Math.max(navBarInsets.left, displayCutoutInsets.left);
                int top = Math.max(statusBarInsets.top, displayCutoutInsets.top);
                int right = Math.max(navBarInsets.right, displayCutoutInsets.right);
                int bottom = Math.max(navBarInsets.bottom, displayCutoutInsets.bottom);

                v.setPadding(left, top, right, bottom);
                return insets;
            });
        }

        // ⚡ 120 FPS GPU Hardware Acceleration & Rasterization for WebView
        if (getBridge() != null && getBridge().getWebView() != null) {
            android.webkit.WebView webView = getBridge().getWebView();
            webView.setLayerType(View.LAYER_TYPE_HARDWARE, null);
            webView.setOverScrollMode(View.OVER_SCROLL_NEVER);
            android.webkit.WebSettings webSettings = webView.getSettings();
            webSettings.setRenderPriority(android.webkit.WebSettings.RenderPriority.HIGH);
            webSettings.setEnableSmoothTransition(true);
            webSettings.setCacheMode(android.webkit.WebSettings.LOAD_DEFAULT);
            webSettings.setDomStorageEnabled(true);
            webSettings.setDatabaseEnabled(true);
            webSettings.setGeolocationEnabled(true);
            webSettings.setMediaPlaybackRequiresUserGesture(false);
            try {
                webSettings.setGeolocationDatabasePath(getFilesDir().getPath());
            } catch (Exception ignored) {}

            webView.addJavascriptInterface(new Object() {
                @JavascriptInterface
                public void exitApp() {
                    runOnUiThread(() -> finishAffinity());
                }

                @JavascriptInterface
                public void setStatusBarLight(boolean light) {
                    runOnUiThread(() -> {
                        WindowInsetsControllerCompat insetsController = WindowCompat.getInsetsController(window, window.getDecorView());
                        if (insetsController != null) {
                            // false = WHITE icons (battery, clock, wifi) so they are always 100% visible on dark status bar
                            insetsController.setAppearanceLightStatusBars(false);
                            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                                insetsController.setAppearanceLightNavigationBars(false);
                            }
                        }
                        int targetColor = Color.parseColor("#030712");
                        window.setStatusBarColor(targetColor);
                        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                            window.setNavigationBarColor(targetColor);
                        }
                        window.getDecorView().setBackgroundColor(targetColor);
                    });
                }

                @JavascriptInterface
                public boolean saveImageToGallery(String base64Data, String fileName) {
                    if (base64Data == null || base64Data.isEmpty()) return false;
                    try {
                        String cleanBase64 = base64Data;
                        int commaIdx = cleanBase64.indexOf(",");
                        if (commaIdx >= 0) {
                            cleanBase64 = cleanBase64.substring(commaIdx + 1);
                        }
                        byte[] imageBytes = Base64.decode(cleanBase64, Base64.DEFAULT);

                        String safeFileName = (fileName != null && !fileName.isEmpty()) ? fileName : ("ZS_Mart_" + System.currentTimeMillis() + ".png");
                        String mimeType = (safeFileName.toLowerCase().endsWith(".jpg") || safeFileName.toLowerCase().endsWith(".jpeg")) ? "image/jpeg" : "image/png";

                        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                            ContentValues values = new ContentValues();
                            values.put(MediaStore.Images.Media.DISPLAY_NAME, safeFileName);
                            values.put(MediaStore.Images.Media.MIME_TYPE, mimeType);
                            values.put(MediaStore.Images.Media.RELATIVE_PATH, Environment.DIRECTORY_PICTURES + "/ZS Mart");
                            values.put(MediaStore.Images.Media.IS_PENDING, 1);

                            Uri uri = getContentResolver().insert(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, values);
                            if (uri != null) {
                                try (OutputStream os = getContentResolver().openOutputStream(uri)) {
                                    if (os != null) {
                                        os.write(imageBytes);
                                        os.flush();
                                    }
                                }
                                values.clear();
                                values.put(MediaStore.Images.Media.IS_PENDING, 0);
                                getContentResolver().update(uri, values, null, null);

                                runOnUiThread(() -> Toast.makeText(MainActivity.this, "✅ Saved to Gallery (ZS Mart)!", Toast.LENGTH_SHORT).show());
                                return true;
                            }
                        } else {
                            File dir = new File(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_PICTURES), "ZS Mart");
                            if (!dir.exists()) dir.mkdirs();
                            File file = new File(dir, safeFileName);
                            try (FileOutputStream fos = new FileOutputStream(file)) {
                                fos.write(imageBytes);
                                fos.flush();
                            }
                            android.media.MediaScannerConnection.scanFile(
                                MainActivity.this,
                                new String[]{file.getAbsolutePath()},
                                new String[]{mimeType},
                                null
                            );
                            runOnUiThread(() -> Toast.makeText(MainActivity.this, "✅ Saved to Gallery (ZS Mart)!", Toast.LENGTH_SHORT).show());
                            return true;
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                    return false;
                }

                @JavascriptInterface
                public boolean printInvoice(String htmlContent, String orderId) {
                    if (htmlContent == null || htmlContent.isEmpty()) return false;
                    runOnUiThread(() -> {
                        try {
                            WebView printWebView = new WebView(MainActivity.this);
                            printWebView.getSettings().setJavaScriptEnabled(false);
                            printWebView.setWebViewClient(new WebViewClient() {
                                @Override
                                public void onPageFinished(WebView view, String url) {
                                    try {
                                        PrintManager printManager = (PrintManager) getSystemService(Context.PRINT_SERVICE);
                                        if (printManager != null) {
                                            String jobName = "ZS_Mart_Invoice_" + (orderId != null ? orderId : String.valueOf(System.currentTimeMillis()));
                                            PrintDocumentAdapter printAdapter = view.createPrintDocumentAdapter(jobName);
                                            printManager.print(jobName, printAdapter, new PrintAttributes.Builder().build());
                                        }
                                    } catch (Exception e) {
                                        e.printStackTrace();
                                    }
                                }
                            });
                            printWebView.loadDataWithBaseURL("https://zsmart.pk", htmlContent, "text/html", "UTF-8", null);
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    });
                    return true;
                }

                @JavascriptInterface
                public boolean shareImage(String base64Data, String fileName, String title, String text) {
                    if (base64Data == null || base64Data.isEmpty()) return false;
                    runOnUiThread(() -> {
                        try {
                            String cleanBase64 = base64Data;
                            int commaIdx = cleanBase64.indexOf(",");
                            if (commaIdx >= 0) {
                                cleanBase64 = cleanBase64.substring(commaIdx + 1);
                            }
                            byte[] imageBytes = Base64.decode(cleanBase64, Base64.DEFAULT);

                            String safeFileName = (fileName != null && !fileName.isEmpty()) ? fileName : ("ZS_Mart_" + System.currentTimeMillis() + ".png");
                            String mimeType = (safeFileName.toLowerCase().endsWith(".jpg") || safeFileName.toLowerCase().endsWith(".jpeg")) ? "image/jpeg" : "image/png";

                            File cacheDir = new File(getCacheDir(), "shared_images");
                            if (!cacheDir.exists()) cacheDir.mkdirs();
                            File imageFile = new File(cacheDir, safeFileName);
                            try (FileOutputStream fos = new FileOutputStream(imageFile)) {
                                fos.write(imageBytes);
                                fos.flush();
                            }

                            Uri contentUri = FileProvider.getUriForFile(MainActivity.this, getPackageName() + ".fileprovider", imageFile);
                            Intent shareIntent = new Intent(Intent.ACTION_SEND);
                            shareIntent.setType(mimeType);
                            shareIntent.putExtra(Intent.EXTRA_STREAM, contentUri);
                            if (text != null && !text.isEmpty()) {
                                shareIntent.putExtra(Intent.EXTRA_TEXT, text);
                            }
                            if (title != null && !title.isEmpty()) {
                                shareIntent.putExtra(Intent.EXTRA_SUBJECT, title);
                            }
                            shareIntent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
                            startActivity(Intent.createChooser(shareIntent, title != null ? title : "Share Invoice"));
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    });
                    return true;
                }
            }, "AndroidBridge");
        }
    }

    @Override
    public void onBackPressed() {
        if (getBridge() != null && getBridge().getWebView() != null) {
            getBridge().getWebView().evaluateJavascript(
                "if (typeof window.handleAppBackButton === 'function') { window.handleAppBackButton(); } else { window.history.back(); }",
                null
            );
        } else {
            super.onBackPressed();
        }
    }
}
