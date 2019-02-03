import * as crypto from 'crypto';

export function hashPasswordAndSalt (pass: string, salt: Buffer): Buffer {
    return crypto.createHash('sha256')
        .update(Buffer.from(pass))
        .update(salt)
        .digest()
    ;
}
