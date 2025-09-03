// Données tarifaires organisées par produit -> épaisseur -> tranches de surface
const tarifs = {
    romaneCanal: {
        "40/80": [
            { min: 0, max: 25, prix: 56 },
            { min: 25, max: 50, prix: 52 },
            { min: 50, max: 75, prix: 49 },
            { min: 75, max: 100, prix: 46 },
            { min: 100, max: 150, prix: 41 },
            { min: 150, max: Infinity, prix: 39 }
        ],
        "60/105": [
            { min: 0, max: 25, prix: 58.5 },
            { min: 25, max: 50, prix: 54.5 },
            { min: 50, max: 75, prix: 51.5 },
            { min: 75, max: 100, prix: 48.5 },
            { min: 100, max: 150, prix: 43.5 },
            { min: 150, max: Infinity, prix: 41.5 }
        ]
    },
    romaneCanalVieillies: {
        "40/80": [
            { min: 0, max: 25, prix: 59 },
            { min: 25, max: 50, prix: 55 },
            { min: 50, max: 75, prix: 52 },
            { min: 75, max: 100, prix: 49 },
            { min: 100, max: 150, prix: 44 },
            { min: 150, max: Infinity, prix: 42 }
        ],
        "60/105": [
            { min: 0, max: 25, prix: 61.5 },
            { min: 25, max: 50, prix: 57.5 },
            { min: 50, max: 75, prix: 54.5 },
            { min: 75, max: 100, prix: 51.5 },
            { min: 100, max: 150, prix: 46.5 },
            { min: 150, max: Infinity, prix: 44.5 }
        ]
    },
    tuilesPlates: {
        "50/77": [
            { min: 0, max: 24, prix: 56 },
            { min: 25, max: 49, prix: 52 },
            { min: 50, max: 74, prix: 49 },
            { min: 75, max: 99, prix: 46 },
            { min: 100, max: 149, prix: 41 },
            { min: 150, max: Infinity, prix: 39 }
        ],
        "40/80": [
            { min: 0, max: 24, prix: 56 },
            { min: 25, max: 49, prix: 52 },
            { min: 50, max: 74, prix: 49 },
            { min: 75, max: 99, prix: 46 },
            { min: 100, max: 149, prix: 41 },
            { min: 150, max: Infinity, prix: 39 }
        ],
        "60/105": [
            { min: 0, max: 24, prix: 58.5 },
            { min: 25, max: 49, prix: 54.5 },
            { min: 50, max: 74, prix: 51.5 },
            { min: 75, max: 99, prix: 48.5 },
            { min: 100, max: 149, prix: 43.5 },
            { min: 150, max: Infinity, prix: 41.5 }
        ],
    },
    bacAcier: {
        "30": [
            { min: 20, max: 49, prix: 47.3 },
            { min: 50, max: 149, prix: 29.5 },
            { min: 150, max: 299, prix: 24.8 },
            { min: 300, max: 499, prix: 22.9 },
            { min: 500, max: Infinity, prix: 20.5 }
        ],
        "40": [
            { min: 20, max: 49, prix: 48.9 },
            { min: 50, max: 149, prix: 31.1 },
            { min: 150, max: 299, prix: 26.4 },
            { min: 300, max: 499, prix: 24.5 },
            { min: 500, max: Infinity, prix: 22.1 }
        ],
        "50": [
            { min: 20, max: 49, prix: 50.9 },
            { min: 50, max: 149, prix: 34.2 },
            { min: 150, max: 299, prix: 29 },
            { min: 300, max: 499, prix: 27.1 },
            { min: 500, max: Infinity, prix: 24.7 }
        ],
        "60": [
            { min: 20, max: 49, prix: 53.6 },
            { min: 50, max: 149, prix: 37.9 },
            { min: 150, max: 299, prix: 31.7 },
            { min: 300, max: 499, prix: 29.8 },
            { min: 500, max: Infinity, prix: 27.4 }
        ],
        "80": [
            { min: 20, max: 49, prix: 56 },
            { min: 50, max: 149, prix: 40.3 },
            { min: 150, max: 299, prix: 34.1 },
            { min: 300, max: 499, prix: 32.2 },
            { min: 500, max: Infinity, prix: 29.8 }
        ],
        "100": [
            { min: 20, max: 49, prix: 58.3 },
            { min: 50, max: 149, prix: 42.6 },
            { min: 150, max: 299, prix: 36.4 },
            { min: 300, max: 499, prix: 34.5 },
            { min: 500, max: Infinity, prix: 32.1 }
        ]
    }
};

// Données des coloris par type
const couleursParType = {
    romaneCanal: [["Terracotta", "#c96a31"], ["Gris Anthracite", "#484848"], ["Rouge Vieillie", "linear-gradient(90deg,#ba684f 10%, #724437 50%, #ba684f 90%);"], ["Pastel Vieillie", "linear-gradient(90deg,rgba(135, 113, 84, 1) 10%, rgba(102, 79, 56, 1) 50%, rgba(135, 113, 84, 1) 90%)"]],
    tuilesPlates: [["Gris anthracite (RAL 7016)", "#3B4044"], ["Gris terre d’ombre (RAL 7022)", "#4C4C47"], ["Terracotta", "#c96a31"]],
    bacAcier: [["Blanc - RAL 9010", "#EFEEE5"],
    ["Métal argenté - RAL 9006", "#9A9D9D"],
    ["Métal gris - RAL 9007", "#828280"],
    ["Gris perle - RAL 7038", "#ADB0A9"],
    ["Gris basalte - RAL 7012", "#595E60"],
    ["Gris anthracite - RAL 7016", "#3B4044"],
    ["Gris fonce - RAL 7022", "#4C4C47"],
    ["Noir profond - RAL 9005", "#131516"],
    ["Tuile rouge - RAL 8004", "#814D37"],
    ["Rouge foncé - RAL 3009", "#643730"],
    ["Rouge feu - RAL 3000", "#962A27"],
    ["Crème - RAL 1015", "#DED3B6"],
    ["Jaune zinc - RAL 1018", "#EBD346"],
    ["Bleu gentiane - RAL 5010", "#0E457A"],
    ["Vert foncé - RAL 6005", "#234235"]]
};

// Données des épaisseurs par type
const epaisseursParType = {
    romaneCanal: ["40/80", "60/105"],
    tuilesPlates: ["50/77", "40/80", "60/105"],
    bacAcier: ["30", "40", "50", "60", "80", "100"]
};




// Produit sélectionné (à changer selon ton select)
let produitSelectionne = "romaneCanal";
let epaisseurSelectionne = "40/80";
let isVieillie = false;









// ===== CHOIX DYNAMIQUE PRODUITS ===================
document.addEventListener("DOMContentLoaded", function () {

    const couleurContainer = document.getElementById("couleurContainer");
    const epaisseurContainer = document.getElementById("epaisseurContainer");

    // Fonction qui met à jour les options en fonction du type sélectionné
    function majOptions() {


        let valType = $('input[name="typePanneau"]:checked').val();
        let valEpaisseur = $('input[name="epaisseurPanneau"]:checked').val();


        produitSelectionne = valType || produitSelectionne;
        epaisseurSelectionne = valEpaisseur || epaisseurSelectionne;
        isVieillie = ($('input[name="couleurPanneau"]:checked').val() || "").includes("Vieillie");
        produitSelectionne = isVieillie ? "romaneCanalVieillies" : produitSelectionne === "romaneCanalVieillies" ? "romaneCanal" : produitSelectionne;



        console.log("========", isVieillie, produitSelectionne, epaisseurSelectionne, "========");







        if ((!couleursParType[produitSelectionne])) {
            return
        }

        // Mise à jour couleurs
        couleurContainer.innerHTML = "";
        couleursParType[produitSelectionne].forEach((couleur, i) => {
            const id = `coul${i}`;
            couleurContainer.innerHTML += `
                <div class="form-check">
                    <input type="radio" id="${id}" name="couleurPanneau" value="${couleur[0]}" ${i === 0 ? 'checked' : ''}>
                    <label for="${id}"><div class="couleurChip" style="background:${couleur[1]};"></div>${couleur[0]}</label>
                </div>
            `;
        });

        // Mise à jour épaisseurs
        epaisseurContainer.innerHTML = "";
        epaisseursParType[produitSelectionne].forEach((ep, i) => {
            if (i === 0) { epaisseurSelectionne = ep }
            const id = `ep${i}`;
            epaisseurContainer.innerHTML += `
                <div class="form-check">
                    <input type="radio" id="${id}" name="epaisseurPanneau" value="${ep}" ${i === 0 ? 'checked' : ''}>
                    <label for="${id}">${ep}mm</label>
                </div>
            `;
        });


        majTablePrix();


        // Événement sur changement de type
        document.querySelectorAll('input[name="typePanneau"]').forEach(el => {
            el.addEventListener("change", majOptions);
        });

        // Événement sur changement de type
        document.querySelectorAll('input[name="couleurPanneau"], input[name="epaisseurPanneau"]').forEach(el => {
            el.addEventListener("change", function () {
                isVieillie = ($('input[name="couleurPanneau"]:checked').val() || "").includes("Vieillie");
                produitSelectionne = isVieillie ? "romaneCanalVieillies" : produitSelectionne === "romaneCanalVieillies" ? "romaneCanal" : produitSelectionne;
                let valEpaisseur = $('input[name="epaisseurPanneau"]:checked').val();
                epaisseurSelectionne = valEpaisseur || epaisseurSelectionne;
                majTablePrix();
            });
        });




    }



    // Initialisation
    majOptions();
});












// Génère le tableau des prix
function majTablePrix() {

    data = tarifs[produitSelectionne]

    titre = $('input[name="typePanneau"]:checked').next('label').text();

    let html = `<h4>${titre}</h4>`;
    html += `<table  cellpadding="5">
        <thead>
            <tr>
                <th>Surface / Épaisseur</th>
                <th>${epaisseurSelectionne}mm</th>
            </tr>
        </thead>
        <tbody>`;


    if ((!data[epaisseurSelectionne])) {
        return console.log("GAEEEEEEEEEEEEEEE")
    }
    console.log("Check", data[epaisseurSelectionne], epaisseurSelectionne)

    const nbRows = data[epaisseurSelectionne].length;
    for (let i = 0; i < nbRows; i++) {
        const plages = data[epaisseurSelectionne][i];

        let surfaceLabel = "";
        if (plages.min === 0) surfaceLabel = `De 0 à ${plages.max}m²`;
        else if (plages.max === Infinity) surfaceLabel = `Plus de ${plages.min}m²`;
        else surfaceLabel = `De ${plages.min} à ${plages.max}m²`;

        html += `<tr>
            <td class="tb_longueur">${surfaceLabel}</td>
            <td class="tb_quantite">${plages.prix.toFixed(2).replace('.', ',')} €/m²</td>
        </tr>`;
    }

    html += `</tbody></table>`;
    $("#tablePrix").html(html);
}






// Ajout de ligne
document.getElementById('ajouterLigne').addEventListener('click', () => {
    const tbody = document.querySelector('#tablePanneaux tbody');
    const row = document.createElement('tr');
    row.innerHTML = `
        <td><input type="number" step="0.01" class="longueur"></td>
        <td><input type="number" step="1" class="quantite"></td>
        <td class="surface">0</td>
    `;
    tbody.appendChild(row);
});

// Récupération du prix selon le produit, l’épaisseur et la surface totale
function getPrixM2(surfaceTotale) {
    if (surfaceTotale === 0) { return }
    const tranches = tarifs[produitSelectionne][epaisseurSelectionne];
    // console.log("tarifs", tarifs, "type", type, "epaisseur", epaisseur)
    const tranche = tranches.find(t => surfaceTotale >= t.min && surfaceTotale <= t.max);
    return tranche ? tranche.prix : 0;
}

// Calcul
function majCalcul() {

    let tbody = $("#tableDetail tbody");
    tbody.empty();

    let totalSurface = 0;
    document.querySelectorAll('#tablePanneaux tbody tr').forEach(tr => {
        const longueur = parseFloat(tr.querySelector('.longueur').value) / 1000 || 0;
        const quantite = parseInt(tr.querySelector('.quantite').value) || 0;
        const surface = longueur * quantite;
        tr.querySelector('.surface').textContent = surface.toFixed(2);
        totalSurface += surface;

        var prixM2_ligne = getPrixM2(surface);
        var prixTotal_ligne = surface * prixM2_ligne
        // Ajout dans la table
        var titre = $('input[name="typePanneau"]:checked').next('label').text();
        tbody.append(`
            <tr>
                <td>${titre} ${isVieillie ? "(Vieillie)" : ""}</td>
                <td>${epaisseurSelectionne}</td>
                <td>${longueur} m</td>
                <td>${quantite}</td>
                <td>${surface.toFixed(2)} m²</td>
                <td>${prixM2_ligne} €/m²</td>
                <td>${prixTotal_ligne?prixTotal_ligne.toFixed(2):0} €</td>
            </tr>
        `);

    });


    const prixM2 = getPrixM2(totalSurface);
    const prixTotal = totalSurface * prixM2;




    document.getElementById('prixTotal').textContent = prixTotal?`${prixTotal.toFixed(2)} €`:"0 €";
}

// Événements
document.addEventListener('input', majCalcul);
document.addEventListener('change', majCalcul);


// Toggle affichage
$(".toggle_btn").on("click", function () {
    $(this).next(".tableContainer").slideToggle();
    $(this).toggleClass("expand");
});

// Initialisation
majTablePrix();