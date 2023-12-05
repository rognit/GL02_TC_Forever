async function searchAndDisplayVCard() {
    // Demander à l'utilisateur d'entrer le prénom et le nom
    var prenom = prompt("Entrez le prénom :");
    var nom = prompt("Entrez le nom :");

    // Vérifier si les informations sont complètes
    if (!prenom || !nom) {
        alert("Les informations d'identification sont incomplètes. Veuillez entrer à la fois le prénom et le nom.");
        return;
    }

    try {
        // Sélectionner le dossier data_vcard
        const dataVCardDirectory = await window.showDirectoryPicker();

        // Construire le chemin du fichier vCard
        const fileName = `${prenom}_${nom}.vcf`;

        // Tenter d'obtenir le handle du fichier
        try {
            const fileHandle = await dataVCardDirectory.getFileHandle(fileName);

            // Lire le contenu du fichier
            const file = await fileHandle.getFile();
            const vCardData = await file.text();

            // Afficher le contenu du fichier VCard
            alert("Contenu du fichier VCard :\n\n" + vCardData);
        } catch (fileError) {
            // Le fichier n'a pas été trouvé
            console.error("Fichier VCard non trouvé :", fileError);
            alert("Utilisateur introuvable. Veuillez vérifier les informations entrées.");
        }
    } catch (directoryError) {
        console.error("Une erreur s'est produite lors de l'accès au dossier data_vcard :", directoryError);
        alert("Une erreur s'est produite. Veuillez vérifier les informations entrées et assurez-vous que le fichier VCard correspondant existe dans le dossier data_vcard.");
    }
}

// Appeler searchAndDisplayVCard pour initier la recherche et l'affichage du fichier VCard
searchAndDisplayVCard();
