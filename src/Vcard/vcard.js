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



/*async function searchAndDisplayContactInfo(answers) {
    try {
        const userInput = await getUserNameInput();
        const { answers.prenom, answers.nom } = userInput;

        const fileName = `data_vcard/${prenom}_${nom}.vcf`;

        if (fs.existsSync(fileName)) {
            const fileContent = fs.readFileSync(fileName, 'utf-8');
            const contactInfo = extractContactInfo(fileContent);

            console.log("Informations de contact :");
            console.log("Prénom :", contactInfo.prenom);
            console.log("Nom :", contactInfo.nom);
            console.log("Adresse :", contactInfo.adresse);
            console.log("Téléphone :", contactInfo.telephone);
            console.log("Email :", contactInfo.email);
        } else {
            console.log("Enseignant introuvable, informations de contact indisponibles.");
        }
    } catch (error) {
        console.error("Une erreur s'est produite lors de la recherche des informations de contact :", error.message);
    }
}

function extractContactInfo(vCardString) {
    // Logique pour extraire les informations de la chaîne VCard ici
    // ...

    // Exemple minimal
    const contactInfo = {
        prenom: "John",
        nom: "Doe",
        adresse: "123 Rue Example",
        telephone: "+33 1 23 45 67 89",
        email: "john.doe@example.com"
    };

    return contactInfo;
}

// Appeler la fonction pour rechercher et afficher les informations de contact
searchAndDisplayContactInfo();
*/