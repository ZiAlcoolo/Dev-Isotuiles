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
    tuilesPlates: ["50/77"/*, "40/80", "60/105"*/],
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
        return
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
        <td> <select class="longueur" required>
                                <option value="">-- Sélectionner --</option>
                                <option value="2100">2.100 mm</option>
                                <option value="2450">2.450 mm</option>
                                <option value="2800">2.800 mm</option>
                                <option value="3150">3.150 mm</option>
                                <option value="3500">3.500 mm</option>
                                <option value="3850">3.850 mm</option>
                                <option value="4200">4.200 mm</option>
                                <option value="4550">4.550 mm</option>
                                <option value="4900">4.900 mm</option>
                                <option value="5250">5.250 mm</option>
                                <option value="5600">5.600 mm</option>
                                <option value="5950">5.950 mm</option>
                                <option value="6300">6.300 mm</option>
                                <option value="6650">6.650 mm</option>
                                <option value="7000">7.000 mm</option>
                                <option value="7350">7.350 mm</option>
                                <option value="7700">7.700 mm</option>
                                <option value="8050">8.050 mm</option>
                                <option value="8400">8.400 mm</option>
                                <option value="8750">8.750 mm</option>
                                <option value="9100">9.100 mm</option>
                                <option value="9450">9.450 mm</option>
                                <option value="9800">9.800 mm</option>
                                <option value="10150">10.150 mm</option>
                                <option value="10500">10.500 mm</option>
                                <option value="10850">10.850 mm</option>
                                <option value="11200">11.200 mm</option>
                                <option value="11550">11.550 mm</option>
                                <option value="11900">11.900 mm</option>
                                <option value="12250">12.250 mm</option>
                            </select></td>
        <td><input type="number" step="1" class="quantite" required></td>
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

    $("#tableDetail .info-text").hide();
    let tbody = $("#tableDetail tbody");
    tbody.empty();

    let totalSurface = 0;
    let totalPrix = 0;

    // === 1. Parcours des panneaux ===
    document.querySelectorAll('#tablePanneaux tbody tr').forEach(tr => {
        const longueur = parseFloat(tr.querySelector('.longueur').value) / 1000 || 0;
        const quantite = parseInt(tr.querySelector('.quantite').value) || 0;
        const surface = longueur * quantite;
        tr.querySelector('.surface').textContent = surface.toFixed(2);
        totalSurface += surface;

        var prixM2_ligne = getPrixM2(surface);
        var prixTotal_ligne = surface * prixM2_ligne;

        // Ajout dans la table
        var titre = $('input[name="typePanneau"]:checked').next('label').text();
        tbody.append(`
            <tr>
                <td>${titre} ${isVieillie ? "(Vieillie)" : ""}</td>
                <td>${epaisseurSelectionne}</td>
                <td>${longueur} m</td>
                <td>${quantite}</td>
                <td>${surface.toFixed(2)} m²</td>
                <td>${prixM2_ligne ?? "--"} €/m²</td>
                <td>${prixTotal_ligne ? prixTotal_ligne.toFixed(2) : 0} €</td>
            </tr>
        `);

        totalPrix += prixTotal_ligne;
    });

    // === 2. Parcours des accessoires ===
    $('#listeAccessoires .accessoire_container').each(function () {
        let nb = parseInt($(this).attr("data-nb-acc")) || 0;
        if (nb > 0) {
            let id = $(this).attr("data-id-acc");
            let acc = liste_accessoires.find(a => a.id === id);
            if (acc) {
                let prixTotalAcc = acc.prix * nb;

                tbody.append(`
                    <tr>
                        <td>${acc.nom}</td>
                        <td colspan="2"></td>
                        <td>${nb}</td>
                        <td colspan="1"></td>
                        <td>${acc.prix.toFixed(2)} €/u.</td>
                        <td>${prixTotalAcc.toFixed(2)} €</td>
                    </tr>
                `);

                totalPrix += prixTotalAcc;
            }
        }
    });

    // === 3. Total général ===
    document.getElementById('prixTotal').textContent = totalPrix ? `${totalPrix.toFixed(2)} €` : "0 €";
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






// ACCESSOIRES ==============================================
const liste_accessoires = [
    {
        id: "1",
        nom: "Cache mousse ép. 40/80mm",
        url:"./products/faitage-de-fermeture-copie",
        photo:"https://isotuiles.fr/cdn/shop/files/Capture_d_ecran_2025-04-08_180757.png?v=1744156679",
        prix: 12.50,
    },
    {
        id: "2",
        nom: "Cache mousse ép. 60/100mm",
        url:"./products/cache-mousse-ep-40-80-mm-copie",
        photo:"https://isotuiles.fr/cdn/shop/files/Capture_d_ecran_2025-04-08_180815.png?v=1744128595",
        prix: 13.00,
    },
    {
        id: "3",
        nom: "Faitage",
        url:"./products/faitage-1",
        photo:"https://isotuiles.fr/cdn/shop/files/accessoire5.webp?v=1744156679",
        prix: 22.00,
    },
    {
        id: "4",
        nom: "Faitage contre mur",
        url:"./products/faitage-contre-mur-1",
        photo:"https://isotuiles.fr/cdn/shop/files/accessoire3.webp?v=1744156679",
        prix: 18.50,
    },
    {
        id: "5",
        nom: "Faitage de fermeture",
        url:"./products/faitage-de-fermeture-1",
        photo:"https://isotuiles.fr/cdn/shop/files/accessoire4.webp?v=1732008577",
        prix: 18.50,
    },
    {
        id: "6",
        nom: "Rive latérale L",
        url:"./products/rive-laterale-u-copie",
        photo:"https://isotuiles.fr/cdn/shop/files/Capture_d_ecran_2025-04-08_180903.png?v=1744128556",
        prix: 16.80,
    },
    {
        id: "7",
        nom: "Rive latérale U",
        url:"./products/profil-frontale-copie",
        photo:"https://isotuiles.fr/cdn/shop/files/Capture_d_ecran_2025-04-08_181122.png?v=1744156679",
        prix: 17.00,
    },
    {
        id: "8",
        nom: "Vis de 125mm (100 u.)",
        url:"./products/vis-de-125mm",
        photo:"https://isotuiles.fr/cdn/shop/files/vis.png?v=1744156679",
        prix: 52.80,
    },
    {
        id: "9",
        nom: "Vis de 150mm (100 u.)",
        url:"./products/vis-de-150mm",
        photo:"https://isotuiles.fr/cdn/shop/files/vis.png?v=1744156679",
        prix: 55.20,
    },
]




function DisplayAccessories() {
    $('#listeAccessoires').toggleClass('expand').slideToggle();

    if ($('#listeAccessoires').hasClass('expand')) {
        $('button#afficherAccessoires').text("Retirer les accessoires");

        var html_accessoires = "";
        liste_accessoires.forEach(accessoire => {
            html_accessoires += `
            <div class="accessoire_container" data-id-acc="${accessoire.id}" data-nb-acc="0">
                <div class="cover">
                    <img src="${accessoire.photo}" loading="lazy">
                </div>
                <div class="acc_details">
                    <p class="nom">${accessoire.nom}</p>
                    <p class="prix">€${accessoire.prix} EUR</p>
                    <div class="btn_container">
                        <button class="reduce_nb">-</button>
                        <div class="select_acc">Ajouter</div>
                        <button class="increase_nb">+</button>
                    </div>
                </div>
            </div>
            `;
        });

        $('#listeAccessoires').html(html_accessoires);

        // Initialisation : cacher les boutons + et -
        $('#listeAccessoires .reduce_nb, #listeAccessoires .increase_nb').hide();

        // Gestion des événements
        $('#listeAccessoires .select_acc').on('click', function () {
            let container = $(this).closest('.accessoire_container');
            container.attr("data-nb-acc", 1).addClass('selected');
            $(this).text("1"); // remplacer "Ajouter" par compteur
            container.find('.reduce_nb, .increase_nb').show(); // montrer les boutons
            majCalcul()
        });
        
        $('#listeAccessoires .increase_nb').on('click', function () {
            let container = $(this).closest('.accessoire_container');
            let count = parseInt(container.attr("data-nb-acc")) || 0;
            count++;
            container.attr("data-nb-acc", count);
            container.find('.select_acc').text(count);
            majCalcul()
        });
        
        $('#listeAccessoires .reduce_nb').on('click', function () {
            let container = $(this).closest('.accessoire_container');
            let count = parseInt(container.attr("data-nb-acc")) || 0;
            if (count > 1) {
                count--;
                container.attr("data-nb-acc", count);
                container.find('.select_acc').text(count);
            } else {
                // Retour à l'état initial
                container.attr("data-nb-acc", 0).removeClass('selected');
                container.find('.select_acc').text("Ajouter");
                container.find('.reduce_nb, .increase_nb').hide();
            }
            majCalcul()
        });

    } else {
        $('button#afficherAccessoires').text("Ajouter des accessoires");
    }
}
