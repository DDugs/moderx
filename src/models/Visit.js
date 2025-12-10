const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Patient = require('./Patient');

const Visit = sequelize.define('Visit', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  patientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Patient,
      key: 'id'
    }
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  doctorName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  diagnosis: {
    type: DataTypes.STRING,
    allowNull: true
  },
  prescription: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('active', 'archived'),
    defaultValue: 'active'
  }
}, {
  timestamps: true
});

// Define relationships
Patient.hasMany(Visit, { foreignKey: 'patientId', as: 'visits' });
Visit.belongsTo(Patient, { foreignKey: 'patientId', as: 'patient' });

module.exports = Visit;
