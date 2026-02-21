gsap.registerPlugin(ScrollTrigger, ScrollToPlugin); // Añadido ScrollToPlugin

document.addEventListener('DOMContentLoaded', () => {
    const steps = document.querySelectorAll('.step');
    const panel = document.getElementById('info-panel');
    const closeBtn = document.getElementById('close-btn');
    const timeline = document.getElementById('timeline-container');
    const toggleBtn = document.getElementById('toggle-timeline');

    // --- NUEVA LÓGICA DE NAVEGACIÓN ---
    const menuConfig = [
        { btnId: 'btn-research', target: '#research-section' },
        { btnId: 'toggle-timeline', target: '#sources-section' },
        { btnId: 'btn-orgs', target: '#orgs-section' },
        { btnId: 'btn-extra', target: '#about-section' }
    ];

    menuConfig.forEach(item => {
        const button = document.getElementById(item.btnId);
        if (button) {
            button.addEventListener('click', () => {
                gsap.to(window, {
                    duration: 1.5,
                    scrollTo: {
                        y: item.target,
                        autoKill: true,
                        offsetY: 30
                    },
                    ease: "power4.inOut"
                });
            });
        }
    });
    // --- FIN NAVEGACIÓN ---

    // Animación para los esquineros
    gsap.to(".corner-svg", {
        scale: 1.05,
        rotation: "random(-2, 2)",
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.5
    });

    gsap.from(".corner-svg", {
        y: -30,
        opacity: 0,
        duration: 1.5,
        ease: "power2.out"
    });

    // Objetos laterales animados
    document.querySelectorAll('.extra-float').forEach((obj, index) => {
        gsap.to(obj, {
            y: "random(-90, 90)",
            x: "random(-70, 70)",
            rotation: "random(-25, 25)",
            scale: "random(0.9, 1.2)",
            duration: "random(5, 8)",
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: index * 0.3
        });

        gsap.to(obj, {
            scrollTrigger: {
                trigger: ".scene",
                start: "top bottom",
                end: "bottom top",
                scrub: 2
            },
            y: (index === 1 || index === 4) ? -300 : -150,
            ease: "none"
        });
    });

    // --- 1. CONFIGURACIÓN DE DATOS ---
    const imageMap = {
        'hasan': 'hYildirim.svg',
        'ozcan': 'oYildirim.svg',
        'testigo1': 'abdullah.svg',
        'testigo2': 'fr.svg',
        'women': 'women.svg',
        'schily': 'schily.svg',
        'man': 'man.svg',
        'kleffner': 'kleffner.svg',
        'gün': 'gün.svg',
    };

    const characterRegistry = {
        'hasan': { name: "Hasan Yildirim", age: "52", role: "Friseur", desc: "Geboren in Ankara, kam 1997 nach Deutschland. War bereits in der Türkei als Friseur tätig und arbeitet auch in Deutschland in diesem Beruf. Arbeitete etwa acht Jahre lang in der Keupstraße.", gender: 'masculino', present: true, memory: 'directa' },
        'ozcan': { name: "Özcan Yildirim", age: "--", role: "Inhaber des\nHaarstudio Özcan", desc: "Aus den Ermittlungsakten...", gender: 'masculino', present: false, memory: 'directa' },
        'testigo1': { name: "Abdullah", age: "--", role: "Vecino", desc: "Vio la explosión.", gender: 'masculino', present: true, memory: 'indirecta' },
        'testigo2': { name: "Meral Şahin", age: "--", role: "Präsidentin der Interessensgemeinschaft Keupstraße", desc: "Estaba cerca.", gender: 'femenino', present: true, memory: 'directa' },
        'women': { name: "Anonyme Frau", age: "--", role: "Anonyme Zeuginnen", desc: "Vieron a los sospechosos y escucharon la Explosion", gender: 'femenino', present: true, memory: 'directa' },
        'schily': { name: "Otto Schily", age: "94", role: "Rechtsanwalt und Politiker (SPD). ", desc: "Von 1998 bis 2005 war er Bundesminister des Innern. Er war Mitgründer der Partei Die Grünen, von der er im November 1989 zur SPD wechselte.", gender: 'masculino', present: false, memory: 'colectiva' },
        'man': { name: "Herr M.", age: "--", role: "Anonymer Zeuge", desc: "Die Person ist 50 Jahre alt und lebt seit 20 Jahren in Deutschland. Da sie nicht möchte, dass Rückschlüsse auf ihre Person gezogen werden können, gibt sie ihren Beruf nicht an.", gender: 'masculino', present: true, memory: 'directa' },
        'kleffner': { name: "Heike Kleffner", age: "60", role: "deutsche Journalistin und Autorin.", desc: "Von 2004 bis 2009 leitete sie die Mobile Beratung für Opfer rechter Gewalt in Sachsen-Anhalt." +
                "Bis 2013 war sie Referentin der Fraktion" +
                " Die Linke im Bundestag im NSU-Untersuchung-" +
                "sausschuss.", gender: 'femenino', present: false, memory: 'directa' },
        'gün': { name: "Gün", age: "--", role: "Psychotherapeut ", desc: "Studium der Psychologie an der Universität Köln sowie Ausbildung in Psychodrama und systemischer Beratung und Therapie. " +
                "Vertreter der Migranten in der Kommunalen Gesundheitskonferenz. Sprecher des Arbeitskreises Migration und Psychiatrie im Landschaftsverband Rheinland. " +
                "Mitglied des LVR-Kompetenzzentrums Migration. ", gender: 'masculino', present: false, memory: 'directa' },
    };

    const colorCodes = {
        present: { true: "#ffd700", false: "#1b1a1a" },
        memory: {
            'directa': "rgb(0,124,128)",
            'indirecta': "#8b0000",
            'colectiva': "#4682b4"
        },
        gender: { 'masculino': "#2c3e50", 'femenino': "#e74c3c" }
    };

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

    function updateTimelineMarker(markerId) {
        if (!markerId) return;
        const targetMarker = document.getElementById(markerId);
        if (!targetMarker) return;

        const currentGroup = targetMarker.closest('.timeline-group');
        document.querySelectorAll('.timeline-group').forEach(group => {
            group.classList.toggle('active-group', group === currentGroup);
        });

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

    steps.forEach((step) => {
        const parentScene = step.closest('.scene');
        if (!parentScene) return;
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

    createContextTrigger("#info-1", "#step-3");
    createContextTrigger("#info-2", "#step-8");

    const criteriosConfig = [
        { id: 'present', label: 'Present at the event' },
        { id: 'memory', label: 'Type of memory' },
        { id: 'gender', label: 'Gender' }
    ];

    let indiceActual = 0;

    function createMosaic(filtroCriterio) {
        const container = document.getElementById('mosaic-grid-container');
        if (!container) return;

        const labelText = document.getElementById('criterio-text');
        const config = criteriosConfig.find(c => c.id === filtroCriterio);
        if(labelText) labelText.innerText = config.label;

        container.innerHTML = '';
        const charKeys = Object.keys(characterRegistry);

        for (let i = 0; i < 20; i++) {
            const currentId = charKeys[i % charKeys.length];
            const personData = characterRegistry[currentId];
            const personDiv = document.createElement('div');
            personDiv.className = 'person';
            personDiv.dataset.id = currentId; // CRUCIAL: Añadimos el ID para el panel

            const valorCriterio = personData[filtroCriterio];
            const assignedColor = colorCodes[filtroCriterio][valorCriterio] || "#ccc";

            personDiv.innerHTML = `
                <div class="backgroundColor" style="background: ${assignedColor}; opacity: 0.6;"></div>
                <img src="images/${imageMap[currentId] || 'default.svg'}" alt="${personData.name}">
            `;

            // Asignamos el evento de click que usa la misma lógica del panel
            personDiv.addEventListener('click', () => handleCharacterClick(personDiv));
            container.appendChild(personDiv);
        }
    }
    const cycleBtn = document.getElementById('cycle-criterio');
    if (cycleBtn) {
        cycleBtn.addEventListener('click', () => {
            indiceActual = (indiceActual + 1) % criteriosConfig.length;
            createMosaic(criteriosConfig[indiceActual].id);
        });
    }

    createMosaic(criteriosConfig[indiceActual].id);

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

