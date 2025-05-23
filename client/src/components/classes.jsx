import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import * as XLSX from 'xlsx';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ExamSchedule from './examSchedule';
import Graph from './graph';

const Classes = () => {
    const { user: teacher } = useSelector((state) => state.userSlice);
    const [classes, setClasses] = useState([]);
    const [expandedRows, setExpandedRows] = useState(null);
    const [selectedClass, setSelectedClass] = useState(null);
    const [exams, setExams] = useState([]);
    const [selectedExam, setSelectedExam] = useState(null);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogExamScheduleVisible, setDialogExamScheduleVisible] = useState(false);
    const [selectedClassForSchedule, setSelectedClassForSchedule] = useState(null);
    const [showGraphDialog, setShowGraphDialog] = useState(false);
    const [selectedClassForGraph, setSelectedClassForGraph] = useState(null);

    const openExamScheduleDialog = (classObj) => {
        setSelectedClassForSchedule(classObj);
        setDialogExamScheduleVisible(true);
    };
    
    const openGraphDialog = (classId) => {
        setSelectedClassForGraph(classId);
        setShowGraphDialog(true);
    }

    const fileInputsRef = useRef({});
    const navigate = useNavigate();

    // טעינת כיתות עבור המורה
    useEffect(() => {
        if (teacher) {
            axios
                .get(`http://localhost:8080/class/getClassesByTeacher/${teacher._id}`)
                .then((res) => setClasses(res.data));
        }
    }, [teacher]);

    // הצגת טבלת תלמידים לכל כיתה
    const loadStudents = (classObj) => (
        <DataTable value={classObj.students} responsiveLayout="scroll" stripedRows>
            <Column field="studentId" header="תעודת זהות" />
            <Column field="firstName" header="שם פרטי" />
            <Column field="lastName" header="שם משפחה" />
            <Column field="email" header="אימייל" />
            <Column
                field="grades"
                header="Grade sheet"
                body={(rowData) => (
                    <Button
                        label="View Grade sheet"
                        icon="pi pi-eye"
                        text
                        severity="info"
                        onClick={() => navigate(`/gradeSheet/${rowData._id}`)}
                    />
                )}
            />
        </DataTable>
    );

    // פתיחת דיאלוג לבחירת מבחן
    const openExamDialog = (classObj) => {
        setSelectedClass(classObj);
        axios
            .get(`http://localhost:8080/exam/getExamsByClassAndTeacher/${classObj._id}/teacher/${teacher._id}`)
            .then((res) => {
                setExams(res.data);
                setDialogVisible(true);
            });
    };

    // הורדת תבנית ציונים לפי המבחן הנבחר
    const downloadExcelTemplate = () => {
        if (!selectedExam) {
            alert('אנא בחר מבחן לפני הורדת הקובץ.');
            return;
        }

        const data = selectedClass.students.map((s) => ({
            studentId: s.studentId,
            firstName: s.firstName,
            lastName: s.lastName,
            email: s.email,
            grade: '',
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Grades');
        XLSX.writeFile(workbook, `grades_${selectedClass.name}_${selectedExam.subject.name}.xlsx`);
        setDialogVisible(false);
    };

    // טעינת ציונים מקובץ Excel
    const handleFileUpload = async (e) => {
        if (!selectedExam) {
            alert('אנא בחר מבחן לפני העלאת הקובץ.');
            return;
        }

        const file = e.target.files[0];
        if (!file) {
            alert('אנא בחר קובץ להעלאה.');
            return;
        }

        try {
            const data = await file.arrayBuffer();
            const workbook = XLSX.read(data);
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const grades = XLSX.utils.sheet_to_json(sheet);

            await axios.post(
                `http://localhost:8080/grade/uploadGradesFromExcel/${selectedExam._id}`,
                { grades }
            );
            alert('הציונים עודכנו בהצלחה');
        } catch (error) {
            console.error('שגיאה בהעלאת הקובץ:', error);
            alert('אירעה שגיאה. ודא שהקובץ תקין ונסה שוב.');
        }
    };

    // הורדת רשימת תלמידים בקובץ Excel
    const downloadStudentsExcel = (classObj) => {
        const data = classObj.students.map((s) => ({
            studentId: s.studentId,
            firstName: s.firstName,
            lastName: s.lastName,
            email: s.email,
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');
        XLSX.writeFile(workbook, `students_${classObj.name}.xlsx`);
    };

    // הורדת תבנית ריקה להוספת תלמידים
    const downloadEmptyStudentsExcel = (classObj) => {
        const data = [{
            studentId: '',
            firstName: '',
            lastName: '',
            email: '',
        }];

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'NewStudents');
        XLSX.writeFile(workbook, `add_students_template_${classObj.name}.xlsx`);
    };

    // טעינת תלמידים חדשים מקובץ Excel
    const handleStudentsExcelUpload = async (e, classId) => {
        const file = e.target.files[0];
        if (!file) {
            alert('אנא בחר קובץ להעלאה.');
            return;
        }

        try {
            const data = await file.arrayBuffer();
            const workbook = XLSX.read(data);
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const newStudents = XLSX.utils.sheet_to_json(sheet);

            await axios.post(
                `http://localhost:8080/class/addStudentsFromExcel/${classId}`,
                { students: newStudents }
            );
            alert('התלמידות נוספו בהצלחה');

            const updatedClasses = await axios.get(`http://localhost:8080/class/getClassesByTeacher/${teacher._id}`);
            setClasses(updatedClasses.data);
        } catch (error) {
            console.error('שגיאה בהעלאת הקובץ:', error);
            alert('אירעה שגיאה. ודא שהקובץ תקין ונסה שוב.');
        }
    };

    return (
        <div style={{ 
            padding: '2rem', 
            maxWidth: '80rem', 
            margin: '0 auto', 
            backgroundColor: 'white',
            borderRadius: '1rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
        }}>
            <h2 style={{ 
                fontSize: '1.5rem', 
                fontWeight: 'bold', 
                marginBottom: '1.5rem', 
                textAlign: 'center', 
                color: '#1d4ed8' 
            }}>
                הכיתות שאני מלמד
            </h2>

            <DataTable
                value={classes}
                expandedRows={expandedRows}
                onRowToggle={(e) => setExpandedRows(e.data)}
                rowExpansionTemplate={loadStudents}
                dataKey="_id"
                responsiveLayout="scroll"
                stripedRows
                style={{ 
                    borderRadius: '0.5rem',
                    overflow: 'hidden',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
            >
                <Column expander style={{ width: '3em' }} />
                <Column field="name" header="שם כיתה" />
                <Column
                    header="פעולות"
                    body={(rowData) => (
                        <div style={{ 
                            marginTop: '1rem', 
                            display: 'flex', 
                            flexWrap: 'wrap', 
                            gap: '0.75rem' 
                        }}>
                            <Button
                                label="ייצוא ציונים"
                                onClick={() => openExamDialog(rowData)}
                                style={{ backgroundColor: '#2563eb', color: 'white' }}
                            />
                            <Button
                                label="ייצוא תלמידים"
                                onClick={() => downloadStudentsExcel(rowData)}
                                severity="secondary"
                            />
                            <Button
                                label="הורד תבנית תלמידים"
                                onClick={() => downloadEmptyStudentsExcel(rowData)}
                                severity="help"
                                outlined
                            />
                            <Button
                                label="העלה תלמידים"
                                onClick={() => fileInputsRef.current[rowData._id]?.click()}
                                severity="success"
                            />
                            <Button
                                label="View exam schedule"
                                icon="pi pi-file-edit"
                                text
                                severity="info"
                                onClick={() => openExamScheduleDialog(rowData._id)}
                            />
                            <Button
                                label="הצג גרף"
                                icon="pi pi-chart-bar"
                                onClick={() => openGraphDialog(rowData._id)}
                                size="small"
                                severity="warning"
                            />

                            <input
                                type="file"
                                accept=".xlsx"
                                onChange={handleFileUpload}
                                ref={(el) => (fileInputsRef.current[rowData._id] = el)}
                                style={{ display: "none" }}
                            />
                        </div>
                    )}
                />
            </DataTable>

            <Dialog
                header="בחר מבחן"
                visible={dialogVisible}
                onHide={() => setDialogVisible(false)}
                style={{ width: '30vw', minWidth: '300px' }}
                breakpoints={{ '960px': '75vw', '640px': '90vw' }}
            >
                <div style={{ padding: '1.25rem' }}>
                    <Dropdown
                        value={selectedExam}
                        options={exams}
                        onChange={(e) => setSelectedExam(e.value)}
                        optionLabel={(e) => e.subject?.name}
                        placeholder="בחר מבחן"
                        style={{ width: '100%', marginBottom: '0.75rem' }}
                    />
                    <Button
                        label="הורד אקסל"
                        onClick={downloadExcelTemplate}
                        disabled={!selectedExam}
                        style={{ marginRight: '0.5rem' }}
                    />
                    <label style={{ 
                        marginTop: '1rem', 
                        display: 'block', 
                        fontSize: '0.875rem', 
                        fontWeight: '500', 
                        color: '#374151' 
                    }}>
                        העלה קובץ אקסל:
                        <input 
                            type="file" 
                            accept=".xlsx" 
                            onChange={handleFileUpload} 
                            style={{ marginTop: '0.25rem' }} 
                        />
                    </label>
                </div>
            </Dialog>

            <Dialog
                header={`לוח מבחנים עבור ${selectedClassForSchedule?.name || ''}`}
                visible={dialogExamScheduleVisible}
                onHide={() => setDialogExamScheduleVisible(false)}
                style={{ width: '40vw', minWidth: '400px' }}
                breakpoints={{ '960px': '75vw', '640px': '90vw' }}
            >
                <div style={{ padding: '1.25rem' }}>
                    {selectedClassForSchedule && (
                        <ExamSchedule classObj={selectedClassForSchedule} />
                    )}
                </div>
            </Dialog>

            <Dialog
                header="גרף ציונים"
                visible={showGraphDialog}
                onHide={() => setShowGraphDialog(false)}
                style={{ width: '50vw' }}
                breakpoints={{ '960px': '75vw', '640px': '90vw' }}
            >
                <Graph classId={selectedClassForGraph} teacherId={teacher?._id} />
            </Dialog>
        </div>
    );
};

export default Classes;