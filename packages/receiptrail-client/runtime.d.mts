export interface AddressCodec {
  encode(address: string): Uint8Array;
  decode(bytes: Uint8Array): string;
}
export interface AccountMeta { address: string; isSigner: boolean; isWritable: boolean; }
export interface Instruction { programAddress: string; accounts: AccountMeta[]; data: Uint8Array; }
export declare const U64_MAX: bigint;
