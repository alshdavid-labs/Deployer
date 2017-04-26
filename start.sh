#!/bin/bash


script="$0"
basename="$(dirname $script)"

cd "$basename"
node index.js
