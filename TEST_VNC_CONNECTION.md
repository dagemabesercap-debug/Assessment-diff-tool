# Testing VNC Connection with Password Authentication

## Issue Identified
Password authentication was failing because the iframe was using `password=secret` but the actual VNC password is set to: `nsKaZ1GLEPEzJa+SAhvw4D/VlweG4mcY`

## Fix Applied
Updated the iframe URL to use the correct VNC password from environment variable.

## Verification Steps

### 1. Check Actual VNC Password
```bash
docker exec difftool-app-1 printenv VNC_PASSWORD
# Should output: nsKaZ1GLEPEzJa+SAhvw4D/VlweG4mcY
```

### 2. Check Iframe Configuration
```bash
grep "browser-iframe" /Users/dagemabraham/repository/CrossLake/Crosslake-Tech-2026-Intern-Project/DiffTool/index.html | grep "password="
# Should show: password=nsKaZ1GLEPEzJa%2BSAhvw4D/VlweG4mcY
```

### 3. Check VNC Server Logs
```bash
docker exec difftool-app-1 cat /tmp/x11vnc.log | grep -E "(password|auth|connected)"
# Look for: "accepted client" or "authenticated client"
```

### 4. Check Websockify Logs
```bash
docker exec difftool-app-1 cat /tmp/websockify.log | tail -20
# Should show WebSocket connection attempts
```

### 5. Manual Browser Test
1. Open http://localhost:8090 in browser
2. Open browser DevTools (F12)
3. Open Network tab
4. Filter by "WS" (WebSocket)
5. Click "Grab Company Assessments"
6. Fill form and click "Open Browser & Import"
7. Watch for WebSocket connection to /websockify
8. Should see HTTP 101 (Switching Protocols)

### 6. Expected noVNC Behavior
When iframe loads, noVNC should:
- ✅ Connect automatically (no "Connect" button)
- ✅ Authenticate with password from URL
- ✅ Show VNC session immediately
- ✅ Browser centered in view
- ✅ Scaled to 60%

## Troubleshooting

### If password still fails:
1. Check password encoding:
   ```bash
   python3 -c "import urllib.parse; print(urllib.parse.quote('nsKaZ1GLEPEzJa+SAhvw4D/VlweG4mcY'))"
   # Should output: nsKaZ1GLEPEzJa%2BSAhvw4D/VlweG4mcY
   ```

2. Check x11vnc is using password auth:
   ```bash
   docker exec difftool-app-1 ps aux | grep x11vnc
   # Should show: x11vnc ... -rfbauth /tmp/x11vnc.pass
   ```

3. Check password file:
   ```bash
   docker exec -u root difftool-app-1 ls -la /tmp/x11vnc.pass
   # Should exist and be readable
   ```

4. Get fresh logs:
   ```bash
   docker logs difftool-app-1 2>&1 | grep -E "(Proxying|VNC|password)" | tail -10
   ```

## Expected Logs After Container Start

```
Starting Portfolio Assessment Server on http://localhost:8090
Xvfb starting on :99 with 1440x900x24
x11vnc starting with password authentication
websockify starting on port 6080 -> localhost:5900

When user clicks import:
Proxying VNC request: GET /novnc-view/vnc_auto.html?autoconnect=1&host=...&password=nsKaZ1GLEPEzJa%2BSAhvw4D/VlweG4mcY... -> http://localhost:6080/vnc_auto.html?...
VNC proxy response: 200
```

Then in x11vnc.log, after connection:
```
Got connection from client 127.0.0.1
Normal socket connection
Client Protocol Version 3.8
Protocol version sent 3.8, using 3.8
...authentication successful...
```

## Quick Test Command

```bash
# Wait for container to be ready
sleep 5

# Check services are running
docker exec difftool-app-1 ps aux | grep -E "(Xvfb|x11vnc|websockify)"

# Check password in HTML
grep "password=nsKaZ1GLEPEzJa%2BSAhvw4D/VlweG4mcY" /Users/dagemabraham/repository/CrossLake/Crosslake-Tech-2026-Intern-Project/DiffTool/index.html

# Expected output:
# Should show the iframe with the encoded password
```

## Next Steps

1. Run test script:
   ```bash
   ./test_workflow.sh
   ```

2. Manual test:
   - Open browser to http://localhost:8090
   - Try with assessment code 7403
   - Check if VNC connects without password prompt

3. If still failing, check browser console for errors
