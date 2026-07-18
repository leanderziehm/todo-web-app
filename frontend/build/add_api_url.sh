#!/bin/sh
set -e


echo "Loading .env..."

if [ -f .env ]; then
  . .env
  export API_URL
  echo ".env loaded"
  echo API_URL=${API_URL}
else
  echo ".env file not found"
fi

cat > ./dist/config.js <<EOF
window.APP_CONFIG = {
  API_URL: "${API_URL}"
};
EOF
