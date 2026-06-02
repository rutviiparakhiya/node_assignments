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

// Search
router.get("/search", noteController.searchByTitle);
router.get("/search/content", noteController.searchByContent);
router.get("/search/all", noteController.searchAll);

// Two Concepts Combined
router.get("/filter-sort", noteController.filterAndSort);
router.get("/filter-paginate", noteController.filterAndPaginate);
router.get("/sort-paginate", noteController.sortAndPaginate);
router.get("/search-filter", noteController.searchAndFilter);

// Three Concepts Combined
router.get("/search-sort-paginate", noteController.searchSortPaginate);
router.get("/filter-sort-paginate", noteController.filterSortPaginate);

// Master Endpoint
router.get("/query", noteController.masterQuery);

module.exports = router;
