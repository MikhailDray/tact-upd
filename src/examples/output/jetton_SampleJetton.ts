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

export type ChangeOwner = {
    $$type: 'ChangeOwner';
    newOwner: Address;
}

export function packChangeOwner(src: ChangeOwner): Cell {
    let b_0 = new Builder();
    b_0 = b_0.storeUint(3067051791, 32);
    b_0 = b_0.storeAddress(src.newOwner);
    return b_0.endCell();
}

export function packStackChangeOwner(src: ChangeOwner, to: StackItem[]) {
    to.push({ type: 'slice', cell: beginCell().storeAddress(src.newOwner).endCell() });
}

export type TokenBurned = {
    $$type: 'TokenBurned';
    amount: BN;
    owner: Address;
    cashback: Address | null;
}

export function packTokenBurned(src: TokenBurned): Cell {
    let b_0 = new Builder();
    b_0 = b_0.storeUint(2078119902, 32);
    b_0 = b_0.storeInt(src.amount, 257);
    b_0 = b_0.storeAddress(src.owner);
    if (src.cashback !== null) {
        b_0 = b_0.storeBit(true);
        b_0 = b_0.storeAddress(src.cashback);
    } else {
        b_0 = b_0.storeBit(false);
    }
    return b_0.endCell();
}

export function packStackTokenBurned(src: TokenBurned, to: StackItem[]) {
    to.push({ type: 'int', value: src.amount });
    to.push({ type: 'slice', cell: beginCell().storeAddress(src.owner).endCell() });
    if (src.cashback === null) {
        to.push({ type: 'null' });
    } else {
        to.push({ type: 'slice', cell: beginCell().storeAddress(src.cashback).endCell() });
    }
}

export type TokenTransferInternal = {
    $$type: 'TokenTransferInternal';
    queryId: BN;
    amount: BN;
    from: Address;
    responseAddress: Address;
    forwardTonAmount: BN;
}

export function packTokenTransferInternal(src: TokenTransferInternal): Cell {
    let b_0 = new Builder();
    b_0 = b_0.storeUint(395134233, 32);
    b_0 = b_0.storeUint(src.queryId, 64);
    b_0 = b_0.storeInt(src.amount, 257);
    b_0 = b_0.storeAddress(src.from);
    b_0 = b_0.storeAddress(src.responseAddress);
    b_0 = b_0.storeCoins(src.forwardTonAmount);
    return b_0.endCell();
}

export function packStackTokenTransferInternal(src: TokenTransferInternal, to: StackItem[]) {
    to.push({ type: 'int', value: src.queryId });
    to.push({ type: 'int', value: src.amount });
    to.push({ type: 'slice', cell: beginCell().storeAddress(src.from).endCell() });
    to.push({ type: 'slice', cell: beginCell().storeAddress(src.responseAddress).endCell() });
    to.push({ type: 'int', value: src.forwardTonAmount });
}

export type TokenTransfer = {
    $$type: 'TokenTransfer';
    queryId: BN;
    amount: BN;
    destination: Address;
    responseDestination: Address;
    customPayload: Cell | null;
    forwardTonAmount: BN;
}

export function packTokenTransfer(src: TokenTransfer): Cell {
    let b_0 = new Builder();
    b_0 = b_0.storeUint(260734629, 32);
    b_0 = b_0.storeUint(src.queryId, 64);
    b_0 = b_0.storeCoins(src.amount);
    b_0 = b_0.storeAddress(src.destination);
    b_0 = b_0.storeAddress(src.responseDestination);
    if (src.customPayload !== null) {
        b_0 = b_0.storeBit(true);
        b_0 = b_0.storeRef(src.customPayload);
    } else {
        b_0 = b_0.storeBit(false);
    }
    b_0 = b_0.storeCoins(src.forwardTonAmount);
    return b_0.endCell();
}

export function packStackTokenTransfer(src: TokenTransfer, to: StackItem[]) {
    to.push({ type: 'int', value: src.queryId });
    to.push({ type: 'int', value: src.amount });
    to.push({ type: 'slice', cell: beginCell().storeAddress(src.destination).endCell() });
    to.push({ type: 'slice', cell: beginCell().storeAddress(src.responseDestination).endCell() });
    if (src.customPayload === null) {
        to.push({ type: 'null' });
    } else {
        to.push({ type: 'cell', cell: src.customPayload });
    }
    to.push({ type: 'int', value: src.forwardTonAmount });
}

export type JettonUpdateContent = {
    $$type: 'JettonUpdateContent';
    content: Cell | null;
}

export function packJettonUpdateContent(src: JettonUpdateContent): Cell {
    let b_0 = new Builder();
    b_0 = b_0.storeUint(3551049822, 32);
    if (src.content !== null) {
        b_0 = b_0.storeBit(true);
        b_0 = b_0.storeRef(src.content);
    } else {
        b_0 = b_0.storeBit(false);
    }
    return b_0.endCell();
}

export function packStackJettonUpdateContent(src: JettonUpdateContent, to: StackItem[]) {
    if (src.content === null) {
        to.push({ type: 'null' });
    } else {
        to.push({ type: 'cell', cell: src.content });
    }
}

export type JettonData = {
    $$type: 'JettonData';
    totalSupply: BN;
    mintable: boolean;
    owner: Address;
    content: Cell;
    walletCode: Cell;
}

export function packJettonData(src: JettonData): Cell {
    let b_0 = new Builder();
    b_0 = b_0.storeInt(src.totalSupply, 257);
    b_0 = b_0.storeBit(src.mintable);
    b_0 = b_0.storeAddress(src.owner);
    b_0 = b_0.storeRef(src.content);
    b_0 = b_0.storeRef(src.walletCode);
    return b_0.endCell();
}

export function packStackJettonData(src: JettonData, to: StackItem[]) {
    to.push({ type: 'int', value: src.totalSupply });
    to.push({ type: 'int', value: src.mintable ? new BN(-1): new BN(0) });
    to.push({ type: 'slice', cell: beginCell().storeAddress(src.owner).endCell() });
    to.push({ type: 'cell', cell: src.content });
    to.push({ type: 'cell', cell: src.walletCode });
}

export type Mint = {
    $$type: 'Mint';
    amount: BN;
}

export function packMint(src: Mint): Cell {
    let b_0 = new Builder();
    b_0 = b_0.storeUint(2737462367, 32);
    b_0 = b_0.storeInt(src.amount, 257);
    return b_0.endCell();
}

export function packStackMint(src: Mint, to: StackItem[]) {
    to.push({ type: 'int', value: src.amount });
}

export async function SampleJetton_init(owner: Address, content: Cell | null) {
    const __code = 'te6ccgECLwEABEkAART/APSkE/S88sgLAQIBYgIDAgLKBAUCASApKgIBIAYHAgHOIyQCAUgICQIBIA8QAgFICgsAR2chwAcsBcwHLAXABywASzMzJ+QDIcgHLAXABywASygfL/8nQgOXHAh10nCH5UwINcLH94C0NMDAXGwwAGRf5Fw4gH6QDBUQRVvA/hhApFb4CCCEKMqXF+64wIgghDTqLheuuMCghB73ZfeuuMCMPLAZIAwNDgAJCBu8k6AAtjDtRNDUAfhi+gD6QAFtAtIAAZLUMd7SAARQM2wUBNMfAYIQoypcX7ry4GSBAQHXAAExEDRBMPAhyPhCAcxVMFBD+gIBzxYibpUycFjKAJZ/AcoAEsziygDJ7VQAvjDtRNDUAfhi+gD6QAFtAtIAAZLUMd7SAARQM2wUBNMfAYIQ06i4Xrry4GRtAdIAAZLUMd4BMRA0QTDwIsj4QgHMVTBQQ/oCAc8WIm6VMnBYygCWfwHKABLM4soAye1UANjtRNDUAfhi+gD6QAFtAtIAAZLUMd7SAARQM2wUBNMfAYIQe92X3rry4GSBAQHXAPpAAW0C0gABlPpAATDeQxMzEFYQRRA0WPAjyPhCAcxVMFBD+gIBzxYibpUycFjKAJZ/AcoAEsziygDJ7VQCAVgREgIBIBUWABVZR/AcoA4HABygCAIBIBMUAOsyHEBygEXygBwAcoCUAXPFlAD+gJwAcpoI26zJW6zsY41f/AVyHDwFXDwFSRus5V/8BUUzJU0A3DwFeIkbrOVf/AVFMyVNANw8BXicPAVAn/wFQLJWMyWMzMBcPAV4iFus5l/AcoAAfABAcyUcDLKAOLJAfsAgACkcAPIzEMTUCOBAQHPAAHPFgHPFsmACASAXGAIBIB0eAgEgGRoCASAbHABvALQ9AQwIIIA2K8BgBD0D2+h8uBkbQKCANivAYAQ9A9vofLgZBKCANivAQKAEPQXyPQAyUAD8BeAAQxwfwTIzEM0UEP6AgHPFiJulTJwWMoAln8BygASzOLKAMmAADz4QvgoWPAYgABU8BpsIjJwMwHwBYAIBIB8gAgEgISIADz4KPAaMEMwgAIkUVWgVTDwGnBTIfAFcHBTAPgo+CgiEDQQPshVQIIQF41FGVAGyx8Uyz8SgQEBzwABzxYBzxYB+gLJXjIUEDpAqvAWVQKAALz4QW8jMDFVQPAacFnwBVAFxwXy4GRVAoAAZPhBbyMwMSPHBfLgZIAIBICUmAgEgJygACQQI18DgABM+EFvIzAxAfAdgAA8VTDwHzFBMIAAZDAVFEMw8B5QNKFQI4ABBvijvaiaGoA/DF9AH0gALaBaQAAyWoY72kAAigZtgp4EEAgEgKywCAWYtLgAJudw/AZgARa289qJoagD8MX0AfSAAtoFpAADJahjvaQACKBm2CiqB+A3AAEGvFvaiaGoA/DF9AH0gALaBaQAAyWoY72kAAigZtgp4DkA=';
    const depends = new Map<string, Cell>();
    depends.set('55471', Cell.fromBoc(Buffer.from('te6ccgECFgEAAs4AART/APSkE/S88sgLAQIBYgIDAgLLBAUACaFjx+ApAgFIBgcCAUgMDQIBSAgJAEdnIcAHLAXMBywFwAcsAEszMyfkAyHIBywFwAcsAEsoHy//J0ICgxwIddJwh+VMCDXCx/eAtDTAwFxsMABkX+RcOIB+kAwVEEVbwP4YQKRW+AgghAXjUUZuuMCghAPin6luuMCMPLAZIAoLAAkIG7yToACyMO1E0NQB+GKBAQHXAPpAAQH6QAFDMGwTA9MfAYIQF41FGbry4GTTP4EBAdcA+kABAfpAAQH6AFVANRBnEFZVA/AWyPhCAcxVIFAjgQEBzwABzxYBzxbJ7VQAwO1E0NQB+GKBAQHXAPpAAQH6QAFDMGwTA9MfAYIQD4p+pbry4GTTP/oA+kABAfpAAW0C0gABktQx3voABgUEUDM2EHgQZ1UE8BfI+EIBzFUgUCOBAQHPAAHPFgHPFsntVAIBWA4PAgEgEBEAFSUfwHKAOBwAcoAgAOsyHEBygEXygBwAcoCUAXPFlAD+gJwAcpoI26zJW6zsY41f/ASyHDwEnDwEiRus5V/8BIUzJU0A3DwEuIkbrOVf/ASFMyVNANw8BLicPASAn/wEgLJWMyWMzMBcPAS4iFus5l/AcoAAfABAcyUcDLKAOLJAfsAgAgEgEhMCASAUFQApHADyMxDE1AjgQEBzwABzxYBzxbJgAG8AtD0BDAgggDYrwGAEPQPb6Hy4GRtAoIA2K8BgBD0D2+h8uBkEoIA2K8BAoAQ9BfI9ADJQAPwFIABbFsy+EFvIzAxUwPHBbOOEfhCVCBE8BVwWfAFWMcF8uBkkjAx4hOgIML/8uBkAoACpF8D+EFvIzAxJccF8uBkUVGhIML/8uBk+EJUIEfwFXBTIfAFcHBUNmZUJ6BSsMhVQIIQF41FGVAGyx8Uyz8SgQEBzwABzxYBzxYB+gLJQBVQYxTwE4A==', 'base64'))[0]);
    let systemCell = beginCell().storeDict(serializeDict(depends, 16, (src, v) => v.refs.push(src))).endCell();
    let __stack: StackItem[] = [];
    __stack.push({ type: 'cell', cell: systemCell });
    __stack.push({ type: 'slice', cell: beginCell().storeAddress(owner).endCell() });
    if (content !== null) {
        __stack.push({ type: 'cell', cell: content });
    } else {
        __stack.push({ type: 'null' });
    }
    let codeCell = Cell.fromBoc(Buffer.from(__code, 'base64'))[0];
    let executor = await createExecutorFromCode({ code: codeCell, data: new Cell() });
    let res = await executor.get('init_SampleJetton', __stack, { debug: true });
    let data = res.stack.readCell();
    return { code: codeCell, data };
}

export class SampleJetton {
    readonly executor: ContractExecutor; 
    constructor(executor: ContractExecutor) { this.executor = executor; } 
    
    async send(args: { amount: BN, from?: Address, debug?: boolean }, message: Mint | JettonUpdateContent | TokenBurned) {
        let body: Cell | null = null;
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'Mint') {
            body = packMint(message);
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'JettonUpdateContent') {
            body = packJettonUpdateContent(message);
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'TokenBurned') {
            body = packTokenBurned(message);
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
    async getGetWalletAddress(owner: Address) {
        let __stack: StackItem[] = [];
        __stack.push({ type: 'slice', cell: beginCell().storeAddress(owner).endCell() });
        let result = await this.executor.get('get_wallet_address', __stack);
        return result.stack.readAddress()!;
    }
    async getGetJettonData() {
        let __stack: StackItem[] = [];
        let result = await this.executor.get('get_jetton_data', __stack);
    }
    async getOwner() {
        let __stack: StackItem[] = [];
        let result = await this.executor.get('owner', __stack);
        return result.stack.readAddress()!;
    }
}