// Google Apps Script - FAQ Web App
// Sheet ID: 1RMaEUMFyCcb9qCxk_NavIBh3vM3ShzFSPLLGy9yRBy4

const SHEET_ID = '1RMaEUMFyCcb9qCxk_NavIBh3vM3ShzFSPLLGy9yRBy4';
const SHEETS = { isotuiles: 'isotuiles', panotuiles: 'panotuiles', questions: 'questions' };
const HEADERS_FAQ = ['ID', 'Categorie', 'Titre', 'Texte_HTML', 'Boutons_JSON', 'Ordre', 'Actif'];
const HEADERS_QST = ['ID', 'Date', 'Question', 'Note_par', 'Statut'];

function doGet(e) {
  const p = e.parameter;
  const action = p.action;
  const callback = p.callback; // JSONP callback
  try {
    let result;
    if (action === 'getFAQ') result = getFAQ(p.brand);
    else if (action === 'getQuestions') result = getQuestions();
    else if (action === 'saveFAQ') result = saveFAQ(p.brand, JSON.parse(decodeURIComponent(p.row)));
    else if (action === 'deleteFAQ') result = deleteFAQ(p.brand, p.id);
    else if (action === 'reorderFAQ') result = reorderFAQ(p.brand, JSON.parse(decodeURIComponent(p.order)));
    else if (action === 'addQuestion') result = addQuestion(JSON.parse(decodeURIComponent(p.row)));
    else if (action === 'updateQuestionStatus') result = updateQuestionStatus(p.id, decodeURIComponent(p.statut));
    else if (action === 'deleteQuestion') result = deleteQuestion(p.id);
    else if (action === 'initSheets') result = initSheets();
    else result = { error: 'Action inconnue' };
    return jsonpResponse(result, callback);
  } catch (err) {
    return jsonpResponse({ error: err.message }, callback);
  }
}

function jsonpResponse(data, callback) {
  const json = JSON.stringify(data);
  const output = callback ? `${callback}(${json})` : json;
  return ContentService
    .createTextOutput(output)
    .setMimeType(callback ? ContentService.MimeType.JAVASCRIPT : ContentService.MimeType.JSON);
}

function getSheet(name) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  return ss.getSheetByName(name);
}

// ── INIT ──────────────────────────────────────────────
function initSheets() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  ['isotuiles', 'panotuiles'].forEach(name => {
    let sh = ss.getSheetByName(name);
    if (!sh) sh = ss.insertSheet(name);
    if (sh.getLastRow() === 0) sh.appendRow(HEADERS_FAQ);
  });
  let qsh = ss.getSheetByName('questions');
  if (!qsh) qsh = ss.insertSheet('questions');
  if (qsh.getLastRow() === 0) qsh.appendRow(HEADERS_QST);
  return { success: true };
}

// ── FAQ ───────────────────────────────────────────────
function getFAQ(brand) {
  const sh = getSheet(SHEETS[brand]);
  if (!sh) return { error: 'Feuille introuvable' };
  const rows = sh.getDataRange().getValues();
  const headers = rows[0];
  const data = rows.slice(1).map(r => {
    const obj = {};
    headers.forEach((h, i) => obj[h] = r[i]);
    return obj;
  }).filter(r => r.ID !== '');
  return { data };
}

function saveFAQ(brand, row) {
  const sh = getSheet(SHEETS[brand]);
  const rows = sh.getDataRange().getValues();
  // Find by ID
  const idx = rows.findIndex((r, i) => i > 0 && String(r[0]) === String(row.ID));
  const values = [row.ID, row.Categorie, row.Titre, row.Texte_HTML, row.Boutons_JSON, row.Ordre, row.Actif];
  if (idx > -1) {
    sh.getRange(idx + 1, 1, 1, values.length).setValues([values]);
  } else {
    // New row — generate ID
    const newId = Date.now().toString();
    values[0] = newId;
    sh.appendRow(values);
    row.ID = newId;
  }
  return { success: true, id: row.ID };
}

function deleteFAQ(brand, id) {
  const sh = getSheet(SHEETS[brand]);
  const rows = sh.getDataRange().getValues();
  const idx = rows.findIndex((r, i) => i > 0 && String(r[0]) === String(id));
  if (idx > -1) sh.deleteRow(idx + 1);
  return { success: true };
}

function reorderFAQ(brand, orderArr) {
  // orderArr = [{id, ordre}, ...]
  const sh = getSheet(SHEETS[brand]);
  const rows = sh.getDataRange().getValues();
  orderArr.forEach(item => {
    const idx = rows.findIndex((r, i) => i > 0 && String(r[0]) === String(item.id));
    if (idx > -1) sh.getRange(idx + 1, 6).setValue(item.ordre); // col 6 = Ordre
  });
  return { success: true };
}

// ── QUESTIONS ─────────────────────────────────────────
function getQuestions() {
  const sh = getSheet('questions');
  const rows = sh.getDataRange().getValues();
  const headers = rows[0];
  const data = rows.slice(1).map(r => {
    const obj = {};
    headers.forEach((h, i) => obj[h] = r[i]);
    return obj;
  }).filter(r => r.ID !== '');
  return { data };
}

function addQuestion(row) {
  const sh = getSheet('questions');
  const id = Date.now().toString();
  const date = new Date().toLocaleDateString('fr-FR');
  sh.appendRow([id, date, row.Question, row.Note_par || '', row.Statut || 'À traiter']);
  return { success: true, id };
}

function updateQuestionStatus(id, statut) {
  const sh = getSheet('questions');
  const rows = sh.getDataRange().getValues();
  const idx = rows.findIndex((r, i) => i > 0 && String(r[0]) === String(id));
  if (idx > -1) sh.getRange(idx + 1, 5).setValue(statut);
  return { success: true };
}

function deleteQuestion(id) {
  const sh = getSheet('questions');
  const rows = sh.getDataRange().getValues();
  const idx = rows.findIndex((r, i) => i > 0 && String(r[0]) === String(id));
  if (idx > -1) sh.deleteRow(idx + 1);
  return { success: true };
}
