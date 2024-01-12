import { GIFT } from "./GIFT/gift.js";
import vega from 'vega';
import vegaLite from 'vega-lite';
import vegaEmbed from 'vega-embed';
import open from 'open';
import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import { search } from './GIFT/search.js';
import { compile } from 'vega-lite';
import { View } from 'vega';

export class Exam {
    /**
     * @param {string} name
     * @param {[GIFT]} questions
     */

    constructor(name, questions) {
        this.name = name;
        this.questions = questions;
    }

    static add_question(question) {
        console.log("dora is so beautiful")
        if (!question instanceof GIFT) {
            throw new Error("not a valid GIFT question")
        }
        
    }

    static test_profile() {

    }

    static verify_test_quality() {
        return this.questions.length >= 15 && this.questions.length <= 20;
        //Affichage du nombre de questions 


    }

    static pass() {
        let q;
        for (q in this.questions) {
            console.log(q);
        }
    }


   

    async viewProfile() {
        // Calculer les proportions
        const totalQuestions = this.questions.length;
        const boolQuestion = this.questions.filter(q => q.body[1].type === 'BOOLEAN').length;
        const numberQuestion = this.questions.filter(q => q.body[1].type === 'NUMBER').length;
        const matchQuestion = this.questions.filter(q => q.body[1].type === 'MATCHING').length;
        const inputQuestion = this.questions.filter(q => q.body[1].type === 'INPUT').length;
        const choiceQuestion = this.questions.filter(q => q.body[1].type === 'CHOICE').length;

        console.log(`Total questions: ${totalQuestions}`,
            `Vrai ou Faux: ${boolQuestion}`,
            `Numérique: ${numberQuestion}`,
            `Appariement: ${matchQuestion}`,
            `Entrée: ${inputQuestion}`,
            `Choix multiples: ${choiceQuestion}`,
            );

        // Préparer les données pour le graphique
        const data = [
            { category: 'Vrai ou Faux', count: boolQuestion },
            { category: 'Numérique', count: numberQuestion },
            { category: 'Appariement', count: matchQuestion },
            { category: 'Entrée', count: inputQuestion },
            { category: 'Choix multiples', count: choiceQuestion },
        ];

        // Définition de la spécification Vega-Lite
        const spec = {
            $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
            description: 'Profil de l\'examen',
            data: { values: data },
            mark: 'bar',
            encoding: {
                x: { field: 'category', type: 'nominal', axis: { title: 'Catégorie' } },
                y: { field: 'count', type: 'quantitative', axis: { title: 'Nombre de Questions' } }
            }
        };

        // Compiler la spécification Vega-Lite en spécification Vega
        const compiledSpec = compile(spec).spec;

        // Créer une vue Vega avec la spécification compilée
        const view = new View(vega.parse(compiledSpec), {
            renderer: 'none'  // Pas besoin de rendu dans un navigateur
        }).initialize();

        // Générer le PNG
        const png = await view.toCanvas();

        fs.writeFileSync('./src/Storage/ExamCharts/chart.png', png.toBuffer());

    }


    static compareExams(exam1, exam2) {

        console.log("Comparaison des examens:");
        console.log(`Exam 1: ${exam1.name}`);
        exam1.viewProfile();
        console.log(`Exam 2: ${exam2.name}`);
        exam2.viewProfile();

        const titlesExam1 = exam1.questions.map(q => q.title);
        const titlesExam2 = exam2.questions.map(q => q.title);

        const commonTitles = titlesExam1.filter(title => titlesExam2.includes(title));

        if (commonTitles.length > 0) {
            console.log("Questions communes entre les deux examens:");
            commonTitles.forEach(title => console.log(title));
        } else {
            console.log("Il n'y a pas de questions communes entre les deux examens.");
        }
    }



}

export async function saveTest(testName, questions) {
    const testFileName = 'test_db.json';

    // Lecture du contenu actuel du fichier (s'il existe)
    let existingTests = [];
    try {
        const fileContent = fs.readFileSync(`./src/Storage/${testFileName}`, 'utf8');
        existingTests = JSON.parse(fileContent);
    } catch (error) {
        console.log('Error while saving test:', error);
    }

    // Ajout du nouveau test à la liste des tests existants
    existingTests.push({ name: testName, questions });

    // Écriture du contenu mis à jour dans le fichier
    try {
        fs.writeFileSync(`./src/Storage/${testFileName}`, JSON.stringify(existingTests, null, 2), 'utf8');
    } catch (error) {
        console.error('Error while saving test:', error);
    }
}

export async function getRandomQuestions(count) {
    const randomQuestions = [];

    for (let i = 0; i < count; i++) {
      const randomQuestion = await getRandomQuestion();
      randomQuestions.push(randomQuestion);
    }

    return randomQuestions;
  }


  export async function getTestName() {
    const userInput = await inquirer.prompt({
      type: 'input',
      name: 'testName',
      message: 'Enter a name for the test:',
    });
    
    return userInput.testName;
    }

   export async function getRandomQuestion() {
        // Utilisez la fonction search pour récupérer une question aléatoire complète
        const key = ''; // Vous pouvez ajuster la clé de recherche selon vos besoins
        const searchResults = search(key);
  
        // Sélectionnez une question aléatoire parmi les résultats
        const randomIndex = Math.floor(Math.random() * searchResults.length);
        return searchResults[randomIndex];
      }

    export async function shuffle(array) {
        let currentIndex = array.length, randomIndex;
      
        // While there remain elements to shuffle...
        while (currentIndex !== 0) {
      
          // Pick a remaining element...
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;
      
          // And swap it with the current element.
          [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
      
        return array;
      }