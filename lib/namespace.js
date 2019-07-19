const shortid = require('shortid');
const { createNamespace } = require('cls-hooked');

const namespace = createNamespace(`express-wolox-logger:${shortid()}`);

const getRequestId = () => (namespace ? namespace.get('requestId') : null);

const setRequestId = id => {
  namespace.set('requestId', id);
  return id;
};

module.exports = { namespace, getRequestId, setRequestId };
