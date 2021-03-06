/* eslint-disable @typescript-eslint/no-explicit-any */
import path from 'path';
import * as orgFs from 'fs';

type Fs = typeof orgFs;
interface FsProp extends Fs {
  __setMockFiles: (newMockFiles) => void;
}

const fs = jest.createMockFromModule('fs') as FsProp;

// This is a custom function that our tests can use during setup to specify
// what the files on the "mock" filesystem should look like when any of the
// `fs` APIs are used.
let mockFiles = Object.create(null);

function __setMockFiles(newMockFiles) {
  mockFiles = Object.create(null);
  for (const dir in newMockFiles) {
    if (!mockFiles[dir]) {
      mockFiles[dir] = [];
    }
    mockFiles[dir].push(path.basename(dir));
  }
}

// A custom version of `readdirSync` that reads from the special mocked out
// file list set via __setMockFiles
function readdirSync(directoryPath) {
  return mockFiles[directoryPath] || [];
}

fs.__setMockFiles = __setMockFiles;
fs.readdirSync = readdirSync;

fs.unlinkSync = jest.fn();

fs.existsSync = (directoryPath: any) => {
  return mockFiles[directoryPath] !== undefined;
};

module.exports = fs;
