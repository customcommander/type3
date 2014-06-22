#!/bin/bash

test: minify
	@grover tests/unit/testrunner.html

minify:
	@uglifyjs --no-mange --no-squeeze src/js/type3.js >build/src/type3.min.js

apidocs:
	@test -d build/tmp || mkdir build/tmp
	@yuidoc -p -o build/tmp/ src/js/
	@node build/scripts/process-yuidoc.js

readme: apidocs
	@cat build/docs/intro.md build/docs/api.md >build/docs/README.md
	@cp build/docs/README.md README.md

.PHONY: test minify apidocs readme
