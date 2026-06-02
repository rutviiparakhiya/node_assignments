const express = require("express");
const router = express.Router();
const noteController = require("../controllers/note.controller");

// POST routes
router.post("/", noteController.createNote);
router.post("/bulk", noteController.createNotesBulk);

// GET routes
router.get("/", noteController.getAllNotes);
router.get("/:id", noteController.getNoteById);

// PUT/PATCH routes
router.put("/:id", noteController.replaceNote);
router.patch("/:id", noteController.updateNote);

// DELETE routes
router.delete("/bulk", noteController.deleteNotesBulk);
router.delete("/:id", noteController.deleteNote);

module.exports = router;
