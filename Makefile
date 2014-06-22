#!/bin/bash

test:
	@grover tests/unit/testrunner.html

apidocs:
	@test -d build/tmp || mkdir build/tmp
	@yuidoc -p -o build/tmp/ src/js/
	@node build/scripts/process-yuidoc.js

.PHONY: test apidocs
