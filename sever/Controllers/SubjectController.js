const mongoose = require('mongoose')
const Subject = require('../Models/SubjectModel')

const createSubject = async (req, res) => {
    const  subjectData  = req.body;
    try {
        const subject = new Subject(subjectData);
        await subject.save();
        console.log('Subject Created:', subject);
        res.status(201).json(subject); }
        catch (error) {
            console.error('Error creating subject:', error);
            res.status(500).send('Server Error');
        }
        
}

const getSubjects = async (req, res) => {
    try {
        const subjects = await Subject.find();
        console.log('Subjects:', subjects);
        res.status(200).json(subjects); 
    } catch (error) {
        console.error('Error fetching subjects:', error);
        res.status(500).send('Server Error');
    }
};

const getSubjectById = async (req, res) => {
    const { id } = req.params;
    try {
        const subject = await Subject.findById(id);
        if (!subject) {
            return res.status(404).send('Subject not found');
        }
        res.status(200).json(subject);
    } catch (error) {
        console.error('Error fetching subject by ID:', error);
        res.status(500).send('Server Error');
    }
};

const updateSubject = async (req, res) => {
    const  {id}  = req.params; 
    try {
        const subject = await Subject.findByIdAndUpdate(id, req.body, { new: true }); // תיקון
        if (!subject) {
            return res.status(404).send('Subject not found');
        }
        console.log('Subject Updated:', subject);
        res.status(200).json(subject); 
    } catch (error) {
        console.error('Error updating subject:', error);
        res.status(500).send('Server Error');
    }
};

const deleteSubject = async (req, res) => {
    const { id } = req.params;
    try {
        const subject = await Subject.findByIdAndDelete(id);
        if (!subject) {
            return res.status(404).send('Subject not found');
        }
        console.log('Subject Deleted');
        res.status(204).send(); 
    } catch (error) {
        console.error('Error deleting subject:', error);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    deleteSubject, updateSubject, getSubjects, createSubject,getSubjectById
};
