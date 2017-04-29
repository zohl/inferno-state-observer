#!/bin/sh

source ./scripts/constants.sh

eslint "$BUILD_DIR/"* \
&& flow check "$BUILD_DIR" \
&& mocha --compilers js:babel-core/register ./test/index.js

