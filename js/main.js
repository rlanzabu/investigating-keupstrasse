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
});

