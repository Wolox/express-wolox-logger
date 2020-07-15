const { AsyncLocalStorage, AsyncResource } = require('async_hooks');

const appMetadataKey = 'logMetadata';
const appKey = 'express-wolox-logger';
const asyncLocalStorage = new AsyncLocalStorage();

const getLogStore = () => asyncLocalStorage && asyncLocalStorage.getStore();

const getLogMetadata = () => {
  const logStore = getLogStore();
  return (logStore && logStore.get(appMetadataKey)) || {};
};

const addLogMetadata = newMetadata => {
  const actualStore = getLogStore();
  const actualLogMetadata = getLogMetadata();
  actualStore.set(appMetadataKey, { ...actualLogMetadata, ...newMetadata });
};

const getRequestId = () => getLogMetadata().requestId || null;

const setRequestId = id => {
  addLogMetadata({ requestId: id });
  return id;
};

const runWithContext = callback => {
  const resource = new AsyncResource(appKey);
  return (...args) => resource.runInAsyncScope(callback, null, ...args);
};

const getInitialContext = ({ requestId }) => {
  const context = new Map();
  context.set(appMetadataKey, { requestId });
  return context;
};

module.exports = {
  runWithContext,
  getInitialContext,
  asyncLocalStorage,
  getRequestId,
  setRequestId,
  getLogStore,
  getLogMetadata,
  addLogMetadata
};
