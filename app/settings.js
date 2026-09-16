(() => {
    "use strict";

    const THEME = () =>
        window.StudyOSTheme || null;

    function icons() {
        if (
            window.lucide &&
            lucide.createIcons
        ) {
            lucide.createIcons();
        }
    }

    function button() {
        if (
            document.querySelector(
                ".study-os-settings-button"
            )
        ) return;

        const el =
            document.createElement("button");

        el.className =
            "study-os-settings-button";

        el.type = "button";
        el.title = "Ayarlar";
        el.setAttribute(
            "aria-label",
            "Ayarlar"
        );

        el.innerHTML =
            `<i data-lucide="settings"></i>`;

        document.body.appendChild(el);

        el.onclick = open;

        icons();
    }

    function panel() {
        if (
            document.querySelector(
                ".study-os-settings-overlay"
            )
        ) return;

        const el =
            document.createElement("div");

        el.className =
            "study-os-settings-overlay";

        el.innerHTML = `
            <div
                class="study-os-settings-panel"
            >
                <header
                    class="study-os-settings-header"
                >
                    <div>
                        <small>
                            STUDY OS
                        </small>

                        <h2>
                            Ayarlar
                        </h2>
                    </div>

                    <button
                        class="study-os-settings-close"
                        type="button"
                    >
                        <i
                            data-lucide="x"
                        ></i>
                    </button>
                </header>

                <main
                    class="study-os-settings-content"
                >
                    <section>
                        <strong>
                            Görünüm
                        </strong>

                        <p>
                            Temanın nasıl
                            çalışacağını seç.
                        </p>

                        <div
                            class="study-os-theme-modes"
                        >
                            ${mode(
                                "auto",
                                "sparkles",
                                "Otomatik",
                                "Hava, mevsim ve saat."
                            )}

                            ${mode(
                                "manual",
                                "palette",
                                "Manuel",
                                "Temanı kendin seç."
                            )}

                            ${mode(
                                "off",
                                "circle-off",
                                "Kapalı",
                                "Varsayılan görünüm."
                            )}
                        </div>
                    </section>
                </main>
            </div>
        `;

        document.body.appendChild(el);

        bind(el);
        icons();
    }

    function mode(
        id,
        icon,
        title,
        text
    ) {
        return `
            <button
                class="study-os-option"
                data-theme-mode="${id}"
                type="button"
            >
                <i
                    data-lucide="${icon}"
                ></i>

                <span>
                    <b>${title}</b>
                    <small>${text}</small>
                </span>

                <em>
                    <i data-lucide="check"></i>
                </em>
            </button>
        `;
    }    function bind(el) {

        el.querySelector(
            ".study-os-settings-close"
        ).onclick = close;

        el.onclick = event => {
            if (event.target === el) {
                close();
            }
        };

        el.querySelectorAll(
            "[data-theme-mode]"
        ).forEach(btn => {

            btn.onclick = () => {

                const engine = THEME();

                if (engine) {
                    engine.setMode(
                        btn.dataset.themeMode
                    );
                }

                update();
            };
        });
    }

    function update() {

        const el =
            document.querySelector(
                ".study-os-settings-overlay"
            );

        const engine = THEME();

        if (!el || !engine) return;

        const data =
            engine.getSettings();

        el.querySelectorAll(
            "[data-theme-mode]"
        ).forEach(btn => {

            btn.classList.toggle(
                "is-selected",
                btn.dataset.themeMode ===
                data.mode
            );
        });
    }

    function open() {

        panel();

        const el =
            document.querySelector(
                ".study-os-settings-overlay"
            );

        requestAnimationFrame(() => {
            el.classList.add(
                "is-visible"
            );
        });

        update();
    }

    function close() {

        const el =
            document.querySelector(
                ".study-os-settings-overlay"
            );

        if (!el) return;

        el.classList.remove(
            "is-visible"
        );

        setTimeout(() => {
            el.remove();
        }, 300);
    }

    function styles() {

        if (
            document.querySelector(
                "[data-study-os-settings]"
            )
        ) return;

        const link =
            document.createElement("link");

        link.rel = "stylesheet";
        link.href =
            `settings.css?v=${Date.now()}`;

        link.dataset.studyOsSettings =
            "true";

        document.head.appendChild(link);
    }

    function start() {
        styles();
        button();

        document.addEventListener(
            "keydown",
            e => {
                if (e.key === "Escape") {
                    close();
                }
            }
        );
                  }    if (
        document.readyState === "loading"
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
