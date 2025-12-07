fetch('../JSON/tracking_order-faq.json')
    .then(r => r.json())
    .then(data => {
        let html = "";
        data.faq.forEach(item => {
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


    });
