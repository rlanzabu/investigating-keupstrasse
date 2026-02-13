gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    const steps = document.querySelectorAll('.step');
    const panel = document.getElementById('info-panel');
    const closeBtn = document.getElementById('close-btn');
    const timeline = document.getElementById('timeline-container');
    const toggleBtn = document.getElementById('toggle-timeline');

    document.addEventListener('DOMContentLoaded', () => {

        // Función para manejar los clics
        const handleNavClick = (sectionName) => {
            console.log(`Abriendo sección: ${sectionName}`);
            // Aquí es donde luego pondremos la lógica para abrir los modales o el buscador
        };

        // Asignar eventos a cada botón

        document.getElementById('btn-research').addEventListener('click', () => handleNavClick('Investigación'));
        document.getElementById('toggle-timeline').addEventListener('click', () => handleNavClick('Buscador'));
        document.getElementById('btn-orgs').addEventListener('click', () => handleNavClick('Organizaciones'));
        document.getElementById('btn-extra').addEventListener('click', () => handleNavClick('Acerca de'));

    });



        // Animación para los esquineros
    gsap.to(".corner-svg", {
        scale: 1.05,        // Crece un poquito
        rotation: "random(-2, 2)", // Oscila levemente
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.5
    });

        // Opcional: Que aparezcan con el scroll
    gsap.from(".corner-svg", {
        scrollTrigger: {
            trigger: ".frame-container",
            start: "top center",
        },
        y: -50,
        opacity: 0,
        duration: 1.2,
        ease: "power2.out"
    });


        // Objetos laterales animados
    document.querySelectorAll('.extra-float').forEach((obj, index) => {
        // Flotación, Rotación y ESCALA
        gsap.to(obj, {
            y: "random(-90, 90)", // Movimiento vertical más amplio por ser más grandes
            x: "random(-70, 70)",
            rotation: "random(-25, 25)",
            scale: "random(0.9, 1.2)", // Hace que el objeto "respire" acercándose
            duration: "random(5, 8)",
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: index * 0.3
        });

        // Parallax de Scroll reforzado
        gsap.to(obj, {
            scrollTrigger: {
                trigger: ".scene",
                start: "top bottom",
                end: "bottom top",
                scrub: 2
            },
            // Los objetos más grandes (f2, f5) se mueven más rápido para acentuar el 3D
            y: (index === 1 || index === 4) ? -300 : -150,
            ease: "none"
        });
    });


    // --- 1. CONFIGURACIÓN DE DATOS ---
    const imageMap = {
        'hasan': 'hYildirim.svg',
        'ozcan': 'oYildirim.svg',
        'testigo1': 'abdullah.svg',
        'testigo2': 'fr.svg'
    };

        // Registro de Personajes
    const characterRegistry = {
        'hasan': { name: "Hasan Yildirim", age: "--", role: "Friseur", desc: "Aktenauszug...",gender: 'masculino', present: true, memory: 'directa' },
        'ozcan': { name: "Özcan Yildirim", age: "--", role: "Inhaber des\nHaarstudio Özcan", desc: "Aus den Ermittlungsakten...",gender: 'masculino', present: false, memory: 'directa' },
        'testigo1': { name: "Abdullah", age: "40", role: "Vecino", desc: "Vio la explosión.", gender: 'masculino', present: true, memory: 'indirecta' },
        'testigo2': { name: "Testigo B", age: "25", role: "Estudiante", desc: "Estaba cerca.", gender: 'femenino', present: true, memory: 'directa' }
    };

        // Colores para atributos
    const colorCodes = {
        present: { true: "#ffd700", false: "#1b1a1a" },
        memory: {
            'directa': "rgb(0,124,128)",
            'indirecta': "#8b0000",
            'colectiva': "#4682b4"
        },
        gender: { 'masculino': "#2c3e50", 'femenino': "#e74c3c" }
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

        // Identificar el grupo contenedor de esta fecha
        const currentGroup = targetMarker.closest('.timeline-group');

        // Desactivar otros grupos y activar el actual
        document.querySelectorAll('.timeline-group').forEach(group => {
            if (group === currentGroup) {
                group.classList.add('active-group');
            } else {
                group.classList.remove('active-group');
            }
        });

        // Resaltar la fecha específica dentro del grupo
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

    //  Lógica de Scroll (Conversación y Marcadores)
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

    // 3. Eventos de Click para Personajes (Panel Lateral)
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

    // Aplicar a las cajas
    createContextTrigger("#info-1", "#step-3"); // La caja 1 aparece cuando el texto 3 llega al centro
    createContextTrigger("#info-2", "#step-8"); // La caja 2 aparece en el texto 8


// 1. Definición de criterios y sus etiquetas legibles
    const criteriosConfig = [
        { id: 'present', label: 'Present at the event' },
        { id: 'memory', label: 'Type of memory' },
        { id: 'gender', label: 'Gender' }
    ];

    let indiceActual = 0;

// 2. Función crearMosaico actualizada (basada en la anterior)
    function createMosaic(filtroCriterio) {
        const container = document.getElementById('mosaic-grid-container');
        const labelText = document.getElementById('criterio-text');

        if (!container) return;

        // Actualizar el texto descriptivo
        const config = criteriosConfig.find(c => c.id === filtroCriterio);
        if(labelText) labelText.innerText = config.label;

        container.innerHTML = '';

        const charKeys = Object.keys(characterRegistry);
        const totalTiles = 30;

        for (let i = 0; i < totalTiles; i++) {
            const currentId = charKeys[i % charKeys.length];
            const personData = characterRegistry[currentId];

            const personDiv = document.createElement('div');
            personDiv.className = 'person';

            // Obtener color del mapa de colorCodes (definido en el paso anterior)
            const valorCriterio = personData[filtroCriterio];
            const assignedColor = colorCodes[filtroCriterio][valorCriterio] || "#ccc";

            personDiv.innerHTML = `
            <div class="backgroundColor" style="background: ${assignedColor}; opacity: 0.6;"></div>
            <img src="images/${imageMap[currentId] || 'default.svg'}" alt="${personData.name}">
        `;


            personDiv.addEventListener('click', () => handleCharacterClick(personDiv));
            container.appendChild(personDiv);
        }
    }

// 3. Evento para el botón de cambio
    document.getElementById('cycle-criterio').addEventListener('click', () => {
        // Avanzar al siguiente criterio
        indiceActual = (indiceActual + 1) % criteriosConfig.length;
        const nuevoCriterio = criteriosConfig[indiceActual].id;

        // Volver a generar el mosaico con el nuevo color code
        createMosaic(nuevoCriterio);
    });

// Ejecución inicial
    createMosaic(criteriosConfig[indiceActual].id);




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

