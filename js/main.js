gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    const steps = document.querySelectorAll('.step');
    const panel = document.getElementById('info-panel');
    const closeBtn = document.getElementById('close-btn');

    // 1. Registro de Personajes Extendido
    const characterRegistry = {
        'hasan': { name: "Hasan Yildirim", age: "--", role: "Friseur", desc: "Aktenauszug..." },
        'ozcan': { name: "Özcan Yildirim", age: "--", role: "Inhaber des\n" +
                "Haarstudio Özcan", desc: "Aus den Ermittlungsakten: Vor dem Friseurgeschäft\n" +
                "wurde Herr Özcan Yildirim festgestellt. In einer ersten informellen Befragung\n" +
                "wurde er durch den Beamten P. befragt,ob es Bedrohungen\n" +
                "zu seinem Nachteil gegeben hat." },
        'testigo1': { name: "Abdullah", age: "40", role: "Vecino", desc: "Vio la explosión." },
        'testigo2': { name: "Testigo B", age: "25", role: "Estudiante", desc: "Estaba cerca." }
    };

    // 2. Lógica de Scroll Dinámica
    steps.forEach((step) => {
        // Buscamos los elementos específicos de la escena que contiene este step
        const parentScene = step.closest('.scene');
        const charL = parentScene.querySelector('.left-char');
        const charR = parentScene.querySelector('.right-char');
        const bubbleL = charL.querySelector('.bubble');
        const bubbleR = charR.querySelector('.bubble');

        const speaker = step.dataset.who;
        const message = step.dataset.text;

        ScrollTrigger.create({
            trigger: step,
            start: "top center",
            end: "bottom center",
            onEnter: () => updateConversation(speaker, message, charL, charR, bubbleL, bubbleR),
            onEnterBack: () => updateConversation(speaker, message, charL, charR, bubbleL, bubbleR),
            onLeave: () => hideBubble(speaker, charL, charR, bubbleL, bubbleR),
            onLeaveBack: () => hideBubble(speaker, charL, charR, bubbleL, bubbleR)
        });
    });

    function updateConversation(speaker, message, charL, charR, bubbleL, bubbleR) {
        if (speaker === 'left') {
            bubbleL.textContent = message;
            gsap.to(bubbleL, { opacity: 1, y: -10 });
            gsap.to(charL, { scale: 1.1, duration: 0.3 });
        } else {
            bubbleR.textContent = message;
            gsap.to(bubbleR, { opacity: 1, y: -10 });
            gsap.to(charR, { scale: 1.1, duration: 0.3 });
        }
    }

    function hideBubble(speaker, charL, charR, bubbleL, bubbleR) {
        const targetBubble = speaker === 'left' ? bubbleL : bubbleR;
        const targetChar = speaker === 'left' ? charL : charR;
        gsap.to(targetBubble, { opacity: 0, y: 0 });
        gsap.to(targetChar, { scale: 1, duration: 0.3 });
    }

    // 3. Interacción con los personajes (Click)
    document.querySelectorAll('.character').forEach(char => {
        char.addEventListener('click', (e) => {
            e.stopPropagation();

            // Quitar aura de todos los personajes de todas las escenas
            document.querySelectorAll('.character').forEach(c => c.classList.remove('active-character'));
            char.classList.add('active-character');

            // Cargar datos usando el data-id
            const charId = char.dataset.id;
            const data = characterRegistry[charId];
            if (data) {
                document.getElementById('p-name').textContent = data.name;
                document.getElementById('p-age').textContent = data.age;
                document.getElementById('p-role').textContent = data.role;
                document.getElementById('p-desc').textContent = data.desc;
                panel.classList.add('is-visible');
            }
        });
    });

    // 4. Cierre
    closeBtn.addEventListener('click', () => {
        panel.classList.remove('is-visible');
        document.querySelectorAll('.active-character').forEach(c => c.classList.remove('active-character'));
    });

    // Función para crear triggers de cajas de contexto rápidamente
    function createContextTrigger(boxId, triggerElement) {
        gsap.to(boxId, {
            scrollTrigger: {
                trigger: triggerElement,
                start: "top center",
                end: "bottom center",
                toggleActions: "play reverse play reverse",
            },
            opacity: 1,
            y: -10,
            duration: 0.4
        });
    }

    // Aplicar a tus cajas
    createContextTrigger("#info-1", "#step-3"); // La caja 1 aparece cuando el texto 3 llega al centro
    createContextTrigger("#info-2", "#step-8"); // La caja 2 aparece en el texto 8


});

