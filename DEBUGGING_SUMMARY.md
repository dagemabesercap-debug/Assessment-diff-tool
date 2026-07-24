# noVNC Iframe 404 Error - Root Cause & Fix

## Problem Summary
The iframe was returning a 404 "page not found" error when trying to load `/novnc-view/vnc.html`.

## Root Cause
**Incorrect HTTP route registration** in `server.go`.

### The Bug:
```go
// Incorrect - only matches exact path
http.HandleFunc("/novnc-view", handleNoVNCView)
```

Go's `http.ServeMux` matches routes exactly by default. When registering `/novnc-view`, it only matches the exact path `/novnc-view`, not `/novnc-view/vnc.html` or any subpaths.

### Why It Failed:
1. Browser requests `/novnc-view/vnc.html`
2. Go's router looks for a handler matching exactly `/novnc-view/vnc.html`
3. Only handler registered is for `/novnc-view` (no match)
4. Falls through to static file handler
5. Static file handler can't find `novnc-view/vnc.html` in the filesystem
6. Returns 404 "page not found"

## The Fix:
```go
// Correct - matches entire subtree
http.HandleFunc("/novnc-view/", handleNoVNCView)
```

Adding a trailing slash `"/novnc-view/"` tells Go's router to match this path AND all subpaths. Now:
1. `/novnc-view` → matches (redirects to `/novnc-view/`)
2. `/novnc-view/vnc.html` → matches
3. `/novnc-view/app/images/file.png` → matches
4. Any path starting with `/novnc-view/` → matches

## Additional Enhancements Made:

### 1. Better Proxy Implementation (`server.go`)
- Added debug logging (shows in docker logs)
- Improved header forwarding (only safe headers)
- Better error handling
- Request logging: `Proxying VNC request: GET /novnc-view/vnc.html -> http://localhost:6080/vnc.html`
- Response logging: `VNC proxy response: 200`

### 2. Chrome Fullscreen Configuration
Added flags to launch Chrome in fullscreen mode:
```go
chromedp.Flag("start-fullscreen", true)
chromedp.Flag("window-size", "1920,1080")
```

### 3. Virtual Display Resolution
Updated Xvfb to match Chrome resolution:
```bash
Xvfb "${DISPLAY}" -screen 0 1920x1080x24
```

### 4. Loading Overlay → Notification Banner 
- Changed from blocking overlay to small notification
- Users can interact with iframe while it shows
- Clear instruction: "Complete sign-in in the mini window below"

## Testing Results

All tests pass:
```
✓ Server responding on port 8090
✓ Websockify responding on port 6080
✓ Proxy returned 200 for /novnc-view/
✓ Proxy returned 200 for vnc.html (15212 bytes)
✓ Proxy returned 200 for resource files
✓ X-Frame-Options: SAMEORIGIN is set
✓ Content-Security-Policy with frame-ancestors is set
✓ Chrome start-fullscreen flag is set
✓ Chrome window-size flag is set to 1920x1080
✓ Xvfb resolution set to 1920x1080x24
```

## Manual Testing Steps

To test with assessment code 7403:

1. Open http://localhost:8090
2. Click "Grab Company Assessments"
3. Fill form:
   - **Company Name**: progress learning
   - **Assessment Code**: 7403
   - **Year**: 2025
4. Click "Open Browser & Import"
5. Observe:
   - Small purple notification appears at top (non-blocking)
   - Iframe loads VNC viewer immediately
   - Browser launches in fullscreen
   - Can interact with browser while notification shows
   - Notification updates status during import
   - Both hide when complete

## Summary

The 404 was caused by incorrect route registration. Adding a trailing slash fixed it. The proxy now works correctly, Chrome launches in fullscreen, and users get a seamless experience with no blocking overlays.
