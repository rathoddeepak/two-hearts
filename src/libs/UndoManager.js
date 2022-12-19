var UndoManager = require('./UM'); // require the lib from node_modules
var undoManager = new UndoManager(5);
module.exports = undoManager;