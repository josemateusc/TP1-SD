const mongoose = require("mongoose");
const dbUrl = process.env.DB_URL || "mongodb://localhost/vidly";
const db2Url = process.env.DB2_URL || "mongodb://localhost/vidly2";
module.exports = { dbUrl, db2Url };
