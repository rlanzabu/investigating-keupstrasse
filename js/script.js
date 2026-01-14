console.log("JavaScript is working!");

// javascript
document.addEventListener('DOMContentLoaded', () => {
    if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }
// javascript
// Insert this at the end of the existing `document.addEventListener('DOMContentLoaded', ...)`
// in `js/script.js`, after the setupObjectAnimation(...) calls.

    if (typeof ScrollTrigger !== 'undefined') {
        console.log('ScrollTrigger is loaded');

        let test = document.getElementById('gsap-scrolltest');
        if (!test) {
            test = document.createElement('div');
            test.id = 'gsap-scrolltest';
            test.textContent = 'ScrollTrigger test — scroll to me';
            test.style.cssText = 'margin-top:150vh;padding:20px;background:#fffae6;border:1px solid #e2c044;';
            document.body.appendChild(test);
        }

        ScrollTrigger.create({
            trigger: '#gsap-scrolltest',
            start: 'top center',
            end: 'bottom center',
            onEnter: () => console.log('ScrollTrigger: entered test'),
            onLeaveBack: () => console.log('ScrollTrigger: left back'),
            markers: true
        });
    } else {
        console.warn('ScrollTrigger is not available — check your GSAP plugin import');
    }


    function setupObjectAnimation(objectId, { scaleUp = 1.15, duration = 0.4 } = {}) {
        const obj = document.getElementById(objectId);
        if (!obj) return;

        //defines how the element should behave when hovered. Host the parent document, main website
        const initTarget = (target, host) => {
            // If target is an SVG, ensure transforms use its bounding box
            if (target instanceof SVGElement) {
                target.style.transformBox = 'fill-box';
                target.style.transformOrigin = '50% 50%';
            } else {
                host.style.transformOrigin = '50% 50%';
            }

            target.addEventListener('mouseenter', () => {
                gsap.to(target, { scale: scaleUp, duration, transformOrigin: '50% 50%' });
            });
            target.addEventListener('mouseleave', () => {
                gsap.to(target, { scale: 1, duration: Math.min(0.3, duration) });
            });
        };

        //SVGs loaded via <object> tags are like tiny websites inside the website

        const onLoad = () => {
            const svg = obj.contentDocument && obj.contentDocument.querySelector('svg');
            const target = svg || obj; // use inner svg when available, otherwise animate the <object>
            initTarget(target, obj);
        };

        // If already loaded (e.g. cached), call handler immediately; otherwise wait for load
        try {
            if (obj.contentDocument && obj.contentDocument.readyState === 'complete') {
                onLoad();
            } else {
                obj.addEventListener('load', onLoad);
            }
        } catch (e) {
            // Accessing contentDocument can throw for cross-origin; just animate host in that case
            initTarget(obj, obj);
        }
    }



    setupObjectAnimation('cameraSvg', { scaleUp: 1.5, duration: 0.5 });
    setupObjectAnimation('mySvg2-left', { scaleUp: 1.15, duration: 0.5 });
    setupObjectAnimation('mySvg2-right', { scaleUp: 1.5, duration: 0.5 });

    /*const allObjects = document.querySelectorAll('object');


    allObjects.forEach((obj) => {
        // We pass the ID of the current object in the loop
        // If the object doesn't have an ID, we can use the element itself
        // (though your function is currently written to expect an ID string)
        if (obj.id) {
            setupObjectAnimation(obj.id, { scaleUp: 1.2, duration: 0.5 });
        }
    });*/

});


