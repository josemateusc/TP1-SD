module.exports = {
  async up(db, client) {
    // Populate the default database (db1)
    await db
      .collection("movies")
      .insertMany([
        { title: "Avatar" },
        { title: "Star Wars" },
        { title: "Terminator" },
        { title: "Titanic" },
      ]);

    // Populate the second database (db2)
    const db2 = client.db("vidly2");
    await db2
      .collection("movies")
      .insertMany([
        { title: "Avatar" },
        { title: "Avengers" },
        { title: "Terminator" },
        { title: "Godfather" },
      ]);
  },

  async down(db, client) {
    // Revert the default database (db1)
    await db.collection("movies").deleteMany({
      title: {
        $in: ["Avatar", "Star Wars", "Terminator", "Titanic"],
      },
    });

    // Revert the second database (db2)
    const db2 = client.db("vidly2");
    await db2.collection("movies").deleteMany({
      title: {
        $in: ["Avatar", "Avengers", "Terminator", "Godfather"],
      },
    });
  },
};
