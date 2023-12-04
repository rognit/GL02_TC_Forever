import inquirer from 'inquirer';
import { search } from '../src/GIFT/search.js';


export async function get_question_menu() {
  process.stdout.write('\x1B[2J\x1B[0f');
  const userInput = await inquirer.prompt({
    type: 'input',
    name: 'question',
    message: 'Enter the name of a question:',
  });

  const result = search(userInput.question);
  console.log(result);
}

export function create_test_menu() {

}
