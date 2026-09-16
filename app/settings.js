(() => {
    "use strict";


    /*
     * STUDY OS
     * Settings Engine
     *
     * Theme controls
     * Atmosphere controls
     * Settings panel
     */


    const SETTINGS_CLASS =
        "study-os-settings";


    function getThemeEngine() {

        return window.StudyOSTheme || null;

    }


    function createSettingsButton() {

        if (
            document.querySelector(
                ".study-os-settings-button"
            )
        ) {
            return;
        }


        const button =
            document.createElement("button");


        button.className =
            "study-os-settings-button";


        button.type =
            "button";


        button.setAttribute(
            "aria-label",
            "Ayarlar"
        );


        button.setAttribute(
            "title",
            "Ayarlar"
        );


        button.innerHTML = `
            <i data-lucide="settings"></i>
        `;


        document.body.appendChild(
            button
        );


        button.addEventListener(
            "click",
            openSettings
        );


        refreshIcons();

    }


    function createPanel() {

        if (
            document.querySelector(
                ".study-os-settings-overlay"
            )
        ) {
            return;
        }


        const overlay =
            document.createElement("div");


        overlay.className =
            "study-os-settings-overlay";


        overlay.innerHTML = `

            <div
                class="study-os-settings-panel"
                role="dialog"
                aria-modal="true"
                aria-label="Ayarlar"
            >

                <div
                    class="study-os-settings-header"
                >

                    <div>

                        <p
                            class="study-os-settings-eyebrow"
                        >
                            STUDY OS
                        </p>

                        <h2>
                            Ayarlar
                        </h2>

                    </div>


                    <button
                        type="button"
                        class="study-os-settings-close"
                        aria-label="Ayarları kapat"
                    >
                        <i data-lucide="x"></i>
                    </button>

                </div>


                <div
                    class="study-os-settings-content"
                >

                    <section
                        class="study-os-settings-section"
                    >

                        <div
                            class="study-os-settings-section-title"
                        >

                            <div>

                                <strong>
                                    Görünüm
                                </strong>

                                <span>
                                    Study OS atmosferini
                                    nasıl kullanacağını seç.
                                </span>

                            </div>

                        </div>


                        <div
                            class="study-os-theme-modes"
                        >

                            <button
                                type="button"
                                data-theme-mode="auto"
                                class="study-os-option"
                            >

                                <span
                                    class="study-os-option-icon"
                                >
                                    <i
                                        data-lucide="sparkles"
                                    ></i>
                                </span>

                                <span
                                    class="study-os-option-text"
                                >

                                    <strong>
                                        Otomatik
                                    </strong>

                                    <small>
                                        Hava, mevsim ve
                                        günün saatine göre.
                                    </small>

                                </span>

                                <span
                                    class="study-os-option-check"
                                >
                                    <i
                                        data-lucide="check"
                                    ></i>
                                </span>

                            </button>


                            <button
                                type="button"
                                data-theme-mode="manual"
                                class="study-os-option"
                            >

                                <span
                                    class="study-os-option-icon"
                                >
                                    <i
                                        data-lucide="palette"
                                    ></i>
                                </span>

                                <span
                                    class="study-os-option-text"
                                >

                                    <strong>
                                        Manuel
                                    </strong>

                                    <small>
                                        Temanı kendin seç.
                                    </small>

                                </span>

                                <span
                                    class="study-os-option-check"
                                >
                                    <i
                                        data-lucide="check"
                                    ></i>
                                </span>

                            </button>


                            <button
                                type="button"
                                data-theme-mode="off"
                                class="study-os-option"
                            >

                                <span
                                    class="study-os-option-icon"
                                >
                                    <i
                                        data-lucide="circle-off"
                                    ></i>
                                </span>

                                <span
                                    class="study-os-option-text"
                                >

                                    <strong>
                                        Kapalı
                                    </strong>

                                    <small>
                                        Varsayılan görünümü kullan.
                                    </small>

                                </span>

                                <span
                                    class="study-os-option-check"
                                >
                                    <i
                                        data-lucide="check"
                                    ></i>
                                </span>

                            </button>

                        </div>

                    </section>


                    <section
                        class="study-os-settings-section
                               study-os-manual-section"
                    >

                        <div
                            class="study-os-settings-section-title"
                        >

                            <div>

                                <strong>
                                    Tema
                                </strong>

                                <span>
                                    Manuel modda kullanılacak
                                    görünümü seç.
                                </span>

                            </div>

                        </div>


                        <div
                            class="study-os-theme-list"
                        >

                            <button
                                type="button"
                                data-manual-theme="default"
                                class="study-os-theme-choice"
                            >

                                <span
                                    class="theme-preview
                                           theme-preview-default"
                                ></span>

                                <span>
                                    Study OS
                                </span>

                                <i
                                    data-lucide="check"
                                ></i>

                            </button>


                            <button
                                type="button"
                                data-manual-theme="daylight"
                                class="study-os-theme-choice"
                            >

                                <span
                                    class="theme-preview
                                           theme-preview-daylight"
                                ></span>

                                <span>
                                    Daylight
                                </span>

                                <i
                                    data-lucide="check"
                                ></i>

                            </button>


                            <button
                                type="button"
                                data-manual-theme="night"
                                class="study-os-theme-choice"
                            >

                                <span
                                    class="theme-preview
                                           theme-preview-night"
                                ></span>

                                <span>
                                    Night
                                </span>

                                <i
                                    data-lucide="check"
                                ></i>

                            </button>


                            <button
                                type="button"
                                data-manual-theme="spring"
                                class="study-os-theme-choice"
                            >

                                <span
                                    class="theme-preview
                                           theme-preview-spring"
                                ></span>

                                <span>
                                    Spring
                                </span>

                                <i
                                    data-lucide="check"
                                ></i>

                            </button>


                            <button
                                type="button"
                                data-manual-theme="summer"
                                class="study-os-theme-choice"
                            >

                                <span
                                    class="theme-preview
                                           theme-preview-summer"
                                ></span>

                                <span>
                                    Summer
                                </span>

                                <i
                                    data-lucide="check"
                                ></i>

                            </button>


                            <button
                                type="button"
                                data-manual-theme="autumn"
                                class="study-os-theme-choice"
                            >

                                <span
                                    class="theme-preview
                                           theme-preview-autumn"
                                ></span>

                                <span>
                                    Autumn
                                </span>

                                <i
                                    data-lucide="check"
                                ></i>

                            </button>


                            <button
                                type="button"
                                data-manual-theme="winter"
                                class="study-os-theme-choice"
                            >

                                <span
                                    class="theme-preview
                                           theme-preview-winter"
                                ></span>

                                <span>
                                    Winter
                                </span>

                                <i
                                    data-lucide="check"
                                ></i>

                            </button>

                        </div>

                    </section>


                    <section
                        class="study-os-settings-section"
                    >

                        <div
                            class="study-os-settings-row"
                        >

                            <div>

                                <strong>
                                    Atmosfer efektleri
                                </strong>

                                <span>
                                    Yağmur, kar, güneş ve
                                    diğer hafif efektler.
                                </span>

                            </div>


                            <button
                                type="button"
                                class="study-os-toggle"
                                role="switch"
                                aria-checked="true"
                                aria-label="Atmosfer efektleri"
                            >

                                <span></span>

                            </button>

                        </div>

                    </section>


                </div>


                <div
                    class="study-os-settings-footer"
                >

                    <span>
                        Study OS
                    </span>

                    <span>
                        Kişisel çalışma alanın.
                    </span>

                </div>

            </div>

        `;


        document.body.appendChild(
            overlay
        );


        bindPanelEvents(
            overlay
        );


        refreshIcons();

    }


    function bindPanelEvents(
        overlay
    ) {

        const closeButton =
            overlay.querySelector(
                ".study-os-settings-close"
            );


        closeButton.addEventListener(
            "click",
            closeSettings
        );


        overlay.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    overlay
                ) {

                    closeSettings();

                }

            }
        );


        const modeButtons =
            overlay.querySelectorAll(
                "[data-theme-mode]"
            );


        modeButtons.forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const mode =
                            button.dataset.themeMode;


                        const engine =
                            getThemeEngine();


                        if (
                            engine &&
                            typeof engine.setMode ===
                                "function"
                        ) {

                            engine.setMode(
                                mode
                            );

                        }


                        updatePanel();

                    }
                );

            }
        );


        const themeButtons =
            overlay.querySelectorAll(
                "[data-manual-theme]"
            );


        themeButtons.forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const theme =
                            button.dataset.manualTheme;


                        const engine =
                            getThemeEngine();


                        if (
                            engine &&
                            typeof engine.setManualTheme ===
                                "function"
                        ) {

                            engine.setManualTheme(
                                theme
                            );

                        }


                        updatePanel();

                    }
                );

            }
        );


        const toggle =
            overlay.querySelector(
                ".study-os-toggle"
            );


        toggle.addEventListener(
            "click",
            () => {

                const engine =
                    getThemeEngine();


                if (
                    !engine ||
                    typeof engine.getSettings !==
                        "function"
                ) {
                    return;
                }


                const settings =
                    engine.getSettings();


                const next =
                    !settings.atmosphere;


                if (
                    typeof engine.setAtmosphereEnabled ===
                        "function"
                ) {

                    engine.setAtmosphereEnabled(
                        next
                    );

                }


                updatePanel();

            }
        );


        document.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Escape"
                ) {

                    closeSettings();

                }

            }
        );

    }


    function updatePanel() {

        const overlay =
            document.querySelector(
                ".study-os-settings-overlay"
            );


        if (!overlay) {
            return;
        }


        const engine =
            getThemeEngine();


        if (!engine) {
            return;
        }


        const settings =
            engine.getSettings();


        const modeButtons =
            overlay.querySelectorAll(
                "[data-theme-mode]"
            );


        modeButtons.forEach(
            button => {

                const active =
                    button.dataset.themeMode ===
                    settings.mode;


                button.classList.toggle(
                    "is-selected",
                    active
                );

            }
        );


        const themeButtons =
            overlay.querySelectorAll(
                "[data-manual-theme]"
            );


        themeButtons.forEach(
            button => {

                const active =
                    button.dataset.manualTheme ===
                    settings.manualTheme;


                button.classList.toggle(
                    "is-selected",
                    active
                );

            }
        );


        const manualSection 
