#!/usr/bin/env bash
set -euo pipefail

if [ "$(uname -s)" != "Darwin" ]; then
  echo "This script only supports macOS." >&2
  exit 1
fi

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

APP_NAME="MonoCode"
DEST="/Applications/${APP_NAME}.app"

if pgrep -qx "$APP_NAME"; then
  echo "Quitting running $APP_NAME..."
  osascript -e "tell application \"$APP_NAME\" to quit" >/dev/null 2>&1 || true
  for _ in $(seq 1 20); do
    pgrep -qx "$APP_NAME" || break
    sleep 0.5
  done
  pgrep -qx "$APP_NAME" && pkill -x "$APP_NAME" || true
fi

echo "Building release bundle..."
# createUpdaterArtifacts is on in tauri.conf.json but no signing key is set up
# for local builds, so disable it here or the build fails after compiling.
bun run tauri build --bundles app --config '{"bundle":{"createUpdaterArtifacts":false}}'

# Cargo workspace root is the repo root (see Cargo.toml), so output lands in
# ./target, not src-tauri/target.
BUILT_APP="$(find "$ROOT_DIR/target/release/bundle/macos" -maxdepth 1 -name "*.app" -print -quit)"
if [ -z "$BUILT_APP" ]; then
  echo "No .app bundle found after build." >&2
  exit 1
fi

echo "Installing to $DEST..."
rm -rf "$DEST"
ditto "$BUILT_APP" "$DEST"

# Built locally with an ad-hoc signature ("-" in tauri.conf.json), so Gatekeeper
# quarantines it on copy; strip that or the first launch prompts "unidentified developer".
xattr -cr "$DEST"

echo "Done. Launch with: open \"$DEST\""
