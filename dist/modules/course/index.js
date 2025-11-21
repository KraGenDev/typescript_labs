"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMostPopularCourseType = getMostPopularCourseType;
const data_1 = require("../../data");
function getMostPopularCourseType() {
    const counts = {
        "Lecture": 0, "Seminar": 0, "Lab": 0, "Practice": 0
    };
    data_1.schedule.forEach(lesson => {
        const course = data_1.courses.find(c => c.id === lesson.courseId);
        if (course) {
            counts[course.type]++;
        }
    });
    let max = -1;
    let popularType = "Lecture";
    for (const key in counts) {
        if (counts[key] > max) {
            max = counts[key];
            popularType = key;
        }
    }
    return popularType;
}
