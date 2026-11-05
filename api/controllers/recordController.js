const Record = require('../models/Record');
const connectDB = require('../config/db');

// @route   GET /api/records
const getRecords = async (req, res) => {
  try {
    await connectDB();
    const { role, type, search } = req.query;
    let filter = {};
    if (role && role !== 'all') filter.role = role;
    if (type && type !== 'all') filter.type = type;
    if (search) filter.name = { $regex: search, $options: 'i' };

    const records = await Record.find(filter).sort({ createdAt: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route   POST /api/records
const createRecord = async (req, res) => {
  try {
    await connectDB();
    const { name, amount, role, type = 'income', paymentMethod = 'cash', description } = req.body;

    if (!name || amount === undefined || !role) {
      return res.status(400).json({ message: 'Name, amount aur role zaroori hain' });
    }

    const record = await Record.create({
      name,
      amount: Number(amount),
      role,
      type: type === 'expense' ? 'expense' : 'income',
      paymentMethod,
      description,
    });
    res.status(201).json(record);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route   PUT /api/records/:id
const updateRecord = async (req, res) => {
  try {
    await connectDB();
    const { name, amount, role, type, paymentMethod, description } = req.body;

    const record = await Record.findByIdAndUpdate(
      req.params.id,
      {
        name,
        amount: Number(amount),
        role,
        type: type === 'expense' ? 'expense' : 'income',
        paymentMethod: paymentMethod || 'cash',
        description,
      },
      { new: true, runValidators: true }
    );

    if (!record) {
      return res.status(404).json({ message: 'Record nahi mila' });
    }

    res.json(record);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route   DELETE /api/records/:id
const deleteRecord = async (req, res) => {
  try {
    await connectDB();
    const record = await Record.findByIdAndDelete(req.params.id);

    if (!record) {
      return res.status(404).json({ message: 'Record nahi mila' });
    }

    res.json({ message: 'Record delete ho gaya', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getRecords, createRecord, updateRecord, deleteRecord };
