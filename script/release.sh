#!/bin/bash
set -xe

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

pushd $SCRIPT_DIR/../

CURRENT_VERSION=$(cat manifest.json | jq .version -r)

NEW_VERSION=$(bump $1 $CURRENT_VERSION)

sed -i 's|\(.*"version"\): "\(.*\)",.*|\1: '"\"$NEW_VERSION\",|" package.json manifest.json

git add --all
git commit -m 'release '"$NEW_VERSION"
git push origin master
git tag 'v'"$NEW_VERSION"
git push origin 'v'"$NEW_VERSION"

./script/build.sh

popd