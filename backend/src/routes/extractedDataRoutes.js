const express = require('express');
const router = express.Router();
const extractedDataController = require('../controllers/extractedDataController');

// Create a new extracted data entry
router.post('/', extractedDataController.createExtractedData);

// Get all extracted data with pagination and search
router.get('/', extractedDataController.getAllExtractedData);

// Get a single extracted data entry by ID
router.get('/:id', extractedDataController.getExtractedDataById);

// Update an extracted data entry
router.put('/:id', extractedDataController.updateExtractedData);

// Delete an extracted data entry
router.delete('/:id', extractedDataController.deleteExtractedData);

module.exports = router;
