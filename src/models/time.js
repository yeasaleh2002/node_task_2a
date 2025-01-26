const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Time', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    london: {
      type: DataTypes.STRING,
      allowNull: false
    },
    est: {
      type: DataTypes.STRING,
      allowNull: false
    },
    nigeria: {
      type: DataTypes.STRING,
      allowNull: false
    },
    pakistan: {
      type: DataTypes.STRING,
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      onUpdate: DataTypes.NOW
    }
  });
};
