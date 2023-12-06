import inquirer from 'inquirer';
import { saveVCardFromUserInput } from '../src/Vcard/vcard.js';
import fs from 'fs';
import { search, getAllTestNames } from './GIFT/search.js';
import {SubQuestion } from './GIFT/parser.js';
import { Exam, saveTest, getRandomQuestions, getTestName } from './exam.js';
import { GIFT } from "./GIFT/gift.js";

let userResponses = [];

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
  const questions = [];
  let selectedQuestion;
  let testName = '';

  while (true) {
    const choices = [];

    //si le test a moins de 15 questions, l'option pour sauvegarder n'apparais pas
    if (questions.length >= 15) {
      choices.unshift('Finish and Save Test');
    }

    //si le test a 20 questions, alors il n'est plus possible d'en ajouter ou de le remplir
    if (questions.length < 20) {
      choices.unshift('Fill the Test');
      choices.unshift('Choose a Question');
    }

    const userInput = await inquirer.prompt({
      type: 'list',
      name: 'mainOption',
      message: 'Choose an option:',
      choices: choices,
    });

    //on reutilise get_question_menu
    if (userInput.mainOption === 'Choose a Question') {
      const result = await get_question_menu();
      questions.push(result);
      // Vous pouvez également utiliser le résultat de l'attente de l'utilisateur ici si nécessaire
    } else if (userInput.mainOption === 'Fill the Test') {
      const remainingQuestions = 20 - questions.length;

      //cette option rempli le test totalement (donc jusqu'a 20 questions), on pourrais pousser plus loin en remplissant jusqu'a un nombre aleatoire entre 15 et 20
      if (remainingQuestions > 0) {
        const randomQuestions = await getRandomQuestions(remainingQuestions);

        questions.push(...randomQuestions);
        console.log(`${randomQuestions.length} random questions added to the test.`);
      } else {
        console.log('Error: Test has reached the maximum limit of 20 questions.'); //pareil une secu normalement ne sert a rien
      }
    } else if (userInput.mainOption === 'Finish and Save Test') {
      if (!testName) {
        testName = await getTestName(); // Demandez le nom du test s'il n'est pas déjà défini
      }

      saveTest(testName, questions);
      console.log('Test created and saved successfully!');
      break;
    }
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
}

export async function simulate_test_menu() {
  const testNames = getAllTestNames();

  const userInput = await inquirer.prompt({
    type: 'list',
    name: 'selectedTest',
    message: 'Choose a test to simulate:',
    choices: testNames,
  });

  const jsonContent = fs.readFileSync('./src/Storage/test_db.json', 'utf-8');
  const loadedTestDatabase = JSON.parse(jsonContent);

  const selectedTest = loadedTestDatabase.find(test => test.name === userInput.selectedTest);

  const questions = selectedTest.questions;

  for (const question of questions) {
    console.log(`Question: ${question.title}`);
    console.log(`Body: ${processBody(question.body)}`);

    // Vérifier le type de la question
    if (question.body[1].type === 'INPUT') {
      // Question de type INPUT
      const userInput = await inquirer.prompt({
        type: 'input',
        name: 'userInput',
        message: 'Enter your answer:',
      });
      console.log(`Your answer: ${userInput.userInput}`);
    } else if (question.body[1].type === 'CHOICE') {
      // Question de type CHOICE
      const options = question.body[1].options.map(option => option.value);
      const userInput = await inquirer.prompt({
        type: 'list',  // Utilisez 'list' au lieu de 'input'
        name: 'userChoice',
        message: 'Choose one of the options:',
        choices: options,
      });
      console.log(`Your choice: ${userInput.userChoice}`);
    }

    // Ajouter d'autres types de questions selon vos besoins

    console.log(); // Ajouter une ligne vide entre les questions
  }

  console.log('Test completed!');
}

function processBody(body) {
  if (Array.isArray(body)) {
    let optionIndex = 1;
    return body.map((item) => {
      if (typeof item === 'string') {
        return item;
      } else if (item.type === 'INPUT') {
        return '';
      } else if (item.type === 'CHOICE') {
        return '';
      } else if (typeof item === 'object' && item.value) {
        return typeof item.value === 'string' ? item.value : '';
      }
    }).join('');
  } else {
    return ''; // Gérer d'autres types de corps si nécessaire
  }
}



export async function inputToSearchVcard() {
  const answers = await inquirer.prompt([
    { type: 'input', name: 'prenom', message: 'Entrez le prénom à rechercher :' },
    { type: 'input', name: 'nom', message: 'Entrez le nom à rechercher :' },
  ]);
}

