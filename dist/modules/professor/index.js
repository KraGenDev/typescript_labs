"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addProfessor = addProfessor;
exports.getProfessorSchedule = getProfessorSchedule;
const data_1 = require("../../data");
function addProfessor(professor) {
    data_1.professors.push(professor);
}
function getProfessorSchedule(professorId) {
    return data_1.schedule.filter(l => l.professorId === professorId);
}
