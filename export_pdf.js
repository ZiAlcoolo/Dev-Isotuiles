// Au clic sur le bouton principal -> ouvre l'overlay
document.getElementById("exportPdf").addEventListener("click", function () {
    var pdf_overlay = `
<!-- Overlay -->
  <div id="overlayPdf" class="overlay_content">
    <button id="close_overlay" onclick="$('#overlayPdf').remove()"><img  src="https://img.icons8.com/ios/500/delete-sign--v1.png"></button>
    <h4>Personnaliser le devis</h4>
    <p>Complétez les champs que vous désirez</p>
    <input type="text" id="nomPrenom" placeholder="Nom Prénom">
    <input type="email" id="emailClient" placeholder="Email">
    <input type="tel" id="telClient" placeholder="Téléphone">
    <div style="margin-top:15px;">
      <button id="exportAvecNom" onclick="generatePdf(true)">Exporter avec infos</button>
      <button id="exportSansNom" onclick="generatePdf(false)">Exporter sans infos</button>
    </div>
  </div>
`;
    $('#insert_pdf_options').append(pdf_overlay)
});


// Fonction de génération du PDF avec option nom
function generatePdf(withInfos) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // === Récupération date et heure ===
    const now = new Date();
    const dateStr = now.toLocaleDateString("fr-FR");
    const timeStr = now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    const fileDate = dateStr.replaceAll("/", "-") + "_" + timeStr.replace(":", "-");

    // === Logo ===
    const logoUrl = "https://cdn.shopify.com/s/files/1/0909/7605/9715/files/logo-bleu.png?v=1731518185";
    doc.addImage(logoUrl, "PNG", 14, 10, 30, 10);

    // === Coordonnées entreprise ===
    doc.setFontSize(16);
    doc.text("Isotuiles", 50, 20);

    doc.setFontSize(11);
    doc.text("Adresse : Zone d'Activité de Gemeillan, 33480 Sainte-Hélène, France", 50, 28);
    doc.text("Téléphone : +33 6 76 45 67 57", 50, 34);
    doc.text("Email : isotuiles@gmail.com", 50, 40);

    doc.line(14, 45, 195, 45);

    // === Titre devis ===
    doc.setFontSize(18);
    doc.text("Devis en ligne", 14, 55);

    doc.setFontSize(11);
    doc.text(`Émis le : ${dateStr} à ${timeStr}`, 150, 55);

    // === Infos client si demandées ===
    let yPos = 65;
    if (withInfos) {
        const nomPrenom = document.getElementById("nomPrenom").value.trim();
        const emailClient = document.getElementById("emailClient").value.trim();
        const telClient = document.getElementById("telClient").value.trim();

        doc.setFontSize(12);
        if (nomPrenom) {
            doc.text(`Client : ${nomPrenom}`, 14, yPos);
            yPos += 8;
        }
        if (emailClient) {
            doc.text(`Email : ${emailClient}`, 14, yPos);
            yPos += 8;
        }
        if (telClient) {
            doc.text(`Téléphone : ${telClient}`, 14, yPos);
            yPos += 8;
        }
    }

    // === Infos produit ===
    const produit = $('input[name="typePanneau"]:checked').val() || "";
    const epaisseur = $('input[name="epaisseurPanneau"]:checked').val() || "";
    const couleur = $('input[name="couleurPanneau"]:checked').val() || "";
    const prixTotal = document.getElementById("prixTotal").innerText;

    doc.setFontSize(12);
    doc.text(`Produit : ${produit}`, 14, yPos);
    doc.text(`Épaisseur : ${epaisseur}`, 14, yPos + 8);
    doc.text(`Couleur : ${couleur}`, 14, yPos + 16);

    // === Tableau détail ===
    const table = document.querySelector("#tableDetail table");
    if (table) {
        doc.autoTable({
            html: "#tableDetail table",
            startY: yPos + 25,
            theme: "grid",
            headStyles: { fillColor: [0, 47, 92] },
            styles: { halign: "center" },
        });
    }

    const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : yPos + 40;

    // === Prix total ===
    doc.setFontSize(14);
    doc.text(`Prix estimé (HT) : ${prixTotal}`, 14, finalY);

    // === Note client ===
    doc.setFontSize(11);
    doc.setTextColor(50, 50, 50);
    doc.text(
        "NB : lors de votre prise de contact, n’hésitez pas à nous transmettre directement ce devis. Cela facilitera vos échanges et accélérera le traitement de votre commande.",
        14,
        finalY + 12,
        { maxWidth: 180 }
    );
    doc.setTextColor(0, 0, 0);

    // === Sauvegarde PDF ===
    doc.save(`devis_${fileDate}.pdf`);

    // Fermer l’overlay
    $('#overlayPdf').remove()
}


