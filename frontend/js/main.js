/* ==========================================================
   SafeVision AI - main.js
   Factory Safety Monitoring System
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ============================================
       Navbar Scroll Effect
    ============================================ */

    const navbar = document.querySelector(".navbar");

    window.addEventListener("scroll", () => {

        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }

    });


    /* ============================================
       Smooth Scroll for Navigation
    ============================================ */

    const navLinks = document.querySelectorAll('a[href^="#"]');

    navLinks.forEach(link => {

        link.addEventListener("click", function (e) {

            e.preventDefault();

            const target = document.querySelector(this.getAttribute("href"));

            if (target) {

                window.scrollTo({

                    top: target.offsetTop - 70,

                    behavior: "smooth"

                });

            }

        });

    });


    /* ============================================
       Active Navigation Link
    ============================================ */

    const sections = document.querySelectorAll("section");
    const navigationLinks = document.querySelectorAll(".nav-link");

    window.addEventListener("scroll", () => {

        let current = "";

        sections.forEach(section => {

            const sectionTop = section.offsetTop - 120;

            if (window.scrollY >= sectionTop) {
                current = section.getAttribute("id");
            }

        });

        navigationLinks.forEach(link => {

            link.classList.remove("active");

            if (link.getAttribute("href") === "#" + current) {

                link.classList.add("active");

            }

        });

    });


    /* ============================================
       Counter Animation
    ============================================ */

    const counters = document.querySelectorAll(".counter");

    const startCounter = (counter) => {

        const target = +counter.getAttribute("data-target");

        let count = 0;

        const speed = target / 150;

        const updateCounter = () => {

            count += speed;

            if (count < target) {

                counter.innerText = Math.ceil(count);

                requestAnimationFrame(updateCounter);

            } else {

                counter.innerText = target;

            }

        };

        updateCounter();

    };


    const observer = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                startCounter(entry.target);

                observer.unobserve(entry.target);

            }

        });

    }, {
        threshold: 0.6
    });


    counters.forEach(counter => {

        observer.observe(counter);

    });


    /* ============================================
       Reveal Animation
    ============================================ */

    const reveals = document.querySelectorAll(".fade-up");

    const revealOnScroll = () => {

        reveals.forEach(item => {

            const windowHeight = window.innerHeight;

            const revealTop = item.getBoundingClientRect().top;

            const revealPoint = 100;

            if (revealTop < windowHeight - revealPoint) {

                item.classList.add("show");

            }

        });

    };

    window.addEventListener("scroll", revealOnScroll);

    revealOnScroll();


    /* ============================================
       Hero Floating Animation
    ============================================ */

    const heroImage = document.querySelector(".hero-image");

    if (heroImage) {

        let angle = 0;

        setInterval(() => {

            angle += 0.01;

            heroImage.style.transform =
                `translateY(${Math.sin(angle) * 12}px)`;

        }, 20);

    }


    /* ============================================
       Mouse Glow Effect
    ============================================ */

    const glow = document.createElement("div");

    glow.className = "mouse-glow";

    document.body.appendChild(glow);

    document.addEventListener("mousemove", (e) => {

        glow.style.left = e.clientX + "px";

        glow.style.top = e.clientY + "px";

    });


    /* ============================================
       Scroll To Top Button
    ============================================ */

    const topButton = document.createElement("button");

    topButton.innerHTML = "↑";

    topButton.className = "scroll-top";

    document.body.appendChild(topButton);

    window.addEventListener("scroll", () => {

        if (window.scrollY > 400) {

            topButton.classList.add("show");

        } else {

            topButton.classList.remove("show");

        }

    });

    topButton.addEventListener("click", () => {

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    });


    /* ============================================
       Button Hover Animation
    ============================================ */

    const buttons = document.querySelectorAll(".btn");

    buttons.forEach(button => {

        button.addEventListener("mouseenter", () => {

            button.style.transform = "translateY(-5px) scale(1.03)";

        });

        button.addEventListener("mouseleave", () => {

            button.style.transform = "translateY(0) scale(1)";

        });

    });


    /* ============================================
       Typing Effect
    ============================================ */

    const typing = document.querySelector(".typing");

    if (typing) {

        const words = [

            "Detect.",

            "Monitor.",

            "Protect."

        ];

        let wordIndex = 0;

        let charIndex = 0;

        let deleting = false;

        function type() {

            const currentWord = words[wordIndex];

            if (!deleting) {

                typing.textContent =
                    currentWord.substring(0, charIndex++);

                if (charIndex > currentWord.length) {

                    deleting = true;

                    setTimeout(type, 1500);

                    return;

                }

            } else {

                typing.textContent =
                    currentWord.substring(0, charIndex--);

                if (charIndex === 0) {

                    deleting = false;

                    wordIndex = (wordIndex + 1) % words.length;

                }

            }

            setTimeout(type, deleting ? 60 : 120);

        }

        type();

    }


    /* ============================================
       AOS Initialization
    ============================================ */

    if (typeof AOS !== "undefined") {

        AOS.init({

            duration: 1000,

            once: true,

            easing: "ease-in-out"

        });

    }

});


/* ==========================================================
   End of main.js
========================================================== */