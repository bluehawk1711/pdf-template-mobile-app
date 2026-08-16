// Node-only preload shim: replaces native modules with plain-JS fakes so the
// compiled form/PDF logic can run in a plain `node` process for checks.
// Usage: node --require <abs-path>/scripts/node-preload.js <compiled-check.js>
'use strict';

const Module = require('module');
const originalLoad = Module._load;

const memStore = new Map();

Module._load = function (request, parent, isMain) {
  if (request === 'expo-crypto') {
    return { randomUUID: () => 'test-' + Math.random().toString(36).slice(2, 10) };
  }
  if (request === '@react-native-async-storage/async-storage') {
    return {
      getItem: async (key) => (memStore.has(key) ? memStore.get(key) : null),
      setItem: async (key, value) => {
        memStore.set(key, value);
      },
      removeItem: async (key) => {
        memStore.delete(key);
      },
    };
  }
  return originalLoad.call(this, request, parent, isMain);
};
