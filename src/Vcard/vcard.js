function createVCardFromUserInput() {
    // On récupère les valeurs des paramètres depuis l'utilisateur
    const prenom = prompt("Entrez le prénom :");
    const nom = prompt("Entrez le nom :");
    const nomEtablissement = prompt("Entrez le nom de l'établissement :");
    const poste = prompt("Entrez le poste :");
    const numeroTel = prompt("Entrez le numéro de téléphone (format : +33 1 23 45 67 89) :");
    const email = prenom.toLowerCase() + '@' + nomEtablissement.toLowerCase() + '.fr';
    const numeroRue = prompt("Entrez le numéro de rue :");
    const nomRue = prompt("Entrez le nom de la rue :");
    const bp = prompt("Entrez le numéro de boîte postale :");
    const ville = prompt("Entrez la ville :");
    const siteWeb = 'www.' + nomEtablissement.toLowerCase() + '.fr';

    // On vérifie si les informations sont complètes
    if (!prenom || !nom || !nomEtablissement || !poste || !numeroTel || !numeroRue || !nomRue || !bp || !ville) {
        alert("Les informations d'identification ou de contact de l'enseignant sont incomplètes ou incorrectes." +
            "Le fichier VCard ne peut pas être généré en entier pour cet enseignant spécifique.");
        return null;
    }

    // Création de la chaîne vCard
    return "BEGIN:VCARD\n" +
        "VERSION:3.0\n" +
        "FN:" + prenom + " " + nom + "\n" +
        "ORG:" + nomEtablissement + "\n" +
        "TITLE:" + poste + "\n" +
        "ADR;TYPE=WORK:;;" + numeroRue + " " + nomRue + ";" + bp + ";" + ville + ";;\n" +
        "TEL:" + numeroTel + "\n" +
        "EMAIL:" + email + "\n" +
        "URL:" + siteWeb + "\n" +
        "END:VCARD";
}

function getPrenomNomFromUserInput() {
    return prenom + "_" + nom;
}


function downloadVCardFromUserInput() {
    // Appeler la fonction createVCardFromUserInput avec les valeurs fournies par l'utilisateur
    const vCardData = createVCardFromUserInput();

    // Vérifier si la création du fichier VCard a échoué
    if (!vCardData) {
        return; // Arrêter la fonction si les informations sont incomplètes ou incorrectes
    }

    // Créer un objet Blob contenant le texte vCard
    const blob = new Blob([vCardData], { type: "text/vcard" });

    // Créer un élément d'ancrage (a) pour le téléchargement
    const a = document.createElement("a");
    a.style.display = "none";
    document.body.appendChild(a);

    // Créer une URL de données à partir du Blob et l'attribuer à l'élément d'ancrage
    const url = window.URL.createObjectURL(blob);
    const fileName = "data_vcard/" + getPrenomNomFromUserInput() + ".vcf";
    a.href = url;
    a.download = fileName;

    // Simuler un clic sur l'élément d'ancrage pour déclencher le téléchargement
    a.click();

    // Supprimer l'élément d'ancrage
    document.body.removeChild(a);

    // Libérer la ressource URL de données après le téléchargement
    window.URL.revokeObjectURL(url);
}


// Appeler downloadVCardFromUserInput pour initier le processus de création et de téléchargement du fichier vCard
downloadVCardFromUserInput();
