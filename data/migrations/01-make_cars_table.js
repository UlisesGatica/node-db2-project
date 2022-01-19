exports.up = async function (knex) {
  await knex.schema.createTable("cars", (table) => {
    table.increments();
    table.text("vin", 19).unique().notNullable();
    table.text("make", 19).notNullable();
    table.text("model", 50).notNullable();
    table.decimal("mileage").notNullable();
    table.text("title", 19);
    table.text("transmission", 10);
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("cars");
};