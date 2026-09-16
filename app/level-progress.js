(() => {

    const statsUrl =
        `data/stats.json?cache=${Date.now()}`;


    function calculateLevelProgress(totalXp) {

        totalXp = Math.max(
            0,
            Number(totalXp) || 0
        );

        let level = 1;
        let remainingXp = totalXp;

        while (true) {

            const requiredXp =
                level * 100;

            if (remainingXp < requiredXp) {
                break;
            }

            remainingXp -= requiredXp;
            level += 1;
        }

        const nextLevelXp =
            level * 100;

        const percentage = Math.min(
            100,
            Math.round(
                remainingXp /
                nextLevelXp *
                100
            )
        );

        return {
            level,
            currentXp: remainingXp,
            nextLevelXp,
            remainingXp:
                Math.max(
                    0,
                    nextLevelXp -
                    remainingXp
                ),
            percentage
        };
    }


    function injectStyles() {

        if (
            document.getElementById(
                "levelProgressStyles"
            )
        ) {
            return;
        }

        const style =
            document.createElement(
                "style"
            );

        style.id =
            "levelProgressStyles";

        style.textContent = `

            .level-progress-panel {

                position: relative;

                overflow: hidden;

            }


            .level-progress-glow {

                position: absolute;

                width: 220px;

                height: 220px;

                right: -90px;

                top: -100px;

                border-radius: 50%;

                background:
                    radial-gradient(
                        circle,
                        rgba(139,108,255,0.20),
                        transparent 68%
                    );

                pointer-events: none;

            }


            .level-progress-top {

                display: flex;

                align-items: center;

                justify-content: space-between;

                gap: 20px;

            }


            .level-progress-title {

                margin: 3px 0 0;

                font-size: 23px;

            }


            .level-progress-level {

                display: flex;

                align-items: baseline;

                gap: 8px;

                white-space: nowrap;

            }


            .level-progress-level strong {

                font-size: 34px;

                line-height: 1;

                color: #f6f7fb;

            }


            .level-progress-level span {

                color: #8f98aa;

                font-size: 14px;

            }


            .level-progress-track {

                width: 100%;

                height: 14px;

                margin-top: 20px;

                overflow: hidden;

                border-radius: 999px;

                background:
                    rgba(255,255,255,0.07);

                box-shadow:
                    inset 0 1px 2px
                    rgba(0,0,0,0.25);

            }


            .level-progress-fill {

                width: 0%;

                height: 100%;

                border-radius: inherit;

                background:
                    linear-gradient(
                        90deg,
                        #765cf6,
                        #a997ff,
                        #d4ccff
                    );

                box-shadow:
                    0 0 18px
                    rgba(139,108,255,0.35);

                transition:
                    width 1s cubic-bezier(
                        0.22,
                        1,
                        0.36,
                        1
                    );

            }


            .level-progress-bottom {

                display: flex;

                align-items: center;

                justify-content: space-between;

                gap: 16px;

                margin-top: 12px;

                color: #8f98aa;

                font-size: 14px;

            }


            .level-progress-bottom strong {

                color: #f6f7fb;

            }


            .level-progress-card-pop {

                animation:
                    levelProgressPop
                    0.65s ease;

            }


            @keyframes levelProgressPop {

                0% {

                    transform: scale(1);

                }

                35% {

                    transform: scale(1.018);

                }

                65% {

                    transform: scale(0.996);

                }

                100% {

                    transform: scale(1);

                }

            }


            .level-up-highlight {

                animation:
                    levelUpHighlight
                    1s ease;

            }


            @keyframes levelUpHighlight {

                0% {

                    box-shadow:
                        0 0 0
                        rgba(169,151,255,0);

                }

                35% {

                    box-shadow:
                        0 0 42px
                        rgba(169,151,255,0.45);

                }

                100% {

                    box-shadow:
                        0 0 0
                        rgba(169,151,255,0);

                }

            }


            .level-up-toast {

                position: fixed;

                left: 50%;

                top: 28px;

                z-index: 9999;

                transform:
                    translate(-50%, -20px)
                    scale(0.96);

                opacity: 0;

                pointer-events: none;

                padding:
                    14px 20px;

                border:
                    1px solid
                    rgba(255,255,255,0.12);

                border-radius: 18px;

                background:
                    rgba(18,22,33,0.82);

                backdrop-filter:
                    blur(18px);

                box-shadow:
                    0 20px 60px
                    rgba(0,0,0,0.35);

                color: #ffffff;

                text-align: center;

                transition:
                    opacity 0.35s ease,
                    transform 0.35s ease;

            }


            .level-up-toast.visible {

                opacity: 1;

                transform:
                    translate(-50%, 0)
                    scale(1);

            }


            .level-up-toast small {

                display: block;

                margin-top: 3px;

                color: #aaa0ff;

                font-size: 12px;

                letter-spacing: 0.08em;

                font-weight: 800;

            }


            .level-up-confetti {

                position: fixed;

                width: 7px;

                height: 11px;

                z-index: 9998;

                top: -20px;

                pointer-events: none;

                border-radius: 2px;

                animation:
                    levelConfettiFall
                    var(--duration)
                    cubic-bezier(
                        0.12,
                        0.75,
                        0.35,
                        1
                    )
                    forwards;

            }


            @keyframes levelConfettiFall {

                0% {

                    transform:
                        translate3d(
                            0,
                            0,
                            0
                        )
                        rotate(0deg);

                    opacity: 0;

                }

                10% {

                    opacity: 1;

                }

                100% {

                    transform:
                        translate3d(
                            var(--drift),
                            110vh,
                            0
                        )
                        rotate(
                            var(--rotation)
                        );

                    opacity: 0;

                }

            }


            @media (max-width: 500px) {

                .level-progress-top {

                    align-items: flex-start;

                }


                .level-progress-level strong {

                    font-size: 29px;

                }


                .level-progress-bottom {

                    font-size: 13px;

                }

            }

        `;

        document.head.appendChild(
            style
        );

    }


    function createPanel() {

        if (
            document.getElementById(
                "levelProgressPanel"
            )
        ) {
            return;
        }

        const statsGrid =
            document.querySelector(
                ".stats-grid"
            );

        if (!statsGrid) {
            return;
        }

        const panel =
            document.createElement(
                "section"
            );

        panel.id =
            "levelProgressPanel";

        panel.className =
            "panel level-progress-panel";

        panel.innerHTML = `

            <div
                class="level-progress-glow"
            ></div>

            <div
                class="level-progress-top"
            >

                <div>

                    <p
                        class="eyebrow"
                    >
                        PROGRESSION
                    </p>

                    <h2
                        class="level-progress-title"
                    >
                        Seviye İlerlemesi
                    </h2>

                </div>

                <div
                    class="level-progress-level"
                >

                    <strong
                        id="levelProgressCurrent"
                    >
                        1
                    </strong>

                    <span>
                        LEVEL
                    </span>

                </div>

            </div>

            <div
                class="level-progress-track"
            >

                <div
                    id="levelProgressFill"
                    class="level-progress-fill"
                ></div>

            </div>

            <div
                class="level-progress-bottom"
            >

                <span>
                    <strong
                        id="levelProgressXp"
                    >
                        0 / 100 XP
                    </strong>
                </span>

                <span
                    id="levelProgressRemaining"
                >
                    100 XP kaldı
                </span>

            </div>

        `;

        statsGrid.insertAdjacentElement(
            "afterend",
            panel
        );

    }


    function showLevelUp(level) {

        const panel =
            document.getElementById(
                "levelProgressPanel"
            );

        const levelCard =
            document.querySelector(
                ".stat-card.blue"
            );

        if (panel) {

            panel.classList.remove(
                "level-progress-card-pop"
            );

            void panel.offsetWidth;

            panel.classList.add(
                "level-progress-card-pop"
            );

        }


        if (levelCard) {

            levelCard.classList.remove(
                "level-up-highlight"
            );

            void levelCard.offsetWidth;

            levelCard.classList.add(
                "level-up-highlight"
            );

        }


        const toast =
            document.createElement(
                "div"
            );

        toast.className =
            "level-up-toast";

        toast.innerHTML = `

            <strong>
                LEVEL ${level} 🎉
            </strong>

            <small>
                SEVİYE ATLADIN
            </small>

        `;

        document.body.appendChild(
            toast
        );


        requestAnimationFrame(
            () => {

                toast.classList.add(
                    "visible"
                );

            }
        );


        createConfetti();


        setTimeout(
            () => {

                toast.classList.remove(
                    "visible"
                );

                setTimeout(
                    () => {

                        toast.remove();

                    },
                    350
                );

            },
            2800
        );

    }


    function createConfetti() {

        const pieces = 42;

        for (
            let i = 0;
            i < pieces;
            i++
        ) {

            const piece =
                document.createElement(
                    "div"
                );

            piece.className =
                "level-up-confetti";


            const hue =
                Math.floor(
                    Math.random() *
                    360
                );

            piece.style.background =
                `hsl(${hue} 85% 72%)`;


            piece.style.left =
                `${
                    10 +
                    Math.random() * 80
                }vw`;


            piece.style.setProperty(
                "--drift",
                `${
                    -120 +
                    Math.random() * 240
                }px`
            );


            piece.style.setProperty(
                "--rotation",
                `${
                    -540 +
                    Math.random() * 1080
                }deg`
            );


            piece.style.setProperty(
                "--duration",
                `${
                    1.5 +
                    Math.random() * 1.4
                }s`
            );


            piece.style.animationDelay =
                `${
                    Math.random() *
                    0.18
                }s`;


            document.body.appendChild(
                piece
            );


            setTimeout(
                () => {

                    piece.remove();

                },
                3400
            );

        }

    }


    function checkLevelUp(
        currentLevel
    ) {

        const storageKey =
            "studyOsLastSeenLevel";

        const saved =
            localStorage.getItem(
                storageKey
            );

        const previousLevel =
            Number(saved);


        localStorage.setItem(
            storageKey,
            String(currentLevel)
        );


        if (
            !saved ||
            !Number.isFinite(
                previousLevel
            )
        ) {
            return;
        }


        if (
            currentLevel >
            previousLevel
        ) {

            showLevelUp(
                currentLevel
            );

        }

    }


    function renderProgress(
        totalXp,
        backendLevel
    ) {

        const progress =
            calculateLevelProgress(
                totalXp
            );


        const level =
            Number.isFinite(
                Number(backendLevel)
            )
                ? Number(backendLevel)
                : progress.level;


        const current =
            document.getElementById(
                "levelProgressCurrent"
            );

        const fill =
            document.getElementById(
                "levelProgressFill"
            );

        const xp =
            document.getElementById(
                "levelProgressXp"
            );

        const remaining =
            document.getElementById(
                "levelProgressRemaining"
            );


        if (!current) {
            return;
        }


        current.textContent =
            level;


        fill.style.width =
            `${progress.percentage}%`;


        xp.textContent =
            `${
                progress.currentXp
            } / ${
                progress.nextLevelXp
            } XP`;


        remaining.textContent =
            `${
                progress.remainingXp
            } XP kaldı`;


        checkLevelUp(
            level
        );

    }


    async function load() {

        try {

            injectStyles();

            createPanel();


            const response =
                await fetch(
                    statsUrl
                );


            if (!response.ok) {

                throw new Error(
                    "Study OS istatistikleri okunamadı."
                );

            }


            const data =
                await response.json();


            const totals =
                data.totals || {};


            renderProgress(
                totals.xp || 0,
                totals.level
            );

        } catch (error) {

            console.error(
                "Level progress:",
                error
            );

        }

    }


    function start() {

        load();

    }


    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            start
        );

    } else {

        start();

    }

})();
