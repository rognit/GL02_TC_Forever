import { GIFT } from "./GIFT/parser.js";
import vega from 'vega';
import vegaLite from 'vega-lite';
import vegaEmbed from 'vega-embed';
import open from 'open';
import fs from 'fs';
import path from 'path';

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
        if (!question instanceof GIFT) {
            throw new Error("not a valid GIFT question")
        }
        this.questions.push(question);
    }

    static test_profile() {

    }

    static verify_test_quality() {
        return this.questions.length >= 15 && this.questions.length <= 20;

    }

    static pass() {
        let q;
        for (q in this.questions) {
            console.log(q);
        }
    }

    async viewProfile() {

        console.log(this.questions);
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


    }
}