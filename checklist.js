const mychecklist = [
    {
        title: "Ajouter les longueurs par défaut",
        check: false,
    },
    {
        title: "Les coloris vieillie en Romane canal + chers que couleurs unis (gris / terracotta )",
        check: true,
    },
    {
        title: "Afficher détail : Genre prix au m2 + prix du panneau",
        check: true,
    }
];


$("#checkList").html(`



<div class="checklist">
    <h2>Améliorations à faire</h2>
    <div id="checklist_content">
        <div class="item">
            <input type="checkbox">
            <span class="text">Apprendre HTML</span>
        </div>
        <div class="item">
            <input type="checkbox">
            <span class="text">Coder en CSS</span>
        </div>
        <div class="item">
            <input type="checkbox">
            <span class="text">Maîtriser JavaScript</span>
        </div>
    </div>
    
</div>

<script>
    document.querySelectorAll('.item').forEach(item => {
        const checkbox = item.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', () => {
            item.classList.toggle('checked', checkbox.checked);
        });
    });
</script>
<style>


    #checkList .checklist {
        margin:auto;
        background: white;
        padding: 20px 25px;
        border-radius: 12px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.08);
        width: 100%;
        box-sizing: border-box;
    }

    #checkList .checklist h2 {
        margin-bottom: 15px;
        font-size: 1.4em;
        color: #333;
    }

    #checkList .item {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        padding: 8px;
        border-radius: 8px;
        transition: background 0.2s;
        cursor: pointer;
    }

    #checkList .item:hover {
        background: #f0f0f0;
    }

    #checkList input[type="checkbox"] {
        appearance: none;
        width: 18px;
        height: 18px;
        border: 2px solid #777;
        border-radius: 4px;
        margin-right: 12px;
        position: relative;
        cursor: pointer;
        transition: border-color 0.2s, background 0.2s;
    }

    #checkList input[type="checkbox"]:checked {
        background: #4caf50;
        border-color: #4caf50;
    }

    #checkList input[type="checkbox"]:checked::after {
        content: '✔';
        position: absolute;
        top: -2px;
        left: 3px;
        font-size: 14px;
        color: white;
    }

    #checkList .text {
        flex: 1;
        font-size: 1em;
        color: #444;
        transition: color 0.3s, text-decoration 0.3s;
    }

    #checkList .checked .text {
        color: #aaa;
        text-decoration: line-through;
    }
</style>

`)







// Génération du HTML avec .map()
$('#checklist_content').html(
    mychecklist.map(item => `
        <div class="item">
            <input type="checkbox" ${item.check ? 'checked' : ''}>
            <span class="text">${item.title}</span>
        </div>
    `).join('')
);

// Gestion de l'état visuel (ligne barrée si coché)
$('.checklist input[type="checkbox"]').each(function() {
    if ($(this).is(':checked')) {
        $(this).closest('.item').addClass('checked');
    }
}).on('change', function() {
    $(this).closest('.item').toggleClass('checked', this.checked);
});
