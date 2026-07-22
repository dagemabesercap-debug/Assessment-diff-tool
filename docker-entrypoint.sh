#!/bin/sh
set -eu

if [ "$(id -u)" = "0" ]; then
    mkdir -p "${ASSESSMENT_DATA_DIR}" "${HOME}"
    chown -R appuser:appuser "${ASSESSMENT_DATA_DIR}" "${HOME}"
    exec gosu appuser "$0" "$@"
fi

if [ -z "${VNC_PASSWORD:-}" ]; then
    echo "VNC_PASSWORD is required" >&2
    exit 1
fi

mkdir -p "${HOME}"
x11vnc -storepasswd "${VNC_PASSWORD}" /tmp/x11vnc.pass >/dev/null
Xvfb "${DISPLAY}" -screen 0 1440x900x24 -nolisten tcp &
x11vnc -display "${DISPLAY}" -rfbauth /tmp/x11vnc.pass -rfbport 5900 -forever -shared -bg -o /tmp/x11vnc.log
websockify --web=/usr/share/novnc 6080 localhost:5900 >/tmp/websockify.log 2>&1 &

exec "$@"
