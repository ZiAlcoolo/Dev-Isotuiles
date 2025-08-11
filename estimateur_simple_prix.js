// Données tarifaires organisées par produit -> épaisseur -> tranches de surface
const tarifs = {
    romaneCanal: {
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
            { min: 0, max: 24, prix: 56 },
            { min: 25, max: 49, prix: 52 },
            { min: 50, max: 74, prix: 49 },
            { min: 75, max: 99, prix: 46 },
            { min: 100, max: 149, prix: 41 },
            { min: 150, max: Infinity, prix: 39 }
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
    romaneCanal: ["Rouge Vieillie", "Pastel Vieillie", "Terracotta", "Gris Anthracite"],
    tuilesPlates: ["Gris anthracite (RAL 7016)", "Gris terre d’ombre (RAL 7022)", "Rouge terracotta"],
    bacAcier: ["Blanc - RAL 9010", "Métal argenté - RAL 9006", "Métal gris - RAL 9007", "Gris perle - RAL 7038", "Gris basalte - RAL 7012", "Gris anthracite - RAL 7016", "Gris fonce - RAL 7022", "Noir profond - RAL 9005", "Tuile rouge - RAL 8004", "Rouge fonce - RAL 3009", "Rouge feu - RAL 3000", "Creme - RAL 1015", "Jaune zinc - RAL 1018", "Bleu gentiane - RAL 5010", "Vert fonce - RAL 6005"]
};

// Données des épaisseurs par type
const epaisseursParType = {
    romaneCanal: ["40/80", "60/105"],
    tuilesPlates: ["50/77", "40/80", "60/105"],
    bacAcier: ["30", "40", "50", "60", "80", "100"]
};




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
function getPrixM2(type, epaisseur, surfaceTotale) {
    const tranches = tarifs[type][epaisseur];
    console.log("tarifs", tarifs, "type", type, "epaisseur", epaisseur)
    const tranche = tranches.find(t => surfaceTotale >= t.min && surfaceTotale <= t.max);
    return tranche ? tranche.prix : 0;
}

// Calcul
function majCalcul() {
    const type = document.querySelector('input[name="typePanneau"]:checked').value;
    const epaisseur = document.querySelector('input[name="epaisseur"]:checked').value;

    let totalSurface = 0;
    document.querySelectorAll('#tablePanneaux tbody tr').forEach(tr => {
        const longueur = parseFloat(tr.querySelector('.longueur').value) / 1000 || 0;
        const quantite = parseInt(tr.querySelector('.quantite').value) || 0;
        const surface = longueur * quantite;
        tr.querySelector('.surface').textContent = surface.toFixed(2);
        totalSurface += surface;
    });

    const prixM2 = getPrixM2(type, epaisseur, totalSurface);
    const prixTotal = totalSurface * prixM2;

    document.getElementById('prixTotal').textContent = prixTotal.toFixed(2);
}

// Événements
document.addEventListener('input', majCalcul);
document.addEventListener('change', majCalcul);







// ===== CHOIX DYNAMIQUE PRODUITS ===================
document.addEventListener("DOMContentLoaded", function () {

    const couleurContainer = document.getElementById("couleurContainer");
    const epaisseurContainer = document.getElementById("epaisseurContainer");

    // Fonction qui met à jour les options en fonction du type sélectionné
    function majOptions() {
        const typeSelect = document.querySelector('input[name="typePanneau"]:checked').value;

        // Mise à jour couleurs
        couleurContainer.innerHTML = "";
        couleursParType[typeSelect].forEach((couleur, i) => {
            const id = `coul${i}`;
            couleurContainer.innerHTML += `
                <div class="form-check">
                    <input type="radio" id="${id}" name="couleur" value="${couleur}" ${i === 0 ? 'checked' : ''}>
                    <label for="${id}">${couleur}</label>
                </div>
            `;
        });

        // Mise à jour épaisseurs
        epaisseurContainer.innerHTML = "";
        epaisseursParType[typeSelect].forEach((ep, i) => {
            const id = `ep${i}`;
            epaisseurContainer.innerHTML += `
                <div class="form-check">
                    <input type="radio" id="${id}" name="epaisseur" value="${ep}" ${i === 0 ? 'checked' : ''}>
                    <label for="${id}">${ep}mm</label>
                </div>
            `;
        });
    }

    // Événement sur changement de type
    document.querySelectorAll('input[name="typePanneau"]').forEach(el => {
        el.addEventListener("change", majOptions);
    });

    // Initialisation
    majOptions();
});