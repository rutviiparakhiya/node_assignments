const express = require("express");
const router = express.Router();
const noteController = require("../controllers/note.controller");

// CRUD
router.post("/", noteController.createNote);
router.post("/bulk", noteController.createNotesBulk);
router.get("/", noteController.getAllNotes);
router.get("/:id", noteController.getNoteById);
router.put("/:id", noteController.replaceNote);
router.patch("/:id", noteController.updateNote);
router.delete("/bulk", noteController.deleteNotesBulk);
router.delete("/:id", noteController.deleteNote);

// Route Parameters
router.get("/category/:category", noteController.getNotesByCategory);
router.get("/status/:isPinned", noteController.getNotesByPinnedStatus);
router.get("/:id/summary", noteController.getNoteSummary);

// Query Parameters
router.get("/filter", noteController.filterNotes);
router.get("/filter/pinned", noteController.filterPinnedNotes);
router.get("/filter/category", noteController.filterNotesByCategoryQuery);
router.get("/filter/date-range", noteController.filterNotesByDateRange);

// Pagination
router.get("/paginate", noteController.paginateNotes);
router.get("/paginate/category/:category", noteController.paginateNotesByCategory);

// Sorting
router.get("/sort", noteController.sortNotes);
router.get("/sort/pinned", noteController.sortPinnedNotes);

module.exports = router;
