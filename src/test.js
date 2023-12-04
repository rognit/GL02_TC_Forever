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

    }

    static pass() {

    }
}