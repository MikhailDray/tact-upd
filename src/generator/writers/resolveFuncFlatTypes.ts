import { getType } from "../../types/resolveDescriptors";
import { TypeDescription, TypeRef } from "../../types/types";
import { WriterContext } from "../Writer";
import { resolveFuncType } from "./resolveFuncType";

export function resolveFuncFlatTypes(descriptor: TypeRef | TypeDescription | string, ctx: WriterContext, optional: boolean = false): string[] {

    // String
    if (typeof descriptor === 'string') {
        return resolveFuncFlatTypes(getType(ctx.ctx, descriptor), ctx);
    }

    // TypeRef
    if (descriptor.kind === 'ref') {
        return resolveFuncFlatTypes(getType(ctx.ctx, descriptor.name), ctx, descriptor.optional);
    }
    if (descriptor.kind === 'map') {
        return ['cell'];
    }
    if (descriptor.kind === 'void') {
        throw Error('Void type is not allowed in function arguments');
    }

    // TypeDescription
    if (descriptor.kind === 'primitive') {
        return [resolveFuncType(descriptor, ctx)];
    } else if (descriptor.kind === 'struct') {
        if (optional) {
            return ['tuple'];
        } else {
            return descriptor.fields.flatMap((v) => resolveFuncFlatTypes(v.type, ctx));
        }
    } else if (descriptor.kind === 'contract') {
        if (optional) {
            return ['tuple'];
        } else {
            return descriptor.fields.flatMap((v) => resolveFuncFlatTypes(v.type, ctx));
        }
    }

    // Unreachable
    throw Error('Unknown type: ' + descriptor.kind);
}