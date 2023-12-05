function createVCardFromUserInput() {
    // On récupère les valeurs des paramètres depuis l'utilisateur
    var prenom = prompt("Entrez le prénom :");
    var nom = prompt("Entrez le nom :");
    var nomEtablissement = prompt("Entrez le nom de l'établissement :");
    var poste = prompt("Entrez le poste :");
    var numeroTel = prompt("Entrez le numéro de téléphone (format : +33 1 23 45 67 89) :");
    var email = prenom.toLowerCase() + '@' + nomEtablissement.toLowerCase() + '.fr';
    var numeroRue = prompt("Entrez le numéro de rue :");
    var nomRue = prompt("Entrez le nom de la rue :");
    var bp = prompt("Entrez le numéro de boîte postale :");
    var ville = prompt("Entrez la ville :");
    var siteWeb = 'www.' + nomEtablissement.toLowerCase() + '.fr';

    // On vérifie si les informations sont complètes
    if (!prenom || !nom || !nomEtablissement || !poste || !numeroTel || !numeroRue || !nomRue || !bp || !ville) {
        alert("Les informations d'identification ou de contact de l'enseignant sont incomplètes ou incorrectes. Le fichier VCard ne peut pas être généré en entier pour cet enseignant spécifique.");
        return null;
    }

    // Création de la chaîne vCard
    var vCardString =
        "BEGIN:VCARD\n" +
        "VERSION:3.0\n" +
        "FN:" + prenom + " " + nom + "\n" +
        "ORG:" + nomEtablissement + "\n" +
        "TITLE:" + poste + "\n" +
        "ADR;TYPE=WORK:;;" + numeroRue + " " + nomRue + ";" + bp + ";" + ville + ";;\n" +
        "TEL:" + numeroTel + "\n" +
        "EMAIL:" + email + "\n" +
        "URL:" + siteWeb + "\n" +
        "END:VCARD";

    return vCardString;
}

function getPrenomNomFromUserInput() {
    return prenom + "_" + nom;
}


function downloadVCardFromUserInput() {
    // Appeler la fonction createVCardFromUserInput avec les valeurs fournies par l'utilisateur
    var vCardData = createVCardFromUserInput();

    // Vérifier si la création du fichier VCard a échoué
    if (!vCardData) {
        return; // Arrêter la fonction si les informations sont incomplètes ou incorrectes
    }

    // Créer un objet Blob contenant le texte vCard
    var blob = new Blob([vCardData], { type: "text/vcard" });

    // Créer un élément d'ancrage (a) pour le téléchargement
    var a = document.createElement("a");
    a.style.display = "none";
    document.body.appendChild(a);

    // Créer une URL de données à partir du Blob et l'attribuer à l'élément d'ancrage
    var url = window.URL.createObjectURL(blob);
    var fileName = "data_vcard/" + getPrenomNomFromUserInput() + ".vcf";
    a.href = url;
    a.download = filename;

    // Simuler un clic sur l'élément d'ancrage pour déclencher le téléchargement
    a.click();

    // Supprimer l'élément d'ancrage
    document.body.removeChild(a);

    // Libérer la ressource URL de données après le téléchargement
    window.URL.revokeObjectURL(url);
}


// Appeler downloadVCardFromUserInput pour initier le processus de création et de téléchargement du fichier vCard
downloadVCardFromUserInput();
