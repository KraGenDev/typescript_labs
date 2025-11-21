
const studentName: string = "Петро Щур";


const age: number = 20;


const hasScholarship: boolean = true;


function showStudentInfo(name: string, age: number, hasScholarship: boolean): void {
    console.log(`Студент: ${name}`);
    console.log(`Вік: ${age} років`);

    if (hasScholarship) {
        console.log("Статус: Отримує стипендію");
    } else {
        console.log("Статус: Стипендія відсутня");
    }
}


showStudentInfo(studentName, age, hasScholarship);