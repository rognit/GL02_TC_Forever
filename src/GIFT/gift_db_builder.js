import fs from 'fs';
import path from 'path';

import { GIFT } from "./gift_parser.js";



function splitGIFT(path) {
    const fileContent = fs.readFileSync(path, 'utf-8');
    const regex = /::(.*?)::/g;

    const raw_content = [];
    let lastIndex = 0;
    let match;

    let i = fileContent.startsWith("::") ? 0 : 1; 

    while ((match = regex.exec(fileContent)) !== null) {
        // Content before the current match
        const contentBefore = fileContent.substring(lastIndex, match.index);
        if (contentBefore.trim() !== "") {
            raw_content.push(contentBefore.trim());
        }
        raw_content.push("::" + match[1] + "::");
      
        lastIndex = match.index + match[0].length;
    }
      
    const contentAfter = fileContent.substring(lastIndex).trim();
    if (contentAfter !== "") {
        raw_content.push(contentAfter);
    }
      
    let content = []
    while (i < raw_content.length) {
        content.push(raw_content[i] + raw_content[i + 1]);
        i += 2;
    }
    
    return content
}

function save(data, file) {
    const jsonContent = JSON.stringify(data, null, 2);

    fs.writeFileSync(file, jsonContent);
}


const folderPath = '../../SujetB_data';
const giftDictionary = {};

fs.readdirSync(folderPath).forEach((file) => {
    const filePath = path.join(folderPath, file);

    // Split the text based on every second occurrence of ::
    const splitted_gift = splitGIFT(filePath);

    for (let i in splitted_gift) {
        try {
            const parsedGift = GIFT.fromString(splitted_gift[i]);
            if (parsedGift.SubQuestions.length !== 0) {
                giftDictionary[parsedGift.title] = parsedGift;
            }
        } catch (error) {

        }
    }
});

console.log(Object.keys(giftDictionary).length);
save(giftDictionary, "gift_db.json");

