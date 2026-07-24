# noVNC Iframe Fixes - Updated Implementation

## Issues Fixed

### 1. Iframe now points directly to VNC viewer
**Fixed**: The iframe now loads `/novnc-view/vnc.html` directly, bypassing the noVNC connect page. Users no longer need to click "Connect" manually.

**Change** in `index.html`:
```html
<iframe id="browser-iframe" src="/novnc-view/vnc.html" style="..."></iframe>
```

**How it works**: 
- The `/novnc-view` endpoint proxies all requests to the internal websockify service (localhost:6080)
- When iframe requests `/novnc-view/vnc.html`, the server proxies it to `http://localhost:6080/vnc.html`
- Users immediately see the VNC viewer without additional clicks

### 2. Loading overlay changed to non-blocking notification
**Fixed**: Replaced the full-screen overlay that blocked the iframe with a small notification banner at the top of the modal.

**Changes** in `index.html`:
```html
<!-- Old: Full-screen blocking overlay -->
<div id="modal-spinner" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(8, 9, 12, 0.9); ...">

<!-- New: Small notification banner -->
<div id="modal-spinner" style="display: none; flex-direction: column; gap: 8px; padding: 12px 16px; margin-bottom: 16px; background: rgba(124, 58, 237, 0.15); border: 1px solid rgba(124, 58, 237, 0.3); border-radius: 8px;">
```

**Changes** in `app.js`:
- Removed code that manually set iframe src (now handled in HTML)
- Notification message now says: "Complete sign-in in the mini window below, then keep this dashboard open while import completes."

## Visual Appearance

### Before Changes:
- Full-screen dark overlay blocked the entire modal
- Iframe showed noVNC connect page requiring manual click
- Users had to: dismiss overlay → click Connect → sign in

### After Changes:
- Small purple notification banner at top (non-blocking)
- Iframe loads VNC viewer directly
- Users can immediately see and interact with browser window
- Clear instruction: "Complete sign-in in the mini window below"

## Updated Files

1. **index.html**
   - iframe src set to `/novnc-view/vnc.html`
   - Spinner overlay converted to notification banner
   - Message updated to direct user to mini window

2. **app.js**
   - Removed dynamic iframe src setting
   - Cleaned up closeModal to not clear iframe src
   - Notification shows/hides appropriately

3. **server.go** (no changes needed)
   - `/novnc-view` endpoint already handles subpaths correctly

## Testing Checklist

- [ ] Click "Grab Company Assessments"
- [ ] Fill form and click "Open Browser & Import"
- [ ] Verify small notification appears at top (not blocking)
- [ ] Verify iframe loads VNC viewer immediately (no Connect button)
- [ ] Verify notification says "Complete sign-in in the mini window below"
- [ ] Verify can interact with browser in iframe while notification shows
- [ ] Verify notification disappears when import completes
- [ ] Verify "Hide Browser" button works
- [ ] Verify error handling shows alert and hides notification

## Screenshots (Expected)

### Notification Banner (Top)
```
┌─────────────────────────────────────────────────┐
│ ⏳ Waiting for browser sign-in...                │
│ Complete sign-in in the mini window below...   │
└─────────────────────────────────────────────────┘
```

### Iframe Below (Interactive)
```
┌─────────────────────────────────────────────────┐
│ [Browser Window - Fullscreen Chromium]        │
│                                                 │
│  Assessment Login Page                        │
│  ┌─────────────────────────────────────────┐  │
│  │  Email: [_______________]               │  │
│  │  Password: [_______________]          │  │
│  │  [Sign In]                             │  │
│  └─────────────────────────────────────────┘  │
│                                                 │
└─────────────────────────────────────────────────┘
```

Users can now see the browser window immediately and complete sign-in without any overlay blocking their view!
