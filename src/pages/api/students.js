const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Function to handle GET and POST requests for students
export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const students = await prisma.student.findMany({
        include: {
          courses: true // Include related courses for each student
        }
      });
      
      res.status(200).json(students);
    } catch (error) {
      console.error('Error fetching students:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } 
  
  else if (req.method === 'POST') {
    const { name, cohort, courses, status } = req.body;

    // Validate required fields
    if (!name || !cohort || !courses) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      // Create student with course connections in a single operation
      const student = await prisma.student.create({
        data: {
          name,
          cohort,
          dateJoined: new Date(), // Set current date
          lastLogin: new Date(),  // Set current date
          status: status ?? true, // Default to true if not provided
          courses: {
            connect: courses.map(courseId => ({ id: courseId }))
          }
        },
        // Include courses in the response
        include: {
          courses: true
        }
      });

      res.status(201).json(student);
    } catch (error) {
      console.error('Error adding student:', error);
      if (error.code === 'P2002') {
        // Handle unique constraint violations
        res.status(400).json({ error: 'Student already exists' });
      } else if (error.code === 'P2003') {
        // Handle foreign key constraint violations
        res.status(400).json({ error: 'Invalid course ID(s)' });
      } else {
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  } 
  
  // Add PUT method for updating students
  else if (req.method === 'PUT') {
    const { id, name, cohort, courses, status } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Student ID is required' });
    }

    try {
      const updatedStudent = await prisma.student.update({
        where: { id },
        data: {
          name,
          cohort,
          status,
          lastLogin: new Date(),
          courses: courses ? {
            set: [], // First remove all existing connections
            connect: courses.map(courseId => ({ id: courseId })) // Then add new ones
          } : undefined
        },
        include: {
          courses: true
        }
      });

      res.status(200).json(updatedStudent);
    } catch (error) {
      console.error('Error updating student:', error);
      if (error.code === 'P2025') {
        // Record not found
        res.status(404).json({ error: 'Student not found' });
      } else {
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  }

  // Add DELETE method
  else if (req.method === 'DELETE') {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'Student ID is required' });
    }

    try {
      await prisma.student.delete({
        where: { id }
      });

      res.status(204).send(); // No content response for successful deletion
    } catch (error) {
      console.error('Error deleting student:', error);
      if (error.code === 'P2025') {
        res.status(404).json({ error: 'Student not found' });
      } else {
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  }
  
  else {
    // Handle any other HTTP method
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}