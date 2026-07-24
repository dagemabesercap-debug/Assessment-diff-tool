#!/bin/bash
set -e

# Test noVNC Iframe Workflow
# Usage: ./test_workflow.sh

echo "🧪 Testing noVNC iframe workflow..."
echo ""

# Test 1: Check if main app is running
echo "✓ Test 1: Main application server"
curl -s http://localhost:8090/ > /dev/null && echo "  ✓ Server responding on port 8090" || echo "  ✗ Server not responding"
echo ""

# Test 2: Check if websockify is running
echo "✓ Test 2: Websockify VNC service"
curl -s http://localhost:6080/ > /dev/null && echo "  ✓ Websockify responding on port 6080" || echo "  ✗ Websockify not responding"
echo ""

# Test 3: Test proxy endpoint - root
echo "✓ Test 3: Proxy endpoint /novnc-view/"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8090/novnc-view/)
if [ "$HTTP_CODE" = "200" ]; then
    echo "  ✓ Proxy returned 200 for /novnc-view/"
else
    echo "  ✗ Proxy returned $HTTP_CODE for /novnc-view/"
fi
echo ""

# Test 4: Test proxy endpoint - vnc.html
echo "✓ Test 4: Proxy endpoint /novnc-view/vnc.html"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8090/novnc-view/vnc.html)
if [ "$HTTP_CODE" = "200" ]; then
    echo "  ✓ Proxy returned 200 for vnc.html"
    SIZE=$(curl -s http://localhost:8090/novnc-view/vnc.html | wc -c)
    echo "  ✓ vnc.html size: $SIZE bytes"
else
    echo "  ✗ Proxy returned $HTTP_CODE for vnc.html"
fi
echo ""

# Test 5: Test proxy with resource
echo "✓ Test 5: Proxy with resource file"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8090/novnc-view/app/images/icons/novnc-16x16.png)
if [ "$HTTP_CODE" = "200" ]; then
    echo "  ✓ Proxy returned 200 for resource file"
else
    echo "  ✗ Proxy returned $HTTP_CODE for resource file"
fi
echo ""

# Test 6: Check iframe-friendly headers
echo "✓ Test 6: Iframe security headers"
HEADERS=$(curl -s -I http://localhost:8090/novnc-view/vnc.html)
if echo "$HEADERS" | grep -q "X-Frame-Options: SAMEORIGIN"; then
    echo "  ✓ X-Frame-Options: SAMEORIGIN is set"
else
    echo "  ✗ X-Frame-Options header missing"
fi
if echo "$HEADERS" | grep -q "Content-Security-Policy.*frame-ancestors"; then
    echo "  ✓ Content-Security-Policy with frame-ancestors is set"
else
    echo "  ✗ Content-Security-Policy header missing"
fi
echo ""

# Test 7: Check for fullscreen Chrome flags
echo "✓ Test 7: Chrome fullscreen configuration"
if grep -q "start-fullscreen" /Users/dagemabraham/repository/CrossLake/Crosslake-Tech-2026-Intern-Project/DiffTool/DocumentGrab.go; then
    echo "  ✓ Chrome start-fullscreen flag is set"
else
    echo "  ✗ Chrome start-fullscreen flag missing"
fi
if grep -q "window-size.*1920,1080" /Users/dagemabraham/repository/CrossLake/Crosslake-Tech-2026-Intern-Project/DiffTool/DocumentGrab.go; then
    echo "  ✓ Chrome window-size flag is set to 1920x1080"
else
    echo "  ✗ Chrome window-size flag missing or incorrect"
fi
echo ""

# Test 8: Check Xvfb resolution
echo "✓ Test 8: Virtual display resolution"
if grep -q "1920x1080x24" /Users/dagemabraham/repository/CrossLake/Crosslake-Tech-2026-Intern-Project/DiffTool/docker-entrypoint.sh; then
    echo "  ✓ Xvfb resolution set to 1920x1080x24"
else
    echo "  ✗ Xvfb resolution not set correctly"
fi
echo ""

echo "🎉 Workflow tests complete!"
echo ""
echo "To manually test the full workflow:"
echo "1. Open http://localhost:8090 in browser"
echo "2. Click 'Grab Company Assessments'"
echo "3. Enter:"
echo "   - Company: progress learning"
echo "   - Assessment Code: 7403"
echo "   - Year: 2025"
echo "4. Click 'Open Browser & Import'"
echo "5. Verify:"
echo "   - Small notification appears at top (not blocking)"
echo "   - Iframe loads VNC viewer immediately"
echo "   - Browser launches in fullscreen"
echo "   - Can interact with browser while notification shows"
echo ""
