import { Lesson, ScheduleConflict } from "../../types";
import { schedule } from "../../data";

export function validateLesson(lesson: Lesson): ScheduleConflict | null {
    const professorConflict = schedule.find(l => 
        l.professorId === lesson.professorId &&
        l.dayOfWeek === lesson.dayOfWeek &&
        l.timeSlot === lesson.timeSlot &&
        l.id !== lesson.id
    );

    if (professorConflict) {
        return { type: "ProfessorConflict", lessonDetails: professorConflict };
    }

    const classroomConflict = schedule.find(l => 
        l.classroomNumber === lesson.classroomNumber &&
        l.dayOfWeek === lesson.dayOfWeek &&
        l.timeSlot === lesson.timeSlot &&
        l.id !== lesson.id
    );

    if (classroomConflict) {
        return { type: "ClassroomConflict", lessonDetails: classroomConflict };
    }

    return null;
}

export function addLesson(lesson: Lesson): boolean {
    // Використовуємо функцію валідації з цього ж модуля
    const conflict = validateLesson(lesson);
    
    if (conflict !== null) {
        console.log(`Помилка додавання заняття: ${conflict.type}`);
        return false;
    }

    schedule.push(lesson);
    return true;
}

export function reassignClassroom(lessonId: number, newClassroomNumber: string): boolean {
    const lessonIndex = schedule.findIndex(l => l.id === lessonId);
    if (lessonIndex === -1) return false;

    const tempLesson = { ...schedule[lessonIndex], classroomNumber: newClassroomNumber };
    
    const conflict = validateLesson(tempLesson);
    
    if (conflict === null) {
        schedule[lessonIndex].classroomNumber = newClassroomNumber;
        return true;
    } else {
        console.log(`Неможливо змінити аудиторію: ${conflict.type}`);
        return false;
    }
}

export function cancelLesson(lessonId: number): void {
    const index = schedule.findIndex(l => l.id === lessonId);
    if (index !== -1) {
        schedule.splice(index, 1); // Видаляємо елемент з масиву
    } else {
        console.log("Заняття для видалення не знайдено.");
    }
}