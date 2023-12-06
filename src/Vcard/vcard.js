// Importez les dépendances nécessaires
import fs from 'fs';

function createVCardFromUserInput(answer) {
    // On vérifie si les informations sont complètes
    if (!answer.prenom || !answer.nom || !answer.nomEtablissement || !answer.poste || !answer.numeroTel || !answer.numeroRue || !answer.nomRue || !answer.bp || !answer.ville || !answer.siteWeb) {
        console.log("Les informations d'identification ou de contact de l'enseignant sont incomplètes ou incorrectes. Le fichier VCard ne peut pas être généré en entier pour cet enseignant spécifique.");
        return null;
    }

    // Création de la chaîne vCard
    const vCardString =
        "BEGIN:VCARD\n" +
        "VERSION:3.0\n" +
        "FN:" + answer.prenom + " " + answer.nom + "\n" +
        "ORG:" + answer.nomEtablissement + "\n" +
        "TITLE:" + answer.poste + "\n" +
        "ADR;TYPE=WORK:;;" + answer.numeroRue + " " + answer.nomRue + ";" + answer.bp + ";" + answer.ville + ";;\n" +
        "TEL:" + answer.numeroTel + "\n" +
        "EMAIL:" + answer.prenom.toLowerCase() + '@' + answer.nomEtablissement.toLowerCase() + '.fr' + "\n" +
        "URL:" + answer.siteWeb + "\n" +
        "END:VCARD";

    return vCardString;
}

export function saveVCardFromUserInput(answer) {
    // Appeler la fonction createVCardFromUserInput avec les valeurs fournies par l'utilisateur
    const vCardString = createVCardFromUserInput(answer);

    // Vérifier si la création du fichier VCard a échoué
    if (!vCardString) {
        return; // Arrêter la fonction si les informations sont incomplètes ou incorrectes
    }

    // Vérifier si le dossier existe, sinon le créer
    const folderPath = "data_vcard";
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
    }

    // Écrire le fichier VCard dans le dossier data_vcard avec une fonction de rappel
    const fileName = `${folderPath}/${answer.prenom}_${answer.nom}.vcf`;

    fs.writeFile(fileName, vCardString, (error) => {
        if (error) {
            console.error("Erreur lors de l'écriture du fichier VCard :", error);
        } else {
            console.log("Fichier VCard créé avec succès : " + fileName);
        }
    });
}