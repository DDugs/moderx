const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Patient = sequelize.define('Patient', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: false
  },
  contactInfo: {
    type: DataTypes.STRING,
    allowNull: true
  },
  medicalHistory: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  version: true, // Enable optimistic locking
  timestamps: true
});

module.exports = Patient;
