import inquirer from 'inquirer';
import { search } from '../src/GIFT/search.js';
import { saveVCardFromUserInput } from '../src/Vcard/vcard.js';

export async function get_question_menu() {
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

export async function create_vcard_menu() {
  const answers = await inquirer.prompt([
    { type: 'input', name: 'prenom', message: 'Entrez le prénom :' },
    { type: 'input', name: 'nom', message: 'Entrez le nom :' },
    { type: 'input', name: 'nomEtablissement', message: 'Entrez le nom de l\'établissement :' },
    { type: 'input', name: 'poste', message: 'Entrez le poste :' },
    { type: 'input', name: 'numeroTel', message: 'Entrez le numéro de téléphone (format : +33 1 23 45 67 89) :' },
    { type: 'input', name: 'numeroRue', message: 'Entrez le numéro de rue :' },
    { type: 'input', name: 'nomRue', message: 'Entrez le nom de la rue :' },
    { type: 'input', name: 'bp', message: 'Entrez le numéro de boîte postale :' },
    { type: 'input', name: 'ville', message: 'Entrez la ville :' },
  ]);
  answers.siteWeb = 'www.' + answers.nomEtablissement.toLowerCase() + '.fr';

  saveVCardFromUserInput(answers)

  // Ajouter des calculs pour les valeurs dérivées comme email et siteWeb
}

export async function inputToSearchVcard() {
  const answers = await inquirer.prompt([
    { type: 'input', name: 'prenom', message: 'Entrez le prénom à rechercher :' },
    { type: 'input', name: 'nom', message: 'Entrez le nom à rechercher :' },
  ]);
}
