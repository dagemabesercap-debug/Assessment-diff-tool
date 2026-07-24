# Auto-Connect & Scroll Fix Summary

## Issues Fixed

### 1. Auto-Connection Failure ✅
**Problem**: noVNC viewer showed "Connect" button requiring manual click
**Root Cause**: noVNC requires `autoconnect`, `host`, and `port` parameters in URL
**Fix**: Added URL parameters to iframe src

### 2. Main Page Scrolling Blocked ✅
**Problem**: When iframe was visible, couldn't scroll the main dashboard page
**Root Cause**: iframe captured all pointer events
**Fix**: Added `pointer-events: none` to container, `pointer-events: auto` to iframe

## Changes Made

### HTML Changes (`index.html`)
```html
<!-- OLD (manual connect required) -->
<iframe id="browser-iframe" src="/novnc-view/vnc_auto.html?autoconnect=1" ...></iframe>

<!-- NEW (auto-connects) -->
<iframe id="browser-iframe" src="/novnc-view/vnc_auto.html?autoconnect=1&amp;host=localhost&amp;port=6080" ...></iframe>
```

**URL Parameters:**
- `autoconnect=1` - Triggers automatic connection
- `host=localhost` - noVNC connects to localhost
- `port=6080` - noVNC connects to websockify port 6080

### CSS Changes (`index.html`)
```css
/* OLD (blocked scrolling) */
<div id="browser-view-container" style="...">

/* NEW (allows scrolling) */
<div id="browser-view-container" style="... pointer-events: none;">
  <div style="... pointer-events: auto;">...</div>
  <iframe ... style="... pointer-events: auto;"></iframe>
</div>
```

**Pointer Events Control:**
- `pointer-events: none` on container - allows scroll events to pass through
- `pointer-events: auto` on iframe - enables interaction when clicked

## How It Works Now

### Before Changes:
1. User clicks "Open Browser & Import"
2. iframe loads VNC viewer
3. **User must click "Connect" button**
4. User cannot scroll main page when iframe is visible

### After Changes:
1. User clicks "Open Browser & Import"
2. iframe loads VNC viewer
3. **Auto-connects immediately** (no button click needed)
4. User can **scroll main page** freely even with iframe visible
5. Clicking on iframe still allows interaction with browser window

## Testing

### Curl Test
```bash
# Proxy endpoint works
curl -I "http://localhost:8090/novnc-view/vnc_auto.html?autoconnect=1&host=localhost&port=6080"
# Returns: HTTP/1.1 200 OK
```

### Manual Test with Assessment Code 7403
1. Open http://localhost:8090
2. Click "Grab Company Assessments"
3. Enter:
   - **Company**: `progress learning`
   - **Assessment Code**: `7403`
   - **Year**: `2025`
4. Click "Open Browser & Import"
5. Verify:
   - ✅ **No "Connect" button** - connects automatically
   - ✅ **Can scroll main page** - scroll wheel works on dashboard
   - ✅ **Can interact with browser** - click iframe to control browser
   - ✅ **Auto-connection** - VNC connects immediately
   - ✅ **Notification shows** at top with instructions

## Docker Logs

When iframe loads, you should see:
```
2026/07/23 20:00:00 Proxying VNC request: GET /novnc-view/vnc_auto.html?autoconnect=1&host=localhost&port=6080 -> http://localhost:6080/vnc_auto.html?autoconnect=1&host=localhost&port=6080
2026/07/23 20:00:00 VNC proxy response: 200
```

## Technical Details

### noVNC Auto-Connect
noVNC supports URL parameters for automatic connection:
- `autoconnect=1` - Enables automatic connection
- `host=HOST` - Target host (websocket server)
- `port=PORT` - Target port
- `password=PASSWORD` - VNC password (if required)
- `path=PATH` - WebSocket path
- `encrypt=1` - Use WSS instead of WS

### CSS Pointer Events
- `pointer-events: none` - Makes element transparent to mouse/scroll events
- `pointer-events: auto` - Restores normal event handling
- By setting container to `none` and children to `auto`, we allow main page scrolling while maintaining iframe interactivity

## Browser Compatibility
Works on all modern browsers supporting:
- CSS pointer-events property (all modern browsers)
- URL parameters in iframes
- WebSocket connections (required for noVNC)
