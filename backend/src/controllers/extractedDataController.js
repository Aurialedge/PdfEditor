const ExtractedData = require('../models/ExtractedData');

// Create a new extracted data entry
exports.createExtractedData = async (req, res) => {
  try {
    const { title, summary, keyPoints, date, author, originalText, metadata } = req.body;
    
    const newData = new ExtractedData({
      title,
      summary,
      keyPoints: keyPoints || [],
      date: date || new Date(),
      author: author || 'Unknown',
      originalText,
      metadata: metadata || {}
    });

    const savedData = await newData.save();
    res.status(201).json({
      success: true,
      data: savedData
    });
  } catch (error) {
    console.error('Error creating extracted data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create extracted data',
      error: error.message
    });
  }
};

// Get all extracted data with pagination and search
exports.getAllExtractedData = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const skip = (page - 1) * limit;
    
    let query = {};
    if (search) {
      query = { $text: { $search: search } };
    }

    const data = await ExtractedData.find(query)
      .sort({ createdAt: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit));

    const total = await ExtractedData.countDocuments(query);

    res.status(200).json({
      success: true,
      data,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching extracted data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch extracted data',
      error: error.message
    });
  }
};

// Get a single extracted data entry by ID
exports.getExtractedDataById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await ExtractedData.findById(id);
    
    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Extracted data not found'
      });
    }

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error fetching extracted data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch extracted data',
      error: error.message
    });
  }
};

// Update an extracted data entry
exports.updateExtractedData = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, summary, keyPoints, date, author, originalText, metadata } = req.body;

    const updatedData = await ExtractedData.findByIdAndUpdate(
      id,
      {
        title,
        summary,
        keyPoints,
        date,
        author,
        originalText,
        metadata,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    if (!updatedData) {
      return res.status(404).json({
        success: false,
        message: 'Extracted data not found'
      });
    }

    res.status(200).json({
      success: true,
      data: updatedData
    });
  } catch (error) {
    console.error('Error updating extracted data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update extracted data',
      error: error.message
    });
  }
};

// Delete an extracted data entry
exports.deleteExtractedData = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedData = await ExtractedData.findByIdAndDelete(id);

    if (!deletedData) {
      return res.status(404).json({
        success: false,
        message: 'Extracted data not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Extracted data deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting extracted data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete extracted data',
      error: error.message
    });
  }
};
