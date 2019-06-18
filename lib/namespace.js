const shortid = require('shortid');
const { createNamespace } = require('cls-hooked');

const ns = createNamespace(`express-wolox-logger:${shortid()}`);

const getRequestId = () => (ns ? ns.get('requestId') : null);

const setRequestId = id => {
  ns.set('requestId', id);
  return id;
};

module.exports = { ns, getRequestId, setRequestId };
