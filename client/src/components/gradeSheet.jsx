import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { format } from 'date-fns';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { useSelector } from 'react-redux';

const GradeSheet = () => {
    const { studentId } = useParams();
    const emptyStudent = {
        studentId: '',
        firstName: '',
        lastName: '',
        email: '',
        classId: {},
    };

    const userObj = useSelector((state) => state.userSlice);
    const user = userObj.user;
    const isTeacherOrAdmin = user?.role === 'teacher' || user?.role === 'admin';
    const [student, setStudent] = useState(emptyStudent);
    const [grades, setGrades] = useState([]);
    const [subjectData, setSubjectData] = useState([]);
    const [expandedRows, setExpandedRows] = useState(null);
    const [editingRowId, setEditingRowId] = useState(null);
    const [editedGrade, setEditedGrade] = useState(null);
    useEffect(() => {
        getStudent();
        getStudentGrades();
    }, []);

    const getStudentGrades = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:8080/grade/getGradesByStudentId/${studentId}`, {
                headers: { Authorization: token },
            });

            const grades = response.data;
            const groupedData = grades.reduce((acc, grade) => {
                const { grade: gradeValue, examId } = grade;
                const subject = examId.subject.name;
                const date = examId.examDate;

                if (!acc[subject]) {
                    acc[subject] = {
                        subject,
                        details: [],
                        total: 0,
                        count: 0,
                    };
                }

                acc[subject].details.push({
                    gradeId: grade._id,
                    date,
                    grade: gradeValue,
                });
                acc[subject].total += gradeValue;
                acc[subject].count += 1;

                return acc;
            }, {});

            const processedData = Object.values(groupedData).map((subjectData) => ({
                subject: subjectData.subject,
                average: (subjectData.total / subjectData.count).toFixed(2),
                details: subjectData.details,
            }));

            setGrades(grades);
            setSubjectData(processedData);
        } catch (error) {
            console.error('Error fetching grades:', error);
        }
    };

    const getStudent = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:8080/student/getStudentById/${studentId}`, {
                headers: { Authorization: token },
            });
            setStudent(response.data);
        } catch (error) {
            console.error('Error fetching student:', error);
        }
    };

    const handleSave = async (rowData) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `http://localhost:8080/grade/updateGrade/${rowData.gradeId}`,
                { grade: editedGrade },
                { headers: { Authorization: token } }
            );
            setEditingRowId(null);
            setEditedGrade(null);
            getStudentGrades();
        } catch (error) {
            console.error('Error updating grade:', error);
        }
    };

    const rowExpansionTemplate = (data) => {
        return (
            <DataTable value={data.details} responsiveLayout="scroll">
                <Column
                    field="date"
                    header="Exam Date"
                    body={(row) => format(new Date(row.date), 'dd/MM/yyyy')}
                />
                <Column
                    field="grade"
                    header="Grade"
                    body={(rowData) =>
                        editingRowId === rowData.gradeId ? (
                            <InputNumber
                                value={editedGrade}
                                onValueChange={(e) => setEditedGrade(e.value)}
                                min={0}
                                max={100}
                                showButtons
                                buttonLayout="horizontal"
                            />
                        ) : (
                            rowData.grade
                        )
                    }
                />
                <Column
                    header="Action"
                    body={(rowData) =>
                        editingRowId === rowData.gradeId ? (
                            isTeacherOrAdmin && (
                                <>
                                    <Button
                                        icon="pi pi-check"
                                        className="p-button-success p-button-sm mr-2"
                                        onClick={() => handleSave(rowData)}
                                    />
                                    <Button
                                        icon="pi pi-times"
                                        className="p-button-secondary p-button-sm"
                                        onClick={() => {
                                            setEditingRowId(null);
                                            setEditedGrade(null);
                                        }}
                                    />
                                </>
                            )
                        ) : (
                            isTeacherOrAdmin && (
                                <Button
                                    icon="pi pi-pencil"
                                    className="p-button-warning p-button-sm"
                                    onClick={() => {
                                        setEditingRowId(rowData.gradeId);
                                        setEditedGrade(rowData.grade);
                                    }}
                                />
                            )
                        )
                    }
                />
            </DataTable>
        );
    };

    return (
        <div className="p-4">
            <h2>Grade Sheet</h2>
            <h3>
                {student.firstName} {student.lastName}
            </h3>
            <DataTable
                value={subjectData}
                expandedRows={expandedRows}
                onRowToggle={(e) => setExpandedRows(e.data)}
                rowExpansionTemplate={rowExpansionTemplate}
                dataKey="subject"
                responsiveLayout="scroll"
            >
                <Column expander style={{ width: '3em' }} />
                <Column field="subject" header="Subject" />
                <Column field="average" header="Average Grades" />
            </DataTable>
        </div>
    );
};

export default GradeSheet;
