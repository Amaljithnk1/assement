import { create } from 'zustand';

export const useStore = create((set) => ({
  students: [],
  loading: false,
  error: null,

  // Fetch all students
  fetchStudents: async () => {
    set({ loading: true });
    try {
      const response = await fetch('/api/students');
      const data = await response.json();
      set({ students: data, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch students', loading: false });
    }
  },

  // Add a new student
  addStudent: async (studentData) => {
    try {
      const response = await fetch('/api/addStudent', { // Update endpoint to /api/addStudent
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentData),
      });
      const newStudent = await response.json();
      set((state) => ({
        students: [...state.students, newStudent],
      }));
    } catch (error) {
      set({ error: 'Failed to add student' });
    }
  },

  // Update an existing student
  updateStudent: async (id, data) => {
    try {
      const response = await fetch(`/api/students/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const updatedStudent = await response.json();
      set((state) => ({
        students: state.students.map((student) =>
          student.id === id ? updatedStudent : student
        ),
      }));
    } catch (error) {
      set({ error: 'Failed to update student' });
    }
  },

  // Delete a student
  deleteStudent: async (id) => {
    try {
      await fetch(`/api/students/${id}`, { method: 'DELETE' });
      set((state) => ({
        students: state.students.filter((student) => student.id !== id),
      }));
    } catch (error) {
      set({ error: 'Failed to delete student' });
    }
  },
}));
