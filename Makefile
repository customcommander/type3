#!/bin/bash

test:
	@grover tests/unit/testrunner.html

apidocs:
	@test -d build/tmp || mkdir build/tmp
	@yuidoc -p -o build/tmp/ src/js/
	@node build/scripts/process-yuidoc.js

readme: apidocs
	@cat build/docs/intro.md build/docs/api.md >build/docs/README.md
	@cp build/docs/README.md README.md

.PHONY: test apidocs readme
