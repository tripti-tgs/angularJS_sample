const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define(
  "User",
  {
    Id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    FirstName: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    LastName: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    Email: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    Gender: {
      type: DataTypes.TINYINT,
      allowNull: false,
    },
    MaritalStatus: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    Birthday: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    Hobbies: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    Photo: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    Salary: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    Address: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    City: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    Country: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    State: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    ZipCode: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    CreateDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    CreatedBy: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    Password: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
  },
  {
    tableName: "userdetails",
    timestamps: false,
  }
);

module.exports = User;
