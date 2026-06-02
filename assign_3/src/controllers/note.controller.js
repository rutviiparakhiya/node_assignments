const mongoose = require("mongoose");
const Note = require("../models/note.model");

// --- CRUD Endpoints ---

exports.createNote = async (req, res) => {
  try {
    const { title, content, category, isPinned } = req.body;
    if (!title || !content) {
      return res.status(400).json({ success: false, message: "Title and content are required", data: null });
    }
    const note = await Note.create({ title, content, category, isPinned });
    res.status(201).json({ success: true, message: "Note created successfully", data: note });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};

exports.createNotesBulk = async (req, res) => {
  try {
    const { notes } = req.body;
    if (!Array.isArray(notes) || notes.length === 0) {
      return res.status(400).json({ success: false, message: "notes array is required", data: null });
    }
    const createdNotes = await Note.insertMany(notes);
    res.status(201).json({ success: true, message: `${createdNotes.length} notes created successfully`, data: createdNotes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};

exports.getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find();
    res.status(200).json({ success: true, message: "Notes fetched successfully", count: notes.length, data: notes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};

exports.getNoteById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ success: false, message: "Invalid ID", data: null });
    const note = await Note.findById(id);
    if (!note) return res.status(404).json({ success: false, message: "Note not found", data: null });
    res.status(200).json({ success: true, message: "Note fetched successfully", data: note });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};

exports.replaceNote = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ success: false, message: "Invalid ID", data: null });
    const note = await Note.findByIdAndUpdate(id, req.body, { new: true, overwrite: true, runValidators: true });
    if (!note) return res.status(404).json({ success: false, message: "Note not found", data: null });
    res.status(200).json({ success: true, message: "Note replaced successfully", data: note });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};

exports.updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ success: false, message: "Invalid ID", data: null });
    const note = await Note.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!note) return res.status(404).json({ success: false, message: "Note not found", data: null });
    res.status(200).json({ success: true, message: "Note updated successfully", data: note });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};

exports.deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ success: false, message: "Invalid ID", data: null });
    const note = await Note.findByIdAndDelete(id);
    if (!note) return res.status(404).json({ success: false, message: "Note not found", data: null });
    res.status(200).json({ success: true, message: "Note deleted successfully", data: null });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};

exports.deleteNotesBulk = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) return res.status(400).json({ success: false, message: "IDs array required", data: null });
    const result = await Note.deleteMany({ _id: { $in: ids } });
    res.status(200).json({ success: true, message: `${result.deletedCount} notes deleted successfully`, data: null });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};

// --- Search Endpoints ---

// 9. GET /api/notes/search?title=...
exports.searchByTitle = async (req, res) => {
  try {
    const { title } = req.query;
    const notes = await Note.find({ title: { $regex: title, $options: "i" } });
    res.status(200).json({ success: true, message: "Search by title completed", count: notes.length, data: notes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};

// 10. GET /api/notes/search/content?content=...
exports.searchByContent = async (req, res) => {
  try {
    const { content } = req.query;
    const notes = await Note.find({ content: { $regex: content, $options: "i" } });
    res.status(200).json({ success: true, message: "Search by content completed", count: notes.length, data: notes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};

// 11. GET /api/notes/search/all?query=...
exports.searchAll = async (req, res) => {
  try {
    const { query } = req.query;
    const notes = await Note.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { content: { $regex: query, $options: "i" } },
      ],
    });
    res.status(200).json({ success: true, message: "Search in title and content completed", count: notes.length, data: notes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};

// --- Combined Queries ---

// 12. GET /api/notes/filter-sort
exports.filterAndSort = async (req, res) => {
  try {
    const { category, sortBy, order } = req.query;
    const query = category ? { category } : {};
    const sort = {};
    if (sortBy) sort[sortBy] = order === "desc" ? -1 : 1;
    const notes = await Note.find(query).sort(sort);
    res.status(200).json({ success: true, message: "Filter and Sort completed", count: notes.length, data: notes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};

// 13. GET /api/notes/filter-paginate
exports.filterAndPaginate = async (req, res) => {
  try {
    const { category, page = 1, limit = 5 } = req.query;
    const query = category ? { category } : {};
    const skip = (page - 1) * limit;
    const notes = await Note.find(query).skip(skip).limit(parseInt(limit));
    const total = await Note.countDocuments(query);
    res.status(200).json({ success: true, message: "Filter and Paginate completed", page, limit, total, data: notes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};

// 14. GET /api/notes/sort-paginate
exports.sortAndPaginate = async (req, res) => {
  try {
    const { sortBy, order, page = 1, limit = 5 } = req.query;
    const sort = {};
    if (sortBy) sort[sortBy] = order === "desc" ? -1 : 1;
    const skip = (page - 1) * limit;
    const notes = await Note.find().sort(sort).skip(skip).limit(parseInt(limit));
    const total = await Note.countDocuments();
    res.status(200).json({ success: true, message: "Sort and Paginate completed", page, limit, total, data: notes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};

// 15. GET /api/notes/search-filter
exports.searchAndFilter = async (req, res) => {
  try {
    const { query, category } = req.query;
    const findQuery = {
      $or: [
        { title: { $regex: query, $options: "i" } },
        { content: { $regex: query, $options: "i" } },
      ],
    };
    if (category) findQuery.category = category;
    const notes = await Note.find(findQuery);
    res.status(200).json({ success: true, message: "Search and Filter completed", count: notes.length, data: notes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};

// --- Three Concepts Combined ---

// 16. GET /api/notes/search-sort-paginate
exports.searchSortPaginate = async (req, res) => {
  try {
    const { query, sortBy, order, page = 1, limit = 5 } = req.query;
    const findQuery = {
      $or: [
        { title: { $regex: query, $options: "i" } },
        { content: { $regex: query, $options: "i" } },
      ],
    };
    const sort = {};
    if (sortBy) sort[sortBy] = order === "desc" ? -1 : 1;
    const skip = (page - 1) * limit;
    const notes = await Note.find(findQuery).sort(sort).skip(skip).limit(parseInt(limit));
    const total = await Note.countDocuments(findQuery);
    res.status(200).json({ success: true, message: "Search, Sort and Paginate completed", page, limit, total, data: notes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};

// 17. GET /api/notes/filter-sort-paginate
exports.filterSortPaginate = async (req, res) => {
  try {
    const { category, sortBy, order, page = 1, limit = 5 } = req.query;
    const findQuery = category ? { category } : {};
    const sort = {};
    if (sortBy) sort[sortBy] = order === "desc" ? -1 : 1;
    const skip = (page - 1) * limit;
    const notes = await Note.find(findQuery).sort(sort).skip(skip).limit(parseInt(limit));
    const total = await Note.countDocuments(findQuery);
    res.status(200).json({ success: true, message: "Filter, Sort and Paginate completed", page, limit, total, data: notes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};

// --- Master Query Endpoint ---

// 18. GET /api/notes/query
exports.masterQuery = async (req, res) => {
  try {
    const { search, category, isPinned, sortBy, order, page = 1, limit = 5 } = req.query;
    const findQuery = {};

    if (search) {
      findQuery.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }
    if (category) findQuery.category = category;
    if (isPinned) findQuery.isPinned = isPinned === "true";

    const sort = {};
    if (sortBy) sort[sortBy] = order === "desc" ? -1 : 1;
    else sort.createdAt = -1;

    const skip = (page - 1) * limit;
    const notes = await Note.find(findQuery).sort(sort).skip(skip).limit(parseInt(limit));
    const total = await Note.countDocuments(findQuery);

    res.status(200).json({
      success: true,
      message: "Master Query completed successfully",
      pagination: { page: parseInt(page), limit: parseInt(limit), total },
      data: notes,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};
