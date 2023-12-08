import fs from 'fs';
import inquirer from 'inquirer';
import { create_test_menu } from '../src/menus.js'; 
import { get_question_menu } from '../src/menus.js'; 
import * as MenusModule from '../src/menus.js'; // Assurez-vous que le chemin est correct

describe('create_test_menu', () => {
    beforeEach(() => {
        spyOn(inquirer, 'prompt').and.returnValues(
            Promise.resolve({ mainOption: 'Choose a Question' }),
            Promise.resolve({ mainOption: 'Finish and Save Test' })
        );

        // Mockez le comportement de la fonction get_question_menu directement
        spyOn(MenusModule, 'get_question_menu').and.returnValue(Promise.resolve({ title: 'Sample Question' }));

        spyOn(fs, 'writeFileSync');
    });

    it('should create a test and save it successfully', async () => {
        await create_test_menu();

        expect(inquirer.prompt).toHaveBeenCalledTimes(2);
        expect(MenusModule.get_question_menu).toHaveBeenCalled();
        expect(fs.writeFileSync).toHaveBeenCalled();
    });
});

