import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import * as XLSX from 'xlsx';
import axios from 'axios';

const Classes = () => {

    const userObj = useSelector((state) => state.userSlice);
    const teacher =  userObj.user;
    const [classes, setClasses] = useState([]);
    const [expandedRows, setExpandedRows] = useState(null);
    const [selectedClass, setSelectedClass] = useState(null);
    const [exams, setExams] = useState([]);
    const [selectedExam, setSelectedExam] = useState(null);
    const [dialogVisible, setDialogVisible] = useState(false);

    useEffect(() => {
        if (teacher?._id) {
            axios.get(`http://localhost:8080/class/getClassesByTeacher/${teacher._id}`).then((res) => {
                setClasses(res.data);
            });
        }
    }, [teacher]);

    const loadStudents = (classObj) => {
        return (
            <DataTable value={classObj.students} responsiveLayout="scroll">
                <Column field="studentId" header="תעודת זהות" />
                <Column field="firstName" header="שם פרטי" />
                <Column field="lastName" header="שם משפחה" />
                <Column field="email" header="אימייל" />
            </DataTable>
        );
    };

    const openExamDialog = (classObj) => {
        setSelectedClass(classObj);
        axios.get(`http://localhost:8080/exam/getExamsByClassAndTeacher/${classObj._id}/teacher/${teacher._id}`).then((res) => {
            setExams(res.data);
            setDialogVisible(true);
        });
    };

    const downloadExcelTemplate = () => {
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

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const grades = XLSX.utils.sheet_to_json(sheet);

        await axios.post(`http://localhost:8080/uploadGradesFromExcel${selectedExam._id}`, { grades });
        alert('הציונים עודכנו בהצלחה');
    };

    return (
        <>
            <div className="p-4">
                <h2>הכיתות שאני מלמד</h2>
                <DataTable value={classes} expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)}
                    rowExpansionTemplate={loadStudents} dataKey="_id" responsiveLayout="scroll">
                    <Column expander style={{ width: '3em' }} />
                    <Column field="name" header="שם כיתה" />
                    <Column
                        header="פעולות"
                        body={(rowData) => (
                            <Button label="ייצוא ציונים" onClick={() => openExamDialog(rowData)} />
                        )}
                    />
                </DataTable>

                <Dialog header="בחר מבחן" visible={dialogVisible} onHide={() => setDialogVisible(false)}>
                    <Dropdown
                        value={selectedExam}
                        options={exams}
                        onChange={(e) => setSelectedExam(e.value)}
                        optionLabel={(e) => e.subject?.name}
                        placeholder="בחר מבחן"
                        className="w-full mb-3"
                    />
                    <Button label="הורד אקסל" className="mr-2" onClick={downloadExcelTemplate} disabled={!selectedExam} />
                    <label className="mt-4 block">
                        העלה קובץ אקסל:
                        <input type="file" accept=".xlsx" onChange={handleFileUpload} />
                    </label>
                </Dialog>
            </div>
        </>
    )
}

export default Classes