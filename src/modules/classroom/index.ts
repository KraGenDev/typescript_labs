import { TimeSlot, DayOfWeek } from "../../types";
import { classrooms, schedule } from "../../data";

export function findAvailableClassrooms(timeSlot: TimeSlot, dayOfWeek: DayOfWeek): string[] {
    const occupiedNumbers = schedule
        .filter(l => l.dayOfWeek === dayOfWeek && l.timeSlot === timeSlot)
        .map(l => l.classroomNumber);

    return classrooms
        .filter(c => !occupiedNumbers.includes(c.number))
        .map(c => c.number);
}

export function getClassroomUtilization(classroomNumber: string): number {
    const totalSlots = 25; // 5 днів * 5 слотів
    const usedSlots = schedule.filter(l => l.classroomNumber === classroomNumber).length;
    
    return (usedSlots / totalSlots) * 100;
}