const express = require('express');
const router = express.Router();
const { getRecords, createRecord, updateRecord, deleteRecord } = require('../controllers/recordController');
const { protect } = require('../middleware/auth');

// All routes protected
router.use(protect);

router.get('/', getRecords);
router.post('/', createRecord);
router.put('/:id', updateRecord);
router.delete('/:id', deleteRecord);

module.exports = router;

