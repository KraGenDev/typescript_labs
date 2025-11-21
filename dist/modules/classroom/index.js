"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAvailableClassrooms = findAvailableClassrooms;
exports.getClassroomUtilization = getClassroomUtilization;
const data_1 = require("../../data");
function findAvailableClassrooms(timeSlot, dayOfWeek) {
    const occupiedNumbers = data_1.schedule
        .filter(l => l.dayOfWeek === dayOfWeek && l.timeSlot === timeSlot)
        .map(l => l.classroomNumber);
    return data_1.classrooms
        .filter(c => !occupiedNumbers.includes(c.number))
        .map(c => c.number);
}
function getClassroomUtilization(classroomNumber) {
    const totalSlots = 25; // 5 днів * 5 слотів
    const usedSlots = data_1.schedule.filter(l => l.classroomNumber === classroomNumber).length;
    return (usedSlots / totalSlots) * 100;
}
