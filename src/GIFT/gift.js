import { SubQuestion, cleanText } from '../GIFT/parser.js';

class GIFT {
    constructor(title, body) {
        this.title = title;
        this.body = body;
    }

    //cette méthode est appelée pour convertir un string en question GIFT
    static fromString(str) {
        str = cleanText(str)
        const title = this.constructTitle(str);

        const index = str.indexOf("::" + title + "::");
        if (index !== -1) {
            str = str.substring(index + title.length + 4, str.length);
        }
        const body = this.constructBody(str);

        return new GIFT(title, body);
    }

    static constructTitle(rawQuestion) {
        let titleMatch = (/::(.*?)::/).exec(rawQuestion);

        return (titleMatch === null) ? '' : titleMatch[1];
    }

    static constructBody(rawQuestion) {
        let body = rawQuestion.match(/[^{}]+(?=([^]*{[^}]*}[^}]*$)|([^]*$))/g);
        let i = rawQuestion.startsWith('{') ? 0 : 1;
    
        for (i; i < body.length; i += 2) {
            body[i] = SubQuestion.fromString(body[i]);
        }
    
        return body;
    }

    

    // pour avoir toute les sub-questions de la question GIFT
    get SubQuestions() {
        return this.body.filter(x => x instanceof SubQuestion);
    }
}

export function processBody(body) {
    if (Array.isArray(body)) {
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

export { GIFT }

