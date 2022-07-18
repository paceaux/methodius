import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import commonjs from 'rollup-plugin-commonjs';

import pkg from './package.json';

export default [
  // browser-friendly UMD build
  {
    input: 'src/main.js',
    output: {
      name: 'methodius',
      file: pkg.browser,
      format: 'umd',
    },
    plugins: [
      resolve(), // so Rollup can find `ms`
      commonjs(), // so Rollup can convert `ms` to an ES module
      babel({ babelHelpers: 'bundled' }),
    ],
  },
  {
    input: 'src/main.js',
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        name: 'methodius',
      },
      {
        file: pkg.module,
        format: 'es',
        name: 'methodius',
      },
    ],
    plugins: [
      resolve(), // so Rollup can find `ms`
      babel({ babelHelpers: 'bundled' }),
    ],
  },
];
