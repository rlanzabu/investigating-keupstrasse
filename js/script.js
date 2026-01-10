console.log("JavaScript is working!");

gsap.registerPlugin(ScrollTrigger);

console.log(typeof ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    const object = document.getElementById('mySvg');
    if (!object) return; // Check if object exists

    object.addEventListener('load', () => {
        const svg = object.contentDocument && object.contentDocument.querySelector('svg');
        if (!svg) return; // Check if SVG is loaded

        svg.addEventListener('mouseenter', () => {
            gsap.to(svg, {
                rotation: 360,
                transformOrigin: "50% 50%",
                duration: 2
            });
        });
    });
});

