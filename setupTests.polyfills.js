import { Blob, File } from 'node:buffer';
import { ReadableStream, TransformStream, WritableStream } from 'node:stream/web';
import { TextDecoder, TextEncoder } from 'node:util';
import { MessageChannel, MessagePort } from 'node:worker_threads';

if (typeof globalThis.TextEncoder === 'undefined') {
  globalThis.TextEncoder = TextEncoder;
}

if (typeof globalThis.TextDecoder === 'undefined') {
  globalThis.TextDecoder = TextDecoder;
}

if (typeof globalThis.ReadableStream === 'undefined') {
  globalThis.ReadableStream = ReadableStream;
}

if (typeof globalThis.TransformStream === 'undefined') {
  globalThis.TransformStream = TransformStream;
}

if (typeof globalThis.WritableStream === 'undefined') {
  globalThis.WritableStream = WritableStream;
}

if (typeof globalThis.Blob === 'undefined') {
  globalThis.Blob = Blob;
}

if (typeof globalThis.File === 'undefined') {
  globalThis.File = File;
}

if (typeof globalThis.MessageChannel === 'undefined') {
  globalThis.MessageChannel = MessageChannel;
}

if (typeof globalThis.MessagePort === 'undefined') {
  globalThis.MessagePort = MessagePort;
}
