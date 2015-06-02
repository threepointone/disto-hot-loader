build:
	rm -rf ./lib
	babel src -d lib

.PHONY: build