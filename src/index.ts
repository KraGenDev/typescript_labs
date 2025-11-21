type DayOfWeek = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";

type TimeSlot = "8:30-10:00" | "10:15-11:45" | "12:15-13:45" | "14:00-15:30" | "15:45-17:15";

type CourseType = "Lecture" | "Seminar" | "Lab" | "Practice";

type Professor = {
    id: number;
    name: string;
    department: string;
};

type Classroom = {
    number: string;
    capacity: number;
    hasProjector: boolean;
};

type Course = {
    id: number;
    name: string;
    type: CourseType;
};

type Lesson = {
    id: number; // Додано для ідентифікації заняття при редагуванні/видаленні
    courseId: number;
    professorId: number;
    classroomNumber: string;
    dayOfWeek: DayOfWeek;
    timeSlot: TimeSlot;
};


// Робота з масивами даних


let professors: Professor[] = [];
let classrooms: Classroom[] = [];
let courses: Course[] = [];
let schedule: Lesson[] = [];

function addProfessor(professor: Professor): void {
    professors.push(professor);
}

// Функція додавання уроку використовує validateLesson, яка описана нижче.
// Завдяки підняттю (hoisting) функцій у JS/TS, це буде працювати коректно.
function addLesson(lesson: Lesson): boolean {
    const conflict = validateLesson(lesson);
    
    if (conflict !== null) {
        console.log(`Помилка додавання заняття: ${conflict.type}`);
        return false;
    }

    schedule.push(lesson);
    return true;
}

// Функції пошуку та фільтрації

function findAvailableClassrooms(timeSlot: TimeSlot, dayOfWeek: DayOfWeek): string[] {
    // Створюємо список номерів аудиторій, які вже зайняті у цей час
    const occupiedNumbers = schedule
        .filter(l => l.dayOfWeek === dayOfWeek && l.timeSlot === timeSlot)
        .map(l => l.classroomNumber);

    // Повертаємо тільки ті аудиторії, яких немає у списку зайнятих
    return classrooms
        .filter(c => !occupiedNumbers.includes(c.number))
        .map(c => c.number);
}

function getProfessorSchedule(professorId: number): Lesson[] {
    return schedule.filter(l => l.professorId === professorId);
}

// 5. Обробка конфліктів та валідація

type ScheduleConflict = {
    type: "ProfessorConflict" | "ClassroomConflict";
    lessonDetails: Lesson;
};

function validateLesson(lesson: Lesson): ScheduleConflict | null {
    // Перевіряємо, чи професор вже зайнятий у цей час в іншому місці.
    // Ми ігноруємо урок з таким самим id, щоб дозволити редагування (reassignClassroom).
    const professorConflict = schedule.find(l => 
        l.professorId === lesson.professorId &&
        l.dayOfWeek === lesson.dayOfWeek &&
        l.timeSlot === lesson.timeSlot &&
        l.id !== lesson.id
    );

    if (professorConflict) {
        return { type: "ProfessorConflict", lessonDetails: professorConflict };
    }

    // Перевіряємо, чи аудиторія вже зайнята у цей час.
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

// 6. Аналіз та звіти

function getClassroomUtilization(classroomNumber: string): number {
    // Вважаємо, що в тижні 5 днів по 5 слотів = 25 слотів - це 100%
    const totalSlots = 25;
    const usedSlots = schedule.filter(l => l.classroomNumber === classroomNumber).length;
    
    return (usedSlots / totalSlots) * 100;
}

function getMostPopularCourseType(): CourseType {
    // Об'єкт для підрахунку кількості кожного типу
    const counts: { [key: string]: number } = {
        "Lecture": 0, "Seminar": 0, "Lab": 0, "Practice": 0
    };

    schedule.forEach(lesson => {
        // Знаходимо курс по ID, щоб дізнатися його тип
        const course = courses.find(c => c.id === lesson.courseId);
        if (course) {
            counts[course.type]++;
        }
    });

    // Знаходимо тип з найбільшим значенням
    let max = -1;
    let popularType: CourseType = "Lecture";

    for (const key in counts) {
        if (counts[key] > max) {
            max = counts[key];
            popularType = key as CourseType;
        }
    }

    return popularType;
}

// 7. Модифікація даних

function reassignClassroom(lessonId: number, newClassroomNumber: string): boolean {
    const lessonIndex = schedule.findIndex(l => l.id === lessonId);
    if (lessonIndex === -1) return false;

    // Створюємо копію заняття з новою аудиторією, щоб перевірити валідацію.
    // Не змінюємо оригінал, поки не впевнимось, що конфліктів немає.
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

function cancelLesson(lessonId: number): void {
    const initialLength = schedule.length;
    schedule = schedule.filter(l => l.id !== lessonId);
    
    if (schedule.length === initialLength) {
        console.log("Заняття для видалення не знайдено.");
    }
}

// демонстрація роботи

console.log("--- Ініціалізація даних ---");
addProfessor({ id: 1, name: "Іваненко І.І.", department: "Математика" });
addProfessor({ id: 2, name: "Петренко П.П.", department: "Фізика" });

classrooms.push({ number: "101", capacity: 30, hasProjector: true });
classrooms.push({ number: "102", capacity: 20, hasProjector: false });

courses.push({ id: 1, name: "Алгебра", type: "Lecture" });
courses.push({ id: 2, name: "Фізика", type: "Lab" });

console.log("--- Додавання занять ---");
// Успішне додавання
addLesson({ id: 1, courseId: 1, professorId: 1, classroomNumber: "101", dayOfWeek: "Monday", timeSlot: "8:30-10:00" });
addLesson({ id: 2, courseId: 2, professorId: 2, classroomNumber: "102", dayOfWeek: "Monday", timeSlot: "10:15-11:45" });

// Спроба конфлікту (та ж аудиторія 101 у той же час понеділка)
console.log("Спроба додати конфліктне заняття:");
addLesson({ id: 3, courseId: 2, professorId: 2, classroomNumber: "101", dayOfWeek: "Monday", timeSlot: "8:30-10:00" });

console.log("\n--- Пошук та Звіти ---");
console.log("Вільні аудиторії пн 8:30:", findAvailableClassrooms("8:30-10:00", "Monday"));
console.log("Завантаженість 101:", getClassroomUtilization("101") + "%");
console.log("Найпопулярніший тип:", getMostPopularCourseType());

console.log("\n--- Модифікація ---");
// Зміна аудиторії для уроку 1 (з 101 на 102) - має пройти успішно, бо 102 вільна о 8:30
const moved = reassignClassroom(1, "102");
console.log(`Урок перенесено: ${moved}`);
console.log("Вільні аудиторії пн 8:30 після зміни:", findAvailableClassrooms("8:30-10:00", "Monday"));

// Скасування уроку
cancelLesson(2);
console.log("Кількість занять після видалення:", schedule.length);