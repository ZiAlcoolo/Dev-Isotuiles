// CONFIG
const SHEET_ID = '1iq55sUMvZRN8v5ky5F55K2b49bdA-o31JLlqdS-scGI';
const VAT_RATE = 0.20; // modifier si nécessaire
const OPENSHEET_BASE = (sheet) => `https://opensheet.elk.sh/${SHEET_ID}/${encodeURIComponent(sheet)}`;

// STATE
let panneaux = [];
let accessoires = [];
let transportTable = [];
let state = {
    panneauId: null,
    longueur: 2.1,
    quantite: 1,
    accessoiresChoisis: [],
    postal: '',
    name: '',
    email: '',
    phone: ''
};

// DOM
const selectPanneau = document.getElementById('selectPanneau');
const inputLongueur = document.getElementById('inputLongueur');
const inputQuantite = document.getElementById('inputQuantite');
const accessoriesList = document.getElementById('accessoriesList');
const overlayLines = document.getElementById('overlayLines');
const overlayTotalHt = document.getElementById('overlayTotalHt');
const progressBar = document.getElementById('progressBar');
const stepsContainer = document.getElementById('stepsContainer');
const btnNext = document.getElementById('btnNext');
const btnPrev = document.getElementById('btnPrev');
const vatRateEl = document.getElementById('vatRate');
const savedStateEl = document.getElementById('savedState');

vatRateEl.textContent = `${Math.round(VAT_RATE * 100)}%`;

// helpers
function e(q, parent = document) { return parent.querySelector(q) }
function eAll(q, parent = document) { return Array.from((parent || document).querySelectorAll(q)) }

// fetch sheets
// --- Chargement des données via OpenSheet ---
async function loadData() {
    $('#loadingSpinner').fadeIn(150);

    try {
        const cachedStr = localStorage.getItem('isotuiles_ordering_cloud_data');
        let useCache = false;
        if (cachedStr) {
            try {
                const cached = JSON.parse(cachedStr);
                const cacheDate = new Date(cached.date); // Date du cache
                const now = new Date();

                // Vérifie si le cache est inférieur à 1 jour (24h)
                if (now - cacheDate < 24 * 60 * 60 * 1000) {
                    // Cache valide
                    panneaux = cached.panneaux.map(normalizePanneau);
                    accessoires = cached.accessoires.map(normalizeAccessoire);
                    transportTable = cached.transportTable.map(normalizeTransport);

                    console.log("Cache loaded:", panneaux);
                    useCache = true;
                } else {
                    console.log("Cache expiré, chargement depuis Google Sheet...");
                }
            } catch (e) {
                console.warn("Erreur lecture cache, chargement depuis Google Sheet", e);
            }
        }

        if (!useCache) {
            // Fetch depuis OpenSheet
            const [p, a, t] = await Promise.all([
                fetch(OPENSHEET_BASE('Panneaux')).then(r => r.json()),
                fetch(OPENSHEET_BASE('Accessoires')).then(r => r.json()),
                fetch(OPENSHEET_BASE('Transport')).then(r => r.json())
            ]);
            
            console.log(p)
            // Stocke les données + date actuelle
            localStorage.setItem('isotuiles_ordering_cloud_data', JSON.stringify({
                panneaux: p,
                accessoires: a,
                transportTable: t,
                date: new Date().toISOString()
            }));

            panneaux = p.map(normalizePanneau);
            accessoires = a.map(normalizeAccessoire);
            transportTable = t.map(normalizeTransport);
        }

        // Appel des fonctions pour afficher les données
        populatePanneauSelect();
        loadSaved();
        renderAccessories();
        updateAllDebounced();

    } catch (err) {
        console.error('Erreur OpenSheet', err);
        alert("Impossible de charger les données. Vérifiez votre connexion ou l’ID du Google Sheet.");
    } finally {
        $('#loadingSpinner').fadeOut(150);
    }
}


// --- Génération des accessoires dynamiquement ---
function renderAccessories() {
    const $list = $('#accessoriesList').empty();
    const selected = panneaux.find(p => p.id === state.panneauId);
    const compat = selected ? selected.accessoires_associes : [];

    const list = accessoires.filter(a => {
        if (!compat.length) return true;
        return compat.includes(a.id) || compat.some(c => a.compatible_panneaux.includes(c)) || a.compatible_panneaux.length === 0;
    });

    list.forEach(acc => {
        const id = `acc_${acc.id}`;
        const saved = state.accessoiresChoisis.find(x => x.id === acc.id) || { value: 0 };

        $list.append(`
      <div class="field accessory-item mb-2">
        <label for="${id}_check" style="font-weight:600;cursor:pointer">
          ${acc.nom} — ${acc.prix_unitaire_ht.toFixed(2)} € HT / ${acc.unite}
        </label>
        <div class="d-flex align-items-center gap-2 mt-1">
          <input type="checkbox" id="${id}_check" data-id="${acc.id}" ${saved.value > 0 ? 'checked' : ''}>
          <input type="number" id="${id}_value" data-id="${acc.id}" min="0" step="1" 
                 value="${saved.value}" class="form-control form-control-sm" placeholder="ml ou quantité">
        </div>
      </div>
    `);
    });
}

// --- Gestion des événements accessoires (en délégation jQuery) ---
$(document).on('change', '.accessory-item input[type=checkbox]', function () {
    const id = $(this).data('id');
    const $val = $(`#acc_${id}_value`);
    const checked = $(this).is(':checked');
    const value = parseFloat($val.val()) || 0;

    if (checked && value === 0) $val.val(1);
    if (!checked) $val.val(0);

    updateStateAccessory(id, checked, parseFloat($val.val()));
    updateAllDebounced();
});

$(document).on('input', '.accessory-item input[type=number]', function () {
    const id = $(this).data('id');
    const val = parseFloat($(this).val()) || 0;
    const $chk = $(`#acc_${id}_check`);

    $chk.prop('checked', val > 0);
    updateStateAccessory(id, val > 0, val);
    updateAllDebounced();
});

// --- Mise à jour de l'état global ---
function updateStateAccessory(id, checked, value) {
    const idx = state.accessoiresChoisis.findIndex(x => x.id === id);
    if (checked) {
        if (idx === -1) state.accessoiresChoisis.push({ id, value });
        else state.accessoiresChoisis[idx].value = value;
    } else if (idx !== -1) {
        state.accessoiresChoisis.splice(idx, 1);
    }
}

// --- Amélioration loadSaved() pour pré-remplir les champs contact/livraison ---
function loadSaved() {
    const s = localStorage.getItem('isotuiles_config');
    if (!s) return;
    try {
        const parsed = JSON.parse(s);
        Object.assign(state, parsed);

        // Restaure les champs
        $('#selectPanneau').val(state.panneauId);
        $('#inputLongueur').val(state.longueur || 2.1);
        $('#inputQuantite').val(state.quantite || 1);
        $('#inputPostal').val(state.postal || '');
        $('#inputName').val(state.name || '');
        $('#inputEmail').val(state.email || '');
        $('#inputPhone').val(state.phone || '');
    } catch (e) {
        console.warn('Erreur restauration état local', e);
    }
}


function normalizePanneau(row) {
    // attente : row.id, row.nom, row.prix_m2_ht, row.prix_m2_ttc, row.accessoires_associes
    return {
        id: row.id || row.N || row.nom || row.id || ('P_' + Math.random().toString(36).slice(2, 9)),
        nom: row.nom || row.Libellé || row.nom || row.Nom || row['Libellé'] || row.Libellé || row.nom || row.nom,
        prix_m2_ht: parseFloat((row.prix_m2_ht || row['Prix Vente'] || row['Prix Vente'] || row['Prix Vente'] || '').toString().replace(/[^0-9.,-]/g, '').replace(',', '.')) || 0,
        description: row.description || row.Description || '',
        accessoires_associes: (row.accessoires_associes || row.accessoires || '').toString().split(/[;,]/).map(s => s.trim()).filter(Boolean)
    };
}

function normalizeAccessoire(row) {
    // attente : id, nom, unite, prix_unitaire_ht, compatible_panneaux
    return {
        id: (row.id || row.N || row.Libellé || ('A_' + Math.random().toString(36).slice(2, 8))).toString().trim(),
        nom: row.nom || row['Libellé'] || row.Libellé || row.nom || row['Libellé'] || row['Libellé'] || row.nom,
        unite: (row.unite || row.Unité || row['Unité'] || row['type'] || row.type || 'ml').toString().trim(),
        prix_unitaire_ht: parseFloat((row.prix_unitaire_ht || row['Prix Vente'] || row['Prix Minimum (ml)'] || row['Prix Vente'] || '').toString().replace(/[^0-9.,-]/g, '').replace(',', '.')) || 0,
        compatible_panneaux: (row.compatible_panneaux || row['compatible_panneaux'] || row['compatible_panneaux'] || row['compatible_panneaux'] || row['Catégorie'] || '').toString().split(/[;,]/).map(s => s.trim()).filter(Boolean)
    };
}

function normalizeTransport(row) {
    return {
        min: parseFloat((row.palier_commande_ht_min || row['palier_commande_ht_min'] || row['palier_commande_ht_min'] || row['palier_commande_ht_min'] || row[Object.keys(row)[0]] || 0) || 0),
        max: parseFloat((row.palier_commande_ht_max || row['palier_commande_ht_max'] || row['palier_commande_ht_max'] || row['palier_commande_ht_max'] || '').toString().replace(/[^0-9.,-]/g, '').replace(',', '.') || 9999999),
        prix: parseFloat((row.prix_transport || row['prix_transport'] || row['prix_transport'] || row['prix_transport'] || row['prix_transport'] || '').toString().replace(/[^0-9.,-]/g, '').replace(',', '.') || 0),
        malus: parseFloat((row.malus_longueur_sup_7m || row['malus_longueur_sup_7m'] || row['malus_longueur_sup_7m'] || row['malus_longueur_sup_7m'] || '').toString().replace(/[^0-9.,-]/g, '').replace(',', '.') || 0)
    };
}

function populatePanneauSelect() {
    selectPanneau.innerHTML = '';
    panneaux.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.id;
        opt.textContent = `${p.nom} — ${p.prix_m2_ht.toFixed(2)} € HT/m²`;
        selectPanneau.appendChild(opt);
    });
    if (!state.panneauId && panneaux.length) {
        state.panneauId = panneaux[0].id;
    }
}




// calculs
function calcPrices() {
    const panneau = panneaux.find(p => p.id === state.panneauId);
    const largeur = 1.0;
    const surfacePar = state.longueur * largeur; // m² par panneau
    const surfaceTotal = surfacePar * state.quantite;
    const prixPanneau = panneau ? surfaceTotal * panneau.prix_m2_ht : 0;
    let prixAccess = 0;
    for (const a of state.accessoiresChoisis) {
        const acc = accessoires.find(x => x.id === a.id);
        if (!acc) continue;
        const unitCount = (acc.unite.toLowerCase().includes('ml') ? parseFloat(a.value || 0) : parseFloat(a.value || 0));
        prixAccess += unitCount * acc.prix_unitaire_ht;
    }
    const subtotalHt = prixPanneau + prixAccess;
    const maxLen = state.longueur;
    const transport = calcTransport(subtotalHt, maxLen);
    const totalHt = subtotalHt + transport;
    const totalTtc = totalHt * (1 + VAT_RATE);
    return { surfacePar, surfaceTotal, prixPanneau, prixAccess, subtotalHt, transport, totalHt, totalTtc };
}

function calcTransport(totalHt, maxLen) {
    if (!transportTable.length) return 0;
    const row = transportTable.find(r => totalHt >= r.min && totalHt < r.max);
    if (!row) return 0;
    let prix = row.prix || 0;
    if (maxLen > 7) prix += row.malus || 0;
    return prix;
}

// UI updates
function updateOverlay() {
    overlayLines.innerHTML = '';
    const panneau = panneaux.find(p => p.id === state.panneauId);
    const prices = calcPrices();
    if (panneau) {
        const div = document.createElement('div'); div.className = 'line';
        div.innerHTML = `<div>${panneau.nom} x ${state.quantite} (${state.longueur}m)</div><div>${prices.prixPanneau.toFixed(2)} €</div>`;
        overlayLines.appendChild(div);
    }
    for (const a of state.accessoiresChoisis) {
        const acc = accessoires.find(x => x.id === a.id);
        if (!acc) continue;
        const div = document.createElement('div'); div.className = 'line';
        div.innerHTML = `<div>${acc.nom} (${a.value} ${acc.unite})</div><div>${(a.value * acc.prix_unitaire_ht).toFixed(2)} €</div>`;
        overlayLines.appendChild(div);
    }
    const divTransport = document.createElement('div'); divTransport.className = 'line';
    divTransport.innerHTML = `<div>Transport estimé</div><div>${prices.transport.toFixed(2)} €</div>`;
    overlayLines.appendChild(divTransport);

    overlayTotalHt.textContent = prices.totalHt.toFixed(2) + ' €';
}

// Navigation & progression
let currentStep = 1; const MAX_STEP = 4;
function showStep(n) {
    const steps = eAll('.step');
    steps.forEach((s, i) => {
        s.classList.remove('active');
        s.classList.add('hidden');
        if (parseInt(s.dataset.step) === n) {
            s.classList.remove('hidden');
            requestAnimationFrame(() => s.classList.add('active'));
        }
    });
    currentStep = n;
    const pct = (n - 1) / (MAX_STEP - 1) * 100;
    progressBar.style.width = pct + '%';
    $('#btnNext').show()
    $('#btnPrev').show()

    if (currentStep === 1) {
        console.log("start")
        $('#btnPrev').hide()

    }
    if (currentStep === MAX_STEP) {
        console.log("end")
        $('#btnNext').hide()
    }
}


function validateStep(n) {
    if (n === 1) {
        if (!state.panneauId) return "Veuillez choisir un modèle de panneau.";
        if (!state.longueur || state.longueur <= 0) return "Veuillez renseigner une longueur valide.";
        if (!state.quantite || state.quantite <= 0) return "Veuillez indiquer une quantité valide.";
    }
    if (n === 3) {
        if (!state.name || !state.email || !state.postal) return "Veuillez remplir vos informations de contact.";
    }
    return null;
}

btnNext.addEventListener('click', () => {
    const error = validateStep(currentStep);
    if (error) {
        alert(error);
        return;
    }
    if (currentStep < MAX_STEP) {
        showStep(currentStep + 1);
        saveLocal();
    }
});

btnPrev.addEventListener('click', () => {
    if (currentStep > 1) showStep(currentStep - 1);
});

// events for inputs
selectPanneau.addEventListener('change', () => { state.panneauId = selectPanneau.value; state.accessoiresChoisis = []; renderAccessories(); updateAllDebounced(); saveLocal(); });
inputLongueur.addEventListener('input', () => { state.longueur = parseFloat(inputLongueur.value) || 2.1; updateAllDebounced(); saveLocal(); });
inputQuantite.addEventListener('input', () => { state.quantite = parseInt(inputQuantite.value) || 1; updateAllDebounced(); saveLocal(); });

document.getElementById('inputPostal').addEventListener('input', () => { state.postal = e('#inputPostal').value; saveLocal(); });
document.getElementById('inputName').addEventListener('input', () => { state.name = e('#inputName').value; saveLocal(); });
document.getElementById('inputEmail').addEventListener('input', () => { state.email = e('#inputEmail').value; saveLocal(); });
document.getElementById('inputPhone').addEventListener('input', () => { state.phone = e('#inputPhone').value; saveLocal(); });

// save/load local
function saveLocal() { localStorage.setItem('isotuiles_config', JSON.stringify(state)); savedStateEl.textContent = 'Enregistré localement'; setTimeout(() => savedStateEl.textContent = '', 2500); }

// recap & PDF
async function buildRecap() {
    const prices = calcPrices();
    const recapEl = document.getElementById('recapDetails');
    recapEl.innerHTML = '';
    const lines = [];
    const panneau = panneaux.find(p => p.id === state.panneauId);
    if (panneau) {
        lines.push({ label: `${panneau.nom} x ${state.quantite} (${state.longueur}m)`, ht: prices.prixPanneau });
    }
    for (const a of state.accessoiresChoisis) {
        const acc = accessoires.find(x => x.id === a.id);
        if (!acc) continue;
        lines.push({ label: `${acc.nom} (${a.value} ${acc.unite})`, ht: a.value * acc.prix_unitaire_ht });
    }
    lines.push({ label: 'Transport estimé', ht: prices.transport });

    lines.forEach(l => {
        const div = document.createElement('div'); div.className = 'recap-line';
        div.innerHTML = `<div>${l.label}</div><div>${l.ht.toFixed(2)} € HT</div>`;
        recapEl.appendChild(div);
    });

    const subtotal = prices.totalHt;
    const ttc = prices.totalTtc;
    const footer = document.createElement('div'); footer.style.marginTop = '12px'; footer.innerHTML = `<div class="recap-line"><div><strong>Total HT</strong></div><div><strong>${subtotal.toFixed(2)} €</strong></div></div>
  <div class="recap-line"><div>TVA (${Math.round(VAT_RATE * 100)}%)</div><div>${(subtotal * VAT_RATE).toFixed(2)} €</div></div>
  <div class="recap-line"><div><strong>Total TTC</strong></div><div><strong>${ttc.toFixed(2)} €</strong></div></div>`;
    recapEl.appendChild(footer);
}

async function downloadPdf() {
    if (!window.jspdf) {
        await import("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js");
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    doc.setFontSize(12);
    doc.text('Devis ISOTUILES', 14, 20);
    doc.setFontSize(10);
    doc.text(`Nom : ${state.name || '-'}    Email : ${state.email || '-'}    Tel : ${state.phone || '-'}    Postal : ${state.postal || '-'}`, 14, 30);
    let y = 40;
    const prices = calcPrices();
    const panneau = panneaux.find(p => p.id === state.panneauId);
    if (panneau) { doc.text(`${panneau.nom} x ${state.quantite} (${state.longueur}m) — ${prices.prixPanneau.toFixed(2)} € HT`, 14, y); y += 8; }
    for (const a of state.accessoiresChoisis) {
        const acc = accessoires.find(x => x.id === a.id);
        if (acc) { doc.text(`${acc.nom} (${a.value} ${acc.unite}) — ${(a.value * acc.prix_unitaire_ht).toFixed(2)} € HT`, 14, y); y += 8; }
    }
    doc.text(`Transport estimé — ${prices.transport.toFixed(2)} € HT`, 14, y); y += 12;
    doc.setFontSize(11);
    doc.text(`Total HT : ${prices.totalHt.toFixed(2)} €`, 14, y);
    y += 8;
    doc.text(`Total TTC : ${prices.totalTtc.toFixed(2)} €`, 14, y);
    doc.save('devis-isotuiles.pdf');
}

document.getElementById('btnDownloadPdf').addEventListener('click', downloadPdf);


// send to parent (Shopify) via postMessage
function sendToParent() {
    // Build lines: the parent must map to actual Shopify variant IDs. If you already have shopify ids, include them in the sheet and they will be sent.
    const prices = calcPrices();
    const lines = [];
    const panneau = panneaux.find(p => p.id === state.panneauId);
    if (panneau) {
        lines.push({ shopify_variant_id: panneau.shopify_variant_id || null, sku: panneau.nom, quantity: state.quantite, properties: { longueur_m: state.longueur } });
    }
    for (const a of state.accessoiresChoisis) {
        const acc = accessoires.find(x => x.id === a.id);
        if (!acc) continue;
        lines.push({ shopify_variant_id: acc.shopify_variant_id || null, sku: acc.nom, quantity: 1, properties: { mesure: a.value } });
    }

    const payload = {
        type: 'ISOTUILES_ADD_TO_CART',
        payload: {
            lines,
            totals: { ht: prices.totalHt, ttc: prices.totalTtc, transport: prices.transport }
        }
    };
    window.parent.postMessage(payload, '*');
}

document.getElementById('btnSendToCart').addEventListener('click', () => {
    buildRecap();
    sendToParent();
});

function updateAll() {
    updateOverlay();
    buildRecap();
}

let updateTimer;
function updateAllDebounced() {
    clearTimeout(updateTimer);
    updateTimer = setTimeout(updateAll, 200);
}


document.getElementById('btnReset').addEventListener('click', () => {
    if (!confirm("Voulez-vous vraiment réinitialiser le formulaire ?")) return;
    localStorage.removeItem('isotuiles_config');
    state = {
        panneauId: panneaux.length ? panneaux[0].id : null,
        longueur: 2.1,
        quantite: 1,
        accessoiresChoisis: [],
        postal: '',
        name: '',
        email: '',
        phone: ''
    };
    inputLongueur.value = state.longueur;
    inputQuantite.value = state.quantite;
    selectPanneau.value = state.panneauId;
    $('#inputPostal').val(state.postal);
    $('#inputName').val(state.name);
    $('#inputEmail').val(state.email);
    $('#inputPhone').val(state.phone);
    renderAccessories();
    updateAll();
    showStep(1);
});





// init
loadData();
showStep(1);

// SNIPPET (à intégrer dans le thème Shopify) :
// Ce script écoute le message postMessage envoyé par l'iframe et ajoute les lignes au panier.
// Il doit être inséré dans theme.liquid ou un fichier JS chargé sur la page qui contient l'iframe.




// window.addEventListener('message', async (e) => {
//   if(!e.data || e.data.type !== 'ISOTUILES_ADD_TO_CART') return;
//   const payload = e.data.payload;

//   // Exemple de mappage local : associez vos SKUs/labels à des variant_ids ici
//   const variantMap = {
//     // 'Panneau ROMANE 40mm': 1234567890,
//     // 'Rive L': 9876543210
//   };

//   for(const line of payload.lines){
//     const variant_id = line.shopify_variant_id || variantMap[line.sku];
//     if(!variant_id){
//       console.warn('Variant non trouvé pour', line.sku);
//       continue;
//     }
//     try{
//       await fetch('/cart/add.js', {
//         method:'POST', headers:{'Content-Type':'application/json'},
//         body: JSON.stringify({id: variant_id, quantity: line.quantity || 1, properties: line.properties || {}})
//       });
//     }catch(err){ console.error('Erreur ajout panier', err); }
//   }
//   // Rediriger vers le panier
//   window.location.href = '/cart';
// });
