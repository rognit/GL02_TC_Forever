import inquirer from 'inquirer';
import { search } from '../src/GIFT/search.js';

export async function get_question_menu(is_for_creating_test) {
    process.stdout.write('\x1B[2J\x1B[0f');
    const userInput = await inquirer.prompt({
      type: 'input',
      name: 'question',
      message: 'Enter the name of a question:',
    });

    const searchResults = search(userInput.question);
    const resultTitles = searchResults.map(q => q.title);


    const userInput2 = await inquirer.prompt({
      type: 'list',
      name: 'selectedQuestion',
      message: 'Select a question:',
      choices: resultTitles,
    });
    
    const selectedQuestion = searchResults.find(q => q.title === userInput2.selectedQuestion);

    console.log('Selected Question:', selectedQuestion);

    // Wait for the user to press Enter
    await inquirer.prompt({
      type: 'input',
      name: 'enter',
      message: 'Press Enter to continue...',
    });
}


export async function create_test_menu() {
    const userInput = await inquirer.prompt({
      type: 'list',
      name: 'mainOption',
      message: 'Choose an option:',
      choices: ['Choose a Question', 'Fill the Test'],
    });

    if (userInput.mainOption === 'Choose a Question') {
      await get_question_menu();
    } else if (userInput.mainOption === 'Fill the Test') {
      //await fill_test();
    }
}