const TYPES = {
    BOOLEAN: 'BOOLEAN',
    CHOICE: 'CHOICE',
    INPUT: 'INPUT',
    MATCHING: 'MATCHING',
};

class SubQuestion {
    constructor(rawSubQuestion) {
        this.options = this.splitOptions(rawSubQuestion);

        this.type = this.determineType();
        this.answer = this.determineAnswer();
    }

    splitOptions(options) {
        return options.split(/((?<!\\)[=~](?:(?:\\[=~#\{\}])|(?:[^=~]))+)/g).filter(x => x).map(x => x.trim());
    }
    
    determineType() {
        let isInput = () => !this.options.some(x => x.startsWith('~'));
        let isChoice = () => this.options.some(x => x.startsWith('~'));
        let isBoolean = () => /^(TRUE|FALSE|T|F)$/.test(this.options[0]); 
        let isMatching = () => this.options.every(x => x.includes('->')) && !this.options.some(x => x.startsWith('~'));

        if (isBoolean()) {
            return TYPES.BOOLEAN;
        } else if (isMatching()) {
            return TYPES.MATCHING;
        } else if (isChoice()) {
            return TYPES.CHOICE;
        } else if (isInput()) {
            return TYPES.INPUT;
        }
    }

    determineAnswer() {
        switch (this.type) {
            case 'BOOLEAN':
                return this.options[0][0];
            case 'CHOICE':
                return this.options.filter(x => x.startsWith('=')).map(x => x.slice(1));
            case 'INPUT':
                return this.options.map(x => x.slice(1));
            case 'MATCHING':
                const answer = new Map();
                for (let i = 0; i < this.options.length; i++) {
                    const map = this.options[i].split('->')
                    answer.set(map[0].slice(1).trim(), map[1].trim());
                }
                return answer;
        }
    }

    correct(answer) {
        switch (this.type) {
            case 'BOOLEAN':
                answer === this.answer ? 1 : 0
            case 'INPUT':
                return this.answer.includes(answer)
        }
    }
}

class GIFTQuestion {
    constructor(rawQuestion) {
        this.title = this.constructTitle(rawQuestion);
        this.boby = this.constructBody(rawQuestion);
    }
    
    constructTitle(rawQuestion) {
        let titleMatch = (/::(.*?)::/).exec(rawQuestion);

        return (titleMatch === null) ? '' : titleMatch[1];
    }

    constructBody(rawQuestion) {
        let body = rawQuestion.match(/[^{}]+(?=([^]*{[^}]*}[^}]*$)|([^]*$))/g);
        let i = rawQuestion.startsWith('{') ? 0 : 1;
        
        for (i; i < body.length; i += 2) {
            body[i] = new SubQuestion(body[i])
        }

        return body
    }

    get SubQuestions() {
        return this.boby.filter(x => x instanceof SubQuestion);
    }
}

test = new GIFTQuestion(" This is {=two =2} some {=two =2} text {=two ~2} with {=two =2} curly braces.{=Canada -> Ottawa =Italy  -> Rome =Japan  -> Tokyo =India  -> New Delhi}")
console.log(test.SubQuestions)
