"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_1 = require("./data");
const professor_1 = require("./modules/professor");
const lesson_1 = require("./modules/lesson");
const classroom_1 = require("./modules/classroom");
const course_1 = require("./modules/course");
// --- Ініціалізація даних ---
console.log("--- Ініціалізація даних ---");
(0, professor_1.addProfessor)({ id: 1, name: "Іваненко І.І.", department: "Математика" });
(0, professor_1.addProfessor)({ id: 2, name: "Петренко П.П.", department: "Фізика" });
data_1.classrooms.push({ number: "101", capacity: 30, hasProjector: true });
data_1.classrooms.push({ number: "102", capacity: 20, hasProjector: false });
data_1.courses.push({ id: 1, name: "Алгебра", type: "Lecture" });
data_1.courses.push({ id: 2, name: "Фізика", type: "Lab" });
// --- Робота з розкладом ---
console.log("--- Додавання занять ---");
(0, lesson_1.addLesson)({
    id: 1,
    courseId: 1,
    professorId: 1,
    classroomNumber: "101",
    dayOfWeek: "Monday",
    timeSlot: "8:30-10:00"
});
(0, lesson_1.addLesson)({
    id: 2,
    courseId: 2,
    professorId: 2,
    classroomNumber: "102",
    dayOfWeek: "Monday",
    timeSlot: "10:15-11:45"
});
// Конфлікт
console.log("Спроба додати конфліктне заняття:");
(0, lesson_1.addLesson)({
    id: 3,
    courseId: 2,
    professorId: 2,
    classroomNumber: "101",
    dayOfWeek: "Monday",
    timeSlot: "8:30-10:00"
});
// --- Звіти та модифікація ---
console.log("\n--- Звіти та Модифікація ---");
console.log("Вільні аудиторії (Пн, 8:30):", (0, classroom_1.findAvailableClassrooms)("8:30-10:00", "Monday"));
console.log("Найпопулярніший тип занять:", (0, course_1.getMostPopularCourseType)());
const reassignSuccess = (0, lesson_1.reassignClassroom)(1, "102");
console.log(`Перепризначення аудиторії (успіх): ${reassignSuccess}`);
(0, lesson_1.cancelLesson)(2);
console.log("Урок 2 скасовано.");
