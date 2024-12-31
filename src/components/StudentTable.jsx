import React, { useState, useEffect } from "react";
import { IoChevronDown } from "react-icons/io5";
import { BsPlusLg } from "react-icons/bs";
import { format } from "date-fns";
import AddStudentModal from "./AddStudentModal";
import { supabase } from "../lib/supabaseClient";

const StudentsTable = () => {
  const [selectedCohort, setSelectedCohort] = useState("AY 2024-25");
  const [selectedGrade, setSelectedGrade] = useState("CBSE 9");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [students, setStudents] = useState([]);

  const fetchStudents = async () => {
    try {
      let { data, error } = await supabase
        .from("Student")
        .select(`
          id, name, cohort, dateJoined, lastLogin, status, 
          Course(id, name, icon)
        `)
        .eq("cohort", selectedCohort);

      if (error) {
        console.error("Error fetching students:", error);
        return;
      }

      // Filter courses based on selected grade
      const filteredData = data.map(student => ({
        ...student,
        Course: student.Course?.filter(course => {
          if (selectedGrade === "CBSE 9") {
            return course.id === "1" || course.id === "2";
          } else {
            return course.id === "3" || course.id === "4";
          }
        })
      }));

      // Only show students who have courses in the selected grade
      const studentsWithCourses = filteredData.filter(student => 
        student.Course && student.Course.length > 0
      );

      setStudents(studentsWithCourses || []);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [selectedCohort, selectedGrade]);

  const handleAddStudent = async (studentData) => {
    try {
      // Fetch the complete student data including courses
      const { data: newStudentData, error: fetchError } = await supabase
        .from("Student")
        .select(`
          id, name, cohort, dateJoined, lastLogin, status,
          Course(id, name, icon)
        `)
        .eq("id", studentData.id)
        .single();

      if (fetchError) {
        console.error("Error fetching new student data:", fetchError);
        return;
      }

      // Filter courses based on current grade selection
      const filteredCourses = newStudentData.Course.filter(course => {
        if (selectedGrade === "CBSE 9") {
          return course.id === "1" || course.id === "2";
        } else {
          return course.id === "3" || course.id === "4";
        }
      });

      // Check if student should be displayed in current view
      if (newStudentData.cohort === selectedCohort && filteredCourses.length > 0) {
        const studentWithFilteredCourses = {
          ...newStudentData,
          Course: filteredCourses
        };
        
        setStudents(prevStudents => [...prevStudents, studentWithFilteredCourses]);
      }

      setIsModalOpen(false);
    } catch (error) {
      console.error("Error processing new student:", error);
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
          value={selectedGrade}
          onChange={(e) => setSelectedGrade(e.target.value)}
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