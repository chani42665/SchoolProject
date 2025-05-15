import React, { useState, useEffect, useRef } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { Toolbar } from 'primereact/toolbar'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { MultiSelect } from 'primereact/multiselect'
import { Toast } from 'primereact/toast'
import axios from 'axios'
import WeeklySchedule from './weeklySchedule'

const Teachers = () => {
    const emptyTeacher = {
        teacherId: '',
        firstName: '',
        lastName: '',
        email: '',
        subjects: [],
        classes: [],
        role: 'teacher',
    };

    const [teachers, setTeachers] = useState([]);
    const [allClasses, setAllClasses] = useState([]);
    const [allSubjects, setAllSubjects] = useState([]);
    const [teacherDialog, setTeacherDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [teacher, setTeacher] = useState(emptyTeacher);
    const toast = useRef(null);
    const [weeklyScheduleDialog, setWeeklyScheduleDialog] = useState(false);
    const [selectedTeacherId, setSelectedTeacherId] = useState(null);
    const [deleteTeacherDialog, setDeleteTeacherDialog] = useState(false);
    const [teacherToDelete, setTeacherToDelete] = useState(null);

    const openWeeklySchedule = (teacherId) => {
        setSelectedTeacherId(teacherId);
        setWeeklyScheduleDialog(true);
    };

    const fetchTeachers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8080/teacher/getAllTeachers', {
                headers: { Authorization: token },
            });
            setTeachers(response.data);
        } catch (error) {
            console.error('Error fetching teachers:', error);
        }
    };

    const fetchClasses = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8080/class/getAllClasses', {
                headers: { Authorization: token },
            });
            setAllClasses(response.data.map((classObj) => ({ label: classObj.name, value: classObj._id })));
        } catch (error) {
            console.error('Error fetching classes:', error);
        }
    };

    const fetchSubjects = async () => {
        try {
            const subjects = ['Math', 'Science', 'History', 'English', 'Art'];
            setAllSubjects(subjects.map((subject) => ({ label: subject, value: subject })));
        } catch (error) {
            console.error('Error fetching subjects:', error);
        }
    };

    useEffect(() => {
        fetchTeachers();
        fetchClasses();
        fetchSubjects();
    }, []);

    const saveTeacher = async () => {
        setSubmitted(true);
        if (teacher.firstName.trim() && teacher.lastName.trim() && teacher.email.trim()) {
            try {
                const token = localStorage.getItem('token');
                let updatedTeachers = [...teachers];

                if (teacher._id) {
                    const response = await axios.put(
                        `http://localhost:8080/teacher/updateTeacher/${teacher._id}`,
                        teacher,
                        { headers: { Authorization: token } }
                    );
                    const index = updatedTeachers.findIndex((t) => t._id === teacher._id);
                    updatedTeachers[index] = response.data.teacher;
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Teacher Updated', life: 3000 });
                } else {
                    const response = await axios.post(
                        'http://localhost:8080/teacher/createTeacher',
                        teacher,
                        { headers: { Authorization: token } }
                    );
                    updatedTeachers.push(response.data.teacher);
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Teacher Created', life: 3000 });
                }

                setTeachers(updatedTeachers);
                setTeacherDialog(false);
                setTeacher(emptyTeacher);
            } catch (error) {
                console.error('Error saving teacher:', error);
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to save teacher', life: 3000 });
            }
        }
    };

    const openNew = () => {
        setTeacher(emptyTeacher);
        setSubmitted(false);
        setTeacherDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setTeacherDialog(false);
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _teacher = { ...teacher };
        _teacher[`${name}`] = val;
        setTeacher(_teacher);
    };

    const teacherDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" onClick={saveTeacher} />
        </React.Fragment>
    );

    const editTeacher = (teacher) => {
        setTeacher({ ...teacher });
        setTeacherDialog(true);
    };

    const confirmDeleteTeacher = (teacher) => {
        setTeacherToDelete(teacher);
        setDeleteTeacherDialog(true);
    };

    const deleteTeacher = async () => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:8080/teacher/deleteTeacher/${teacherToDelete._id}`, {
                headers: { Authorization: token },
            });
            const updatedTeachers = teachers.filter(t => t._id !== teacherToDelete._id);
            setTeachers(updatedTeachers);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Teacher Deleted', life: 3000 });
            setDeleteTeacherDialog(false);
        } catch (error) {
            console.error('Error deleting teacher:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete teacher', life: 3000 });
            setDeleteTeacherDialog(false);
        }
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-text" onClick={() => editTeacher(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger p-button-text" onClick={() => confirmDeleteTeacher(rowData)} />
            </React.Fragment>
        );
    };

    return (
        <div className="grid p-4">
            <Toast ref={toast} />
            <Toolbar
                className="mb-4"
                left={() => (
                    <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} />
                )}
            />

            <DataTable
                value={teachers}
                paginator
                rows={10}
                dataKey="_id"
                responsiveLayout="scroll"
            >
                <Column field="teacherId" header="ID" sortable></Column>
                <Column field="firstName" header="First Name" sortable></Column>
                <Column field="lastName" header="Last Name" sortable></Column>
                <Column field="email" header="Email" sortable></Column>
                <Column
                    field="subjects"
                    header="Subjects"
                    body={(rowData) => (
                        <div>
                            <Button
                                label="View Weekly Schedule"
                                icon="pi pi-calendar"
                                className="p-button-text p-button-sm mt-2"
                                onClick={() => openWeeklySchedule(rowData._id)}
                            />
                        </div>
                    )}
                ></Column>
                <Column field="role" header="Role" sortable></Column>
                <Column body={actionBodyTemplate} header="Actions"></Column>
            </DataTable>

            <Dialog visible={teacherDialog} style={{ width: '450px' }} header="Teacher Details" modal footer={teacherDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <label htmlFor="teacherId">ID</label>
                    <InputText id="teacherId" value={teacher.teacherId} onChange={(e) => onInputChange(e, 'teacherId')} required />
                    {submitted && !teacher.teacherId && <small className="p-error">ID is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="firstName">First Name</label>
                    <InputText id="firstName" value={teacher.firstName} onChange={(e) => onInputChange(e, 'firstName')} required />
                    {submitted && !teacher.firstName && <small className="p-error">First Name is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="lastName">Last Name</label>
                    <InputText id="lastName" value={teacher.lastName} onChange={(e) => onInputChange(e, 'lastName')} required />
                    {submitted && !teacher.lastName && <small className="p-error">Last Name is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="email">Email</label>
                    <InputText id="email" value={teacher.email} onChange={(e) => onInputChange(e, 'email')} required />
                    {submitted && !teacher.email && <small className="p-error">Email is required.</small>}
                </div>
            </Dialog>

            <Dialog visible={weeklyScheduleDialog} style={{ width: '70vw' }} header="Weekly Schedule" modal onHide={() => setWeeklyScheduleDialog(false)}>
                <WeeklySchedule teacherId={selectedTeacherId} />
            </Dialog>

            <Dialog visible={deleteTeacherDialog} style={{ width: '450px' }} header="Confirm Delete" modal onHide={() => setDeleteTeacherDialog(false)}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle" style={{ fontSize: '2rem', marginRight: '1rem' }} />
                    {teacherToDelete && <span>Are you sure you want to delete <b>{teacherToDelete.firstName} {teacherToDelete.lastName}</b>?</span>}
                </div>
                <div className="dialog-footer">
                    <Button label="No" icon="pi pi-times" onClick={() => setDeleteTeacherDialog(false)} />
                    <Button label="Yes" icon="pi pi-check" onClick={deleteTeacher} />
                </div>
            </Dialog>
        </div>
    );
};

export default Teachers;
