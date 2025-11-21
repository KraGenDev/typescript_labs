"use strict";
const studentName = "Петро Щур";
const age = 20;
const hasScholarship = true;
function showStudentInfo(name, age, hasScholarship) {
    console.log(`Студент: ${name}`);
    console.log(`Вік: ${age} років`);
    if (hasScholarship) {
        console.log("Статус: Отримує стипендію");
    }
    else {
        console.log("Статус: Стипендія відсутня");
    }
}
showStudentInfo(studentName, age, hasScholarship);
