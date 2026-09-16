(() => {
    "use strict";

    function loadStyles() {
        if (
            document.querySelector(
                "[data-study-os-navigation]"
            )
        ) return;

        const link =
            document.createElement("link");

        link.rel = "stylesheet";
        link.href =
            `navigation.css?v=${Date.now()}`;

        link.dataset.studyOsNavigation =
            "true";

        document.head.appendChild(link);
    }


    function findPanels() {
        const panels =
            [...document.querySelectorAll(
                ".dashboard > .panel"
            )];

        return {
            daily: panels[0] || null,

            recent:
                panels.find(panel =>
                    panel.textContent.includes(
                        "Son Çalışmalar"
                    )
                ) || null
        };
    }


    function createNavigation() {

        if (
            document.querySelector(
                ".study-os-bottom-nav"
            )
        ) return;

        const nav =
            document.createElement("nav");

        nav.className =
            "study-os-bottom-nav";

        nav.innerHTML = `

            <button
                class="study-os-nav-item active"
                data-tab="home"
            >
                <i data-lucide="house"></i>
                <span>Ana Sayfa</span>
            </button>

            <button
                class="study-os-nav-item"
                data-tab="progress"
            >
                <i data-lucide="chart-no-axes-combined"></i>
                <span>İlerleme</span>
            </button>

            <button
                class="study-os-nav-item"
                data-tab="achievements"
            >
                <i data-lucide="trophy"></i>
                <span>Başarımlar</span>
            </button>

            <button
                class="study-os-nav-item"
                data-tab="settings"
            >
                <i data-lucide="settings"></i>
                <span>Ayarlar</span>
            </button>

        `;

        document.body.appendChild(nav);

        nav.querySelectorAll(
            ".study-os-nav-item"
        ).forEach(button => {

            button.addEventListener(
                "click",
                () => {
                    switchTab(
                        button.dataset.tab
                    );
                }
            );

        });

        if (
            window.lucide &&
            lucide.createIcons
        ) {
            lucide.createIcons();
        }
    }


    function getAchievement() {
        return document.querySelector(
            "#achievementSection"
        );
    }    function showElement(
        element,
        visible
    ) {
        if (!element) return;

        element.classList.toggle(
            "study-os-tab-hidden",
            !visible
        );
    }


    function switchTab(tab) {

        const dashboard =
            document.querySelector(
                ".dashboard"
            );

        if (!dashboard) return;

        const hero =
            document.querySelector(
                ".hero"
            );

        const stats =
            document.querySelector(
                ".stats-grid"
            );

        const level =
            document.querySelector(
                "#levelProgressPanel"
            );

        const panels =
            findPanels();

        const charts =
            document.querySelector(
                ".charts-grid"
            );

        const message =
            document.querySelector(
                ".message-panel"
            );

        const achievement =
            getAchievement();


        showElement(
            hero,
            tab === "home"
        );

        showElement(
            stats,
            tab === "home"
        );

        showElement(
            level,
            tab === "home"
        );

        showElement(
            panels.daily,
            tab === "home"
        );


        showElement(
            charts,
            tab === "progress"
        );

        showElement(
            message,
            tab === "progress"
        );

        showElement(
            panels.recent,
            tab === "progress"
        );

        showElement(
            achievement,
            tab === "achievements"
        );


        document
            .querySelectorAll(
                ".study-os-nav-item"
            )
            .forEach(button => {

                button.classList.toggle(
                    "active",
                    button.dataset.tab ===
                    tab
                );

            });


        if (tab === "settings") {

            const settings =
                document.querySelector(
                    ".study-os-settings-button"
                );

            if (settings) {
                settings.click();
            }

            return;
        }

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }


    function observeAchievements() {

        const observer =
            new MutationObserver(() => {

                const nav =
                    document.querySelector(
                        ".study-os-bottom-nav"
                    );

                if (!nav) return;

                const achievement =
                    getAchievement();

                if (
                    achievement &&
                    !achievement.dataset.navReady
                ) {
                    achievement.dataset.navReady =
                        "true";
                }

            });

        observer.observe(
            document.body,
            {
                childList: true,
                subtree: true
            }
        );
    }


    function start() {

        loadStyles();

        createNavigation();

        observeAchievements();

        setTimeout(() => {
            switchTab("home");
        }, 300);
    }


    if (
        document.readyState ===
        "loading"
    ) {
        document.addEventListener(
            "DOMContentLoaded",
            start,
            { once: true }
        );
    } else {
        start();
    }

})();
