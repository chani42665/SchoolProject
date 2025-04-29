import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import axios from 'axios';

const StudentsDemo = () => {
    const emptyStudent = {
        studentId: '',
        firstName: '',
        lastName: '',
        email: '',
        classId: null,
        _id: null,
    };

    const [students, setStudents] = useState([]);
    const [allClasses, setAllClasses] = useState([]);
    const [studentDialog, setStudentDialog] = useState(false);
    const [student, setStudent] = useState(emptyStudent);
    const [submitted, setSubmitted] = useState(false);
    const toast = useRef(null);

    // Fetch students and classes
    const fetchStudents = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8080/student/getAllStudents/', {
                headers: { Authorization: token },
            });
            setStudents(response.data);
        } catch (error) {
            console.error('Error fetching students:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch students', life: 3000 });
        }
    };

    const fetchClasses = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8080/class/getAllClasses/', {
                headers: { Authorization: token },
            });
            setAllClasses(response.data);
        } catch (error) {
            console.error('Error fetching classes:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch classes', life: 3000 });
        }
    };

    useEffect(() => {
        fetchStudents();
        fetchClasses();
    }, []);

    // Save student (update or create)
    const saveStudent = async () => {
        setSubmitted(true);

        if (student.firstName.trim() && student.lastName.trim() && student.classId) {
            try {
                const token = localStorage.getItem('token');
                let success = false;

                if (student._id) {
                    // Update existing student
                    const response = await axios.put(
                        `http://localhost:8080/student/updateStudent/${student._id}`,
                        { ...student, classId: student.classId._id || student.classId },
                        { headers: { Authorization: token } }
                    );
                    console.log('Student updated:', response.data);
                    success = true;
                } else {
                    // Create new student
                    const response = await axios.post(
                        'http://localhost:8080/student/createStudent',
                        { ...student, classId: student.classId._id || student.classId },
                        { headers: { Authorization: token } }
                    );
                    console.log('Student created:', response.data);
                    success = true;
                }

                if (success) {
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Student Saved', life: 3000 });
                    await fetchStudents(); // Refresh students
                    setStudentDialog(false);
                    setStudent(emptyStudent);
                }
            } catch (error) {
                console.error('Error saving student:', error);
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to save student', life: 3000 });
            }
        }
    };

    // Open dialog for editing or creating a student
    const openNew = () => {
        setStudent(emptyStudent);
        setSubmitted(false);
        setStudentDialog(true);
    };

    const editStudent = (student) => {
        setStudent({ ...student });
        setStudentDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setStudentDialog(false);
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _student = { ...student };
        _student[`${name}`] = val;
        setStudent(_student);
    };

    const onClassChange = (e) => {
        const selectedClass = e.value;
        setStudent((prev) => ({
            ...prev,
            classId: selectedClass,
        }));
    };

    const studentDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" onClick={saveStudent} />
        </React.Fragment>
    );

    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4" left={() => <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} />} />
                <DataTable value={students} paginator rows={10} dataKey="_id">
                    <Column field="studentId" header="ID" sortable></Column>
                    <Column field="firstName" header="First Name" sortable></Column>
                    <Column field="lastName" header="Last Name" sortable></Column>
                    <Column field="email" header="Email" sortable></Column>
                    <Column field="classId.name" header="Class" sortable></Column>
                    <Column
                        body={(rowData) => (
                            <div>
                                <Button icon="pi pi-pencil" className="mr-2" onClick={() => editStudent(rowData)} />
                            </div>
                        )}
                    ></Column>
                </DataTable>
            </div>

            <Dialog visible={studentDialog} style={{ width: '32rem' }} header="Student Details" modal footer={studentDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <label htmlFor="firstName">First Name</label>
                    <InputText id="firstName" value={student.firstName} onChange={(e) => onInputChange(e, 'firstName')} required />
                    {submitted && !student.firstName && <small className="p-error">First Name is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="lastName">Last Name</label>
                    <InputText id="lastName" value={student.lastName} onChange={(e) => onInputChange(e, 'lastName')} required />
                    {submitted && !student.lastName && <small className="p-error">Last Name is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="email">Email</label>
                    <InputText id="email" value={student.email} onChange={(e) => onInputChange(e, 'email')} required />
                    {submitted && !student.email && <small className="p-error">Email is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="classId">Class</label>
                    <Dropdown
                        value={student.classId}
                        options={allClasses}
                        onChange={onClassChange}
                        optionLabel="name"
                        placeholder="Select a class"
                        className="w-full"
                    />
                    {submitted && !student.classId && <small className="p-error">Class is required.</small>}
                </div>
            </Dialog>
        </div>
    );
};

export default StudentsDemo;