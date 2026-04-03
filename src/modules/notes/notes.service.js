import mongoose from "mongoose";
import { NoteModel } from "../../DB/model/note.model.js";

export const createNoteService = async (userId, data) => {
  const { title, content } = data;

  const note = new NoteModel({
    title,
    content,
    userId,
  });

  await note.save();
  return { status: 201, message: "Note created" };
};

export const updateNoteService = async (noteId, userId, data) => {
  const { title, content } = data;

  const note = await NoteModel.findById(noteId);
  if (!note) return { status: 404, message: "Note not found" };

  if (note.userId.toString() !== userId) {
    return { status: 403, message: "You are not the owner" };
  }

  const updatedNote = await NoteModel.findByIdAndUpdate(
    noteId,
    { title, content },
    { new: true, runValidators: true }
  );

  return { status: 200, message: "updated", note: updatedNote };
};

export const replaceNoteService = async (noteId, userId, data) => {
  const { title, content } = data;

  const note = await NoteModel.findById(noteId);
  if (!note) return { status: 404, message: "Note not found" };

  if (note.userId.toString() !== userId) {
    return { status: 403, message: "You are not the owner" };
  }

  const replacedNote = await NoteModel.findOneAndReplace(
    { _id: noteId },
    { title, content, userId },
    { new: true, runValidators: true }
  );

  return { status: 200, note: replacedNote };
};

export const updateAllNotesTitleService = async (userId, title) => {
  const result = await NoteModel.updateMany(
    { userId },
    { title },
    { runValidators: true }
  );

  if (result.matchedCount === 0) {
    return { status: 404, message: "No note found" };
  }

  return { status: 200, message: "All notes updated" };
};

export const deleteNoteService = async (noteId, userId) => {
  const note = await NoteModel.findOneAndDelete({ _id: noteId, userId });

  if (!note) {
    // Handling both not found and not authorized cases based on query
    const exists = await NoteModel.findById(noteId);
    if(exists) return { status: 403, message: "You are not the owner" };
    return { status: 404, message: "Note not found" };
  }

  return { status: 200, message: "Note deleted", note };
};

export const getAllNotesService = async (userId, query) => {
  let { page, limit } = query;

  page = parseInt(page) || 1;
  limit = parseInt(limit) || 5;
  const skip = (page - 1) * limit;

  // sorted by "createdAt" in descending order.[cite: 6]
  const notes = await NoteModel.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);

  return { status: 200, notes };
};

export const getNoteByIdService = async (noteId, userId) => {
  const note = await NoteModel.findById(noteId);
  
  if (!note) return { status: 404, message: "Note not found" };
  if (note.userId.toString() !== userId) return { status: 403, message: "You are not the owner" };
  
  return { status: 200, note };
};

export const getNoteByContentService = async (userId, content) => {
  const note = await NoteModel.findOne({
    userId,
    content: { $regex: content, $options: "i" },
  });
  if (!note) return { status: 404, message: "No note found" };
  return { status: 200, note };
};

export const getNotesWithUserService = async (userId) => {
  const notes = await NoteModel.find({ userId })
    .populate("userId", "email -_id")
    .select("title userId createdAt");
  return { status: 200, notes };
};

export const aggregateNotesService = async (userId, title) => {
  const pipeline = [
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
  ];

  if (title) {
    pipeline.push({ $match: { title: { $regex: title, $options: "i" } } });
  }

  pipeline.push(
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    {
      $project: {
        title: 1,
        userId: 1,
        createdAt: 1,
        "user.name": 1,
        "user.email": 1,
      },
    }
  );

  const notes = await NoteModel.aggregate(pipeline);
  return { status: 200, notes };
};

export const deleteAllNotesService = async (userId) => {
  await NoteModel.deleteMany({ userId });
  return { status: 200, message: "Deleted" };
};  