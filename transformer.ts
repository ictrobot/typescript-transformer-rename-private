import * as ts from 'typescript';

export interface RenamePrivateOptions {
    privatePrefix?: string,
}

export type RenameFunction = (identifier: string) => string;

type Handler<T extends ts.Node> = (node: T, visitor: ts.Visitor, context: ts.TransformationContext) => T;

export const RenamePrivateTransformer = (fn?: RenameFunction) => (program: ts.Program, config?: RenamePrivateOptions) => {
    const typeChecker = program.getTypeChecker();

    const transformerFactory: ts.TransformerFactory<ts.SourceFile> = context => sourceFile => {
        const visitor = (node: ts.Node): ts.Node => {
            if (ts.isIdentifier(node)) {
                return handleIdentifier(node, visitor, context);
            } else if (ts.isElementAccessExpression(node)) {
                return handleElementAccessExpression(node, visitor, context);
            } else if (ts.isBindingElement(node)) {
                return handleBindingElement(node, visitor, context);
            } else {
                return ts.visitEachChild(node, visitor, context);
            }
        };

        return ts.visitNode(sourceFile, visitor);
    };

    const handleIdentifier: Handler<ts.Identifier> = (node, visitor, context) => {
        const symbol = typeChecker.getSymbolAtLocation(node);
        if (!isPrivateSymbol(symbol)) return node;

        return context.factory.createIdentifier(rename(symbol));
    };

    const handleElementAccessExpression: Handler<ts.ElementAccessExpression> = (node, visitor, context) => {
        let symbol: ts.Symbol | undefined;
        if (ts.isStringLiteral(node.argumentExpression)) {
            // this['privateField']
            symbol = typeChecker.getSymbolAtLocation(node.argumentExpression);
        } else {
            const type = typeChecker.getTypeAtLocation(node.argumentExpression);
            if (!type.isStringLiteral()) {
                // can't infer the symbol or if it is private
                return ts.visitEachChild(node, visitor, context);
            }

            // this[x] where x has a string literal type
            const parentType = typeChecker.getTypeAtLocation(node.expression);
            symbol = parentType.getProperty(type.value);
        }

        // must recurse on node.expression for nested accesses regardless of the symbol
        return context.factory.createElementAccessExpression(
            ts.visitNode(node.expression, visitor),
            isPrivateSymbol(symbol) ? context.factory.createStringLiteral(rename(symbol)) : node.argumentExpression
        );
    };

    const handleBindingElement: Handler<ts.BindingElement> = (node, visitor, context) => {
        // check object, not array, binding
        if (!ts.isObjectBindingPattern(node.parent)) return ts.visitEachChild(node, visitor, context);

        let symbol: ts.Symbol | undefined;
        if (node.propertyName === undefined) {
            // const {name} = this;
            if (!ts.isIdentifier(node.name)) {
                // node.name should always be an identifier as a nested binding doesn't make sense in an object binding
                // pattern without a property name first - recurse anyway to be safe
                return ts.visitEachChild(node, visitor, context);
            }

            const parentType = typeChecker.getTypeAtLocation(node.parent);
            symbol = parentType.getProperty(ts.idText(node.name));
        } else {
            // const {propertyName: name} = this;
            symbol = typeChecker.getSymbolAtLocation(node.propertyName);
        }

        // must recurse on node.name for nested bindings and node.initializer regardless of the symbol
        return context.factory.createBindingElement(
            node.dotDotDotToken,
            isPrivateSymbol(symbol) ? rename(symbol) : node.propertyName,
            ts.visitNode(node.name, visitor),
            ts.visitNode(node.initializer, visitor)
        );
    };

    function isPrivateSymbol(symbol?: ts.Symbol): symbol is ts.Symbol {
        return symbol?.valueDeclaration?.modifiers !== undefined
            && symbol.valueDeclaration.modifiers.some(x => x.kind === ts.SyntaxKind.PrivateKeyword);
    }

    function rename(symbol: ts.Symbol): string {
        const name = ts.symbolName(symbol);
        return fn === undefined ? (config?.privatePrefix ?? '__private_') + name : fn(name);
    }

    return transformerFactory;
};

export default RenamePrivateTransformer();
