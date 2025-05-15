import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { FiEdit, FiTrash } from 'react-icons/fi';

const WeeklySchedule = ({ teacherId }) => {
    const [schedule, setSchedule] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);
    const [editDialogVisible, setEditDialogVisible] = useState(false);
    const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
    const [classToDelete, setClassToDelete] = useState(null);
    const [classes, setClasses] = useState([]);
    const [subjects, setSubjects] = useState([]); // הוספת מצב עבור מקצועות
    const [newSubject, setNewSubject] = useState('');
    const [addLessonDialogVisible, setAddLessonDialogVisible] = useState(false);
    const [selectedClassId, setSelectedClassId] = useState(null);
    const [selectedDay, setSelectedDay] = useState(null);
    const [selectedHour, setSelectedHour] = useState(null);
    const [editSubject, setEditSubject] = useState('');
    const [editClassId, setEditClassId] = useState(null);
    const [subjectToEdit, setSubjectToEdit] = useState(null);
    
    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/schedule/getTeacherSchedule/${teacherId}`);
                setSchedule(response.data);
            } catch (error) {
                console.error('Error fetching schedule:', error);
            }
        };

        const fetchClasses = async () => {
            try {
                const response = await axios.get('http://localhost:8080/class/getAllClasses');
                setClasses(response.data);
            } catch (error) {
                console.error('Error fetching classes:', error);
            }
        };

        const fetchSubjects = async () => { 
            try {
                const response = await axios.get('http://localhost:8080/subject/getSubjects'); // הנחתי שיש API כזה
                setSubjects(response.data);
            } catch (error) {
                console.error('Error fetching subjects:', error);
            }
        };

        if (teacherId) {
            fetchSchedule();
            fetchClasses();
            fetchSubjects(); // קריאה לפונקציה לקבלת מקצועות
        } else {
            console.error("teacherId is not defined");
        }
    }, [teacherId,schedule]);
   
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const hours = ['1', '2', '3', '4', '5', '6', '7', '8'];

    const openAddLessonDialog = (day, hour) => {
        setSelectedClassId(null);
        setNewSubject('');
        setSelectedDay(day);
        setSelectedHour(hour);
        setAddLessonDialogVisible(true);
    };

    const openEditDialog = (subject) => {
        if (subject) {
            setEditSubject(subject.subject);
            setEditClassId(subject.classId);
            setSubjectToEdit(subject);
            setEditDialogVisible(true);
        }
    };

    const updateSchedule = async () => {
        if (subjectToEdit && subjectToEdit._id) {
            const updatedSchedule = {
                teacherId: teacherId,
                subject: editSubject,
                classId: editClassId._id,
                day: subjectToEdit.day,
                time: subjectToEdit.time,
            };

            try {
                const response = await axios.put(`http://localhost:8080/schedule/updateSchedule/${subjectToEdit._id}`, updatedSchedule);
                const updatedScheduleList = schedule.map(entry => 
                    entry._id === subjectToEdit._id ? response.data : entry
                );
                setSchedule(updatedScheduleList);
                setEditDialogVisible(false);
            } catch (error) {
                console.error('Error updating schedule:', error);
            }
        }
    };

    const handleDeleteLesson = async (subjectId) => {
        try {
            await axios.delete(`http://localhost:8080/schedule/deleteSchedule/${subjectId}`);
            const updatedSchedule = schedule.filter(entry => entry._id !== subjectId);
            setSchedule(updatedSchedule);
            setConfirmDeleteVisible(false);
        } catch (error) {
            console.error('Error deleting schedule:', error);
        }
    };

    const createSchedule = async () => {
        try {
            const newSchedule = {
                teacherId: teacherId,
                subject: newSubject._id,
                classId: selectedClassId._id,
                day: selectedDay,
                time: selectedHour,
            };
            const response = await axios.post('http://localhost:8080/schedule/createSchedule', newSchedule);
            setSchedule(prevSchedule => [...prevSchedule, response.data]); // ע
            setAddLessonDialogVisible(false);
            //fetchSchedule(); // הוספת קריאה זו

        } catch (error) {
            console.error('Error creating schedule:', error);
        }
    };

    const openDeleteConfirmation = (subject) => {
        setClassToDelete(subject);
        setConfirmDeleteVisible(true);
    };
    
    const deleteClass = async () => {
        if (classToDelete) {
            await handleDeleteLesson(classToDelete._id);
        }
        setConfirmDeleteVisible(false);
    };

    return (
        <div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th style={{ padding: '10px', minWidth: '100px', textAlign: 'center' }}>שעות</th>
                        {daysOfWeek.map((day) => (
                            <th key={day} style={{ padding: '10px', minWidth: '100px', textAlign: 'center' }}>{day}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {hours.map((hour) => (
                        <tr key={hour}>
                            <td style={{ padding: '10px', textAlign: 'center' }}>{hour}</td>
                            {daysOfWeek.map((day) => {
                                const subject = schedule.find(entry => entry.day === day && entry.time === hour);
                                return (
                                    <td key={day} style={{ padding: '10px', textAlign: 'center', border: '1px solid #ccc' }}>
                                        {subject ? (
                                            <div>
                                                <div>{subject.subject ? subject.subject.name : 'לא זוהה'}</div>
                                                <div>{subject.classId ? subject.classId.name : 'לא זוהה'}</div>

                                                <div style={{ marginTop: '5px' }}>
                                                    <Button
                                                        icon={<FiEdit style={{ color: 'green', fontSize: '16px' }} />}
                                                        className="p-button-text"
                                                        onClick={() => openEditDialog(subject)}
                                                    />
                                                    <Button
                                                        icon={<FiTrash style={{ color: 'red', fontSize: '16px' }} />}
                                                        className="p-button-text"
                                                        onClick={() => openDeleteConfirmation(subject)}
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <Button label="הוסף שיעור" onClick={() => openAddLessonDialog(day, hour)} />
                                        )}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>

            <Dialog visible={addLessonDialogVisible} header="הוסף שיעור" onHide={() => setAddLessonDialogVisible(false)}>
                <div>
                    <label>בחר כיתה:</label>
                    <Dropdown value={selectedClassId} options={classes} onChange={(e) => setSelectedClassId(e.value)} optionLabel="name" placeholder="בחר כיתה" />
                    <label>בחר מקצוע:</label>
                    <Dropdown value={newSubject} options={subjects} onChange={(e) => setNewSubject(e.value)} optionLabel="name" placeholder="בחר מקצוע" />
                </div>
                <Button label="שמור" onClick={createSchedule} />
            </Dialog>

            <Dialog visible={confirmDeleteVisible} header="אישור מחיקה" onHide={() => setConfirmDeleteVisible(false)}>
                <p>האם אתה בטוח שברצונך למחוק את השיעור: {classToDelete ? classToDelete.subject.name : ''}?</p>
                <Button label="כן" onClick={deleteClass} />
                <Button label="לא" onClick={() => setConfirmDeleteVisible(false)} />
            </Dialog>

            <Dialog visible={editDialogVisible} header="ערוך שיעור" onHide={() => setEditDialogVisible(false)}>
                <div>
                    <label>בחר כיתה:</label>
                    <Dropdown value={editClassId} options={classes} onChange={(e) => setEditClassId(e.value)} optionLabel="name" placeholder="בחר כיתה" />
                    <label>בחר מקצוע:</label>
                    <Dropdown value={editSubject} options={subjects} onChange={(e) => setEditSubject(e.value)} optionLabel="name" placeholder="בחר מקצוע" />
                </div>
                <Button label="עדכן" onClick={updateSchedule} />
            </Dialog>
        </div>
    );
};

export default WeeklySchedule;
