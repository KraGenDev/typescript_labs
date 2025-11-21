"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLesson = validateLesson;
exports.addLesson = addLesson;
exports.reassignClassroom = reassignClassroom;
exports.cancelLesson = cancelLesson;
const data_1 = require("../../data");
function validateLesson(lesson) {
    const professorConflict = data_1.schedule.find(l => l.professorId === lesson.professorId &&
        l.dayOfWeek === lesson.dayOfWeek &&
        l.timeSlot === lesson.timeSlot &&
        l.id !== lesson.id);
    if (professorConflict) {
        return { type: "ProfessorConflict", lessonDetails: professorConflict };
    }
    const classroomConflict = data_1.schedule.find(l => l.classroomNumber === lesson.classroomNumber &&
        l.dayOfWeek === lesson.dayOfWeek &&
        l.timeSlot === lesson.timeSlot &&
        l.id !== lesson.id);
    if (classroomConflict) {
        return { type: "ClassroomConflict", lessonDetails: classroomConflict };
    }
    return null;
}
function addLesson(lesson) {
    // Використовуємо функцію валідації з цього ж модуля
    const conflict = validateLesson(lesson);
    if (conflict !== null) {
        console.log(`Помилка додавання заняття: ${conflict.type}`);
        return false;
    }
    data_1.schedule.push(lesson);
    return true;
}
function reassignClassroom(lessonId, newClassroomNumber) {
    const lessonIndex = data_1.schedule.findIndex(l => l.id === lessonId);
    if (lessonIndex === -1)
        return false;
    const tempLesson = Object.assign(Object.assign({}, data_1.schedule[lessonIndex]), { classroomNumber: newClassroomNumber });
    const conflict = validateLesson(tempLesson);
    if (conflict === null) {
        data_1.schedule[lessonIndex].classroomNumber = newClassroomNumber;
        return true;
    }
    else {
        console.log(`Неможливо змінити аудиторію: ${conflict.type}`);
        return false;
    }
}
function cancelLesson(lessonId) {
    const index = data_1.schedule.findIndex(l => l.id === lessonId);
    if (index !== -1) {
        data_1.schedule.splice(index, 1); // Видаляємо елемент з масиву
    }
    else {
        console.log("Заняття для видалення не знайдено.");
    }
}
