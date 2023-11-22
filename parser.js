const TYPES = {
    BOOLEAN: 'BOOLEAN',
    NUMBER: 'NUMBER',
    MATCHING: 'MATCHING',
    INPUT: 'INPUT',
    CHOICE: 'CHOICE',
};

class Question {
    /**
     * @param {string} type
     */

    constructor({ type, options = [] }) {
      this.type = type;
      this.options = options;
    }

    static splitOptions(str) {
        return str
            .split(/((?<!\\)[=~](?:(?:\\[=~#\{\}])|(?:[^=~]))+)/g)
            .filter(x => x)
            .map(x => x.trim());
      }

    static fromString(str) {
        if (/^(TRUE|FALSE|T|F)$/.test(str)) {
            return new Question({
              type: TYPES.BOOLEAN,
              options: [
                new Options(str),
              ],
            });
        } else if (str.startsWith('#')) {
            const options = this.splitOptions(str.slice(1)).map(x => Options.fromString(x));

            return new Question({
                type: TYPES.NUMBER,
                options: [
                  new Options(options),
                ],
              });
        } 
        const options = this.splitOptions(str).map(x => Option.fromString(x));
            
        if (options.every(x => x.value.includes('->') && x.prefix === '=')) {
            return new Question({
                type: TYPES.MATCHING,
                options: [
                  new Option(options),
                ],
            });
        } else if (options.every(x => x.prefix === '=')) {
            return new Question({
                type: TYPES.INPUT,
                options: [
                  new Option(options),
                ],
            });
        } else if (options.every(x => x.prefix === '=' || x.prefix === '~') && options.some(x => x.prefix === '=')) {
            return new Question({
                type: TYPES.CHOICE,
                options: [
                  new Option(options),
                ],
            });
        }
    }

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

    static getOptionsValues() {
        let result = []
        for (i in this.options) {
            result.push(this.options[i].value)
        }
    }

    static getOptionsValuesWithprefix(prefix) {
        let result = []
        for (i in this.options.filter(x => x.prefix === prefix)) {
            result.push(this.options[i].value)
        }
    } 
}

class Option {
    /**
    * @param {?string} prefix. Either '=' or '~', optional.
    * @param {string} value, possible answer to the question.
    * @param {?string} feedback optional feedback to the user.
    */
    constructor(prefix, value, feedback) {
        this.prefix = prefix;
        this.value = value;
        this.feedback = feedback;
    } 

    static fromString(option) {
        let prefix, value, feedback;

        if (option[0] === '~' || option[0] === '=') {
            prefix = option[0]
            option.slice(1)
        } else {
            prefix = null;
        }
        option.slice(1);

        if (option.includes('#')) {
            const split_val = option.split('#')

            option = split_val[0];
            feedback = split_val[1];
        } else {
            value = option;
            this.feedback = null;
        }

        return new Option(prefix, value, feedback);
    }
}

class GIFT {
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
            body[i] = Question.fromString(body[i])
        }

        return body
    }

    get SubQuestions() {
        return this.boby.filter(x => x instanceof Question);
    }
}

test = new GIFT("::Q1:: This is {=two =2} some {=two =2} text {=two ~2} with {=two =2} curly braces.{=Canada -> Ottawa =Italy  -> Rome =Japan  -> Tokyo =India  -> New Delhi}")
console.log(test)