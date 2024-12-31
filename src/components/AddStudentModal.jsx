import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { supabase } from '../lib/supabaseClient';

const AddStudentModal = ({ open, setOpen, addStudent, defaultCohort }) => {
  const [name, setName] = useState('');
  const [cohort, setCohort] = useState(defaultCohort || 'AY 2024-25');
  const [grade, setGrade] = useState('CBSE 9');
  const [courses, setCourses] = useState([]);
  const [status, setStatus] = useState(true);

  useEffect(() => {
    if (open) {
      setCohort(defaultCohort || 'AY 2024-25');
      setGrade('CBSE 9');
      setCourses([]);
    }
  }, [open, defaultCohort]);

  const cohortOptions = ['AY 2024-25', 'AY 2023-24'];
  const gradeOptions = ['CBSE 9', 'CBSE 10'];

  const getCourseOptions = (selectedGrade) => {
    if (selectedGrade === 'CBSE 9') {
      return [
        { id: '1', name: 'CBSE 9 Science', icon: '/cbse09science.svg' },
        { id: '2', name: 'CBSE 9 Math', icon: '/cbse09maths.svg' },
      ];
    } else {
      return [
        { id: '3', name: 'CBSE 10 Science', icon: '/cbse10science.svg' },
        { id: '4', name: 'CBSE 10 Math', icon: '/cbse10maths.svg' },
      ];
    }
  };

  const handleGradeChange = (newGrade) => {
    setGrade(newGrade);
    setCourses([]); // Reset selected courses when grade changes
  };

  const handleCourseToggle = (courseId) => {
    setCourses((prevCourses) =>
      prevCourses.includes(courseId)
        ? prevCourses.filter((id) => id !== courseId)
        : [...prevCourses, courseId]
    );
  };

  const handleSubmit = async () => {
    if (!name || courses.length === 0) {
      alert('Please fill out all required fields.');
      return;
    }

    try {
      // Insert the student
      const { data: studentData, error: studentError } = await supabase
        .from('Student')
        .insert([{
          id: crypto.randomUUID(),
          name,
          cohort,
          status,
          dateJoined: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        }])
        .select('id')
        .single();

      if (studentError) {
        console.error('Error adding student:', studentError);
        alert('Failed to add student. Please try again.');
        return;
      }

      // Link selected courses to the student
      const courseLinks = courses.map((courseId) => ({
        A: courseId, // Using existing course IDs (1,2,3,4)
        B: studentData.id,
      }));

      const { error: linkError } = await supabase
        .from('_CourseToStudent')
        .insert(courseLinks);

      if (linkError) {
        console.error('Error linking courses to student:', linkError);
        alert('Failed to link selected courses. Please try again.');
        return;
      }

      addStudent(studentData);

      // Reset the form
      setOpen(false);
      setName('');
      setCohort('AY 2024-25');
      setGrade('CBSE 9');
      setCourses([]);
      setStatus(true);
    } catch (error) {
      console.error('Unexpected error:', error);
      alert('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-white rounded-lg p-6 space-y-6 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-gray-900">Add New Student</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter student name"
              className="bg-gray-100 border-gray-300 text-gray-900"
            />
          </div>
          <div>
            <Label htmlFor="cohort">Cohort</Label>
            <select
              id="cohort"
              value={cohort}
              onChange={(e) => setCohort(e.target.value)}
              className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500 text-gray-900"
            >
              {cohortOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="grade">Grade</Label>
            <select
              id="grade"
              value={grade}
              onChange={(e) => handleGradeChange(e.target.value)}
              className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500 text-gray-900"
            >
              {gradeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label>Courses</Label>
            <div className="space-y-2">
              {getCourseOptions(grade).map((course) => (
                <div key={course.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={course.name}
                    checked={courses.includes(course.id)}
                    onCheckedChange={() => handleCourseToggle(course.id)}
                  />
                  <Label htmlFor={course.name}>{course.name}</Label>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="status"
              checked={status}
              onCheckedChange={() => setStatus(!status)}
            />
            <Label htmlFor="status">{status ? 'Active' : 'Inactive'}</Label>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Add Student</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddStudentModal;