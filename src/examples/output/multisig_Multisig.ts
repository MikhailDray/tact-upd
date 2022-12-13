import { Cell, Slice, StackItem, Address, Builder, InternalMessage, CommonMessageInfo, CellMessage, beginCell, serializeDict } from 'ton';
import { ContractExecutor, createExecutorFromCode } from 'ton-nodejs';
import BN from 'bn.js';

export type SendParameters = {
    $$type: 'SendParameters';
    bounce: boolean;
    to: Address;
    value: BN;
    mode: BN;
    body: Cell | null;
    code: Cell | null;
    data: Cell | null;
}

export function packSendParameters(src: SendParameters): Cell {
    let b_0 = new Builder();
    b_0 = b_0.storeBit(src.bounce);
    b_0 = b_0.storeAddress(src.to);
    b_0 = b_0.storeInt(src.value, 257);
    b_0 = b_0.storeInt(src.mode, 257);
    if (src.body !== null) {
        b_0 = b_0.storeBit(true);
        b_0 = b_0.storeRef(src.body);
    } else {
        b_0 = b_0.storeBit(false);
    }
    if (src.code !== null) {
        b_0 = b_0.storeBit(true);
        b_0 = b_0.storeRef(src.code);
    } else {
        b_0 = b_0.storeBit(false);
    }
    if (src.data !== null) {
        b_0 = b_0.storeBit(true);
        b_0 = b_0.storeRef(src.data);
    } else {
        b_0 = b_0.storeBit(false);
    }
    return b_0.endCell();
}

export function packStackSendParameters(src: SendParameters, to: StackItem[]) {
    to.push({ type: 'int', value: src.bounce ? new BN(-1): new BN(0) });
    to.push({ type: 'slice', cell: beginCell().storeAddress(src.to).endCell() });
    to.push({ type: 'int', value: src.value });
    to.push({ type: 'int', value: src.mode });
    if (src.body === null) {
        to.push({ type: 'null' });
    } else {
        to.push({ type: 'cell', cell: src.body });
    }
    if (src.code === null) {
        to.push({ type: 'null' });
    } else {
        to.push({ type: 'cell', cell: src.code });
    }
    if (src.data === null) {
        to.push({ type: 'null' });
    } else {
        to.push({ type: 'cell', cell: src.data });
    }
}

export type Context = {
    $$type: 'Context';
    bounced: boolean;
    sender: Address;
    value: BN;
}

export function packContext(src: Context): Cell {
    let b_0 = new Builder();
    b_0 = b_0.storeBit(src.bounced);
    b_0 = b_0.storeAddress(src.sender);
    b_0 = b_0.storeInt(src.value, 257);
    return b_0.endCell();
}

export function packStackContext(src: Context, to: StackItem[]) {
    to.push({ type: 'int', value: src.bounced ? new BN(-1): new BN(0) });
    to.push({ type: 'slice', cell: beginCell().storeAddress(src.sender).endCell() });
    to.push({ type: 'int', value: src.value });
}

export type StateInit = {
    $$type: 'StateInit';
    code: Cell;
    data: Cell;
}

export function packStateInit(src: StateInit): Cell {
    let b_0 = new Builder();
    b_0 = b_0.storeRef(src.code);
    b_0 = b_0.storeRef(src.data);
    return b_0.endCell();
}

export function packStackStateInit(src: StateInit, to: StackItem[]) {
    to.push({ type: 'cell', cell: src.code });
    to.push({ type: 'cell', cell: src.data });
}

export type Request = {
    $$type: 'Request';
    to: Address;
    amount: BN;
    body: Cell | null;
}

export function packRequest(src: Request): Cell {
    let b_0 = new Builder();
    b_0 = b_0.storeUint(4096439811, 32);
    b_0 = b_0.storeAddress(src.to);
    b_0 = b_0.storeInt(src.amount, 257);
    if (src.body !== null) {
        b_0 = b_0.storeBit(true);
        b_0 = b_0.storeRef(src.body);
    } else {
        b_0 = b_0.storeBit(false);
    }
    return b_0.endCell();
}

export function packStackRequest(src: Request, to: StackItem[]) {
    to.push({ type: 'slice', cell: beginCell().storeAddress(src.to).endCell() });
    to.push({ type: 'int', value: src.amount });
    if (src.body === null) {
        to.push({ type: 'null' });
    } else {
        to.push({ type: 'cell', cell: src.body });
    }
}

export async function Multisig_init(members: Cell, requiredWeight: BN) {
    const __code = 'te6ccgEBCQEA6gABFP8A9KQT9LzyyAsBAgFiAgMCAswEBQAJoea/4BEBb9uBDrpOEPypgQa4WP7wFoaYGAuNhgAMi/yLhxAP0gGCogireB/DCBSK3wQQh6FVsB3XGBGHlgMkBgIB1AcIAMrtRNDUAfhigQEB1wD0BIEBAdcAgQEB1wBVMGwUBNMfAYIQ9Cq2A7ry4GT6QAEBgQEB1wBtAdIAAZLUMd5VIDMQVhBFEDRY8AnI+EIBzFUwUDSBAQHPAPQAgQEBzwCBAQHPAMntVAA7G1wBMjMUERDE1A0gQEBzwD0AIEBAc8AgQEBzwDJgAAUXwOA=';
    const depends = new Map<string, Cell>();
    let systemCell = beginCell().storeDict(null).endCell();
    let __stack: StackItem[] = [];
    __stack.push({ type: 'cell', cell: systemCell });
    __stack.push({ type: 'cell', cell: members});
    __stack.push({ type: 'int', value: requiredWeight });
    let codeCell = Cell.fromBoc(Buffer.from(__code, 'base64'))[0];
    let executor = await createExecutorFromCode({ code: codeCell, data: new Cell() });
    let res = await executor.get('init_Multisig', __stack, { debug: true });
    let data = res.stack.readCell();
    return { code: codeCell, data };
}

export class Multisig {
    readonly executor: ContractExecutor; 
    constructor(executor: ContractExecutor) { this.executor = executor; } 
    
    async send(args: { amount: BN, from?: Address, debug?: boolean }, message: Request) {
        let body: Cell | null = null;
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'Request') {
            body = packRequest(message);
        }
        if (body === null) { throw new Error('Invalid message type'); }
        await this.executor.internal(new InternalMessage({
            to: this.executor.address,
            from: args.from || this.executor.address,
            bounce: false,
            value: args.amount,
            body: new CommonMessageInfo({
                body: new CellMessage(body!)
            })
        }), { debug: args.debug });
    }
}