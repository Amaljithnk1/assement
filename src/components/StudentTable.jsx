import React, { useState, useEffect } from "react";
import { IoChevronDown } from "react-icons/io5";
import { BsPlusLg } from "react-icons/bs";
import { format } from "date-fns";
import AddStudentModal from "./AddStudentModal";
import { supabase } from "../lib/supabaseClient";

const StudentsTable = () => {
  const [selectedCohort, setSelectedCohort] = useState("AY 2024-25");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [students, setStudents] = useState([]);

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from("Student")
        .select(`
          id, name, cohort, dateJoined, lastLogin, status, 
          Course(id, name, icon)
        `)
        .eq("cohort", selectedCohort);

      if (error) {
        console.error("Error fetching students:", error);
      } else {
        setStudents(data || []);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [selectedCohort]);

  const handleAddStudent = async (newStudent) => {
    try {
      // Validate required fields
      if (!newStudent.name || !newStudent.cohort) {
        console.error("Name and cohort are required");
        return;
      }

      // First, insert the student
      const { data: studentData, error: studentError } = await supabase
        .from("Student")
        .insert([
          {
            name: newStudent.name,
            cohort: newStudent.cohort,
            dateJoined: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            status: newStudent.status || true // Default to true if not provided
          }
        ])
        .select()
        .single();

      if (studentError) {
        console.error("Error adding student:", studentError);
        return;
      }

      // Then, link the courses using the _CourseToStudent table
      if (newStudent.courses && newStudent.courses.length > 0) {
        const courseLinks = newStudent.courses.map(courseId => ({
          A: courseId,        // Course ID goes in column A
          B: studentData.id   // Student ID goes in column B
        }));

        const { error: linkError } = await supabase
          .from('_CourseToStudent')
          .insert(courseLinks);

        if (linkError) {
          console.error("Error linking courses:", linkError);
        }
      }

      // Close modal and refresh the table
      setIsModalOpen(false);
      fetchStudents();

    } catch (error) {
      console.error("Error adding student:", error);
    }
  };

  return (
    <div className="px-6 py-4 bg-white rounded-lg mt-[81px]">
      <div className="flex gap-4 mb-6">
        <select
          value={selectedCohort}
          onChange={(e) => setSelectedCohort(e.target.value)}
          className="flex items-center gap-2 px-4 py-2 bg-[#E9EDF1] rounded-lg text-[#3F526E] font-bold"
        >
          <option value="AY 2024-25">AY 2024-25</option>
          <option value="AY 2023-24">AY 2023-24</option>
        </select>

        <select
          className="flex items-center gap-2 px-4 py-2 bg-[#E9EDF1] rounded-lg text-[#3F526E] font-bold"
        >
          <option value="CBSE 9">CBSE 9</option>
          <option value="CBSE 10">CBSE 10</option>
        </select>

        <button
          onClick={() => setIsModalOpen(true)}
          className="ml-auto flex items-center gap-2 px-4 py-2 bg-[#E9EDF1] text-[#3F526E] rounded-lg font-bold"
        >
          <BsPlusLg />
          Add new Student
        </button>
      </div>
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 text-gray-600 font-medium">Student Name</th>
            <th className="text-left py-3 px-4 text-gray-600 font-medium">Cohort</th>
            <th className="text-left py-3 px-4 text-gray-600 font-medium">Courses</th>
            <th className="text-left py-3 px-4 text-gray-600 font-medium">Date Joined</th>
            <th className="text-left py-3 px-4 text-gray-600 font-medium">Last login</th>
            <th className="text-left py-3 px-4 text-gray-600 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id} className="border-b border-gray-100">
              <td className="py-4 px-4">{student.name}</td>
              <td className="py-4 px-4">{student.cohort}</td>
              <td className="py-4 px-4">
                <div className="flex gap-2">
                  {student.Course?.length > 0 ? (
                    student.Course.map((course) => (
                      <div key={course.id} className="flex items-center gap-2 bg-gray-100 px-2 py-1 rounded">
                        <img src={course.icon} alt={course.name} className="w-6 h-6" />
                        <span className="text-sm">{course.name}</span>
                      </div>
                    ))
                  ) : (
                    <span>No courses assigned</span>
                  )}
                </div>
              </td>
              <td className="py-4 px-4">
                {format(new Date(student.dateJoined), "dd. MMM. yyyy")}
              </td>
              <td className="py-4 px-4">
                {format(new Date(student.lastLogin), "dd. MMM. yyyy hh:mm a")}
              </td>
              <td className="py-4 px-4">
                <div
                  className={`w-2 h-2 rounded-full ${student.status ? "bg-green-500" : "bg-red-500"}`}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <AddStudentModal
        open={isModalOpen}
        setOpen={setIsModalOpen}
        addStudent={handleAddStudent}
        defaultCohort={selectedCohort} 
      />
    </div>
  );
};

export default StudentsTable;