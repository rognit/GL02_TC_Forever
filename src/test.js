import { GIFT } from "./GIFT/parser.js";

class Test {
    /**
     * @param {[GIFT]} questions
     */

    constructor() {
        this.questions = [];
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
        if (this.questions.length >= 15 && this.questions.length <= 20) {
            return true;
        }
        return false;
    }

    static pass() {
        for (q in this.questions) {
            console.log(q);
        }
    }
}

let test = new Test;

test.add_question()