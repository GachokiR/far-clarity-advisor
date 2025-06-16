
// Client-side encryption service for sensitive data
export class EncryptionService {
  private static instance: EncryptionService;
  private keyCache: Map<string, CryptoKey> = new Map();

  static getInstance(): EncryptionService {
    if (!EncryptionService.instance) {
      EncryptionService.instance = new EncryptionService();
    }
    return EncryptionService.instance;
  }

  async generateKey(): Promise<CryptoKey> {
    return await crypto.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: 256,
      },
      true,
      ['encrypt', 'decrypt']
    );
  }

  async exportKey(key: CryptoKey): Promise<string> {
    const exported = await crypto.subtle.exportKey('raw', key);
    return this.arrayBufferToBase64(exported);
  }

  async importKey(keyData: string): Promise<CryptoKey> {
    const keyBuffer = this.base64ToArrayBuffer(keyData);
    return await crypto.subtle.importKey(
      'raw',
      keyBuffer,
      { name: 'AES-GCM' },
      true,
      ['encrypt', 'decrypt']
    );
  }

  async encryptData(data: string, key?: CryptoKey): Promise<{ encryptedData: string; iv: string; keyId?: string }> {
    if (!key) {
      key = await this.generateKey();
    }

    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    const encryptedBuffer = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      key,
      dataBuffer
    );

    return {
      encryptedData: this.arrayBufferToBase64(encryptedBuffer),
      iv: this.arrayBufferToBase64(iv),
      keyId: await this.exportKey(key)
    };
  }

  async decryptData(encryptedData: string, iv: string, key: CryptoKey): Promise<string> {
    const encryptedBuffer = this.base64ToArrayBuffer(encryptedData);
    const ivBuffer = this.base64ToArrayBuffer(iv);

    const decryptedBuffer = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: ivBuffer,
      },
      key,
      encryptedBuffer
    );

    const decoder = new TextDecoder();
    return decoder.decode(decryptedBuffer);
  }

  async encryptFile(file: File, key?: CryptoKey): Promise<{ encryptedFile: Blob; metadata: any }> {
    if (!key) {
      key = await this.generateKey();
    }

    const fileBuffer = await file.arrayBuffer();
    const iv = crypto.getRandomValues(new Uint8Array(12));

    const encryptedBuffer = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      key,
      fileBuffer
    );

    const encryptedFile = new Blob([encryptedBuffer], { type: 'application/octet-stream' });

    return {
      encryptedFile,
      metadata: {
        originalName: file.name,
        originalType: file.type,
        originalSize: file.size,
        iv: this.arrayBufferToBase64(iv),
        keyId: await this.exportKey(key)
      }
    };
  }

  async decryptFile(encryptedBlob: Blob, metadata: any, key: CryptoKey): Promise<File> {
    const encryptedBuffer = await encryptedBlob.arrayBuffer();
    const ivBuffer = this.base64ToArrayBuffer(metadata.iv);

    const decryptedBuffer = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: ivBuffer,
      },
      key,
      encryptedBuffer
    );

    return new File([decryptedBuffer], metadata.originalName, {
      type: metadata.originalType
    });
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }

  // Key management methods
  async storeKey(keyId: string, key: CryptoKey): Promise<void> {
    this.keyCache.set(keyId, key);
    // In production, this would integrate with a secure key management service
  }

  async retrieveKey(keyId: string): Promise<CryptoKey | null> {
    return this.keyCache.get(keyId) || null;
  }

  clearKeyCache(): void {
    this.keyCache.clear();
  }
}

export const encryptionService = EncryptionService.getInstance();
