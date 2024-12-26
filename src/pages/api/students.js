import { supabase } from '../../lib/supabaseClient';

// Function to handle GET and POST requests for students
export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Fetch all students with courses
      const { data, error } = await supabase
        .from('Student')
        .select(`
          id, name, cohort, date_joined, last_login, status,
          Course(id, name, icon)
        `);

      if (error) {
        console.error('Error fetching students:', error);
        return res.status(500).json({ error: 'Error fetching students' });
      }

      res.status(200).json(data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else if (req.method === 'POST') {
    const { name, cohort, courses, status } = req.body;

    if (!name || !cohort || !courses) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      // Insert the student into the 'Student' table
      const { data: studentData, error: studentError } = await supabase
        .from('Student')
        .insert([{
          name: name,
          cohort: cohort,
          status: status || true, // Default to 'true' (active) if status is not provided
        }])
        .single();  // Get back a single student record

      if (studentError) {
        console.error('Error adding student:', studentError);
        return res.status(500).json({ error: 'Error adding student' });
      }

      const studentId = studentData.id;

      // Now add the courses to the student (many-to-many relationship)
      const { error: enrollError } = await supabase
        .from('Student')
        .update({ courses })
        .eq('id', studentId);

      if (enrollError) {
        console.error('Error enrolling student in courses:', enrollError);
        return res.status(500).json({ error: 'Error enrolling student in courses' });
      }

      res.status(201).json({ ...studentData, courses });
    } catch (error) {
      console.error('Error adding student:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    // Handle unsupported HTTP methods
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
