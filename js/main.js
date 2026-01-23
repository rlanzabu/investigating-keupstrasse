gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    const steps = document.querySelectorAll('.step');
    const bubbleL = document.getElementById('bubble-l');
    const bubbleR = document.getElementById('bubble-r');
    const charL = document.querySelector('.left-char');
    const charR = document.querySelector('.right-char');

    steps.forEach((step) => {
        const speaker = step.dataset.who;
        const message = step.dataset.text;

        ScrollTrigger.create({
            trigger: step,
            start: "top center", // When the top of the step hits the center of screen
            end: "bottom center",
            onEnter: () => updateConversation(speaker, message),
            onEnterBack: () => updateConversation(speaker, message),
            onLeave: () => hideBubble(speaker),
            onLeaveBack: () => hideBubble(speaker)
        });
    });

    function updateConversation(speaker, message) {
        if (speaker === 'left') {
            bubbleL.textContent = message;
            gsap.to(bubbleL, { opacity: 1, y: -10 });
            gsap.to(charL, { scale: 1.1, duration: 0.3 }); // "Talking" animation
        } else {
            bubbleR.textContent = message;
            gsap.to(bubbleR, { opacity: 1, y: -10 });
            gsap.to(charR, { scale: 1.1, duration: 0.3 });
        }
    }

    function hideBubble(speaker) {
        const targetBubble = speaker === 'left' ? bubbleL : bubbleR;
        const targetChar = speaker === 'left' ? charL : charR;

        gsap.to(targetBubble, { opacity: 0, y: 0 });
        gsap.to(targetChar, { scale: 1, duration: 0.3 });
    }

    // Objeto con la información de cada personaje
    const characterRegistry = {
        'left': {
            name: "Hasan Yildirim",
            age: "--",
            role: "Friseur",
            desc: "Aktenauszug: Im Friseurgeschäft Keupstraße 29 fielen den Einsatztrupp-Beamten\n"
                + "in der Vergangenheit Kunden auf,\n" +
                "die dem äußeren Eindruck nach,\n"
                + "der türkischen Türsteher Szene\n" +
                "angehören."

        },
        'right': {
            name: "Özcan Yildirim",
            age: "--",
            role: "Inhaber des Haarstudios Özcan",
            desc: "Aus den Ermittlungsakten: Vor dem Friseurgeschäft\n" +
                "wurde Herr Özcan Yildirim festgestellt.In einer ersten informellen Befragung\n" +
                "wurde er durch den Beamten P. befragt, ob es Bedrohungen\n" +
                "zu seinem Nachteil gegeben hat."
        }
    };

    const panel = document.getElementById('info-panel');
    const closeBtn = document.getElementById('close-btn');

    function showDetails(who) {
        const data = characterRegistry[who];

        // Rellenar el panel con la info del objeto
        document.getElementById('p-name').textContent = data.name;
        document.getElementById('p-age').textContent = data.age;
        document.getElementById('p-role').textContent = data.role;
        document.getElementById('p-desc').textContent = data.desc;

        // Mostrar el panel
        panel.classList.add('is-visible');
    }

// Eventos de click específicos para los SVG
    charL.addEventListener('click', (e) => {
        e.stopPropagation(); // Evita interferencias
        showDetails('left');
    });

    charR.addEventListener('click', (e) => {
        e.stopPropagation();
        showDetails('right');
    });

// Cerrar el panel
    closeBtn.addEventListener('click', () => {
        panel.classList.remove('is-visible');
    });



});

