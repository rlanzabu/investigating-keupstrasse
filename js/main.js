gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

document.addEventListener('DOMContentLoaded', () => {
    const steps = document.querySelectorAll('.step');
    const panel = document.getElementById('info-panel');
    const closeBtn = document.getElementById('close-btn');
    const timeline = document.getElementById('timeline-container');
    const toggleBtn = document.getElementById('toggle-timeline');

    const mosaicSection = document.querySelector('#mosaic-section');
    const controls = document.querySelector('.mosaic-controls');

    //NUEVA LÓGICA DE NAVEGACIÓN
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
        'muhamed': 'man.svg',
    };

    const characterRegistry = {
        'hasan': { name: "Hasan Yildirim", age: "52", role: "Friseur", desc: "Geboren in Ankara, kam 1997 nach Deutschland. War bereits in der Türkei als Friseur tätig und arbeitet auch in Deutschland in diesem Beruf. Arbeitete etwa acht Jahre lang in der Keupstraße.",
            gender: 'männlich', present: true, memory: 'implicit| emotional', modality: 'sensory| perceptual', state: 'narratively consolidated' },
        'ozcan': { name: "Özcan Yildirim", age: "--", role: "Inhaber des\nHaarstudio Özcan", desc: "Anfang der 90er Jahre\n" +
                "kommt er aus der Türkei, wo er als Kuaför (türkisch: Friseur) ausgebildet wurde, nach Deutschland.\n" +
                "Er ist verheiratet und hat zwei Kinder, seine Frau Aygül stammt aus\n" +
                "Köln.", gender: 'männlich', present: false, memory: 'explicit| episodic', modality:'auditory', state: 'sensory impression' },
        'testigo1': { name: "Abdullah Özkan", age: "--", role: "Nachbarn", desc: "war am 9. Juni als Kunde im Salon.", gender: 'männlich', present: true,
            memory: 'explicit| episodic', modality: 'sensory| perceptual', state: 'narratively consolidated' },
        'testigo2': { name: "Meral Şahin", age: "55", role: "Präsidentin der Interessensgemeinschaft Keupstraße", desc: "1971 in Köln geboren, Tochter türkischer Einwanderer, " +
                "Geschäftsfrau und Vorsitzende der IG Keupstraße.", gender: 'weiblich', present: true, memory: 'explicit| semantic', modality:'auditory', state: 'sensory impression'},
        'women': { name: "Anonyme Frau", age: "--", role: "Anonyme Zeuginnen", desc: "Nachbarin", gender: 'weiblich', present: true,
            memory: 'explicit| episodic', modality:'sensory| perceptual', state: 'narratively consolidated' },
        'schily': { name: "Otto Schily", age: "94", role: "Rechtsanwalt und Politiker (SPD). ", desc: "Von 1998 bis 2005 war er Bundesminister des Innern. Er war Mitgründer der Partei Die Grünen, von der er im November 1989 zur SPD wechselte.", gender: 'männlich', present: false, memory: 'colectiva' },
        'man': { name: "Herr M.", age: "50", role: "Anonymer Zeuge", desc: "Lebt seit 20 Jahren in Deutschland. Da er nicht möchte, dass Rückschlüsse auf ihre Person gezogen werden können, gibt er seinen Beruf nicht an.", gender: 'männlich', present: true, memory: 'directa' },
        'kleffner': { name: "Heike Kleffner", age: "60", role: "deutsche Journalistin und Autorin.", desc: "Von 2004 bis 2009 leitete sie die Mobile Beratung für Opfer rechter Gewalt in Sachsen-Anhalt." +
                "Bis 2013 war sie Referentin der Fraktion" +
                " Die Linke im Bundestag im NSU-Untersuchung-" +
                "sausschuss.", gender: 'weiblich', present: false, memory: 'explicit| semantic', modality:'auditory', state: 'sensory impression' },
        'gün': { name: "Ali Kemal Gün", age: "--", role: "Psychotherapeut ", desc: "Psychologe (Uni Köln) mit Fokus auf Therapie und Beratung. Er vertritt Migranten in Gesundheitsfragen und leitet Arbeitsgruppen zu Migration und Psychiatrie im LVR. ", gender: 'männlich', present: false,
            memory: 'explicit| semantic', modality:'auditory', state: 'sensory impression' },
        'muhamed': { name: "Muhamed", age: "--", role: "Anonymer Zeuge", desc: "Lebt seit 30 Jahren in Deutschland", gender: 'männlich', present: true,
            memory: 'explicit| semantic', modality:'auditory', state: 'sensory impression' },
    };

    const colorCodes = {
        present: { true: "#ffd700", false: "#1b1a1a" },
        gender: { 'männlich': "#2c3e50", 'weiblich': "#e74c3c" },
        memory: {
            'explicit| episodic': "rgba(255,204,0,0.82)",
            'explicit| semantic': "rgb(27,26,26)",
            'implicit| emotional': "#77b9dd",
            'implicit| procedural': "#e67e22",
            'implicit| conditioned': "#c0392b",
            'implicit| priming': "#804d80"
        },
        modality: {'sensory| perceptual': "rgba(255,204,0,0.82)",
            'somatic| motor': "rgb(162,75,182)",
            'verbal': "#77b9dd",},
        state : {'sensory impression': "rgba(255,204,0,0.82)",
            'non consolidated': "rgb(162,75,182)",
            'narratively consolidated': "#77b9dd",},
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
        { id: 'present', label: 'Present at the attack' },
        { id: 'gender', label: 'Gender' },
        { id: 'memory', label: 'Memory type' },
        { id: 'modality', label: 'Enconding Modality' },
        { id: 'state', label: 'Processing state' },
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

        for (let i = 0; i < 45; i++) {
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

            // Asignar el evento de click que usa la misma lógica del panel
            personDiv.addEventListener('click', () => handleCharacterClick(personDiv));
            container.appendChild(personDiv);
        }

        // LEYENDA DINÁMICA
        const legendScale = document.querySelector('.legend-scale');
        const legendHeader = document.querySelector('.legend-header');

        if (legendScale && config) {
            // Actualiza el encabezado de la leyenda
            if (legendHeader) legendHeader.innerText = `DISTRIBUTION BY ${config.label.toUpperCase()}`;

            // Limpia la leyenda anterior
            legendScale.innerHTML = '';

            // Obtenemos los pares [valor, color] del criterio actual desde colorCodes
            const options = colorCodes[filtroCriterio];

            Object.keys(options).forEach(key => {
                const color = options[key];
                const item = document.createElement('div');
                item.className = 'scale-item';

                // Formateamos el texto (ej: "true" -> "Yes", "directa" -> "Directa")
                let displayLabel = key;
                if (key === 'true') displayLabel = 'Ja';
                if (key === 'false') displayLabel = 'Nein';

                item.innerHTML = `
                <span class="dot" style="background: ${color};"></span>
                <span class="label-text" style="color: black; font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; text-transform: capitalize;">
                    ${displayLabel}
                </span>
            `;
                legendScale.appendChild(item);
            });
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

    ScrollTrigger.create({
        trigger: "#mosaic-section",
        start: "top 95%", // Se activa casi en cuanto el mosaico entra a la pantalla
        end: "bottom top",
        onEnter: () => {
            const tl = document.getElementById('timeline-container');
            if (tl) tl.classList.add('is-hidden');
        },
        onLeaveBack: () => {
            const tl = document.getElementById('timeline-container');
            if (tl) tl.classList.remove('is-hidden');
        }
    });


    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;

        // Actualizar barra y marcador
        const fill = document.getElementById("path-fill");
        const marker = document.getElementById("path-marker");

        if (fill) fill.style.width = scrolled + "%";
        if (marker) marker.style.left = scrolled + "%";

        // Activar etiquetas según posición
        document.querySelectorAll('.location').forEach(loc => {
            const pos = parseFloat(loc.style.left);
            // Si el scroll ha pasado la posición de la etiqueta, se ilumina
            if (scrolled >= pos - 2) {
                loc.classList.add('active');
            } else {
                loc.classList.remove('active');
            }
        });
    });

    // Detectamos cuando el usuario entra en las secciones de texto
    const editorialSections = document.querySelectorAll('.content-section');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Si estamos en About/Research, añadimos la clase que oculta el timeline
                document.body.classList.add('in-editorial-zone');
            } else {
                // Al salir (volver a los personajes), la quitamos
                document.body.classList.remove('in-editorial-zone');
            }
        });
    }, { threshold: 0.1 }); // Se activa cuando asoma el 10% de la sección

    editorialSections.forEach(section => observer.observe(section));





});

