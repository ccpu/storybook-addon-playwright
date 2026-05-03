const { TextDecoder, TextEncoder } = require('node:util');
const {
  ReadableStream,
  TransformStream,
  WritableStream,
} = require('node:stream/web');
const { Blob, File } = require('node:buffer');
const { MessageChannel, MessagePort } = require('node:worker_threads');
const React = require('react');
const { useSyncExternalStore } = require('use-sync-external-store/shim');

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

if (typeof React.useSyncExternalStore === 'undefined') {
  React.useSyncExternalStore = useSyncExternalStore;
}
