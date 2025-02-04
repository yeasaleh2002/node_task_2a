const { Sequelize } = require("sequelize");
const config = require("../config/database");

const env = process.env.NODE_ENV || "development";
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
  }
);

const models = {
  Analytics: require("./Analytics")(sequelize),
  Chat: require("./Chat")(sequelize),
  Image: require("./Image")(sequelize),
  Photo: require("./photos")(sequelize),
  Time: require("./time")(sequelize),
  Airport: require("./airport")(sequelize),
  User: require("./User")(sequelize),
  StripeSubscription: require("./StripeSubscription")(sequelize),
};

module.exports = {
  sequelize,
  ...models,
};
