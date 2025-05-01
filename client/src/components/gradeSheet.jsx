import React from 'react'
import { useParams } from 'react-router-dom';

const GradeSheet = () => {
    const { student } = useParams();
    const studentId=student._id
const showGradeSheet=async()=>{
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:8080/grade/getStudentGrades/${studentId}`, {
            headers: { Authorization: token },
        });
        setStudents(response.data);
    } catch (error) {
        console.error('Error fetching students:', error);
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch students', life: 3000 });
    }
}

  return (

    <div>
        GradeSheet
    </div>
  )
}

export default GradeSheet 