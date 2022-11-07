const Datastore = require("nedb");

const db = new Datastore();
console.log("Using nedb in-memory database")

module.exports = db;
