import inquirer from 'inquirer';
import { saveVCardFromUserInput, searchAndDisplayContactInfo } from './Vcard/vcard.js';
import fs from 'fs';
import { search, getAllTestNames } from './GIFT/search.js';
import { Exam, saveTest, getRandomQuestions, getTestName, shuffle} from './exam.js';
import { processBody } from './GIFT/gift.js';

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
  console.log(`Question: ${selectedQuestion.title} \n Body: ${processBody(selectedQuestion.body)}`);

  // Wait for the user to press Enter
  await inquirer.prompt({
    type: 'input',
    name: 'enter',
    message: 'Press Enter to continue...',
  });

  return selectedQuestion;
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
      if (result) {
        questions.push(result); // Ajoutez la question sélectionnée à l'array
        console.log('Question added to the test.');
      }
    }  else if (userInput.mainOption === 'Fill the Test') {
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

export async function search_vcard_menu() {
  const answers = await inquirer.prompt([
      { type: 'input', name: 'prenom', message: 'Entrez le prénom :'},
      { type: 'input', name: 'nom', message: 'Entrez le nom :'},
  ]);

  await searchAndDisplayContactInfo(answers);
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
    process.stdout.write('\x1B[2J\x1B[0f');
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
    } else if (question.body[1].type === 'NUMBER') {
      // Question de type CHOICE
      const options = question.body[1].options.map(option => option.value);
      const userInput = await inquirer.prompt({
        type: 'input',
        name: 'userInput',
        message: 'Enter a number :',
      });
      console.log(`Your answer: ${userInput.userInput}`);
    } else if (question.body[1].type === 'BOOLEAN') {
      // Question de type BOOLEAN
      const userInput = await inquirer.prompt({
        type: 'list',
        name: 'userBoolean',
        message: 'Choose True or False:',
        choices: ['True', 'False'],
      });
      console.log(`Your choice: ${userInput.userBoolean}`);
    }else if (question.body[1].type === 'MATCHING') {
      // Question de type MATCHING
      const matchingOptions = question.body[1].options.map(option => option.value);
      const shuffledOptions = shuffle(matchingOptions);
      const formattedOptions = shuffledOptions.map(option => {
        const [before, after] = option.split(' -> ');
        return `${before}    |    ${after}`;
      });
    
      const userInput = await inquirer.prompt({
        type: 'editor',
        name: 'userMatching',
        message: 'Match the elements to make collocations:',
        validate: function (input) {
          // Vous pouvez ajouter une logique de validation personnalisée si nécessaire
          return true;
        },
        default: formattedOptions.join('\n'),
      });
    
      console.log('Your matching answers:');
      console.log(userInput.userMatching);
    }


    // Ajouter d'autres types de questions selon vos besoins

    console.log(); // Ajouter une ligne vide entre les questions
  }

  console.log('Test completed!');
}

export async function inputToSearchVcard() {
  const answers = await inquirer.prompt([
    { type: 'input', name: 'prenom', message: 'Entrez le prénom à rechercher :' },
    { type: 'input', name: 'nom', message: 'Entrez le nom à rechercher :' },
  ]);
}

export async function exam_profile_menu() {
  const jsonContent = fs.readFileSync('./src/Storage/test_db.json', 'utf-8');
  const loadedTestDatabase = JSON.parse(jsonContent);

  const testNames = loadedTestDatabase.map(test => test.name);
  const userInput = await inquirer.prompt({
    type: 'list',
    name: 'selectedTest',
    message: 'Choose a test to simulate:',
    choices: testNames,
  });

  // Trouver le test sélectionné dans la base de données
  const selectedTest = loadedTestDatabase.find(test => test.name === userInput.selectedTest);

  // Instancier un objet Exam avec le test sélectionné
  const exam = new Exam(selectedTest.name, selectedTest.questions);

  // Appeler la méthode viewProfile sur l'objet exam
  await exam.viewProfile();
}

export async function compareExams_menu() {
  const jsonContent = fs.readFileSync('./src/Storage/test_db.json', 'utf-8');
  const loadedTestDatabase = JSON.parse(jsonContent);

  const testNames = loadedTestDatabase.map(test => test.name);

  const userInput = await inquirer.prompt({
    type: 'list',
    name: 'selectedTest1',
    message: 'Choose the first test to compare:',
    choices: testNames,
  });

  const userInput2 = await inquirer.prompt({
    type: 'list',
    name: 'selectedTest2',
    message: 'Choose the second test to compare:',
    choices: testNames,
  });

  //console.log(`Comparing ${userInput.selectedTest1} with ${userInput2.selectedTest2}...`);
  // Trouver les tests sélectionnés dans la base de données
  const selectedTest1 = loadedTestDatabase.find(test => test.name === userInput.selectedTest1);
  const selectedTest2 = loadedTestDatabase.find(test => test.name === userInput2.selectedTest2);

  if (!selectedTest1 || !selectedTest2) {
    console.log('One or both of the selected tests could not be found.');
    return;
  }

  // Instancier des objets Exam avec les tests sélectionnés
  const exam1 = new Exam(selectedTest1.name, selectedTest1.questions);
  const exam2 = new Exam(selectedTest2.name, selectedTest2.questions);

  // Comparer les examens
  await Exam.compareExams(exam1, exam2);
}

