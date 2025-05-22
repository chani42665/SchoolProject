import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card } from 'primereact/card';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';

const ExamSchedule = ({ classObj }) => {
    const classId = typeof classObj === 'string' ? classObj : classObj?._id;
    const className = typeof classObj === 'object' ? classObj?.name : '';

    const [events, setEvents] = useState([]);
    const [showDialog, setShowDialog] = useState(false);

    const [teachers, setTeachers] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [classes, setClasses] = useState([]);

    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [selectedClass, setSelectedClass] = useState(null);
    const [examDate, setExamDate] = useState(null);
    const [editingExamId, setEditingExamId] = useState(null);

    const [showEventDialog, setShowEventDialog] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    useEffect(() => {
        if (classId) {
            fetchExams();
        }
    }, [classId]);

    useEffect(() => {
        fetchData()
    })

    const fetchExams = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/exam/getExamByClassId/${classId}`);
            const formatted = response.data.map((exam) => ({
                id: exam._id,
                title: `${exam.subject?.name || '---'} --- ${exam.teacherId?.firstName || ''} ${exam.teacherId?.lastName || ''}`,
                date: exam.examDate.split('T')[0],
                                backgroundColor: '#f59e0b'

            }));
            setEvents(formatted);
        } catch (error) {
            console.error('error:', error);
        }
    };

    const fetchData = async () => {
        try {
            const [teacherRes, subjectRes, classRes] = await Promise.all([
                axios.get('http://localhost:8080/teacher/getAllTeachers'),
                axios.get('http://localhost:8080/subject/getSubjects'),
                axios.get('http://localhost:8080/class/getAllClasses')
            ]);

            setTeachers(teacherRes.data || []);
            setSubjects(subjectRes.data || []);
            setClasses(classRes.data || []);
        } catch (error) {
            console.error('Error fetching data:', error);
            setTeachers([]);
            setSubjects([]);
            setClasses([]);
        }
    }

    const handleDateClick = (arg) => {
        setSelectedTeacher(null);
        setSelectedSubject(null);
        setSelectedClass(classObj);
        setExamDate(new Date(arg.dateStr));
        setEditingExamId(null);
        setShowDialog(true);
    };

    const handleSave = async () => {
        if (!selectedTeacher || !selectedSubject || !selectedClass || !examDate) {
            alert('all fields are required, please fill them');
            return;
        }

        const payload = {
            teacherId: selectedTeacher._id,
            subject: selectedSubject._id,
            classId: selectedClass._id,
            examDate: examDate,
        };

        try {
            if (editingExamId) {
                await axios.put(`http://localhost:8080/exam/updateExam/${editingExamId}`, payload);
            } else {
                await axios.post('http://localhost:8080/exam/createExam', payload);
            }

            await fetchExams();
            setShowDialog(false);
            setEditingExamId(null);
        } catch (error) {
            console.error('erorr', error.response?.data || error.message);
            alert('error saving, please try again');
        }
    };

    const handleEventClick = async (clickInfo) => {
        const examId = clickInfo.event.id;

        try {
            const { data } = await axios.get(`http://localhost:8080/exam/getExamById/${examId}`);
            setSelectedTeacher(data.teacherId);
            setSelectedSubject(data.subject);
            setSelectedClass(data.classId);
            setExamDate(new Date(data.examDate));
            setEditingExamId(data._id);
            setSelectedEvent(clickInfo.event);
            setShowEventDialog(true);
        } catch (error) {
            console.error('error update, please try again', error);
        }
    };

    const handleDelete = async () => {
        if (!editingExamId)
            return;

        try {
            await axios.delete(`http://localhost:8080/exam/deleteExam/${editingExamId}`);
            await fetchExams();
            setShowEventDialog(false);
            setEditingExamId(null);
        } catch (error) {
            console.error('error delete, please try again', error.response?.data || error.message);
            alert('error delete, please try again');
        }
    };

    const handleEditOpen = () => {
        setShowEventDialog(false);
        setShowDialog(true);
    };

    return (
        <Card className="p-4 my-4 shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Exam Schedule - {className}</h2>
                <Button label="add exam" icon="pi pi-plus" onClick={() => {
                    setSelectedTeacher(null);
                    setSelectedSubject(null);
                    const selected = classes.find(c => c._id === classId) || null;
                    setSelectedClass(selected);
                    setExamDate(null);
                    setShowDialog(true);
                }} />
            </div>

            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={events}
                height="auto"
                dateClick={handleDateClick}
                eventClick={handleEventClick}
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,dayGridYear'
                }}
                eventDisplay="block"
                eventContent={(arg) => {
                    return (
                        <div className="text-sm">
                            <i className="pi pi-book mr-2 text-blue-500"></i>
                            <b>{arg.event.title.split(" --- ")[0]}</b><br />
                            <span className="text-gray-600">{arg.event.title.split(" --- ")[1]}</span>
                        </div>
                    );
                }}
            ///eventClassNames="rounded-lg shadow-sm"
            />

            <Dialog header={editingExamId ? "update exam" : "add exam"} visible={showDialog} onHide={() => setShowDialog(false)}>
                <div className="flex flex-col gap-3">
                    <Dropdown
                        options={teachers}
                        value={selectedTeacher}
                        onChange={(e) => setSelectedTeacher(e.value)}
                        optionLabel="firstName"
                        placeholder="select teacher"
                        className="w-full"
                    />
                    <Dropdown
                        options={subjects}
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.value)}
                        optionLabel="name"
                        placeholder="select subject"
                        className="w-full"
                    />
                    <Dropdown
                        options={classes}
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.value)}
                        optionLabel="name"
                        placeholder="select class"
                        className="w-full"
                    />
                    <Calendar
                        value={examDate}
                        onChange={(e) => setExamDate(e.value)}
                        dateFormat="yy-mm-dd"
                        className="w-full"
                    />
                    <Button label="save" icon="pi pi-check" onClick={handleSave} />
                </div>
            </Dialog>

            <Dialog header="----exam----" visible={showEventDialog} onHide={() => setShowEventDialog(false)} footer={
                <div className="flex justify-end gap-2">
                    <Button label="delete" icon="pi pi-trash" className="p-button-danger" onClick={handleDelete} />
                    <Button label="update" icon="pi pi-pencil" onClick={handleEditOpen} />
                    <Button label="cancle" icon="pi pi-times" onClick={() => setShowEventDialog(false)} />
                </div>
            }>
                <p><b>Grade:</b> {selectedClass?.name || '---'}</p>
                <p><b>Teacher:</b> {selectedTeacher ? `${selectedTeacher.firstName} ${selectedTeacher.lastName}` : '---'}</p>
                <p><b>Subject:</b> {selectedSubject?.name || '---'}</p>
                <p><b>Date:</b> {examDate ? examDate.toLocaleDateString() : '---'}</p>
            </Dialog>
        </Card>
    );
};

export default ExamSchedule;
