import { classrooms, courses } from "./data";
import { addProfessor } from "./modules/professor";
import { addLesson, reassignClassroom, cancelLesson } from "./modules/lesson";
import { findAvailableClassrooms, getClassroomUtilization } from "./modules/classroom";
import { getMostPopularCourseType } from "./modules/course";

// --- Ініціалізація даних ---
console.log("--- Ініціалізація даних ---");

addProfessor({ id: 1, name: "Іваненко І.І.", department: "Математика" });
addProfessor({ id: 2, name: "Петренко П.П.", department: "Фізика" });

classrooms.push({ number: "101", capacity: 30, hasProjector: true });
classrooms.push({ number: "102", capacity: 20, hasProjector: false });

courses.push({ id: 1, name: "Алгебра", type: "Lecture" });
courses.push({ id: 2, name: "Фізика", type: "Lab" });

// --- Робота з розкладом ---
console.log("--- Додавання занять ---");

addLesson({ 
    id: 1, 
    courseId: 1, 
    professorId: 1, 
    classroomNumber: "101", 
    dayOfWeek: "Monday", 
    timeSlot: "8:30-10:00" 
});

addLesson({ 
    id: 2, 
    courseId: 2, 
    professorId: 2, 
    classroomNumber: "102", 
    dayOfWeek: "Monday", 
    timeSlot: "10:15-11:45" 
});

// Конфлікт
console.log("Спроба додати конфліктне заняття:");
addLesson({ 
    id: 3, 
    courseId: 2, 
    professorId: 2, 
    classroomNumber: "101", 
    dayOfWeek: "Monday", 
    timeSlot: "8:30-10:00" 
});

// --- Звіти та модифікація ---
console.log("\n--- Звіти та Модифікація ---");
console.log("Вільні аудиторії (Пн, 8:30):", findAvailableClassrooms("8:30-10:00", "Monday"));
console.log("Найпопулярніший тип занять:", getMostPopularCourseType());

const reassignSuccess = reassignClassroom(1, "102");
console.log(`Перепризначення аудиторії (успіх): ${reassignSuccess}`);

cancelLesson(2);
console.log("Урок 2 скасовано.");