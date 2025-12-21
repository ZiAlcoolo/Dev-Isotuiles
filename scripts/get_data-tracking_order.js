async function chargerCommande() {
    const url = new URL(window.location.href);
    const token = url.searchParams.get("token");

    if (!token) {
        document.body.innerHTML = `
        <div style="max-width:400px;margin:80px auto;font-family:Arial">
            <h2>Accès au suivi de commande</h2>
            <p>Veuillez coller votre token de suivi :</p>

            <input 
                id="tokenInput"
                type="text"
                placeholder="Ex : 8f1c2b9e-xxxx"
                style="width:100%;padding:10px;margin:10px 0;border-radius:6px;border:1px solid #ccc"
            />

            <button 
                id="submitToken"
                style="width:100%;padding:10px;border-radius:6px;border:none;background:#2d4472;color:white;font-weight:600;cursor:pointer"
            >
                Envoyer
            </button>
        </div>
    `;

        document.getElementById("submitToken").addEventListener("click", () => {
            const inputToken = document.getElementById("tokenInput").value.trim();

            if (!inputToken) {
                alert("Veuillez saisir un token valide.");
                return;
            }

            const url = new URL(window.location.href);
            url.searchParams.set("token", inputToken);

            window.location.href = url.toString();
        });
        document.getElementById("tokenInput").addEventListener("keydown", e => {
            if (e.key === "Enter") {
                document.getElementById("submitToken").click();
            }
        });


        return;
    }


    const response = await fetch(
        "https://script.google.com/macros/s/AKfycbzcsVGSWZGk0aAmjCOzkvRO_F9a5RHA9pYp9yvQbIxF4SAQfE0giTbT8ZhoQQSnHAo/exec?token=" + token
    );

    const data = await response.json();
    console.table(data)

    if (data.error) {
        document.body.innerHTML = "<h2>Erreur : " + data.error + "</h2>";
        return;
    }

    // Sauvegarde globale
    window.DATA = data;

    // Lance le rendu complet
    renderFromSheet(data);
}

chargerCommande();




var order_data = null

function renderFromSheet(data) {
    order_data = data;

    // -------------------------
    // MAP DES DONNÉES
    // -------------------------
    const d = {
        id_order: data["ID commande"],
        client: data["Nom client"],
        devis: Number(data["Montant devis"] || 0),
        acompte: Number(data["Acompte payé"] || 0),

        modele: data["Modèle de panneau"] || "—",
        epaisseur: data["Épaisseur"] || "—",
        quantite: data["Quantité"] || "—",
        longueurs: data["Longueurs (mm)"] || "—",
        surface: data["Surface totale (m²)"] || "—",

        // Dates timeline
        etape: data["Étape actuelle"] || "Commande enregistrée",
        dates_etapes: [data["Date Commande enregistrée"], data["Date Production"], data["Date Prêt à être expédié"], data["Date En cours de livraison"], data["Date Livré"]],

        delai_livraison: data["Délai Livraison"],

        trackingUrl: data["URL suivi client"] || "#",
    };

    // -------------------------
    // AFFICHAGE DES TEXTES
    // -------------------------
    $("#orderId").text(d.id_order);
    $("#clientName").text(d.client);

    $("#nom").text(d.client);
    $("#id").text(d.id_order);
    $("#etape").text(data["Étape actuelle"]);

    $("#clientValue").text(d.client);
    $("#devisValue").text(formatCurrency(d.devis));
    $("#acompteValue").text(formatCurrency(d.acompte));
    $("#resteValue").text(formatCurrency(d.devis - d.acompte));

    $("#modele").text(d.modele);
    $("#epaisseur").text(d.epaisseur);
    $("#quantite").text(d.quantite);
    $("#longueurs").text(d.longueurs);
    $("#surface").text(d.surface);





    const formatted_today_date = FormattedDate(new Date());


    $("#lastUpdate").text(formatted_today_date);

    $("#openLinkBtn").attr("href", d.trackingUrl);

    // -------------------------
    // TIMELINE
    // -------------------------
    const currentStep = d.etape;
    $("#transportStatus").text(currentStep === "En cours de livraison" || currentStep === "Livré" ? "Expédié" : "Non expédié");
    if (d.delai_livraison) {
        $("#delaiLivraisonStatus").html(`<b>${d.delai_livraison}</b>`);
    }

    const ORDER_STEPS = [
        "Commande enregistrée",
        "Production",
        "Prêt à être expédié",
        "En cours de livraison",
        "Livré",
    ];
    const STEPS_DESCRIPTION = [
        "Nos équipes ont bien reçu votre commande et vérifient les informations fournies.",
        "Votre commande est en cours de fabrication selon les dimensions et coloris choisis.",
        "Votre commande est emballée et en attente de prise en charge par le transporteur.",
        "Votre commande est en transit et acheminée vers votre adresse de livraison.",
        "Votre commande a été remise avec succès. Contactez-nous en cas de besoin.",
    ];

    GenerateDetailedSteps(d.dates_etapes, currentStep, ORDER_STEPS, STEPS_DESCRIPTION)

}


// Nouvel affichage
function GenerateDetailedSteps(dates, current_step, steps, descriptions) {
    let html = "";
    var circle_style = ""

    steps.forEach((step, i) => {
        const date = dates && dates[i] ? `<span> - ${FormattedDate(new Date(dates[i]))}</span>` : "";

        circle_style = step === current_step ? "present" : circle_style === "present" ? "future" : circle_style === "future" ? "future" : "past";

        html += `
        <div class="step-container${" " + circle_style}">
            <div class="dots-container">
                <div class="circle-1">
                    <div class="circle-2"></div>
                </div>
            </div>
            <div class="text-content">
                <h4>${step}${date}</h4>
                <p>${descriptions[i]}</p>
            </div>
        </div>
        <div class="progession-bar${" " + circle_style}"><div><div class="inner-bar"></div></div></div>
        `;
    });

    return $("#progress-container").html(html);
}



// -------- Utils ----------
function formatCurrency(x) {
    return Number(x).toLocaleString("fr-FR", {
        style: "currency",
        currency: "EUR"
    });
}

function formatDate(v) {
    if (!v) return "";
    const d = new Date(v);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "short",
        day: "numeric"
    });
}

function getStageMessage(pct) {
    if (pct === 100) return "Votre commande a été finalisée et livrée — merci !";
    if (pct >= 60) return "Votre commande est en cours d'expédition ou proche de la livraison.";
    if (pct >= 30) return "Votre commande est en production.";
    return "Votre commande est en cours de traitement.";
}


function FormattedDate(date, f) {
    var date_formatted = "--"
    if (f) {
        date_formatted = date.toLocaleString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
        }).replace(',', ' -')
    } else {
        date_formatted = date.toLocaleString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
            hour: "2-digit",
            minute: "2-digit"
        }).replace(',', ' -')
    }
    return date_formatted
}