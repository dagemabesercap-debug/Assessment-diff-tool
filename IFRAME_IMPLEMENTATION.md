# noVNC Iframe Implementation Summary

This document describes the changes made to embed the noVNC browser view as an iframe and launch Chromium in fullscreen mode.

## Changes Made

### 1. Backend Changes

#### `server.go`
- **Added `/novnc-view` endpoint** (line ~186, ~790-834)
  - Proxies requests to internal websockify service (port 6080)
  - Sets iframe-friendly headers (`X-Frame-Options: SAMEORIGIN`, `Content-Security-Policy: frame-ancestors 'self'`)
  - Allows embedding the VNC view in an iframe on the same origin

#### `DocumentGrab.go`
- **Added fullscreen Chrome flags** (lines 82-91)
  - `chromedp.Flag("start-fullscreen", true)` - Launches browser in fullscreen mode
  - `chromedp.Flag("window-size", "1920,1080")` - Sets initial window size to 1920x1080

### 2. Infrastructure Changes

#### `docker-entrypoint.sh`
- **Increased virtual display resolution** (line 17)
  - Changed Xvfb resolution from `1440x900x24` to `1920x1080x24`
  - Supports fullscreen browser rendering

### 3. Frontend Changes

#### `index.html`
- **Added iframe container** (lines 158-167)
  - Container with header and "Hide Browser" button
  - Iframe element pointing to `/novnc-view`
  - Styled with dark theme and proper dimensions (600px height)

#### `app.js`
- **DOM element caching** (lines 29-32)
  - Added `browserViewContainer`, `browserIframe`, `btnCloseBrowser`

- **Iframe show/hide logic** (lines 361-363, 294-303, 327-329, 403-407)
  - Shows iframe when browser import starts (`browserViewContainer.style.display = 'flex'`)
  - Hides iframe on: modal close, import completion, import error, or manual "Hide Browser" click
  - Sets iframe source to `/novnc-view` when showing

- **Event listeners** (lines 327-329)
  - Added listener for "Hide Browser" button to close iframe

## How It Works

1. **User clicks "Open Browser & Import"**
   - JavaScript shows the iframe container and sets src to `/novnc-view`
   - Modal spinner displays with status message

2. **Browser launches in fullscreen**
   - Chromium starts with `--start-fullscreen` flag
   - Renders at 1920x1080 on virtual display

3. **VNC view embedded in iframe**
   - iframe loads the noVNC client from `/novnc-view`
   - User sees the browser window directly in the modal
   - Can complete sign-in without navigating away

4. **Import completes**
   - JavaScript hides the iframe and spinner
   - Modal closes automatically after 800ms

## Benefits

- **Seamless UX**: Users stay within the dashboard during entire import process
- **Fullscreen view**: Browser launches in fullscreen for better visibility
- **No external navigation**: Eliminates need to open separate VNC page
- **Manual control**: Users can hide browser view with "Hide Browser" button

## Testing

To test these changes:

1. Rebuild Docker container: `docker-compose build`
2. Start services: `docker-compose up -d`
3. Open dashboard and click "Grab Company Assessments"
4. Fill form and click "Open Browser & Import"
5. Verify iframe appears with VNC view
6. Confirm browser launches in fullscreen
7. Complete sign-in and verify import works

## Security Notes

- iframe is restricted to same-origin only (`X-Frame-Options: SAMEORIGIN`)
- Content Security Policy allows only self-framing
- VNC password still required via environment variable
