#!/bin/sh
set -e

cat > /usr/share/nginx/html/config.js <<EOF
window.APP_CONFIG = {
  API_URL: "${API_URL}"
};
EOF

exec nginx -g "daemon off;"