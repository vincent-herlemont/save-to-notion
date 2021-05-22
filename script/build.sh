#!/bin/bash
set -xe

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

pushd $SCRIPT_DIR/../

zip -r save-to-notion-$(cat manifest.json | jq .version -r).zip . \
    -x '*.idea*' -x '*.blanck*' -x '*.git*'

popd