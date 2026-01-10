console.log("JavaScript is working!");

gsap.registerPlugin(ScrollTrigger);

console.log(typeof ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    // Second SVG (now handled first)
    const object2 = document.getElementById('cameraSvg');
    if (object2) {
        object2.addEventListener('load', () => {
            const svg2 = object2.contentDocument && object2.contentDocument.querySelector('svg');
            if (!svg2) return;
            svg2.addEventListener('mouseenter', () => {
                // Different animation for second SVG
                gsap.to(svg2, {
                    scale: 1.5,
                    transformOrigin: "50% 50%",
                    duration: 1
                });
            });
        });
    }

    // First SVG (now handled second)
    const object1 = document.getElementById('mySvg2');
    if (object1) {
        object1.addEventListener('load', () => {
            const svg1 = object1.contentDocument && object1.contentDocument.querySelector('svg');
            if (!svg1) return;
            svg1.addEventListener('mouseenter', () => {
                // Custom animation for first SVG
                gsap.to(svg1, {

                    transformOrigin: "50% 50%",
                    duration: 2
                });
            });
        });
    }
});