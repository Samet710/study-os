(() => {
    "use strict";


    /*
     * STUDY OS
     * Visual Effects Engine
     *
     * Achievement unlock
     * Level up
     * Confetti
     * Micro animations
     */


    /* =========================================================
       ACHIEVEMENT UNLOCK
       ========================================================= */


    function createUnlockScreen(achievement) {

        const existing =
            document.querySelector(
                ".achievement-unlock-backdrop"
            );

        if (existing) {
            existing.remove();
        }


        const backdrop =
            document.createElement("div");

        backdrop.className =
            "achievement-unlock-backdrop";


        backdrop.innerHTML = `

            <div
                class="achievement-unlock-screen"
                role="dialog"
                aria-modal="true"
                aria-label="Yeni başarım"
            >

                <div
                    class="achievement-unlock-stage"
                >

                    <div
                        class="achievement-unlock-icon"
                    >

                        <div
                            class="achievement-lock"
                        >
                            <span class="lock-shackle">
                                <span></span>
                            </span>

                            <span class="lock-body">
                            </span>
                        </div>


                        <div
                            class="achievement-real-icon"
                        >
                            <i
                                data-lucide="${achievement.icon}"
                            ></i>
                        </div>

                    </div>


                    <div
                        class="achievement-unlock-info"
                    >

                        <div
                            class="achievement-unlock-label"
                        >
                            BAŞARIM AÇILDI
                        </div>

                        <h2>
                            ${achievement.title}
                        </h2>

                        <p>
                            ${achievement.description}
                        </p>

                    </div>

                </div>


                <div
                    class="achievement-unlock-prompt"
                >

                    <span>
                        Devam etmek için
                    </span>

                    <span>
                        dokun
                    </span>

                </div>


                <div
                    class="achievement-particles"
                    aria-hidden="true"
                >

                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>

                </div>

            </div>

        `;


        document.body.appendChild(backdrop);


        requestAnimationFrame(() => {

            backdrop.classList.add(
                "is-visible"
            );

        });


        refreshIcons();


        return backdrop;
    }


    function refreshIcons() {

        if (
            window.lucide &&
            typeof window.lucide.createIcons ===
                "function"
        ) {

            window.lucide.createIcons();

        }

    }


    function wait(milliseconds) {

        return new Promise(
            resolve =>
                setTimeout(
                    resolve,
                    milliseconds
                )
        );

    }


    function waitForTap(element) {

        return new Promise(resolve => {

            let finished = false;


            const finish = () => {

                if (finished) {
                    return;
                }

                finished = true;

                resolve();

            };


            element.addEventListener(
                "click",
                finish,
                {
                    once: true
                }
            );


            element.addEventListener(
                "touchend",
                finish,
                {
                    once: true,
                    passive: true
                }
            );


            const keyboardHandler =
                event => {

                    if (
                        event.key === "Enter" ||
                        event.key === " "
                    ) {

                        event.preventDefault();

                        finish();

                    }

                };


            document.addEventListener(
                "keydown",
                keyboardHandler
            );


            element.dataset.keyboardHandler =
                "active";


            element._achievementKeyHandler =
                keyboardHandler;

        });

    }


    async function playAchievementUnlock(
        achievement
    ) {

        if (!achievement) {
            return;
        }


        const backdrop =
            createUnlockScreen(
                achievement
            );


        /*
         * 1
         * Ekran ortaya çıkar.
         */

        await wait(350);


        /*
         * 2
         * Kilit hafifçe hareket eder.
         */

        backdrop.classList.add(
            "unlock-shake"
        );


        await wait(450);


        /*
         * 3
         * Kilit açılır.
         */

        backdrop.classList.add(
            "lock-opening"
        );


        await wait(650);


        /*
         * 4
         * Başarım ikonu görünür.
         */

        backdrop.classList.add(
            "icon-revealed"
        );


        refreshIcons();


        await wait(650);


        /*
         * 5
         * İkon hafifçe yana kayar.
         * Bilgi alanı ortaya çıkar.
         */

        backdrop.classList.add(
            "info-revealed"
        );


        await wait(1000);


        /*
         * 6
         * Kullanıcı artık dokunabilir.
         */

        backdrop.classList.add(
            "ready"
        );


        await waitForTap(
            backdrop
        );


        /*
         * 7
         * Kapanış animasyonu.
         */

        backdrop.classList.add(
            "is-closing"
        );


        await wait(500);


        backdrop.remove();

    }


    window.playAchievementUnlock =
        playAchievementUnlock;


    /* =========================================================
       LEVEL UP
       ========================================================= */


    function showLevelUp(level) {

        if (!level) {
            return;
        }


        const existing =
            document.querySelector(
                ".level-up-effect"
            );


        if (existing) {
            existing.remove();
        }


        const effect =
            document.createElement("div");

        effect.className =
            "level-up-effect";


        effect.innerHTML = `

            <div
                class="level-up-card"
            >

                <div
                    class="level-up-orbit"
                >
                </div>

                <div
                    class="level-up-number"
                >
                    ${level}
                </div>

                <div
                    class="level-up-label"
                >
                    LEVEL UP
                </div>

            </div>

            <div
                class="level-up-confetti"
            >
                ${createConfettiPieces()}
            </div>

        `;


        document.body.appendChild(
            effect
        );


        requestAnimationFrame(() => {

            effect.classList.add(
                "is-visible"
            );

        });


        setTimeout(() => {

            effect.classList.add(
                "is-closing"
            );


            setTimeout(() => {

                effect.remove();

            }, 500);

        }, 2600);

    }


    function createConfettiPieces() {

        let html = "";


        for (
            let i = 0;
            i < 24;
            i++
        ) {

            html += `
                <span></span>
            `;

        }


        return html;

    }


    window.showLevelUp =
        showLevelUp;


    /* =========================================================
       GENERIC MICRO EFFECT
       ========================================================= */


    function pulseElement(element) {

        if (!element) {
            return;
        }


        element.classList.remove(
            "study-os-pulse"
        );


        void element.offsetWidth;


        element.classList.add(
            "study-os-pulse"
        );

    }


    window.studyOsPulse =
        pulseElement;


    /* =========================================================
       LOAD EFFECT CSS
       ========================================================= */


    function loadStylesheet() {

        if (
            document.querySelector(
                'link[data-study-os-effects]'
            )
        ) {
            return;
        }


        const link =
            document.createElement("link");


        link.rel =
            "stylesheet";

        link.href =
            `achievements.css?v=${Date.now()}`;


        link.dataset.studyOsEffects =
            "true";


        document.head.appendChild(
            link
        );

    }


    function start() {

        loadStylesheet();

    }


    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            start,
            {
                once: true
            }
        );

    } else {

        start();

    }

})();
