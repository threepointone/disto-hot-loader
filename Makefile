dev:
	babel-node dev.js

build:
	babel src -d lib

.PHONY: dev build