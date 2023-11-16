const TYPES = {
    BOOLEAN: 'BOOLEAN',
    CHOICE: 'CHOICE',
    INPUT: 'INPUT',
};

class SubQuestion {
    constructor(rawSubQuestion) {
        const options = SubQuestion.splitOptions(rawSubQuestion);

        this.type = this.getType(options);
        this.answer = this.getAnswer(options);
    }

    static  splitOptions(options) {
        return options.split(/((?<!\\)[=~](?:(?:\\[=~#\{\}])|(?:[^=~]))+)/g).filter(x => x).map(x => x.trim());
    }

    static isInput(options) {
        return !options.some(x => x.startsWith('~'));
    }

    static isChoice(options) {
        return options.some(x => x.startsWith('~'));
    }

    static isBoolean(options) {
        return /^(TRUE|FALSE|T|F)$/.test(options[0]);        
    }

    getType(options) {
        if (SubQuestion.isBoolean(options)) {
            return TYPES.BOOLEAN;
        } else if (SubQuestion.isChoice(options)) {
            return TYPES.CHOICE;
        } else if (SubQuestion.isInput(options)) {
            return TYPES.INPUT;
        }
    }

    getAnswer(options) {
        switch (this.type) {
            case 'BOOLEAN':
                return options[0];
            case 'CHOICE':
                return options.filter(x => x.startsWith('=')).map(x => x.slice(1));
            case 'INPUT':
                return options.map(x => x.slice(1));
        }
    }
}

class GIFTQuestion {
    constructor(rawQuestion) {
        this.title = this.constructTitle(rawQuestion);
        this.SubQuestion = this.constructSubQuestion(rawQuestion);
    }
    
    constructTitle(rawQuestion) {
        let titleMatch = (/::(.*?)::/).exec(rawQuestion);

        return (titleMatch === null) ? '' : titleMatch[1];
    }

    constructSubQuestion(rawQuestion) {
        const RawSubQuestions = rawQuestion.match(/\{([^}]+)\}/g);
        let subQuestions = [];

        RawSubQuestions.map(match => match.slice(1, -1)).forEach(i => {
            subQuestions.push(new SubQuestion(i));
        });
        
        return subQuestions
    }
}


test = new GIFTQuestion("::q1:: This is {=two =2} some {=two =2} text {=two ~2} with {=two =2} curly braces.")

console.log(test)
