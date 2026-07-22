FROM golang:1.26-bookworm AS builder

WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download
COPY *.go ./
COPY index.html diff.html styles.css app.js diff_app.js ./
RUN CGO_ENABLED=0 go build -trimpath -ldflags="-s -w" -o /out/assessment-diff-tool .

FROM debian:bookworm-slim

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        ca-certificates \
        chromium \
        curl \
        fonts-liberation \
        gosu \
        novnc \
        tini \
        websockify \
        x11vnc \
        xvfb \
    && rm -rf /var/lib/apt/lists/* \
    && groupadd --gid 10001 appuser \
    && useradd --uid 10001 --gid 10001 --create-home --shell /usr/sbin/nologin appuser \
    && mkdir -p /var/lib/assessment-diff-tool \
    && chown appuser:appuser /var/lib/assessment-diff-tool

COPY --from=builder /out/assessment-diff-tool /usr/local/bin/assessment-diff-tool
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh

ENV ASSESSMENT_DATA_DIR=/var/lib/assessment-diff-tool \
    DISPLAY=:99 \
    HOME=/tmp/app-home \
    PORT=8090

EXPOSE 8090 6080
VOLUME ["/var/lib/assessment-diff-tool"]

ENTRYPOINT ["/usr/bin/tini", "-g", "--", "/usr/local/bin/docker-entrypoint.sh"]
CMD ["/usr/local/bin/assessment-diff-tool"]
