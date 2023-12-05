import inquirer from 'inquirer';
import { search } from '../src/GIFT/search.js';
import fs from 'fs';

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

function saveTest(questions) {
  const testFileName = 'test_db.json'; // Nom du fichier de sauvegarde

  // Lecture du contenu actuel du fichier (s'il existe)
  let existingTests = [];
  try {
    const fileContent = fs.readFileSync(testFileName, 'utf8');
    existingTests = JSON.parse(fileContent);
  } catch (error) {
    // Ignorer les erreurs liées à la lecture du fichier
  }

  // Ajout du nouveau test à la liste des tests existants
  existingTests.push(questions);

  // Écriture du contenu mis à jour dans le fichier
  fs.writeFileSync(testFileName, JSON.stringify(existingTests, null, 2), 'utf8');
}

export async function create_test_menu() {
  const questions = [];

  while (true) {

    //constante pour controller l'apparition des choix 
    const remainingQuestions = 20 - questions.length;

    const choices = [];

    //si le test a moins de 15 questions, l'option pour sauvegarder n'apparais pas
    if (questions.length >= 15) {
      choices.unshift('Finish and Save Test');
    }

    //si le test a 20 questions, alors il n'est plus possible d'en ajouter ou de le remplir
    if (questions.length < 20) {
      choices.unshift('Fill the Test');
    }
    
    if (questions.length < 20) {
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
      if (questions.length < 20) {
        const questionNumber = await get_question_menu();
        questions.push({
          number: questionNumber,
        });
      } else {
        console.log('Error: Test has reached the maximum limit of 20 questions.'); //au cas ou mais pas necessaire normalement (on a deja mis condition sur l'apparition des choix)
      }
    } else if (userInput.mainOption === 'Fill the Test') {
      const remainingQuestions = 20 - questions.length;

      //cette option rempli le test totalement (donc jusqu'a 20 questions), on pourrais pousser plus loin en remplissant jusqu'a un nombre aleatoire entre 15 et 20
      if (remainingQuestions > 0) {
        const randomQuestions = await getRandomQuestions(remainingQuestions);

        questions.push(...randomQuestions);
        console.log(`${randomQuestions.length} random questions added to the test.`);
      } else {
        console.log('Error: Test has reached the maximum limit of 20 questions.');//pareil une secu normalement ne sert a rien
      }
    } else if (userInput.mainOption === 'Finish and Save Test') { //a faire
      
        saveTest(questions);
        console.log('Test created and saved successfully!');
        break;
    }
  }
}

// Example function to get random questions
async function getRandomQuestions(count) {
  // Implement logic to fetch random questions from your database or source
  // Adjust as needed based on your data model
  const randomQuestions = [];

  // Example: Fetch random questions from a hypothetical question database
  for (let i = 0; i < count; i++) {
    const questionNumber = await getRandomQuestionNumber();
    randomQuestions.push({
      number: questionNumber,
    });
  }

  return randomQuestions;
}

// Example function to fetch a random question number (adjust as needed)
async function getRandomQuestionNumber() {
  // Implement logic to fetch a random question number from your database or source
  // Adjust as needed based on your data model
  return Math.floor(Math.random() * 100); // Example: Generate a random number between 0 and 99
}

// Rest of the code remains the same...