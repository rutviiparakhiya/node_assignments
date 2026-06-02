const mongoose = require("mongoose");
const Note = require("../models/note.model");

// --- CRUD Endpoints ---

// 1. POST /api/notes -> Create single note
exports.createNote = async (req, res) => {
  try {
    const { title, content, category, isPinned } = req.body;
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required",
        data: null,
      });
    }
    const note = await Note.create({ title, content, category, isPinned });
    res.status(201).json({
      success: true,
      message: "Note created successfully",
      data: note,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};

// 2. POST /api/notes/bulk -> Create multiple notes
exports.createNotesBulk = async (req, res) => {
  try {
    const { notes } = req.body;
    if (!Array.isArray(notes) || notes.length === 0) {
      return res.status(400).json({
        success: false,
        message: "notes array is required and cannot be empty",
        data: null,
      });
    }
    const createdNotes = await Note.insertMany(notes);
    res.status(201).json({
      success: true,
      message: `${createdNotes.length} notes created successfully`,
      data: createdNotes,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};

// 3. GET /api/notes -> Get all notes
exports.getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find();
    res.status(200).json({
      success: true,
      message: "Notes fetched successfully",
      count: notes.length,
      data: notes,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};

// 4. GET /api/notes/:id -> Get single note by ID
exports.getNoteById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid ID format", data: null });
    }
    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).json({ success: false, message: "Note not found", data: null });
    }
    res.status(200).json({ success: true, message: "Note fetched successfully", data: note });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};

// 5. PUT /api/notes/:id -> Full replacement
exports.replaceNote = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid ID format", data: null });
    }
    const note = await Note.findByIdAndUpdate(id, req.body, {
      new: true,
      overwrite: true,
      runValidators: true,
    });
    if (!note) {
      return res.status(404).json({ success: false, message: "Note not found", data: null });
    }
    res.status(200).json({ success: true, message: "Note replaced successfully", data: note });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};

// 6. PATCH /api/notes/:id -> Partial update
exports.updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid ID format", data: null });
    }
    const note = await Note.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!note) {
      return res.status(404).json({ success: false, message: "Note not found", data: null });
    }
    res.status(200).json({ success: true, message: "Note updated successfully", data: note });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};

// 7. DELETE /api/notes/:id -> Delete single note
exports.deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid ID format", data: null });
    }
    const note = await Note.findByIdAndDelete(id);
    if (!note) {
      return res.status(404).json({ success: false, message: "Note not found", data: null });
    }
    res.status(200).json({ success: true, message: "Note deleted successfully", data: null });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};

// 8. DELETE /api/notes/bulk -> Delete multiple notes
exports.deleteNotesBulk = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: "IDs array is required", data: null });
    }
    const result = await Note.deleteMany({ _id: { $in: ids } });
    res.status(200).json({
      success: true,
      message: `${result.deletedCount} notes deleted successfully`,
      data: null,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};

// --- Route Parameters ---

// 9. GET /api/notes/category/:category
exports.getNotesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const notes = await Note.find({ category });
    res.status(200).json({
      success: true,
      message: `Notes for category: ${category} fetched successfully`,
      count: notes.length,
      data: notes,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};

// 10. GET /api/notes/status/:isPinned
exports.getNotesByPinnedStatus = async (req, res) => {
  try {
    const isPinned = req.params.isPinned === "true";
    const notes = await Note.find({ isPinned });
    res.status(200).json({
      success: true,
      message: `Notes with isPinned: ${isPinned} fetched successfully`,
      count: notes.length,
      data: notes,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};

// 11. GET /api/notes/:id/summary
exports.getNoteSummary = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid ID format", data: null });
    }
    const note = await Note.findById(id).select("title category isPinned");
    if (!note) {
      return res.status(404).json({ success: false, message: "Note not found", data: null });
    }
    res.status(200).json({ success: true, message: "Note summary fetched successfully", data: note });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};

// --- Query Parameters ---

// 12. GET /api/notes/filter
exports.filterNotes = async (req, res) => {
  try {
    const { category, isPinned } = req.query;
    const query = {};
    if (category) query.category = category;
    if (isPinned) query.isPinned = isPinned === "true";

    const notes = await Note.find(query);
    res.status(200).json({
      success: true,
      message: "Filtered notes fetched successfully",
      count: notes.length,
      data: notes,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};

// 13. GET /api/notes/filter/pinned
exports.filterPinnedNotes = async (req, res) => {
  try {
    const { isPinned } = req.query;
    const notes = await Note.find({ isPinned: isPinned === "true" });
    res.status(200).json({
      success: true,
      message: "Pinned/Unpinned notes fetched successfully",
      count: notes.length,
      data: notes,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};

// 14. GET /api/notes/filter/category
exports.filterNotesByCategoryQuery = async (req, res) => {
  try {
    const { category } = req.query;
    const notes = await Note.find({ category });
    res.status(200).json({
      success: true,
      message: "Category filtered notes fetched successfully",
      count: notes.length,
      data: notes,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};

// 15. GET /api/notes/filter/date-range
exports.filterNotesByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = {};
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    const notes = await Note.find(query);
    res.status(200).json({
      success: true,
      message: "Notes in date range fetched successfully",
      count: notes.length,
      data: notes,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};

// --- Pagination ---

// 16. GET /api/notes/paginate
exports.paginateNotes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const notes = await Note.find().skip(skip).limit(limit);
    const total = await Note.countDocuments();

    res.status(200).json({
      success: true,
      message: "Paginated notes fetched successfully",
      page,
      limit,
      total,
      data: notes,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};

// 17. GET /api/notes/paginate/category/:category
exports.paginateNotesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const notes = await Note.find({ category }).skip(skip).limit(limit);
    const total = await Note.countDocuments({ category });

    res.status(200).json({
      success: true,
      message: `Paginated notes for category: ${category} fetched successfully`,
      page,
      limit,
      total,
      data: notes,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};

// --- Sorting ---

// 18. GET /api/notes/sort
exports.sortNotes = async (req, res) => {
  try {
    const { sortBy, order } = req.query;
    const sortOrder = order === "desc" ? -1 : 1;
    const sortQuery = {};
    if (sortBy) sortQuery[sortBy] = sortOrder;
    else sortQuery.createdAt = -1; // Default sort

    const notes = await Note.find().sort(sortQuery);
    res.status(200).json({
      success: true,
      message: "Sorted notes fetched successfully",
      count: notes.length,
      data: notes,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};

// 19. GET /api/notes/sort/pinned
exports.sortPinnedNotes = async (req, res) => {
  try {
    const { order } = req.query;
    const sortOrder = order === "desc" ? -1 : 1;
    const notes = await Note.find().sort({ isPinned: sortOrder });
    res.status(200).json({
      success: true,
      message: "Notes sorted by pinned status fetched successfully",
      count: notes.length,
      data: notes,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};
