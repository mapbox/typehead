/**
 * These are inverses of the same regex string from here:
 * https://github.com/evanw/esbuild/issues/619#issuecomment-751995294
 *
 * This uses Node resolution behavior. Any file starting like ./, ../, or /
 * is local to the project. This means we should bundle it and run optimizations.
 *
 * Inversely, any import like 'this-import' is external and shouldn't be bundled.
 */
export const IS_RELATIVE = /^[./]|^\.[./]|^\.\.[/]/;
export const IS_EXTERNAL = /^[^./]|^\.[^./]|^\.\.[^/]/;

/**
 * This is the same as IS_RELATIVE, but makes sure the file has the
 * extensions js/jsx/ts/tsx/cjs/mjs.
 */
export const IS_RELATIVE_AND_JS =
  /(^[./]|^\.[./]|^\.\.[/]).*\.(mjs|cjs|jsx*|tsx*)$/;
