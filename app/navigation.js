(() => {
    "use strict";

    function createNav() {
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
                class="nav-item active"
                data-tab="home"
            >
                <span>⌂</span>
                <small>Ana Sayfa</small>
            </button>

            <button
                class="nav-item"
                data-tab="progress"
            >
                <span>◔</span>
                <small>İlerleme</small>
            </button>

            <button
                class="nav-item"
                data-tab="achievements"
            >
                <span>♜</span>
                <small>Başarımlar</small>
            </button>

            <button
                class="nav-item"
                data-tab="settings"
            >
                <span>⚙</span>
                <small>Ayarlar</small>
            </button>
        `;

        document.body.appendChild(nav);

        nav.querySelectorAll(
            ".nav-item"
        ).forEach(button => {

            button.addEventListener(
                "click",
                () => {
                    changeTab(
                        button.dataset.tab
                    );
                }
            );

        });
    }


    function sections() {
        return {
            hero:
                document.querySelector(
                    ".hero"
                ),

            stats:
                document.querySelector(
                    ".stats-grid"
                ),

            charts:
                document.querySelector(
                    ".charts-grid"
                ),

            message:
                document.querySelector(
                    ".message-panel"
                ),

            daily:
                document.querySelector(
                    ".charts-grid"
                )?.previousElementSibling,

            recent:
                [...document.querySelectorAll(
                    ".panel"
                )].find(panel =>
                    panel.textContent.includes(
                        "Son Çalışmalar"
                    )
                ),

            achievements:
                document.querySelector(
                    "#achievementSection"
                )
        };
    }    function visible(
        element,
        value
    ) {
        if (!element) return;

        element.classList.toggle(
            "nav-hidden",
            !value
        );
    }


    function changeTab(tab) {

        const s = sections();


        visible(
            s.hero,
            tab === "home"
        );

        visible(
            s.stats,
            tab === "home"
        );

        visible(
            s.daily,
            tab === "home"
        );


        visible(
            s.charts,
            tab === "progress"
        );

        visible(
            s.message,
            tab === "progress"
        );

        visible(
            s.recent,
            tab === "progress"
        );


        visible(
            s.achievements,
            tab === "achievements"
        );


        document
            .querySelectorAll(
                ".nav-item"
            )
            .forEach(item => {

                item.classList.toggle(
                    "active",
                    item.dataset.tab === tab
                );

            });


        if (tab === "settings") {

            const settings =
                document.querySelector(
                    ".settings-trigger"
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


    function watchAchievements() {

        const observer =
            new MutationObserver(() => {

                const achievement =
                    document.querySelector(
                        "#achievementSection"
                    );

                if (
                    achievement &&
                    achievement.dataset
                        .navigationReady
                ) {
                    return;
                }

                if (achievement) {
                    achievement.dataset
                        .navigationReady =
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


    function styles() {

        const link =
            document.createElement("link");

        link.rel = "stylesheet";

        link.href =
            "navigation.css?v=1";

        document.head.appendChild(link);
    }


    function start() {

        styles();
        createNav();
        watchAchievements();

        setTimeout(() => {
            changeTab("home");
        }, 500);
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
