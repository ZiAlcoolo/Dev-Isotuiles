 document.getElementById("exportPdf").addEventListener("click", function () {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();

            // Récupération des infos sélectionnées
            const produit = $('input[name="typePanneau"]:checked').val() || "";
            const epaisseur = $('input[name="epaisseurPanneau"]:checked').val() || "";
            const couleur = $('input[name="couleurPanneau"]:checked').val() || "";
            const prixTotal = document.getElementById("prixTotal").innerText;

            // En-tête
            doc.setFontSize(18);
            doc.text("Devis personnalisé", 14, 20);

            // Paramètres choisis
            doc.setFontSize(12);
            doc.text(`Produit : ${produit}`, 14, 35);
            doc.text(`Épaisseur : ${epaisseur}`, 14, 45);
            doc.text(`Couleur : ${couleur}`, 14, 55);

            // Prix total
            doc.text(`Prix estimé : ${prixTotal} €`, 14, 70);

            // ---- Export du tableau détail ----
            const table = document.querySelector("#tableDetail table");
            if (table) {
                // Transforme le tableau HTML en PDF avec autoTable
                doc.autoTable({ html: "#tableDetail table", startY: 80 });
            }

            // Sauvegarde le fichier
            doc.save("devis.pdf");
        });