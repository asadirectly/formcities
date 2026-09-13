#!/bin/bash
# most browsers already resolve *.localhost to 127.0.0.1 on their own, so for
# normal browser testing you probably don't need this at all, just visit
# http://alice.localhost:8080/ directly

# this script is only for cases where that auto resolution doesn't happen, e.g. some Windows setups, or if you're hitting the site with curl/a tool
# that doesn't do the *.localhost trick, or you want a real custom domain

# usage: ./setup-subdomain.sh alice

set -e

SLUG=$1
HOSTS_FILE="/etc/hosts"
DOMAIN_SUFFIX="localhost" # change this if you're using a real domain instead

if [ -z "$SLUG" ]; then
  echo "usage: $0 <student-slug>"
  exit 1
fi

ENTRY="127.0.0.1 $SLUG.$DOMAIN_SUFFIX"

if grep -q "$SLUG.$DOMAIN_SUFFIX" "$HOSTS_FILE" 2>/dev/null; then
  echo "already in hosts file: $ENTRY"
else
  echo "$ENTRY" | sudo tee -a "$HOSTS_FILE" > /dev/null
  echo "added: $ENTRY"
fi

echo "try it: http://$SLUG.$DOMAIN_SUFFIX:8080/"
