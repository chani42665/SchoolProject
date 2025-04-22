import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import axios from 'axios';

const StudentsDemo = () => {
    let emptyStudent = {
        studentId: '',
        firstName: '',
        lastName: '',
        email: '',
        class: '',
        id: null
    };

    const [students, setStudents] = useState([]);
    const [studentDialog, setStudentDialog] = useState(false);
    const [deleteStudentDialog, setDeleteStudentDialog] = useState(false);
    const [deleteStudentsDialog, setStudentProductsDialog] = useState(false);
    const [student, setStudent] = useState(emptyStudent);
    const [selectedStudents, setSelectedStudents] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8080/student/getAllStudents/', {
                    headers: {
                        Authorization: token
                    }
                });
                setStudents(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchStudents();
    }, []);

    const openNew = () => {
        setStudent(emptyStudent);
        setSubmitted(false);
        setStudentDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setStudentDialog(false);
    };

    const hideDeleteStudentDialog = () => {
        setDeleteStudentDialog(false);
    };

    const hideDeleteStudentsDialog = () => {
        setStudentProductsDialog(false);
    };

    const saveStudent = () => {
        setSubmitted(true);

        if (student.firstName.trim() && student.lastName.trim()) {
            let _students = [...students];
            let _student = { ...student };

            if (student.id) {
                const index = findIndexById(student.id);
                _students[index] = _student;
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Student Updated', life: 3000 });
            } else {
                _student.id = createId();
                _students.push(_student);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Student Created', life: 3000 });
            }

            setStudents(_students);
            setStudentDialog(false);
            setStudent(emptyStudent);
        }
    };

    const editStudent = (student) => {
        setStudent({ ...student });
        setStudentDialog(true);
    };

    const confirmDeleteStudent = (student) => {
        setStudent(student);
        setDeleteStudentDialog(true);
    };

    const deleteStudent = () => {
        let _students = students.filter((val) => val.id !== student.id);
        setStudents(_students);
        setDeleteStudentDialog(false);
        setStudent(emptyStudent);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Student Deleted', life: 3000 });
    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < students.length; i++) {
            if (students[i].id === id) {
                index = i;
                break;
            }
        }
        return index;
    };

    const createId = () => {
        let id = '';
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setStudentProductsDialog(true);
    };

    const deleteSelectedStudents = () => {
        let _students = students.filter((val) => !selectedStudents.includes(val));
        setStudents(_students);
        setStudentProductsDialog(false);
        setSelectedStudents(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Students Deleted', life: 3000 });
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _student = { ...student };
        _student[`${name}`] = val;
        setStudent(_student);
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} />
                <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedStudents || !selectedStudents.length} />
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />;
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <div key={rowData.id}>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editStudent(rowData)} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteStudent(rowData)} />
            </div>
        );
    };
    
    
    
    

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Manage Students</h4>
            <IconField iconPosition="left">
                <InputIcon className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </IconField>
        </div>
    );

    const studentDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" onClick={saveStudent} />
        </React.Fragment>
    );

    const deleteStudentDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteStudentDialog} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteStudent} />
        </React.Fragment>
    );

    const deleteStudentsDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteStudentsDialog} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteSelectedStudents} />
        </React.Fragment>
    );

    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                <DataTable ref={dt} value={students} selection={selectedStudents} onSelectionChange={(e) => setSelectedStudents(e.value)}
                    dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products" globalFilter={globalFilter} header={header}>
                    <Column selectionMode="multiple" exportable={false}></Column>
                    <Column key="studentId" field="studentId" header="ID" sortable style={{ minWidth: '10rem' }}></Column>
                    <Column key="firstName" field="firstName" header="First Name" sortable style={{ minWidth: '10rem' }}></Column>
                    <Column key="lastName" field="lastName" header="Last Name" sortable style={{ minWidth: '10rem' }}></Column>
                    <Column key="class" field="class" header="Class" sortable style={{ minWidth: '10rem' }}></Column>
                    <Column key="email" field="email" header="Email" sortable style={{ minWidth: '10rem' }}></Column>
                    <Column key="action" body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                </DataTable>
            </div>

            <Dialog visible={studentDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Student Details" modal className="p-fluid" footer={studentDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <label htmlFor="studentId" className="font-bold">ID</label>
                    <InputText id="studentId" value={student.studentId} onChange={(e) => onInputChange(e, 'studentId')} required autoFocus className={classNames({ 'p-invalid': submitted && !student.studentId })} />
                    {submitted && !student.studentId && <small className="p-error">ID is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="firstName" className="font-bold">First Name</label>
                    <InputText id="firstName" value={student.firstName} onChange={(e) => onInputChange(e, 'firstName')} required autoFocus className={classNames({ 'p-invalid': submitted && !student.firstName })} />
                    {submitted && !student.firstName && <small className="p-error">First name is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="lastName" className="font-bold">Last Name</label>
                    <InputText id="lastName" value={student.lastName} onChange={(e) => onInputChange(e, 'lastName')} required autoFocus className={classNames({ 'p-invalid': submitted && !student.lastName })} />
                    {submitted && !student.lastName && <small className="p-error">Last name is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="email" className="font-bold">Email</label>
                    <InputText id="email" value={student.email} onChange={(e) => onInputChange(e, 'email')} required autoFocus className={classNames({ 'p-invalid': submitted && !student.email })} />
                    {submitted && !student.email && <small className="p-error">Email is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="class" className="font-bold">Class</label>
                    <InputText id="class" value={student.class} onChange={(e) => onInputChange(e, 'class')} required autoFocus className={classNames({ 'p-invalid': submitted && !student.class })} />
                    {submitted && !student.class && <small className="p-error">Class is required.</small>}
                </div>
            </Dialog>

            <Dialog visible={deleteStudentDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteStudentDialogFooter} onHide={hideDeleteStudentDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {student && <span>Are you sure you want to delete <b>{student.firstName} {student.lastName}</b>?</span>}
                </div>
            </Dialog>

            <Dialog visible={deleteStudentsDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteStudentsDialogFooter} onHide={hideDeleteStudentsDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {student && <span>Are you sure you want to delete the selected students?</span>}
                </div>
            </Dialog>
        </div>
    );
}

export default StudentsDemo;