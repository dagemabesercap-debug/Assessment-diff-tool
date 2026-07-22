# Assessment Diff Tool

Internal Go web application for importing Corsis assessments, downloading their evidence, and comparing assessment years.

## Runtime components

- Go HTTP server and PDF parser
- Chromium controlled through `chromedp`
- Xvfb virtual display for interactive Corsis sign-in
- noVNC browser console, bound to localhost by default
- Persistent Docker volume for PDFs, parsed JSON, metadata, attachments, and debug logs

The repository intentionally contains no assessment data. Runtime data is created under `ASSESSMENT_DATA_DIR` and must be backed up separately.

## Run locally with Go

Install Go 1.26 and a Chromium-compatible browser, then run:

```bash
go test ./...
go run .
```

The application listens on `http://localhost:8090`. Override the port with `PORT` and the data location with `ASSESSMENT_DATA_DIR`.

## Run with Docker Compose

1. Copy `.env.example` to `.env`.
2. Replace `VNC_PASSWORD` with a long random password.
3. Build and start the service:

```bash
docker compose up -d --build
docker compose ps
```

The default bindings are deliberately local-only:

- Application: `http://127.0.0.1:8090`
- Browser sign-in console: `http://127.0.0.1:6080/vnc.html`

When an import asks for Corsis authentication, connect to the noVNC address, enter the VNC password, and complete sign-in in the displayed Chromium window. Imports are serialized so only one interactive browser session runs at a time.

## EC2 preparation

The container supports both `linux/amd64` and `linux/arm64`; a Graviton instance is suitable. Before starting it on EC2:

1. Install Docker Engine and the Docker Compose plugin.
2. Clone or copy this cleaned source tree, or pull a prebuilt image from ECR.
3. Create `.env` from `.env.example`.
4. Leave `APP_BIND_IP=127.0.0.1` when using an SSM or SSH tunnel.
5. Set `APP_BIND_IP=0.0.0.0` only if the instance security group restricts port 8090 to approved VPC or corporate VPN CIDRs.
6. Keep port 6080 private. Access it through an SSM/SSH tunnel rather than adding it to the security group.
7. Put an authenticated HTTPS reverse proxy in front of port 8090 before allowing general internal use.

Example SSM port forwarding can map local ports 8090 and 6080 to the instance. The exact command depends on the instance ID, AWS profile, and approved company access pattern.

## Data and backups

Compose stores application data in the `assessment-data` named volume. It includes confidential assessment PDFs and evidence. Back up the underlying volume with encrypted EBS snapshots or an approved encrypted backup process.

Useful commands:

```bash
docker compose logs -f app
docker compose restart app
docker compose down
```

Do not run `docker compose down --volumes` unless permanent deletion of all assessment data is intended.

## Health checks

- `GET /health/live`
- `GET /health/ready`

Both return HTTP 200 after persistent storage has been initialized.

## Security boundaries

- The Go application does not yet implement company SSO.
- Network isolation alone is not user authentication.
- Do not expose ports 8090 or 6080 directly to the public internet.
- Do not commit `.env`, runtime data, downloaded evidence, certificates, or secrets.
- The automatic importer depends on Corsis page structure and an interactive administrator login; validate it after upstream platform changes.
