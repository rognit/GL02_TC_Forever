import fs from 'fs';
import path from 'path';
import { GIFT } from "./parser.js";

function splitGIFT(path) {
    const fileContent = fs.readFileSync(path, 'utf-8');
    const cleanedContent = cleanHTMLTags(fileContent);
    console.log(cleanedContent); // Affiche le contenu nettoyé dans la console
    const regex = /::(.*?)::/g;

    const raw_content = [];
    let lastIndex = 0;
    let match;

    let i = cleanedContent.startsWith("::") ? 0 : 1; 

    while ((match = regex.exec(cleanedContent)) !== null) {
        // Content before the current match
        const contentBefore = cleanedContent.substring(lastIndex, match.index);
        if (contentBefore.trim() !== "") {
            raw_content.push(contentBefore.trim());
        }
        raw_content.push("::" + match[1] + "::");

        lastIndex = match.index + match[0].length;
    }

    const contentAfter = cleanedContent.substring(lastIndex).trim();
    if (contentAfter !== "") {
        raw_content.push(contentAfter);
    }

    let content = [];
    while (i < raw_content.length) {
        content.push(raw_content[i] + raw_content[i + 1]);
        i += 2;
    }

    return content;
}

function cleanHTMLTags(str) {
    // Retire toutes les balises HTML du texte
    return str.replace(/<\/?[^>]+(>|$)/g, "")
              .replace(/&nbsp;/g, " "); // Remplace &nbsp; par un espace
}



function save(data, file) {
    const jsonContent = JSON.stringify(data, null, 2);

    fs.writeFileSync(file, jsonContent);
}

function construct(file_name) {
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
                console.log(error);
            }
        }
    });
    
    console.log(Object.keys(giftDictionary).length);
    const destinationFolder = '../Storage/'; // Chemin du nouveau dossier
    const destinationPath = path.join(destinationFolder, file_name); // Création du chemin complet
    save(giftDictionary, destinationPath);

}
construct("question_db.json");



