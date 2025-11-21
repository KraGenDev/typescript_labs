import { Professor, Lesson } from "../../types";
import { professors, schedule } from "../../data";

export function addProfessor(professor: Professor): void {
    professors.push(professor);
}

export function getProfessorSchedule(professorId: number): Lesson[] {
    return schedule.filter(l => l.professorId === professorId);
}