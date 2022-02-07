![logo](./assets/logo.png)

Typehead is a thin wrapper around [ESBuild](https://esbuild.github.io/) that makes it refreshingly simple to develop NPM packages using TypeScript.

📦 `npm install --save-dev @mapbox/typehead typescript`

# How?

In your `package.json`:

```json
{
  "main": "dist/index.js",
  "module": "dist/index-esm.js",
  "typings": "dist/index.d.ts",
  "scripts": {
    "build": "typehead build",
    "watch": "typehead build --watch",
    "serve": "typehead serve"
  }
}
```

Typehead will not check types or generate declaration files. While this seems initially counter-intuitive, this operation is costly and usually covered by IDE tools (VSCode) and CI (using `tsc`).

We recommend setting this up with `npm install --save-dev dts-bundle-generator`.

Here's an example in `package.json` that builds types before publishing to NPM:

```json
{
  "scripts": {
    "types": "dts-bundle-generator -o dist/index.d.ts src/index.ts",
    "prepare": "npm run types && npm run build"
  }
}
```

## Build

`typehead build` will automatically set the entry point to `src/index`. You can use either `.ts`, `.tsx`, `.jsx`, or `.js` files. We heavily recommend the use of TypeScript for all packages.

Output files will live in `dist/`:

This behavior is configurable ([see below](#Customization)).

- A development CSM build `index-development.js` that is **not** minified.
- A production CSM build `index.js` that is minified.
- A production ESM build `index-esm.js` that is not minified.

## Serve

`typehead serve` will start a web server for the `web` directory (if present).

Inside `web`, `web/index.{js,jsx,ts,tsx}` will be bundled by ESBuild for browser use. From this file, you can import your main module from `../src` and do things like demos, benchmarking, etc...

The bundle will be accessible from the web server at `/index-bundle.js`. Make sure to use `type="module"` in your `<script>` tag.

#### Recommended way to add to your project

`web/index.html`:

```html
<!DOCTYPE html>
<html>
  <body>
    <script type="module" src="/index-bundle.js"></script>
  </body>
</html>
```

`web/index.ts`:

```javascript
// ... you can import your main module here, or anything really!
import myModule from '../src/';
```

## Optimizations

### Lodash

`typehead` will automatically rewrite your Lodash calls using [esbuild-plugin-lodash](https://github.com/josteph/esbuild-plugin-lodash).

```typescript
import { pick, omit } from 'lodash';

// Will be rewritten to...
import pick from 'lodash/pick';
import omit from 'lodash/omit';
```

## Customization

You can add additional ESBuild options by adding `typehead` in any way [cosmiconfig](https://github.com/davidtheclark/cosmiconfig) supports. This will be deep merged with the internal config.

Aside from the disclaimer below, any options in the [ESBuild Build API](https://esbuild.github.io/api/#build-api) may be specified.

**Warning:** The following options may be overwritten: `entryNames`, `format`, `minify`.

To specify a different `outdir` than `dist`, here's an example using `package.json`:

`package.json`:

```json
{
  "typehead": {
    "outdir": "notDist"
  }
}
```

`typehead.config.js`:

```typescript
export default {
  // Add ESBuild options here!
  // https://esbuild.github.io/api/#build-api
  plugins: [],
};
```

**`typehead serve` only:**

The following options `entryPoints` and `outdir` are not respected in `typehead serve`. You can specify values for the serve command with `webEntryPoints` and `webOutdir`.

# Why?

This was created to consolidate a lot of small packages at Mapbox with vastly different build setups.

As we adopt TypeScript, it makes sense to have a common system that:

1. Works out of the box.
2. Allows for customization.
3. Doesn't introduce too many artifical layers.

`typehead` was heavily inspired by, and still has a soft spot for, [TSDX](https://github.com/formium/tsdx).

`typehead` was created as a CLI tool instead of a boilerplate repo. This is so changes in our config could be propagated throughout our packages.

# License

Typehead is provided under the terms of the [MIT License](https://github.com/mapbox/typehead/blob/main/LICENSE)
