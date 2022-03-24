import typescript from '@rollup/plugin-typescript';
import {terser} from 'rollup-plugin-terser'

import defaultRenamePrivateTransformer from 'typescript-transformer-rename-private';
// import {RenamePrivateTransformer} from 'typescript-transformer-rename-private';

export default {
    input: 'example.ts',
    output: {
        file: 'example.min.js',
        format: 'es'
    },
    plugins: [
        typescript({
            transformers: {
                before: [
                    {
                        type: 'program',

                        /* to use the default prefix */
                        factory: defaultRenamePrivateTransformer,

                        /* to use a custom rename function */
                        /* factory: RenamePrivateTransformer(id => '__test_' + id) */
                    }
                ]
            }
        }),
        terser({
            mangle: {
                properties: {
                    regex: /^__private_/
                }
            }
        }),
    ]
};
