import { CourseType } from "../../types";
import { courses, schedule } from "../../data";

export function getMostPopularCourseType(): CourseType {
    const counts: { [key: string]: number } = {
        "Lecture": 0, "Seminar": 0, "Lab": 0, "Practice": 0
    };

    schedule.forEach(lesson => {
        const course = courses.find(c => c.id === lesson.courseId);
        if (course) {
            counts[course.type]++;
        }
    });

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