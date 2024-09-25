// src/global.d.ts
declare module 'randombytes' {
    export default function randomBytes(size: number, cb?: (err: Error | null, buf: Buffer) => void): Buffer;
  }
  