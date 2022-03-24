import {create} from "ts-node";
import defaultRenamePrivateTransformer, {RenamePrivateOptions} from "../transformer";

export function compile(src: string,
                              transformer = defaultRenamePrivateTransformer,
                              transformerOptions?: RenamePrivateOptions,
                              compilerOptions?: object): string {
    const service = create({
        skipProject: true,
        pretty: true,
        transformers: program => ({
            before: [
                transformer(program, transformerOptions)
            ]
        }),
        compilerOptions: {
            strict: true,
            noEmitOnError: true,
            target: 'esnext',
            module: 'esnext',
            newLine: 'lf',
            ...(compilerOptions ? compilerOptions : {})
        },
    });

    const js = service.compile(src, 'main.ts');
    return js.replace(/\/\/# sourceMappingURL=.*$/, '');
}
