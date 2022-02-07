import lodashPlugin from 'esbuild-plugin-lodash';

import deepmerge from 'deepmerge';
import { cosmiconfig } from 'cosmiconfig';

import { IS_RELATIVE_AND_JS } from './regex.mjs';

/**
 * Gets the base ESBuild config for build/serve.
 */
export async function getEsbuildConfig() {
  const configFile = {};

  // Try loading the config file and assign any options it has.
  const explorer = cosmiconfig('typehead');
  try {
    const result = await explorer.search();
    Object.assign(configFile, result.config);
  } catch (e) {
    console.debug('Skipping typehead config, using defaults.');
  }

  return deepmerge(configFile, {
    sourcemap: true,
    bundle: true,
    platform: 'neutral',
    plugins: [
      // Automatically rewrite Lodash statements.
      lodashPlugin({
        filter: IS_RELATIVE_AND_JS,
      }),
    ],
  });
}
