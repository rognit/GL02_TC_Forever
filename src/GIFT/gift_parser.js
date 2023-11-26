//un parseur pour format GIFT.
//il convertir un string en un object GIFT avec les attributs:
// - title : le titre de la question (string), si il n'y a pas de question title : ''
// - body : contient toute les information ordonnées de la question :
//            si une question a plusieur "sub-questions", body contiendra toute les sub-questons ainsi que le text du GIFT, et tout cela dans l'ordre.
//            si par exemple le GIFT contient un texte puis la sub-question alors body sera un array composé d'un string et d'un d'une instance de la class "sub-question"

// la class sub-question est composé du type de la question (la structure TYPE juste en dessous) et d'un array d'instance de la class option
// la class option contient 3 attributs :
// - prefixe qui est soit '~' soit '='
// - value qui est le texte de l'option de la sub-question (string)
// - feedback : ce qui suit le caractère '#' dans l'option (si il n'existe pas alors celui ci est undefined)

//TODO : bug sur "1:SA:"
//TODO : tester les corrections
//TODO : bug sur les matchings

import { convert } from 'html-to-text';

const TYPES = {
    BOOLEAN: 'BOOLEAN',
    NUMBER: 'NUMBER',
    MATCHING: 'MATCHING',
    INPUT: 'INPUT',
    CHOICE: 'CHOICE',
};

class SubQuestion {
    /**
     * @param {string} type
     * @param {[Option]} options
     */

    constructor({ type, options = [] }) {
      this.type = type;
      this.options = options;
    }

    //permet de séparer les différentes options de la sub-question
    static splitOptions(str) {
        return str
            .split(/((?<!\\)[=~](?:(?:\\[=~#\{\}])|(?:[^=~]))+)/g)
            .filter(x => x)
            .map(x => x.trim());
      }

    //cette méthode est appelée pour convertir un string en sub-question
    static fromString(str) {
        const test_bool = str.split('#')[0].trim();
        if (/^(TRUE|FALSE|T|F)$/.test(test_bool)) {
            return new SubQuestion({
              type: TYPES.BOOLEAN,
              options: [
                Option.fromString(str),
              ],
            });
        } 
        const options = this.splitOptions(str.trim()).map(x => Option.fromString(x));

        if (str.startsWith('#')) {
            return new SubQuestion({
                type: TYPES.NUMBER,
                options,
            });
        } else if (options.every(x => x.value.includes('->')) && options.every(x => x.prefix === '=')) {
            return new SubQuestion({
                type: TYPES.MATCHING,
                options,
            });
        } else if (options.every(x => x.prefix === '=')) {
            return new SubQuestion({
                type: TYPES.INPUT,
                options,
            });
        } else if (options.every(x => x.prefix === '=' || '~') && options.some(x => x.prefix === '=')) {
            return new SubQuestion({
                type: TYPES.CHOICE,
                options,
            });
        } else {
            throw new Error('can\'t parse the GIFT question');
        }
    }

    // ATTENTION : cette méthode n'a pas été testée
    // méthode qui permet de corriger la réponse de l'utilisateur.
    // Comme plusieurs types de sous-questions peuvent être corrigés, cette méthode attend différents types de données en fonction du type de question :
    // BOOLEAN : T si vrai et F si faux
    // NUMBER : un float ou integer
    // INPUT : un string
    // CHOICE : un array de string (si il y a plusieur choix de juste)
    // MATCHING : une map qui associe les deux élements
    static correct(answer) {
        switch(this.type) {
            case BOOLEAN:
                return this.options[0].value[0] === answer;
            case NUMBER:
                for (i in options) {
                    const test = i.value.split(':');
                    if (test.lenght === 2) {
                        return (num > test[0] - test[1] && num < test[0] + test[1])
                    } 
                    const test2 = i.value.split('..');
                    if (test.lenght === 2) {
                        return (num > test2[0] && num < test2[0])
                    }
                    return i.value === num;
                }
            case INPUT:
                return this.getOptionsValues.includes(answer)
            case CHOICE:
                const right_answer = getOptionsValuesWithprefix('=').sort()
                return right_answer === answer.sort()
            case MATCHING:
                const right_answer2 = new Map();
                for (let i = 0; i < this.options.length; i++) {
                    const map = this.options[i].split('->')
                    right_answer2.set(map[0].slice(1).trim(), map[1].trim());
                }
                return answer.sort() === right_answer2.sort();
        }
    }

    //méthode propre a la class qui retourne tout les values des options
    static getOptionsValues() {
        let result = []
        for (i in this.options) {
            result.push(this.options[i].value)
        }
    }

    //méthode propre a la class qui retourne tout les values des options avec un certain prefixe
    static getOptionsValuesWithprefix(prefix) {
        let result = []
        for (i in this.options.filter(x => x.prefix === prefix)) {
            result.push(this.options[i].value)
        }
    } 
}

class Option {
    /**
    * @param {?string} prefix.
    * @param {string} value
    * @param {?string} feedback
    */
    constructor(prefix, value, feedback) {
        this.prefix = prefix;
        this.value = value;
        this.feedback = feedback;
    } 

    //cette méthode est appelée pour convertir un string en option
    static fromString(option) {
        let prefix, value, feedback;

        if (option[0] === '=' || option[0] === '~') {
            prefix = option[0]
            option = option.slice(1)
        }

        if (option.includes('#')) {
            const split_val = option.split('#')

            value = split_val[0];
            feedback = split_val[1];
        } else {
            value = option;
        }

        return new Option(prefix, value, feedback);
    }
}

class GIFT {
    constructor(title, body) {
        this.title = title;
        this.boby = body;
    }

    //cette méthode est appelée pour convertir un string en question GIFT
    static fromString(str) {
        str = this.cleanText(str)
        const title = this.constructTitle(str);

        const index = str.indexOf("::" + title + "::");
        if (index !== -1) {
            str = str.substring(index + title.length + 4, str.lenght);
        }
        const body = this.constructBody(str);

        return new GIFT(title, body);
    }

    //méthode qui permet de nettoyer le texte avant qu'il soit convertit en objet javascript
    //je l'ai fait en remarquant des erreurs dans les question GIFT donné et car certaines informations ne nous interesse pas (html)
    static cleanText(str) {
        return convert(str)
            .replace(/~=/g, '=')
            .replace(/\[html\]/g, ' ')
            .replace(/\[markdown\]/g, ' ')
            .replace(/\n/g, "")
            .replace(/\r/g, "")
            .replace(/1:MC:/g, "")
            .replace(/1:SA:/g, "");
    }
    
    static constructTitle(rawQuestion) {
        let titleMatch = (/::(.*?)::/).exec(rawQuestion);

        return (titleMatch === null) ? '' : titleMatch[1];
    }

    static constructBody(rawQuestion) {
        let body = rawQuestion.match(/[^{}]+(?=([^]*{[^}]*}[^}]*$)|([^]*$))/g);
        let i = rawQuestion.startsWith('{') ? 0 : 1;
        
        for (i; i < body.length; i += 2) {
            body[i] = SubQuestion.fromString(body[i])
        }

        return body
    }

    // pour avoir toute les sub-questions de la question GIFT
    get SubQuestions() {
        return this.boby.filter(x => x instanceof SubQuestion);
    }
}
export { GIFT }
// exemple :
//let text = "::EM U42 Ultimate q1::What's the answer to this multiple-choice question? {  ~wrong answer#feedback comment on the wrong answer  ~another wrong answer#feedback comment on this wrong answer  =right answer#Very good!}//From The Hitchhiker's Guide to the Galaxy"
//let question = GIFT.fromString(text)
//console.log(question)
