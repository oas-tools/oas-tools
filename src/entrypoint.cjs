const oasOld = import('./index_old.js');
const oasNew = import('./index.js');

function initialize() {
    if (arguments.length === 3) {
        oasOld.then(m => m.initialize(arguments[0], arguments[1], arguments[2]));
    } else {
        return oasNew.then(m => m.initialize(arguments[0], arguments[1]));
    }
}

function use() {
    oasNew.then(m => m.use(arguments[0], arguments[1], arguments[2]))
}

function configure() {
    oasOld.then(m => m.configure(arguments[0]));
}

module.exports = {
    initialize,
    configure,
    use
}