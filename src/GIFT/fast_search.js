import fs from 'fs';

function search(key) {
    const jsonContent = fs.readFileSync('gift_db.json', 'utf-8');
    const loadedGiftDictionary = JSON.parse(jsonContent);

    return Object.keys(loadedGiftDictionary).filter(title =>
        title.includes(key)
      );
    
}

console.log(search("EM U42"));