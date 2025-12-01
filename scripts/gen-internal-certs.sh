#!/usr/bin/env bash
set -euo pipefail

# Resolve repo root (parent of this script's directory) and secrets dir absolute path to avoid CWD issues
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"
SECRETS_DIR="$REPO_ROOT/secrets"
INTERNAL_CA_KEY="$SECRETS_DIR/internal_ca_key.pem"
INTERNAL_CA_CERT="$SECRETS_DIR/internal_ca_cert"

SERVICES=(upload pong tournament user)

mkdir -p "$SECRETS_DIR"

if [[ -f "$INTERNAL_CA_CERT" ]]; then
  echo "Internal CA already exists: $INTERNAL_CA_CERT"
else
  echo "Generating internal CA..."
  openssl genrsa -out "$INTERNAL_CA_KEY" 4096
  openssl req -x509 -new -nodes -key "$INTERNAL_CA_KEY" -sha256 -days 3650 \
    -subj "/C=FR/ST=Dev/L=Dev/O=Transcendence/OU=CA/CN=transcendence-internal-ca" \
    -out "$INTERNAL_CA_CERT"
fi

for svc in "${SERVICES[@]}"; do
  keyFile="$SECRETS_DIR/${svc}_key"
  csrFile="$SECRETS_DIR/${svc}.csr"
  certFile="$SECRETS_DIR/${svc}_cert"

  if [[ -f "$certFile" ]]; then
    echo "Skipping existing cert for $svc"
    continue
  fi

  echo "Generating cert for $svc"
  openssl genrsa -out "$keyFile" 2048

  # Subject with CN=service name
  openssl req -new -key "$keyFile" -out "$csrFile" -subj "/C=FR/ST=Dev/L=Dev/O=Transcendence/OU=Service/CN=${svc}" -addext "subjectAltName=DNS:${svc},DNS:${svc}_handling,DNS:localhost"

  openssl x509 -req -in "$csrFile" -CA "$INTERNAL_CA_CERT" -CAkey "$INTERNAL_CA_KEY" -CAcreateserial -out "$certFile" -days 825 -sha256 -extensions v3_req -extfile <(cat <<EOF
[v3_req]
subjectAltName=DNS:${svc},DNS:${svc}_handling,DNS:localhost
basicConstraints=CA:FALSE
keyUsage=digitalSignature,keyEncipherment
extendedKeyUsage=serverAuth,clientAuth
EOF
)

  rm -f "$csrFile"
  echo "Created: $certFile and $keyFile"
done

echo "Done. Secrets directory: $SECRETS_DIR"
echo "Ensure compose.yml (srcs/compose.yml) secrets file paths point to ../secrets/* relative to its location."
