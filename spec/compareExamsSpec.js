import fs from 'fs';
import inquirer from 'inquirer';
import { Exam } from '../src/exam.js'; // Assurez-vous que le chemin est correct
import { compareExams_menu } from '../src/menus.js';

describe("compareExams_menu", () => {
    beforeEach(() => {
        spyOn(fs, 'readFileSync').and.returnValue(JSON.stringify([
            { name: 'Test 1', questions: [{ title: 'Question 1' }] },
            { name: 'Test 2', questions: [{ title: 'Question 2' }] }
        ]));

        spyOn(inquirer, 'prompt').and.returnValues(
            Promise.resolve({ selectedTest1: 'Test 1' }),
            Promise.resolve({ selectedTest2: 'Test 2' })
        );

        spyOn(Exam, 'compareExams');
    });

    it("should correctly compare two exams", async () => {
        await compareExams_menu();

        expect(fs.readFileSync).toHaveBeenCalled();
        expect(inquirer.prompt).toHaveBeenCalledTimes(2);
        expect(Exam.compareExams).toHaveBeenCalled();
    });
});
