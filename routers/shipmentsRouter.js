const express = require('express');
const { shipmentsController } = require('../controllers');
const router = express.Router();

router.get('/get', shipmentsController.getData);
router.post('/input', shipmentsController.input);
router.patch('/update', shipmentsController.update);
router.patch('/update-status', shipmentsController.updateStatus);
router.delete('/delete/:resi', shipmentsController.delete)

module.exports = router