import inquirer from 'inquirer';
import { get_question_menu } from './src/menus.js';

const mainMenuQuestions = [
    {
      type: 'list',
      name: 'action',
      message: 'Choose an action:',
      choices: [
        'Search Question',
        'Create a test',
        'Exit',
      ],
    },
  ];

async function runMainMenu() {
    let keepRunning = true;
  
    while (keepRunning) {
      process.stdout.write('\x1B[2J\x1B[0f');
      const { action } = await inquirer.prompt(mainMenuQuestions);
  
      switch (action) {
        case 'Search Question':
          await get_question_menu();
          break;
        case 'Action 2':
          action2();
          break;
        case 'Action 3':
          action3();
          break;
        case 'Exit':
          console.log('Exiting...');
          keepRunning = false;
          break;
  
        default:
          console.log('Invalid choice. Please choose a valid option.');
      }
    }
}
  
runMainMenu();
