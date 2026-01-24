gsap.registerPlugin(ScrollTrigger);


document.addEventListener('DOMContentLoaded', () => {

    const steps = document.querySelectorAll('.step');
    const bubbleL = document.getElementById('bubble-l');
    const bubbleR = document.getElementById('bubble-r');
    const charL = document.querySelector('.left-char');
    const charR = document.querySelector('.right-char');
    const characters = [charL, charR]; // para facilitar limpieza


    // 1. Lógica de Scroll y Burbujas
    steps.forEach((step) => {

        const speaker = step.dataset.who;
        const message = step.dataset.text;

        ScrollTrigger.create({

            trigger: step,
            start: "top center",
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
            gsap.to(charL, { scale: 1.1, duration: 0.3 });

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


    // 2. Registro de Personajes
    const characterRegistry = {

        'left': {
            name: "Hasan Yildirim",
            age: "--",
            role: "Friseur",
            desc: "Aktenauszug: Im Friseurgeschäft Keupstraße 29 fielen den Einsatztrupp-Beamten."
        },

        'right': {
            name: "Özcan Yildirim",
            age: "--",
            role: "Inhaber des Haarstudios Özcan",
            desc: "Aus den Ermittlungsakten: Vor dem Friseurgeschäft wurde Herr Özcan Yildirim festgestellt. " +
                "In einer ersten informellen Befragung wurde er durch den Beamten P. befragt, ob es Bedrohungenm zu seinem Nachteil gegeben hat."
        }
    };


    const panel = document.getElementById('info-panel');
    const closeBtn = document.getElementById('close-btn');


    // 3. Función Maestra: Abre Panel + Pone Aura
    function handleCharacterInteraction(side) {

        const data = characterRegistry[side];
        const selectedChar = (side === 'left') ? charL : charR;

        // Limpiar aura de todos y ponerla al seleccionado

        characters.forEach(char => char.classList.remove('active-character'));
        selectedChar.classList.add('active-character');

        // Llenar datos en el panel

        document.getElementById('p-name').textContent = data.name;
        document.getElementById('p-age').textContent = data.age;
        document.getElementById('p-role').textContent = data.role;
        document.getElementById('p-desc').textContent = data.desc;

        // Mostrar panel
        panel.classList.add('is-visible');
    }



    // 4. Eventos de Click (Unificados)
    charL.addEventListener('click', (e) => {
        e.stopPropagation();
        handleCharacterInteraction('left');
    });



    charR.addEventListener('click', (e) => {
        e.stopPropagation();
        handleCharacterInteraction('right');
    });


    // 5. Cierre: Quita Panel + Quita Aura
    closeBtn.addEventListener('click', () => {
        panel.classList.remove('is-visible');
        // Quitar el aura de todos al cerrar
        characters.forEach(char => char.classList.remove('active-character'));

    });

});

