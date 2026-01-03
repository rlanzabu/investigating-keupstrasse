console.log("JavaScript is working!");



document.addEventListener('DOMContentLoaded', () => {
    gsap.to("#mySvg", {
        transformOrigin: "50% 50%",
        rotation: 360,
        duration: 2
    });
});