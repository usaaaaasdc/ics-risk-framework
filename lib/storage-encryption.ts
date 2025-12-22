/**
 * ICS-Risk Framework
 * Copyright (c) 2025 Osama Ali
 * Licensed under MIT License
 *
 * Storage Encryption Module
 * Provides AES encryption for localStorage data
 */

interface EncryptionConfig {
  enabled: boolean
  password?: string
}

// Simple encryption/decryption using Web Crypto API
export class StorageEncryption {
  private config: EncryptionConfig

  constructor(config: EncryptionConfig = { enabled: false }) {
    this.config = config
  }

  async deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
    const encoder = new TextEncoder()
    const keyMaterial = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, [
      "deriveBits",
      "deriveKey",
    ])

    return crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt,
        iterations: 100000,
        hash: "SHA-256",
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"],
    )
  }

  async encrypt(data: string, password: string): Promise<string> {
    if (!this.config.enabled || !password) {
      return data
    }

    try {
      const encoder = new TextEncoder()
      const salt = crypto.getRandomValues(new Uint8Array(16))
      const iv = crypto.getRandomValues(new Uint8Array(12))
      const key = await this.deriveKey(password, salt)

      const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encoder.encode(data))

      const combined = new Uint8Array(salt.length + iv.length + encrypted.byteLength)
      combined.set(salt, 0)
      combined.set(iv, salt.length)
      combined.set(new Uint8Array(encrypted), salt.length + iv.length)

      return btoa(String.fromCharCode(...combined))
    } catch (error) {
      console.error("Encryption error:", error)
      return data
    }
  }

  async decrypt(encryptedData: string, password: string): Promise<string> {
    if (!this.config.enabled || !password) {
      return encryptedData
    }

    try {
      const combined = Uint8Array.from(atob(encryptedData), (c) => c.charCodeAt(0))
      const salt = combined.slice(0, 16)
      const iv = combined.slice(16, 28)
      const encrypted = combined.slice(28)

      const key = await this.deriveKey(password, salt)

      const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, encrypted)

      const decoder = new TextDecoder()
      return decoder.decode(decrypted)
    } catch (error) {
      console.error("Decryption error:", error)
      throw new Error("Invalid password or corrupted data")
    }
  }

  async saveSecure(key: string, data: any, password?: string): Promise<void> {
    const jsonString = JSON.stringify(data)
    const finalPassword = password || this.config.password

    if (this.config.enabled && finalPassword) {
      const encrypted = await this.encrypt(jsonString, finalPassword)
      localStorage.setItem(key, encrypted)
      localStorage.setItem(`${key}_encrypted`, "true")
    } else {
      localStorage.setItem(key, jsonString)
      localStorage.removeItem(`${key}_encrypted`)
    }
  }

  async loadSecure(key: string, password?: string): Promise<any> {
    const isEncrypted = localStorage.getItem(`${key}_encrypted`) === "true"
    const data = localStorage.getItem(key)

    if (!data) return null

    if (isEncrypted) {
      const finalPassword = password || this.config.password
      if (!finalPassword) {
        throw new Error("Password required to decrypt data")
      }
      const decrypted = await this.decrypt(data, finalPassword)
      return JSON.parse(decrypted)
    }

    return JSON.parse(data)
  }
}

export const secureStorage = new StorageEncryption({ enabled: false })
