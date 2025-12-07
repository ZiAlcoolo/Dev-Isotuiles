const faq_json = {
    "faq": [
        {
            "id": 1,
            "question": "Quelles sont les conditions de paiement ?",
            "answer": [
                "Acompte de 50 % à régler à la commande.",
                "Solde à régler le jour de la livraison, avant déchargement.",
                "Méthodes acceptées : Virement bancaire, Carte bancaire."
            ],
            "category": "Paiement"
        },
        {
            "id": 2,
            "question": "Quelles sont les modalités de réception de la marchandise ?",
            "answer": [
                "Le déchargement est à la charge du client.",
                "Prévoir personnel ou engins pour une réception sécurisée."
            ],
            "category": "Livraison"
        },
        {
            "id": 3,
            "question": "Où en est ma commande ?",
            "answer": [
                "Votre page de suivi affiche l’avancement en temps réel.",
                "Les étapes comprennent : commande enregistrée, production, prêt à expédier, livraison en cours, livré.",
                "Chaque mise à jour déclenche un email automatique."
            ],
            "category": "Suivi"
        },
        {
            "id": 4,
            "question": "Que signifie “Commande fabriquée / Production terminée” ?",
            "answer": [
                "Vos panneaux sont en cours de fabrication ou sortent de production.",
                "Certains accessoires peuvent être fabriqués à des dates différentes.",
                "Vous serez informé(e) lorsque la commande sera prête à être expédiée."
            ],
            "category": "Production"
        },
        {
            "id": 5,
            "question": "Quand ma commande sera-t-elle livrée ?",
            "answer": [
                "Une estimation est indiquée selon les délais moyens.",
                "La date devient précise dès validation de la tournée par le transporteur.",
                "Nous mettons ces informations à jour dès que possible."
            ],
            "category": "Livraison"
        },
        {
            "id": 6,
            "question": "Comment savoir quand les panneaux sont partis en transport ?",
            "answer": [
                "L’étape “En cours de livraison” s’active automatiquement.",
                "Un email vous informe du départ et de la date estimée d’arrivée."
            ],
            "category": "Livraison"
        },
        {
            "id": 7,
            "question": "Recevrai-je un appel du transporteur avant la livraison ?",
            "answer": [
                "Oui, dans la majorité des cas le transporteur vous appelle quelques heures avant.",
                "Cela permet de confirmer votre présence."
            ],
            "category": "Livraison"
        },
        {
            "id": 8,
            "question": "Que faire si je ne suis pas disponible le jour de la livraison ?",
            "answer": [
                "Contactez-nous au plus tôt pour prévenir le transporteur.",
                "Un report de livraison peut parfois être envisagé.",
                "Prévenir avant expédition augmente les possibilités."
            ],
            "category": "Livraison"
        },
        {
            "id": 9,
            "question": "Puis-je modifier ma commande après validation ?",
            "answer": [
                "Après lancement en production, les modifications ne sont généralement plus possibles.",
                "Contactez-nous rapidement pour vérifier si un ajustement reste faisable."
            ],
            "category": "Commande"
        },
        {
            "id": 10,
            "question": "Comment régler le solde de ma commande ?",
            "answer": [
                "Un email 'Rappel solde 50 %' vous est envoyé avant expédition.",
                "Le solde doit être réglé le jour de la livraison, avant déchargement.",
                "Modes de paiement disponibles selon votre choix : lien sécurisé ou virement bancaire."
            ],
            "category": "Paiement"
        },
        {
            "id": 11,
            "question": "Pourquoi le délai de livraison peut-il varier ?",
            "answer": [
                "Selon le modèle, la couleur, la période de l’année, la tournée transport et votre localisation.",
                "Nous faisons le maximum pour respecter les délais annoncés."
            ],
            "category": "Livraison"
        },
        {
            "id": 12,
            "question": "Comment contacter le service client ?",
            "answer": [
                "Par notre formulaire, par email ou par téléphone.",
                "Nous répondons rapidement jusqu'à réception de la commande."
            ],
            "category": "Service client"
        },
        {
            "id": 13,
            "question": "Je ne comprends pas une étape du suivi, que faire ?",
            "answer": [
                "Chaque étape est expliquée sur la page de suivi.",
                "Contactez-nous si un point reste flou : nous vous répondrons personnellement."
            ],
            "category": "Suivi"
        },
        {
            "id": 14,
            "question": "Mon suivi ne s’actualise plus, que faire ?",
            "answer": [
                "Cela peut venir d’un léger délai de synchronisation.",
                "Actualisez la page.",
                "Si le problème persiste, contactez-nous : nous vérifierons auprès de l’usine ou du transporteur."
            ],
            "category": "Suivi"
        }
    ]
}



let html = "";
faq_json.faq.forEach(item => {
    html += `
            <div class="faq-item">
                <div class="faq-header">
                    <h4 class="faq-question">${item.question}</h4>
                    <span>${item.category}</span>
                </div>
                <div class="faq-answer" style="display:none">
                    ${item.answer.map(p => `<p>${p}</p>`).join("")}
                 </div>
            </div>
          `;
});
document.getElementById("faq-container").innerHTML = html;

$(document).on("click", ".faq-item", function () {
    $(this).find(".faq-answer").slideToggle({
        duration: 300,
        easing: "swing" // swing = ease-in-out en jQuery
    });
});


