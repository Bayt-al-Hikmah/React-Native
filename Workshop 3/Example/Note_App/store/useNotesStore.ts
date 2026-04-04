import { create } from "zustand";

export const useNotesStore = create((set) => ({
  notes: [],

  addNote: (title, body) =>set((state) => ({
	notes: [
        ...state.notes,
        {
          id: Date.now().toString(),
          title: title,
          body: body,
        },
      ],
    })),

  deleteNote: (id) =>
    set((state) => ({
      notes: state.notes.filter((note) => note.id !== id),
    })),
}));