#!/bin/bash
set -e

echo "🔍 Testing Complete Workflow (Assessment Code 7403)"
echo ""

# Wait for services to be ready
echo "⏳ Waiting for services..."
sleep 5

# Test 1: Main app
echo "✓ Test 1: Main application server"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8090/)
if [ "$HTTP_CODE" = "200" ]; then
    echo "  ✓ Server responding on port 8090"
else
    echo "  ✗ Server returned $HTTP_CODE"
    exit 1
fi

# Test 2: websockify
echo "✓ Test 2: Websockify VNC service"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:6080/)
if [ "$HTTP_CODE" = "200" ]; then
    echo "  ✓ Websockify responding on port 6080"
else
    echo "  ✗ Websockify returned $HTTP_CODE"
    exit 1
fi

# Test 3: Proxy with all parameters
echo "✓ Test 3: noVNC proxy with auto-connect + password + scale"
URL="/novnc-view/vnc_auto.html?autoconnect=1&host=localhost&port=6080&password=secret&scale=0.6"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:8090${URL}")
if [ "$HTTP_CODE" = "200" ]; then
    echo "  ✓ Proxy returned 200 with all parameters"
    SIZE=$(curl -s "http://localhost:8090${URL}" | wc -c)
    echo "  ✓ Response size: $SIZE bytes"
else
    echo "  ✗ Proxy returned $HTTP_CODE"
    exit 1
fi

# Test 4: Iframe HTML
echo "✓ Test 4: Check iframe configuration"
if curl -s http://localhost:8090/ | grep -q "vnc_auto.html?autoconnect=1"; then
    echo "  ✓ Iframe has autoconnect parameter"
else
    echo "  ✗ Iframe missing autoconnect"
    exit 1
fi

if curl -s http://localhost:8090/ | grep -q "password=secret"; then
    echo "  ✓ Iframe has password parameter"
else
    echo "  ✗ Iframe missing password"
    exit 1
fi

if curl -s http://localhost:8090/ | grep -q "scale="; then
    echo "  ✓ Iframe has scale parameter"
else
    echo "  ✗ Iframe missing scale"
    exit 1
fi

# Test 5: Check CSS pointer-events
echo "✓ Test 5: Pointer-events CSS"
if curl -s http://localhost:8090/ | grep -q "pointer-events: none"; then
    echo "  ✓ Container has pointer-events: none"
else
    echo "  ✗ Container missing pointer-events"
    exit 1
fi

if curl -s http://localhost:8090/ | grep -q "pointer-events: auto"; then
    echo "  ✓ Iframe has pointer-events: auto"
else
    echo "  ✗ Iframe missing pointer-events"
    exit 1
fi

# Test 6: Xvfb resolution
echo "✓ Test 6: Virtual display configuration"
if docker exec difftool-app-1 ps aux | grep -q "Xvfb.*1440x900"; then
    echo "  ✓ Xvfb running at 1440x900"
else
    echo "  ✗ Xvfb resolution incorrect"
    exit 1
fi

echo ""
echo "🎉 All tests passed!"
echo ""
echo "Manual test with assessment code 7403:"
echo "1. Open http://localhost:8090"
echo "2. Click 'Grab Company Assessments'"
echo "3. Enter:"
echo "   - Company: progress learning"
echo "   - Assessment Code: 7403"
echo "   - Year: 2025"
echo "4. Click 'Open Browser & Import'"
echo ""
echo "Expected:"
echo "  ✓ No 404 error"
echo "  ✓ VNC auto-connects (no 'Connect' button)"
echo "  ✓ No password prompt"
echo "  ✓ Browser centered (not top-right)"
echo "  ✓ Can scroll main page"
echo "  ✓ Notification appears at top"
echo ""
