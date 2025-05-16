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

const Classes = () => {
    const { user: teacher } = useSelector((state) => state.userSlice);
    const [classes, setClasses] = useState([]);
    const [expandedRows, setExpandedRows] = useState(null);
    const [selectedClass, setSelectedClass] = useState(null);
    const [exams, setExams] = useState([]);
    const [selectedExam, setSelectedExam] = useState(null);
    const [dialogVisible, setDialogVisible] = useState(false);

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
        <DataTable value={classObj.students} responsiveLayout="scroll">
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
                                            className="p-button-text p-button-info"
                                            onClick={() => navigate(`/gradeSheet/${rowData._id}`)}
                                       
                                        />
                                    )}
                                ></Column> 
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
        <div className="p-4 max-w-7xl mx-auto bg-white shadow-lg rounded-2xl">
            <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">הכיתות שאני מלמד</h2>

            <DataTable
                value={classes}
                expandedRows={expandedRows}
                onRowToggle={(e) => setExpandedRows(e.data)}
                rowExpansionTemplate={loadStudents}
                dataKey="_id"
                responsiveLayout="scroll"
                stripedRows
                className="shadow-md rounded-lg overflow-hidden"
            >
                <Column expander style={{ width: '3em' }} />
                <Column field="name" header="שם כיתה" />
                <Column
                    header="פעולות"
                    body={(rowData) => (
                        <div className="mt-4 flex flex-wrap gap-3">
    <Button
        label="ייצוא ציונים"
        onClick={() => openExamDialog(rowData)}
        className="bg-blue-600 text-white hover:bg-blue-700"
    />
    <Button
        label="ייצוא תלמידים"
        onClick={() => downloadStudentsExcel(rowData)}
        className="bg-gray-200 text-black hover:bg-gray-300"
    />
    <Button
        label="הורד תבנית תלמידים"
        onClick={() => downloadEmptyStudentsExcel(rowData)}
        className="bg-purple-100 text-black hover:bg-purple-200"
    />
    <Button
        label="העלה תלמידים"
        onClick={() => fileInputsRef.current[rowData._id]?.click()}
        className="bg-green-500 text-white hover:bg-green-600"
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
                    className="w-full md:w-[30vw] rounded-xl"
    contentClassName="p-5"

            >
                <Dropdown
                    value={selectedExam}
                    options={exams}
                    onChange={(e) => setSelectedExam(e.value)}
                    optionLabel={(e) => e.subject?.name}
                    placeholder="בחר מבחן"
    className="w-full mb-3 p-inputtext-sm"
                />
                <Button
                    label="הורד אקסל"
                    onClick={downloadExcelTemplate}
                    disabled={!selectedExam}
                    className="mr-2"
                />
                <label className="mt-4 block text-sm font-medium text-gray-700">
                    העלה קובץ אקסל:
                    <input type="file" accept=".xlsx" onChange={handleFileUpload} className="mt-1"/>
                </label>
            </Dialog>
        </div>
    );
};

export default Classes;
