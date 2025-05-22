import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Chart } from 'primereact/chart';

const Graph = ({ classId, teacherId }) => {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedTest, setSelectedTest] = useState(null);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [tests, setTests] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [grades, setGrades] = useState([]);
  const [yearlyData, setYearlyData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!teacherId) return;
    const fetchSubjects = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/subject/getSubjectsByTeacherId/${teacherId}`);
        setSubjects(response.data);
        setError(null);
      } catch (err) {
        setError('שגיאה בשליפת מקצועות: ' + err.message);
      }
    };
    fetchSubjects();
  }, [teacherId]);

  useEffect(() => {
    if (!selectedSubject || !classId || !teacherId) {
      setTests([]);
      return;
    }

    const fetchExams = async () => {
      try {
        const response = await axios.get('http://localhost:8080/exam/getExamsBySubjectAndClass', {
          params: { subjectId: selectedSubject, classId, teacherId },
        });
        setTests(response.data);
        setError(null);
      } catch (err) {
        setError('שגיאה בשליפת מבחנים: ' + err.message);
      }
    };

    const fetchYearlyAverage = async () => {
      try {
        const year = new Date().getFullYear();
        const response = await axios.get('http://localhost:8080/grade/getAverageGradeBySubjectOfYear', {
          params: { subjectId: selectedSubject, classId, teacherId, year },
        });
        console.log('קיבלתי נתונים מהשרת:', response.data); 

        const exams = response.data;
        const labels = exams.map(e => new Date(e.examDate).toLocaleDateString('he-IL'));
        const averages = exams.map(e => e.averageGrade);

        setYearlyData({
          labels,
          datasets: [{ label: 'ממוצע מבחן לפי תאריך', backgroundColor: '#42A5F5', data: averages }],
        });
      } catch (err) {
        setError('שגיאה בטעינת ממוצע שנתי: ' + err.message);
        setYearlyData(null);
      }
    };

    fetchExams();
    fetchYearlyAverage();
  }, [selectedSubject, classId, teacherId]);

  const fetchGrades = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/grade/getGradesByExamAndClass/${selectedTest}`);
      const grades = response.data;
      setGrades(grades);

      if (!grades.length) {
        setChartData(null);
        setLoading(false);
        return;
      }

      const labels = grades.map(g => `${g.studentId.firstName} ${g.studentId.lastName}`);
      const studentScores = grades.map(g => g.grade);
      const average = studentScores.reduce((a, b) => a + b, 0) / studentScores.length;
      const averageScores = new Array(studentScores.length).fill(average);

      setChartData({
        labels,
        datasets: [
          { label: 'ציון התלמיד', backgroundColor: '#42A5F5', data: studentScores },
          { label: 'ממוצע הכיתה', backgroundColor: '#66BB6A', data: averageScores },
        ],
      });
      setError(null);
    } catch (err) {
      setError('שגיאה בטעינת ציונים: ' + err.message);
      setChartData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedTest) fetchGrades();
  }, [selectedTest]);

  const calculateMedian = (grades) => {
    const values = grades.map(g => g.grade).sort((a, b) => a - b);
    const mid = Math.floor(values.length / 2);
    return (values.length % 2 === 0)
      ? ((values[mid - 1] + values[mid]) / 2).toFixed(2)
      : values[mid].toFixed(2);
  };

  const calculateStdDev = (grades) => {
    const values = grades.map(g => g.grade);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / values.length;
    return Math.sqrt(variance).toFixed(2);
  };

  const calculateDistribution = (grades) => {
    let group90 = 0, group80 = 0, group70 = 0, groupLow = 0;
    grades.forEach(g => {
      if (g.grade >= 90) group90++;
      else if (g.grade >= 80) group80++;
      else if (g.grade >= 70) group70++;
      else groupLow++;
    });
    return [group90, group80, group70, groupLow];
  };

  const chartStyle = { width: '360px', height: '250px', margin: 'auto' };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">בחר מקצוע</h2>
      <Dropdown
        value={selectedSubject}
        options={subjects.map(sub => ({ label: sub.name, value: sub._id }))}
        onChange={e => { setSelectedSubject(e.value); setSelectedTest(null); setSelectedFeature(null); setError(null); }}
        placeholder="בחר מקצוע"
        className="w-full md:w-60 mb-4"
      />

      {yearlyData && (
        <>
          <h3 className="text-lg font-semibold mt-4 mb-2">גרף ציוני ממוצע לפי תאריכים</h3>
          <div style={chartStyle}>
            <Chart type="line" data={yearlyData} />
          </div>
        </>
      )}

      {selectedSubject && (
        <>
          <h3 className="text-lg font-semibold mt-5 mb-2">בחר מבחן</h3>
          <Dropdown
            value={selectedTest}
            options={tests.map(test => ({ label: new Date(test.examDate).toLocaleDateString('he-IL'), value: test._id }))}
            onChange={e => { setSelectedTest(e.value); setSelectedFeature(null); setError(null); }}
            placeholder="בחר מבחן"
            className="w-full md:w-60 mb-4"
          />
        </>
      )}

      {selectedTest && (
        <>
          <div className="flex flex-wrap gap-2 mb-4">
            <Button label="גרף ציונים מול ממוצע" className="p-button-info" onClick={() => setSelectedFeature('average')} />
            <Button label="התפלגות ציונים" className="p-button-success" onClick={() => setSelectedFeature('distribution')} />
            <Button label="סטיית תקן" className="p-button-warning" onClick={() => setSelectedFeature('stddev')} />
            <Button label="חציון" className="p-button-help" onClick={() => setSelectedFeature('median')} />
          </div>

          {loading && <div>טוען נתונים...</div>}

          {selectedFeature === 'average' && chartData && !loading && (
            <div style={chartStyle}>
              <Chart type="bar" data={chartData} />
            </div>
          )}

          {selectedFeature === 'distribution' && !loading && (
            <div style={chartStyle}>
              <Chart
                type="pie"
                data={{
                  labels: ['90+', '80–89', '70–79', '<70'],
                  datasets: [
                    { data: calculateDistribution(grades), backgroundColor: ['#4CAF50', '#2196F3', '#FFC107', '#F44336'] },
                  ],
                }}
              />
            </div>
          )}

          {selectedFeature === 'stddev' && !loading && (
            <div className="mt-3 text-center text-lg">
              סטיית תקן: <strong>{calculateStdDev(grades)}</strong>
            </div>
          )}

          {selectedFeature === 'median' && !loading && (
            <div className="mt-3 text-center text-lg">
              חציון הציונים: <strong>{calculateMedian(grades)}</strong>
            </div>
          )}
        </>
      )}

      {error && <div className="text-red-500 mt-4">{error}</div>}
    </div>
  );
};

export default Graph;
