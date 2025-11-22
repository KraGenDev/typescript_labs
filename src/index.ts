// enums

// Статус студента
enum StudentStatus {
    Active = "Active",
    Academic_Leave = "Academic Leave",
    Graduated = "Graduated",
    Expelled = "Expelled"
}

// Тип курсу
enum CourseType {
    Mandatory = "Mandatory",
    Optional = "Optional",
    Special = "Special"
}

// Семестр
enum Semester {
    First = "First",
    Second = "Second"
}

// Оцінки студентів
enum Grade {
    Excellent = 5,
    Good = 4,
    Satisfactory = 3,
    Unsatisfactory = 2
}

// Факультети
enum Faculty {
    Computer_Science = "Computer Science",
    Economics = "Economics",
    Law = "Law",
    Engineering = "Engineering"
}

// Interfaces

interface Student {
    id: number;
    fullName: string;
    faculty: Faculty;
    year: number;
    status: StudentStatus;
    enrollmentDate: Date;
    groupNumber: string;
}

interface Course {
    id: number;
    name: string;
    type: CourseType;
    credits: number;
    semester: Semester;
    faculty: Faculty;
    maxStudents: number;
}

// перейменовано з Grade на GradeEntry, щоб уникнути конфлікту імен з enum Grade
interface GradeEntry {
    studentId: number;
    courseId: number;
    grade: Grade;
    date: Date;
    semester: Semester;
}

// Додатковий інтерфейс для збереження реєстрації на курс (без оцінки)
interface CourseRegistration {
    studentId: number;
    courseId: number;
}

//  Class UniversityManagementSystem 

class UniversityManagementSystem {
    private students: Student[] = [];
    private courses: Course[] = [];
    private grades: GradeEntry[] = [];
    private registrations: CourseRegistration[] = [];
    
    private studentIdCounter = 1;
    private courseIdCounter = 1;

    // методи для додавання початкових даних 
    public addCourse(course: Omit<Course, "id">): Course {
        const newCourse: Course = { ...course, id: this.courseIdCounter++ };
        this.courses.push(newCourse);
        return newCourse;
    }


    /**
     * Зараховує студента до університету
     * Генерує унікальний ID
     */
    public enrollStudent(studentInfo: Omit<Student, "id">): Student {
        const newStudent: Student = {
            ...studentInfo,
            id: this.studentIdCounter++
        };
        this.students.push(newStudent);
        console.log(`Студент ${newStudent.fullName} успішно зарахований на факультет ${newStudent.faculty}.`);
        return newStudent;
    }

    /**
     * Реєструє студента на курс
     * Перевірки: чи існує студент/курс, ліміт місць, відповідність факультету.
     */
    public registerForCourse(studentId: number, courseId: number): void {
        const student = this.students.find(s => s.id === studentId);
        const course = this.courses.find(c => c.id === courseId);

        if (!student || !course) {
            throw new Error("Студента або курс не знайдено.");
        }

        // Перевірка чи студент вже зареєстрований
        const isAlreadyRegistered = this.registrations.some(
            r => r.studentId === studentId && r.courseId === courseId
        );
        if (isAlreadyRegistered) {
            throw new Error("Студент вже зареєстрований на цей курс.");
        }

        // Перевірка відповідності факультету (дозволяємо, якщо курс спільний або Special, або збігається факультет)
        if (course.faculty !== student.faculty && course.type !== CourseType.Special) {
             throw new Error(`Неможливо зареєструватися: курс для факультету ${course.faculty}, а студент з ${student.faculty}.`);
        }

        // Перевірка кількості студентів
        const currentStudentsOnCourse = this.registrations.filter(r => r.courseId === courseId).length;
        if (currentStudentsOnCourse >= course.maxStudents) {
            throw new Error("На курсі немає вільних місць.");
        }

        this.registrations.push({ studentId, courseId });
        console.log(`Студент ${student.fullName} успішно зареєстрований на курс "${course.name}".`);
    }

    // Виставляє оцінку студенту.
    public setGrade(studentId: number, courseId: number, grade: Grade): void {
        const registration = this.registrations.find(
            r => r.studentId === studentId && r.courseId === courseId
        );

        if (!registration) {
            throw new Error("Неможливо виставити оцінку: студент не зареєстрований на цей курс.");
        }

        const course = this.courses.find(c => c.id === courseId);
        
        const newGradeEntry: GradeEntry = {
            studentId,
            courseId,
            grade,
            date: new Date(),
            semester: course ? course.semester : Semester.First
        };

        this.grades.push(newGradeEntry);
        console.log(`Оцінка ${grade} виставлена студенту ID:${studentId} за курс ID:${courseId}.`);
    }

    /**
     * Оновлює статус студента
     * Валідація: не можна перевести відрахованого студента в статус Active без повторного зарахування.
     */
    public updateStudentStatus(studentId: number, newStatus: StudentStatus): void {
        const student = this.students.find(s => s.id === studentId);
        
        if (!student) {
            throw new Error("Студента не знайдено.");
        }

        if (student.status === StudentStatus.Expelled && newStatus === StudentStatus.Active) {
            throw new Error("Неможливо активувати відрахованого студента. Необхідна процедура поновлення.");
        }

        student.status = newStatus;
        console.log(`Статус студента ${student.fullName} змінено на ${newStatus}.`);
    }

    // Отманння студентів за факультетом
    public getStudentsByFaculty(faculty: Faculty): Student[] {
        return this.students.filter(s => s.faculty === faculty);
    }

    // Отримання оцінок студента
    public getStudentGrades(studentId: number): GradeEntry[] {
        return this.grades.filter(g => g.studentId === studentId);
    }

    // отримати доступні курси для факультету та семестру
    public getAvailableCourses(faculty: Faculty, semester: Semester): Course[] {
        return this.courses.filter(c => c.faculty === faculty && c.semester === semester);
    }

    // Обчислення середнього балу студента
    public calculateAverageGrade(studentId: number): number {
        const studentGrades = this.getStudentGrades(studentId);
        
        if (studentGrades.length === 0) return 0;

        const sum = studentGrades.reduce((acc, curr) => acc + curr.grade, 0);
        return parseFloat((sum / studentGrades.length).toFixed(2));
    }

    /**
     * Додатковий метод: Отримати список відмінників (середній бал = 5.0) по факультету
     */
    public getTopStudentsByFaculty(faculty: Faculty): Student[] {
        const facultyStudents = this.getStudentsByFaculty(faculty);
        
        return facultyStudents.filter(student => {
            const avg = this.calculateAverageGrade(student.id);
            return avg === 5;
        });
    }
}

// =================================================
// демонстрація роботи системи

try {
    const system = new UniversityManagementSystem();

    // створення курсів
    const jsCourse = system.addCourse({
        name: "TypeScript Fundamentals",
        type: CourseType.Mandatory,
        credits: 5,
        semester: Semester.First,
        faculty: Faculty.Computer_Science,
        maxStudents: 30
    });

    const historyCourse = system.addCourse({
        name: "World History",
        type: CourseType.Optional,
        credits: 3,
        semester: Semester.First,
        faculty: Faculty.Economics,
        maxStudents: 50
    });

    // додавання студентів
    const student1 = system.enrollStudent({
        fullName: "Щур Петро",
        faculty: Faculty.Computer_Science,
        year: 1,
        status: StudentStatus.Active,
        enrollmentDate: new Date(),
        groupNumber: "CS-101"
    });

    const student2 = system.enrollStudent({
        fullName: "Воділа Ярік",
        faculty: Faculty.Computer_Science,
        year: 1,
        status: StudentStatus.Active,
        enrollmentDate: new Date(),
        groupNumber: "CS-101"
    });

    // реєстрація студентів на курси
    system.registerForCourse(student1.id, jsCourse.id);
    system.registerForCourse(student2.id, jsCourse.id);


    // виставлення оцінок
    system.setGrade(student1.id, jsCourse.id, Grade.Excellent);
    system.setGrade(student2.id, jsCourse.id, Grade.Good);

    // отримання інформації
    const avarageGradeStudent1 = system.calculateAverageGrade(student1.id);
    console.log(`Середній бал студента ${student1.fullName}: ${avarageGradeStudent1}`);

    console.log("Студенти Computer Science:");
    console.table(system.getStudentsByFaculty(Faculty.Computer_Science));

    console.log("Відмінники Computer Science:");
    const topStudents = system.getTopStudentsByFaculty(Faculty.Computer_Science);
    topStudents.forEach(s => console.log(s.fullName));

    // оновлення статусу студента
    system.updateStudentStatus(student2.id, StudentStatus.Academic_Leave);

} catch (error: any) {
    console.error("Виникла помилка:", error.message);
}