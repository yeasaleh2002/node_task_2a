const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define(
    "User",
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      secret: {
        type: DataTypes.STRING, 
        allowNull: true,
      },
    },
    {
      timestamps: false,
    }
  );
};
