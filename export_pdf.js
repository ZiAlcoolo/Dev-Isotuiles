document.getElementById("exportPdf").addEventListener("click", function () {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // === Récupération date et heure ===
    const now = new Date();
    const dateStr = now.toLocaleDateString("fr-FR"); // format JJ/MM/AAAA
    const timeStr = now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }); // HH:MM
    const fileDate = dateStr.replaceAll("/", "-") + "_" + timeStr.replace(":", "-"); // pour le nom du fichier

    // === Logo ===
    const logoUrl = "https://cdn.shopify.com/s/files/1/0909/7605/9715/files/logo-bleu.png?v=1731518185";
    doc.addImage(logoUrl, "PNG", 14, 10, 30, 10);

    // === Coordonnées ===
    doc.setFontSize(16);
    doc.text("Isotuiles", 50, 20);

    doc.setFontSize(11);
    doc.text("Adresse : Zone d'Activité de Gemeillan, 33480 Sainte-Hélène, France", 50, 28);
    doc.text("Téléphone : +33 6 76 45 67 57", 50, 34);
    doc.text("Email : contact@isotuiles.fr", 50, 40);

    // Ligne séparatrice
    doc.line(14, 45, 195, 45);

    // === Titre du devis ===
    doc.setFontSize(18);
    doc.text("Devis en ligne", 14, 55);

    // Ajout de la date/heure du devis
    doc.setFontSize(11);
    doc.text(`Émis le : ${dateStr} à ${timeStr}`, 150, 55);

    // === Infos du produit choisi ===
    const produit = $('input[name="typePanneau"]:checked').val() || "";
    const epaisseur = $('input[name="epaisseurPanneau"]:checked').val() || "";
    const couleur = $('input[name="couleurPanneau"]:checked').val() || "";
    const prixTotal = document.getElementById("prixTotal").innerText;

    doc.setFontSize(12);
    doc.text(`Produit : ${produit}`, 14, 70);
    doc.text(`Épaisseur : ${epaisseur}`, 14, 78);
    doc.text(`Couleur : ${couleur}`, 14, 86);

    // === Tableau détail ===
    const table = document.querySelector("#tableDetail table");
    if (table) {
        doc.autoTable({
            html: "#tableDetail table",
            startY: 95,
            theme: "grid",
            headStyles: { fillColor: [0, 47, 92] },
            styles: { halign: "center" },
        });
    }

    // === Prix total ===
    const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 120;
    doc.setFontSize(14);
    doc.text(`Prix estimé : ${prixTotal}`, 14, finalY);

    // === Bouton site ===
    // === Bouton site ===
    const siteUrl = "https://isotuiles.fr";
    const estimatorUrl = "https://isotuiles.fr/pages/estimateur-de-prix";

    // Texte des boutons
    const siteText = "Visitez notre site";
    const estimatorText = "Aller à l'estimateur";

    // Couleur et style du texte
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);

    // Calcul largeur des textes pour ajuster la largeur du bouton
    const siteWidth = doc.getTextWidth(siteText) + 8; // ajout de padding
    const estimatorWidth = doc.getTextWidth(estimatorText) + 8;

    const buttonHeight = 10;
    const buttonY = finalY + 15;
    let buttonX = 14;

    // Premier bouton : site
    doc.setFillColor(0, 47, 92);
    doc.roundedRect(buttonX, buttonY, siteWidth, buttonHeight, 2, 2, "F");
    doc.setTextColor(255, 255, 255);
    doc.text(siteText, buttonX + 4, buttonY + 7); // 4px padding gauche, 7px vertical
    doc.link(buttonX, buttonY, siteWidth, buttonHeight, { url: siteUrl });

    // Deuxième bouton : estimateur
    buttonX += siteWidth + 5; // espace de 5px entre les boutons
    doc.setFillColor(0, 47, 92);
    doc.roundedRect(buttonX, buttonY, estimatorWidth, buttonHeight, 2, 2, "F");
    doc.setTextColor(255, 255, 255);
    doc.text(estimatorText, buttonX + 4, buttonY + 7);
    doc.link(buttonX, buttonY, estimatorWidth, buttonHeight, { url: estimatorUrl });


    // === Sauvegarde avec date et heure dans le nom ===
    doc.save(`devis_${fileDate}.pdf`);
});
