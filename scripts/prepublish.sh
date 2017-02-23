#!/bin/sh

source ./scripts/constants.sh

babel "$BUILD_DIR" -d "$PUBLISH_DIR"
flow-copy-source "$BUILD_DIR" "$PUBLISH_DIR"
