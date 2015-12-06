NODE_BIN_DIR = ./node_modules/.bin
ESLINT = $(NODE_BIN_DIR)/eslint
KARMA = $(NODE_BIN_DIR)/karma
UGLIFYJS = $(NODE_BIN_DIR)/uglifyjs

lib_js = lib/type3.js
tests_js = tests/unit/type3-test.js
all_js = $(lib_js) $(tests_js)
lint_js = $(addprefix tmp/lint/,$(all_js:.js=.lint))

all: $(lint_js) tmp/unit-test build/type3.min.js

clean:
	rm -rf tmp/
	# touching lib/type3.js to force Make to remake build/type3.min.js
	touch -m lib/type3.js

$(lint_js): tmp/lint/%.lint: %.js .eslintrc.json
	mkdir -p $(dir $@)
	$(ESLINT) $<
	touch $@

tmp/unit-test: $(all_js) karma.conf.js
	mkdir -p $(dir $@)
	$(KARMA) start --single-run
	touch $@

build/type3.min.js: lib/type3.js
	mkdir -p $(dir $@)
	$(UGLIFYJS) $< >$@

.PHONY: all clean
