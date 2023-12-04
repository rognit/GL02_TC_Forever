import fs from 'fs';

//return le top 10 des resultats trier en fonction de la longueur de leur titre
export function search(key) {
    const jsonContent = fs.readFileSync('./src/GIFT/question_db.json', 'utf-8');
    const loadedGiftDictionary = JSON.parse(jsonContent);

    return Object.keys(loadedGiftDictionary)
      .filter(title => title.includes(key))
      .sort((a, b) => b.length - a.length)
      .map(title => loadedGiftDictionary[title])
      .slice(0, 10);
  
}