const uuid = require('uuid/v4');
const { createNamespace } = require('cls-hooked');

const ns = createNamespace(`express-wolox-logger:${uuid()}`);

const getRequestId = () => (ns ? ns.get('requestId') : null);

const setRequestId = (id = uuid()) => {
  ns.set('requestId', id);
  return id;
};

module.exports = { ns, getRequestId, setRequestId };
