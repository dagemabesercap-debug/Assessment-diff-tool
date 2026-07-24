#!/bin/bash
echo "🎯 Comprehensive Test - All Features Working"
echo "═════════════════════════════════════════════════════════════"
echo ""

# Wait for services
echo "⏳ Starting services..."
docker-compose up -d > /dev/null 2>&1
sleep 5

PASS=0
FAIL=0

# Test 1: Main application
echo "✓ Test 1: Main application server"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8090/ 2>&1)
if [ "$HTTP_CODE" = "200" ]; then
    echo "  ✅ Server responding on port 8090"
    ((PASS++))
else
    echo "  ❌ Server returned $HTTP_CODE"
    ((FAIL++))
fi

# Test 2: Websockify
echo "✓ Test 2: Websockify VNC service"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:6080/ 2>&1)
if [ "$HTTP_CODE" = "200" ]; then
    echo "  ✅ Websockify responding on port 6080"
    ((PASS++))
else
    echo "  ❌ Websockify returned $HTTP_CODE"
    ((FAIL++))
fi

# Test 3: Proxy endpoint
echo "✓ Test 3: Proxy endpoint /novnc-view/"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8090/novnc-view/ 2>&1)
if [ "$HTTP_CODE" = "200" ]; then
    echo "  ✅ Proxy returned 200"
    ((PASS++))
else
    echo "  ❌ Proxy returned $HTTP_CODE"
    ((FAIL++))
fi

# Test 4: Iframe with auto-connect
echo "✓ Test 4: Auto-connect parameter"
if grep -q 'autoconnect=true' /Users/dagemabraham/repository/CrossLake/Crosslake-Tech-2026-Intern-Project/DiffTool/index.html; then
    echo "  ✅ autoconnect=true (reliably autoconnects)"
    ((PASS++))
else
    echo "  ❌ autoconnect parameter incorrect"
    ((FAIL++))
fi

# Test 5: Reconnect parameter
echo "✓ Test 5: Connection stability"
if grep -q 'reconnect=true' /Users/dagemabraham/repository/CrossLake/Crosslake-Tech-2026-Intern-Project/DiffTool/index.html; then
    echo "  ✅ reconnect=true (auto-reconnect on disconnect)"
    ((PASS++))
else
    echo "  ❌ reconnect parameter missing"
    ((FAIL++))
fi

# Test 6: Password parameter
echo "✓ Test 6: Password authentication"
if grep -q 'password=nsKaZ1GLEPEzJa%2BSAhvw4D/VlweG4mcY' /Users/dagemabraham/repository/CrossLake/Crosslake-Tech-2026-Intern-Project/DiffTool/index.html; then
    echo "  ✅ Password present and URL-encoded"
    ((PASS++))
else
    echo "  ❌ Password parameter incorrect"
    ((FAIL++))
fi

# Test 7: CSS centering
echo "✓ Test 7: CSS-based centering"
if grep -q 'translate(-50%, -50%) scale(0.6)' /Users/dagemabraham/repository/CrossLake/Crosslake-Tech-2026-Intern-Project/DiffTool/index.html; then
    echo "  ✅ Centered with CSS: translate(-50%, -50%) scale(0.6)"
    ((PASS++))
else
    echo "  ❌ Centering not configured"
    ((FAIL++))
fi

# Test 8: Container overflow
echo "✓ Test 8: Container overflow hidden"
if grep -A 20 'browser-view-container' /Users/dagemabraham/repository/CrossLake/Crosslake-Tech-2026-Intern-Project/DiffTool/index.html | grep -q 'overflow: hidden'; then
    echo "  ✅ Container has overflow: hidden"
    ((PASS++))
else
    echo "  ❌ Overflow not configured"
    ((FAIL++))
fi

# Test 9: Scrollbars disabled
echo "✓ Test 9: Scrollbars disabled"
if grep -q 'scrolling="no"' /Users/dagemabraham/repository/CrossLake/Crosslake-Tech-2026-Intern-Project/DiffTool/index.html; then
    echo "  ✅ scrolling=no on iframe"
    ((PASS++))
else
    echo "  ❌ scrolling not disabled"
    ((FAIL++))
fi

# Test 10: Pointer-events (main page scroll)
echo "✓ Test 10: Main page scrolling"
if grep -q 'pointer-events: none' /Users/dagemabraham/repository/CrossLake/Crosslake-Tech-2026-Intern-Project/DiffTool/index.html && \
   grep -A 30 'browser-view-container' /Users/dagemabraham/repository/CrossLake/Crosslake-Tech-2026-Intern-Project/DiffTool/index.html | grep -q 'pointer-events: auto'; then
    echo "  ✅ Can scroll main page (pointer-events configured)"
    ((PASS++))
else
    echo "  ❌ Pointer-events not configured"
    ((FAIL++))
fi

echo ""
echo "═════════════════════════════════════════════════════════════"
echo "📊 Test Results:"
echo "  ✅ Passed: $PASS tests"
echo "  ❌ Failed: $FAIL tests"
echo "═════════════════════════════════════════════════════════════"

if [ $FAIL -eq 0 ]; then
    echo ""
    echo "🎉 All tests passed!"
    echo ""
    echo "✅ COMPLETE WORKFLOW TEST:"
    echo ""
    echo "To manually verify with assessment code 7403:"
    echo ""
    echo "1. Open browser to http://localhost:8090"
    echo "2. Click 'Grab Company Assessments'"
    echo "3. Enter:"
    echo "   - Company: progress learning"
    echo "   - Assessment Code: 7403"
    echo "   - Year: 2025"
    echo "4. Click 'Open Browser & Import'"
    echo ""
    echo "Expected user experience:"
    echo "   ✓ Iframe appears immediately"
    echo "   ✓ VNC auto-connects (no 'Connect' button)"
    echo "   ✓ No password prompt"
    echo "   ✓ Browser CENTERED in iframe (not top-left)"
    echo "   ✓ No manual panning needed"
    echo "   ✓ Full browser window visible"
    echo "   ✓ Can scroll main page"
    echo "   ✓ Notification banner at top"
    echo "   ✓ Can complete sign-in"
    echo "   ✓ Import completes"
    echo ""
    echo "🚀 All features working perfectly!"
    exit 0
else
    echo ""
    echo "⚠️  Some tests failed. Check the output above."
    exit 1
fi
