const shortid = require('shortid');
const { createNamespace } = require('cls-hooked');

const namespace = createNamespace(`express-wolox-logger:${shortid()}`);

const getLogMetadata = () => (namespace && namespace.get('logMetadata')) || {};

const addLogMetadata = newMetadata =>
  namespace && namespace.set('logMetadata', { ...getLogMetadata(), ...newMetadata });

const getRequestId = () => getLogMetadata().requestId || null;

const setRequestId = id => {
  addLogMetadata({ requestId: id });
  return id;
};

module.exports = { namespace, getRequestId, setRequestId, getLogMetadata, addLogMetadata };
