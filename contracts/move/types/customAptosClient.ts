import { AptosAccount, HexString, MaybeHexString } from 'aptos';

export class CustomAptosAccount extends AptosAccount {
    constructor(privateKey?: Uint8Array | HexString | string, address?: MaybeHexString) {
        let privateKeyBytes: Uint8Array | undefined = undefined;
        
        if (privateKey) {
            if (privateKey instanceof HexString) {
                privateKeyBytes = privateKey.toUint8Array();
            } else if (!(privateKey instanceof Uint8Array)) {
                privateKeyBytes = (new HexString(privateKey)).toUint8Array();
            }
        }
        
        super(privateKeyBytes);
    }
}
