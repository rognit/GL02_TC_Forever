import inquirer from 'inquirer';
import { search } from '../src/GIFT/search.js';
import fs from 'fs';

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

  return selectedQuestion; // Renvoie la question sélectionnée
}

function saveTest(questions) {
  const testFileName = 'test_db.json'; // Nom du fichier de sauvegarde

  // Lecture du contenu actuel du fichier (s'il existe)
  let existingTests = [];
  try {
    const fileContent = fs.readFileSync(`./src/GIFT/${testFileName}`, 'utf8');
    existingTests = JSON.parse(fileContent);
  } catch (error) {
    // Ignorer les erreurs liées à la lecture du fichier
  }

  // Ajout du nouveau test à la liste des tests existants
  existingTests.push(...questions);

  // Écriture du contenu mis à jour dans le fichier
  fs.writeFileSync(`./src/GIFT/${testFileName}`, JSON.stringify(existingTests, null, 2), 'utf8');
}

export async function create_test_menu() {
  const questions = [];
  let selectedQuestion;

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
        const result = await get_question_menu();
        selectedQuestion = result; // Utilisez la question sélectionnée
        // Vous pouvez également utiliser le résultat de l'attente de l'utilisateur ici si nécessaire
        questions.push(selectedQuestion);
      } else {
        console.log('Error: Test has reached the maximum limit of 20 questions.');
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

  async function getRandomQuestions(count) {
    const randomQuestions = [];
  
    for (let i = 0; i < count; i++) {
      const randomQuestion = await getRandomQuestion();
      randomQuestions.push(randomQuestion);
    }
  
    return randomQuestions;
  }
  
  async function getRandomQuestion() {
    // Utilisez la fonction search pour récupérer une question aléatoire complète
    const key = ''; // Vous pouvez ajuster la clé de recherche selon vos besoins
    const searchResults = search(key);
  
    // Sélectionnez une question aléatoire parmi les résultats
    const randomIndex = Math.floor(Math.random() * searchResults.length);
    return searchResults[randomIndex];
  }
}

