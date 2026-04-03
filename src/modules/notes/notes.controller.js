import { Router } from "express";
import * as noteService from "./notes.service.js";
import { auth } from "../../middleware/auth.middleware.js";

const router = Router();

// B- Note APIs
// 1. Create a Single Note (Get the id for the logged-in user (userId) from the token not the body)[cite: 6]
router.post("/", auth, async (req, res, next) => {
  try {
    const result = await noteService.createNoteService(
      req.user.userId,
      req.body
    );
    return res.status(result.status).json({ message: result.message });
  } catch (error) {
    next(error);
  }
});

// 4. Updates the title of all notes created by a logged-in user.[cite: 6]
router.patch("/all", auth, async (req, res, next) => {
  try {
    const result = await noteService.updateAllNotesTitleService(
      req.user.userId,
      req.body.title
    );
    return res.status(result.status).json({ message: result.message });
  } catch (error) {
    next(error);
  }
});

// 6. Retrieve a paginated list of notes for the logged-in user, sorted by "createdAt" in descending order.[cite: 6]
router.get("/paginate-sort", auth, async (req, res, next) => {
  try {
    const result = await noteService.getAllNotesService(
      req.user.userId,
      req.query
    );
    return res.status(result.status).json(result.notes);
  } catch (error) {
    next(error);
  }
});

// 8. Get a note for logged-in user by its content.[cite: 6]
router.get("/note-by-content", auth, async (req, res, next) => {
  try {
    const result = await noteService.getNoteByContentService(
      req.user.userId,
      req.query.content
    );
    return res
      .status(result.status)
      .json(result.note || { message: result.message });
  } catch (error) {
    next(error);
  }
});

// 9. Retrieves all notes for the logged-in user with user information...[cite: 6]
router.get("/note-with-user", auth, async (req, res, next) => {
  try {
    const result = await noteService.getNotesWithUserService(req.user.userId);
    return res.status(result.status).json(result.notes);
  } catch (error) {
    next(error);
  }
});

// 10. Using aggregation, retrieves all notes for the logged-in user with user information (name and email) and allow searching notes by the title.[cite: 6]
router.get("/aggregate", auth, async (req, res, next) => {
  try {
    const result = await noteService.aggregateNotesService(
      req.user.userId,
      req.query.title
    );
    return res.status(result.status).json(result.notes);
  } catch (error) {
    next(error);
  }
});

// 11. Delete all notes for the logged-in user.[cite: 6]
router.delete("/", auth, async (req, res, next) => {
  try {
    const result = await noteService.deleteAllNotesService(req.user.userId);
    return res.status(result.status).json({ message: result.message });
  } catch (error) {
    next(error);
  }
});

// 3. Replace the entire note document with the new data provided in the request body.[cite: 6]
router.put("/replace/:noteId", auth, async (req, res, next) => {
  try {
    const result = await noteService.replaceNoteService(
      req.params.noteId,
      req.user.userId,
      req.body
    );
    if(result.note) return res.status(result.status).json({ message: "Note replaced", note: result.note });
    return res.status(result.status).json({ message: result.message });
  } catch (error) {
    next(error);
  }
});

// 2. Update a single Note by its id and return the updated note.[cite: 6]
router.patch("/:noteId", auth, async (req, res, next) => {
  try {
    const result = await noteService.updateNoteService(
      req.params.noteId,
      req.user.userId,
      req.body
    );
    if(result.note) return res.status(result.status).json({ message: result.message, note: result.note });
    return res.status(result.status).json({ message: result.message });
  } catch (error) {
    next(error);
  }
});

// 5. Delete a single Note by its id and return the deleted note.[cite: 6]
router.delete("/:noteId", auth, async (req, res, next) => {
  try {
    const result = await noteService.deleteNoteService(
      req.params.noteId,
      req.user.userId
    );
    return res.status(result.status).json({ message: result.message, note: result.note });
  } catch (error) {
    next(error);
  }
});

// 7. Get a note by its id. (Only the owner of the note can make this operation)[cite: 6]
router.get("/:id", auth, async (req, res, next) => {
  try {
    const result = await noteService.getNoteByIdService(
      req.params.id,
      req.user.userId
    );
    return res
      .status(result.status)
      .json(result.note || { message: result.message });
  } catch (error) {
    next(error);
  }
});

export default router;