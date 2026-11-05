const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount cannot be negative'],
  },
  type: {
    type: String,
    required: [true, 'Type is required'],
    enum: ['income', 'expense'],
    default: 'income',
  },
  role: {
    type: String,
    required: [true, 'Role / Designation is required'],
    enum: [
      'director',
      'head',
      'core',
      'general',
      'student',
      'teacher',
      'staff',
    ],
    default: 'general',
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'online', 'bank', 'other'],
    default: 'cash',
  },
  description: {
    type: String,
    trim: true,
    default: '',
  },
}, { timestamps: true });

module.exports = mongoose.model('Record', recordSchema);
