import { aad_context, encryptionKey } from "@/config/config";

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // For GCM, this should be 12 bytes
const TAG_LENGTH = 16; // GCM authentication tag length

// Browser-friendly AES-GCM decryptor using Web Crypto API
export async function decryptAesGcmBase64(encryptedBase64: string): Promise<string> {
    const base64Key = encryptionKey;
    const aad = aad_context;
    // Decode inputs
    const encryptedBytes = Uint8Array.from(atob(encryptedBase64), c => c.charCodeAt(0));
    const keyBytes = Uint8Array.from(atob(base64Key), c => c.charCodeAt(0));

    const iv = encryptedBytes.subarray(0, IV_LENGTH);
    const tag = encryptedBytes.subarray(encryptedBytes.length - TAG_LENGTH);
    const ciphertext = encryptedBytes.subarray(IV_LENGTH, encryptedBytes.length - TAG_LENGTH);

    // Web Crypto expects tag appended to ciphertext
    const combined = new Uint8Array(ciphertext.length + tag.length);
    combined.set(ciphertext, 0);
    combined.set(tag, ciphertext.length);

    const cryptoKey = await globalThis.crypto.subtle.importKey(
        'raw',
        keyBytes,
        { name: 'AES-GCM', length: 256 },
        false,
        ['decrypt']
    );

    const decrypted = await globalThis.crypto.subtle.decrypt(
        {
            name: 'AES-GCM',
            iv,
            additionalData: new TextEncoder().encode(aad),
            tagLength: 128,
        },
        cryptoKey,
        combined
    );

    return new TextDecoder().decode(decrypted);
}

export async function generateHashValue(value: string) {
    return await encryptValue(value, encryptionKey);
}

export async function encryptValue(text: string, secretKey: string): Promise<string> {
    try {
        const aad = aad_context;
        const keyBytes = Uint8Array.from(atob(secretKey), c => c.charCodeAt(0));
        const cryptoKey = await globalThis.crypto.subtle.importKey(
            'raw',
            keyBytes,
            { name: 'AES-GCM', length: 256 },
            false,
            ['encrypt']
        );

        const iv = globalThis.crypto.getRandomValues(new Uint8Array(IV_LENGTH));
        const plaintextBytes = new TextEncoder().encode(text);

        const encryptedBuffer = await globalThis.crypto.subtle.encrypt(
            {
                name: 'AES-GCM',
                iv,
                additionalData: new TextEncoder().encode(aad),
                tagLength: 128,
            },
            cryptoKey,
            plaintextBytes
        );

        const encryptedBytes = new Uint8Array(encryptedBuffer); // ciphertext || tag
        const ciphertext = encryptedBytes.subarray(0, encryptedBytes.length - TAG_LENGTH);
        const tag = encryptedBytes.subarray(encryptedBytes.length - TAG_LENGTH);

        const output = new Uint8Array(iv.length + ciphertext.length + tag.length);
        output.set(iv, 0);
        output.set(ciphertext, iv.length);
        output.set(tag, iv.length + ciphertext.length);

        let binary = '';
        for (let i = 0; i < output.length; i++) binary += String.fromCharCode(output[i]);
        return btoa(binary);
    } catch (error) {
        throw new Error(`Encryption failed: ${error}`);
    }
}

