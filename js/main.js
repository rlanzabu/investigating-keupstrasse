gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    const steps = document.querySelectorAll('.step');
    const panel = document.getElementById('info-panel');
    const closeBtn = document.getElementById('close-btn');
    const timeline = document.getElementById('timeline-container');
    const toggleBtn = document.getElementById('toggle-timeline');

    toggleBtn.addEventListener('click', () => {
        timeline.classList.toggle('is-hidden');
    });

    // 1. Registro de Personajes
    const characterRegistry = {
        'hasan': { name: "Hasan Yildirim", age: "--", role: "Friseur", desc: "Aktenauszug..." },
        'ozcan': { name: "Özcan Yildirim", age: "--", role: "Inhaber des\nHaarstudio Özcan", desc: "Aus den Ermittlungsakten..." },
        'testigo1': { name: "Abdullah", age: "40", role: "Vecino", desc: "Vio la explosión." },
        'testigo2': { name: "Testigo B", age: "25", role: "Estudiante", desc: "Estaba cerca." }
    };

    // --- INTERACCIÓN CLICK (Aura y Panel) ---
    function handleCharacterClick(char) {
        document.querySelectorAll('.character').forEach(c => c.classList.remove('active-character'));
        char.classList.add('active-character');

        const charId = char.dataset.id;
        const data = characterRegistry[charId];
        if (data) {
            document.getElementById('p-name').textContent = data.name;
            document.getElementById('p-age').textContent = data.age;
            document.getElementById('p-role').textContent = data.role;
            document.getElementById('p-desc').textContent = data.desc;
            panel.classList.add('is-visible');
        }
    }

    // --- LÓGICA DE LA LÍNEA DE TIEMPO CORREGIDA ---
    function updateTimelineMarker(markerId) {
        if (!markerId) return;

        const targetMarker = document.getElementById(markerId);
        if (!targetMarker) return;

        // 1. Identificar el grupo contenedor de esta fecha
        const currentGroup = targetMarker.closest('.timeline-group');

        // 2. Desactivar otros grupos y activar el actual
        document.querySelectorAll('.timeline-group').forEach(group => {
            if (group === currentGroup) {
                group.classList.add('active-group');
            } else {
                group.classList.remove('active-group');
            }
        });

        // 3. Resaltar la fecha específica dentro del grupo
        currentGroup.querySelectorAll('.time-marker').forEach(m => {
            if (m.id === markerId) {
                m.classList.add('active');
                gsap.to(m, { opacity: 1, x: 5, duration: 0.3 });
            } else {
                m.classList.remove('active');
                gsap.to(m, { opacity: 0.3, x: 0, duration: 0.3 });
            }
        });
    }

    // 2. Lógica de Scroll (Conversación y Marcadores)
    steps.forEach((step) => {
        const parentScene = step.closest('.scene');
        const charL = parentScene.querySelector('.left-char');
        const charR = parentScene.querySelector('.right-char');
        const bubbleL = charL.querySelector('.bubble');
        const bubbleR = charR.querySelector('.bubble');

        const speaker = step.dataset.who;
        const message = step.dataset.text;
        const markerId = step.dataset.marker;

        ScrollTrigger.create({
            trigger: step,
            start: "top center",
            end: "bottom center",
            onEnter: () => {
                updateConversation(speaker, message, charL, charR, bubbleL, bubbleR);
                updateTimelineMarker(markerId);
            },
            onEnterBack: () => {
                updateConversation(speaker, message, charL, charR, bubbleL, bubbleR);
                updateTimelineMarker(markerId);
            },
            onLeave: () => hideBubble(speaker, charL, charR, bubbleL, bubbleR),
            onLeaveBack: () => hideBubble(speaker, charL, charR, bubbleL, bubbleR)
        });
    });

    function updateConversation(speaker, message, charL, charR, bubbleL, bubbleR) {
        const targetBubble = speaker === 'left' ? bubbleL : bubbleR;
        const targetChar = speaker === 'left' ? charL : charR;
        targetBubble.textContent = message;
        gsap.to(targetBubble, { opacity: 1, y: -10 });
        gsap.to(targetChar, { scale: 1.1, duration: 0.3 });
    }

    function hideBubble(speaker, charL, charR, bubbleL, bubbleR) {
        const targetBubble = speaker === 'left' ? bubbleL : bubbleR;
        const targetChar = speaker === 'left' ? charL : charR;
        gsap.to(targetBubble, { opacity: 0, y: 0 });
        gsap.to(targetChar, { scale: 1, duration: 0.3 });
    }

    // 3. Eventos de Clic
    document.querySelectorAll('.character').forEach(char => {
        char.addEventListener('click', () => handleCharacterClick(char));

        const obj = char.querySelector('object');
        if (obj) {
            obj.addEventListener('load', () => {
                const svgDoc = obj.contentDocument;
                if (svgDoc) {
                    svgDoc.addEventListener('click', () => handleCharacterClick(char));
                }
            });
        }
    });

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

    // Función para crear el mosaico iterando sobre el registro de personajes
    function createMosaic() {
        const container = document.getElementById('mosaic-grid-container');
        if (!container) return;

        container.innerHTML = ''; // Limpiamos el contenedor

        // Mapeo manual de IDs a archivos SVG (asegúrate de que los nombres coincidan)
        const imageMap = {
            'hasan': 'hYildirim.svg',
            'ozcan': 'oYildirim.svg',
            'testigo1': 'abdullah.svg',
            'testigo2': 'fr.svg'
        };

        const charKeys = Object.keys(characterRegistry);
        const totalTiles = 30; // Cantidad total de cuadritos para el efecto "masa"

        for (let i = 0; i < totalTiles; i++) {
            // Usamos el operador % para rotar entre los personajes disponibles
            const currentId = charKeys[i % charKeys.length];
            const personData = characterRegistry[currentId];
            const fileName = imageMap[currentId] || 'abdullah.svg';

            const personDiv = document.createElement('div');
            personDiv.className = 'person';
            personDiv.dataset.id = currentId; // Importante para que el click funcione

            // Colores aleatorios
            const colors = ["rgb(0,124,128)", "#1b1a1a", "#ffd700"];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];

            // Insertamos la estructura tipo Pudding
            personDiv.innerHTML = `
                <div class="backgroundColor" style="background: ${randomColor}; opacity: 0.4;"></div>
                <img src="images/${fileName}" alt="${personData.name}">
            `;

            // Hacemos que cada cuadrito sea clickeable para abrir el panel lateral
            personDiv.addEventListener('click', () => handleCharacterClick(personDiv));

            container.appendChild(personDiv);
        }
    }

// Ejecutar la creación
    createMosaic();

// Animación de entrada con ScrollTrigger
    gsap.from(".person", {
        scrollTrigger: {
            trigger: "#mosaic-section",
            start: "top 20%",
        },
        scale: 0,
        opacity: 0,
        stagger: 0.01,
        duration: 0.5,
        ease: "power2.out"
    });

});

