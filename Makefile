# This Makefile is mostly shorthand for package.json
# (optional) You can install entr for real time linting while using dev target

# Generic targets
lint fix-lint build prepublishOnly publish: node_modules
	npm run $@

# Ensure node_modules is up-to-date with the package.json and package-lock.json
node_modules: package.json package-lock.json
	npm install && touch $@

# Dev targets
dev: node_modules
	$(MAKE) -j 2 _dev.ray _dev.lint
dev-fix: node_modules
	$(MAKE) -j 2 _dev.ray _dev.lint-fix

_dev.ray:; npm run dev
_dev.lint: _check_entr
	find src | entr npm run lint # continuously lint
_dev.lint-fix: _check_entr
	find src | entr npm run fix-lint # continuously lint-fix
_check_entr:;	@command -v entr > /dev/null || (echo "'entr' not installed" && exit 0)

.PHONY: dev lint fix-lint build prepublishOnly publish
