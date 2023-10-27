const db = require("./db");

module.exports = {
  mongodb: {
    // We'll use the dbUrl as the main connection point
    url: db.dbUrl,
    databaseName: "vidly", // Using the default database name
    options: {
      useNewUrlParser: true, // removes a deprecation warning when connecting
      useUnifiedTopology: true, // removes a deprecating warning when connecting
    },
  },
  migrationsDir: "migrations",
  changelogCollectionName: "changelog",
  migrationFileExtension: ".js",
};
