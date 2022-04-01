# v1.2.1

- Allow for `"platform": "node"` to be specified and not overridden.

# v1.2.0

- If `globalName` is specified in `typehead.config.js`, then a fourth IIFE ("CDN") build will be created with that name.

# v1.1.0

- 🚨 [breaking change] Upgrade from ESBuild 0.12.0 to 0.14.0.
- 🚨 [breaking change] Only run Lodash plugin on JavaScript files (expected but was bug).

- Add `--print-esbuild-config` flag for debugging.
- Remove outdated reference to `config.mjs`

# v1.0.3

- Drop fork of `esbuild-plugin-lodash` for published release.

# v1.0.2

- Add infrastructure linting and bump "engines" version in `package.json`.

# v1.0.1

- Make public on NPM. 🎉

# v1.0.0

- Initial release!
