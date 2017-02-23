#!/bin/sh

source ./scripts/constants.sh

mkdir -p "$BUILD_DIR"
CSS_FILE="$BUILD_DIR/$PACKAGE.css"
lessc \
  "$SOURCE_DIR/$PACKAGE.less" \
  "$CSS_FILE"

TMP_FILE="$BUILD_DIR/$PACKAGE.js.c"
cp "$SOURCE_DIR/$PACKAGE.js" "$TMP_FILE"
node ./node_modules/.bin/c-preprocessor \
  "$BUILD_DIR/$PACKAGE.js.c" \
  "$BUILD_DIR/$PACKAGE.js"
rm "$TMP_FILE"
rm "$CSS_FILE"

cp "$SOURCE_DIR/index.js" "$BUILD_DIR/index.js"
