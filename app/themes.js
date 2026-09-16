(() => {
    "use strict";


    /*
     * STUDY OS
     * Theme Engine
     *
     * Automatic:
     *   weather + season + day/night
     *
     * Manual:
     *   user-selected theme
     *
     * Off:
     *   default Study OS appearance
     */


    const STORAGE_KEY =
        "studyOsThemeSettings";


    const DEFAULT_SETTINGS = {
        mode: "auto",
        atmosphere: true,
        manualTheme: "default"
    };


    const THEMES = {
        default: {
            id: "default",
            name: "Study OS",
            description: "Varsayılan görünüm",
            className: "theme-default"
        },

        daylight: {
            id: "daylight",
            name: "Daylight",
            description: "Aydınlık gündüz atmosferi",
            className: "theme-daylight"
        },

        night: {
            id: "night",
            name: "Night",
            description: "Sakin gece atmosferi",
            className: "theme-night"
        },

        spring: {
            id: "spring",
            name: "Spring",
            description: "Hafif ve canlı bahar",
            className: "theme-spring"
        },

        summer: {
            id: "summer",
            name: "Summer",
            description: "Aydınlık yaz atmosferi",
            className: "theme-summer"
        },

        autumn: {
            id: "autumn",
            name: "Autumn",
            description: "Sıcak sonbahar atmosferi",
            className: "theme-autumn"
        },

        winter: {
            id: "winter",
            name: "Winter",
            description: "Soğuk ve sakin kış",
            className: "theme-winter"
        }
    };


    function loadSettings() {

        try {

            const stored =
                localStorage.getItem(
                    STORAGE_KEY
                );


            if (!stored) {
                return {
                    ...DEFAULT_SETTINGS
                };
            }


            const parsed =
                JSON.parse(stored);


            return {
                ...DEFAULT_SETTINGS,
                ...parsed
            };

        } catch {

            return {
                ...DEFAULT_SETTINGS
            };

        }

    }


    function saveSettings(settings) {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(settings)
        );

    }


    function removeThemeClasses() {

        Object.values(THEMES)
            .forEach(theme => {

                document.body.classList.remove(
                    theme.className
                );

            });

    }


    function getSeason(date = new Date()) {

        const month =
            date.getMonth() + 1;


        if (
            month === 12 ||
            month === 1 ||
            month === 2
        ) {

            return "winter";

        }


        if (
            month >= 3 &&
            month <= 5
        ) {

            return "spring";

        }


        if (
            month >= 6 &&
            month <= 8
        ) {

            return "summer";

        }


        return "autumn";

    }


    function getTimeOfDay(date = new Date()) {

        const hour =
            date.getHours();


        if (hour >= 6 && hour < 11) {
            return "morning";
        }


        if (hour >= 11 && hour < 17) {
            return "day";
        }


        if (hour >= 17 && hour < 21) {
            return "evening";
        }


        return "night";

    }


    function normalizeWeather(weather) {

        if (!weather) {
            return "unknown";
        }


        const value =
            String(weather)
                .toLowerCase()
                .trim();


        if (
            value.includes("rain") ||
            value.includes("drizzle") ||
            value.includes("showers") ||
            value.includes("yağmur") ||
            value.includes("çise")
        ) {

            return "rain";

        }


        if (
            value.includes("snow") ||
            value.includes("sleet") ||
            value.includes("kar")
        ) {

            return "snow";

        }


        if (
            value.includes("thunder") ||
            value.includes("storm") ||
            value.includes("fırtına")
        ) {

            return "storm";

        }


        if (
            value.includes("cloud") ||
            value.includes("overcast") ||
            value.includes("bulut")
        ) {

            return "cloudy";

        }


        if (
            value.includes("sun") ||
            value.includes("clear") ||
            value.includes("açık")
        ) {

            return "sunny";

        }


        return "unknown";

    }


    /*
     * Hava durumu ağırlığı.
     *
     * Burada amaç havayı baskın yapmak değil.
     * Mevsim ve günün saatiyle birlikte dengelemek.
     */

    function getWeatherWeight(weather) {

        switch (weather) {

            case "rain":
                return 0.35;

            case "snow":
                return 0.35;

            case "storm":
                return 0.28;

            case "cloudy":
                return 0.18;

            case "sunny":
                return 0.22;

            default:
                return 0;

        }

    }


    function getTimeWeight(time) {

        switch (time) {

            case "night":
                return 0.40;

            case "evening":
                return 0.24;

            case "morning":
                return 0.16;

            case "day":
            default:
                return 0.10;

        }

    }


    function getSeasonWeight(season) {

        switch (season) {

            case "spring":
            case "summer":
            case "autumn":
            case "winter":
                return 0.42;

            default:
                return 0.30;

        }

    }


    function resolveAutomaticTheme(
        weather,
        date = new Date()
    ) {

        const normalizedWeather =
            normalizeWeather(weather);


        const season =
            getSeason(date);


        const time =
            getTimeOfDay(date);


        /*
         * Gece her zaman kendi atmosferine
         * belli bir öncelik verir.
         */

        if (time === "night") {
            return "night";
        }


        /*
         * Kar + kış
         */

        if (
            normalizedWeather === "snow" &&
            season === "winter"
        ) {

            return "winter";

        }


        /*
         * Yağmur + sonbahar
         */

        if (
            normalizedWeather === "rain" &&
            season === "autumn"
        ) {

            return "autumn";

        }


        /*
         * Yaz + güneş
         */

        if (
            normalizedWeather === "sunny" &&
            season === "summer"
        ) {

            return "summer";

        }


        /*
         * İlkbahar
         */

        if (
            season === "spring" &&
            normalizedWeather !== "storm"
        ) {

            return "spring";

        }


        /*
         * Akşam atmosferi.
         */

        if (time === "evening") {

            if (
                season === "autumn"
            ) {

                return "autumn";

            }


            if (
                season === "winter"
            ) {

                return "winter";

            }

        }


        /*
         * Gündüz genel atmosferi.
         */

        return "daylight";

    }


    function getWeatherAtmosphere(
        weather
    ) {

        return normalizeWeather(
            weather
        );

    }


    function clearAtmosphere() {

        const existing =
            document.getElementById(
                "studyOsAtmosphere"
            );


        if (existing) {
            existing.remove();
        }


        document.body
            .classList
            .remove(
                "weather-rain",
                "weather-snow",
                "weather-sunny",
                "weather-storm",
                "weather-cloudy"
            );

    }


    function createAtmosphere(
        weather
    ) {

        clearAtmosphere();


        const normalized =
            normalizeWeather(
                weather
            );


        if (
            normalized === "unknown"
        ) {

            return;

        }


        const atmosphere =
            document.createElement(
                "div"
            );


        atmosphere.id =
            "studyOsAtmosphere";


        atmosphere.className =
            `study-os-atmosphere atmosphere-${normalized}`;


        atmosphere.setAttribute(
            "aria-hidden",
            "true"
        );


        document.body
            .appendChild(
                atmosphere
            );


        document.body.classList.add(
            `weather-${normalized}`
        );


        if (
            normalized === "rain"
        ) {

            createRain(
                atmosphere
            );

        }


        if (
            normalized === "snow"
        ) {

            createSnow(
                atmosphere
            );

        }


        if (
            normalized === "sunny"
        ) {

            createSun(
                atmosphere
            );

        }


        if (
            normalized === "storm"
        ) {

            createStorm(
                atmosphere
            );

        }


        if (
            normalized === "cloudy"
        ) {

            createClouds(
                atmosphere
            );

        }

    }


    function createRain(
        container
    ) {

        for (
            let i = 0;
            i < 32;
            i++
        ) {

            const drop =
                document.createElement(
                    "span"
                );


            drop.className =
                "weather-particle rain-drop";


            drop.style.setProperty(
                "--x",
                `${Math.random() * 100}%`
            );


            drop.style.setProperty(
                "--delay",
                `${Math.random() * 2}s`
            );


            drop.style.setProperty(
                "--duration",
                `${1.1 + Math.random() * 1.3}s`
            );


            container.appendChild(
                drop
            );

        }

    }


    function createSnow(
        container
    ) {

        for (
            let i = 0;
            i < 28;
            i++
        ) {

            const flake =
                document.createElement(
                    "span"
                );


            flake.className =
                "weather-particle snow-flake";


            flake.style.setProperty(
                "--x",
                `${Math.random() * 100}%`
            );


            flake.style.setProperty(
                "--delay",
                `${Math.random() * 4}s`
            );


            flake.style.setProperty(
                "--duration",
                `${5 + Math.random() * 5}s`
            );


            flake.style.setProperty(
                "--size",
                `${2 + Math.random() * 4}px`
            );


            container.appendChild(
                flake
            );

        }

    }


    function createSun(
        container
    ) {

        const glow =
            document.createElement(
                "div"
            );


        glow.className =
            "weather-sun-glow";


        container.appendChild(
            glow
        );

    }


    function createStorm(
        container
    ) {

        const layer =
            document.createElement(
                "div"
            );


        layer.className =
            "weather-storm-layer";


        container.appendChild(
            layer
        );

    }


    function createClouds(
        container
    ) {

        const layer =
            document.createElement(
                "div"
            );


        layer.className =
            "weather-cloud-layer";


        container.appendChild(
            layer
        );

    }


    function applyTheme(
        themeId,
        weather = null,
        atmosphereEnabled = true
    ) {

        removeThemeClasses();


        const theme =
            THEMES[themeId] ||
            THEMES.default;


        document.body.classList.add(
            theme.className
        );


        clearAtmosphere();


        if (
            atmosphereEnabled &&
            weather
        ) {

            createAtmosphere(
                weather
            );

        }


        document.documentElement
            .dataset.studyOsTheme =
            theme.id;

    }


    function applyCurrentSettings(
        weather = null,
        date = new Date()
    ) {

        const settings =
            loadSettings();


        let selectedTheme;


        if (
            settings.mode === "off"
        ) {

            selectedTheme =
                "default";

        } else if (
            settings.mode === "manual"
        ) {

            selectedTheme =
                settings.manualTheme;

        } else {

            selectedTheme =
                resolveAutomaticTheme(
                    weather,
                    date
                );

        }


        applyTheme(
            selectedTheme,
            weather,
            settings.atmosphere
        );

    }


    function setMode(
        mode
    ) {

        const settings =
            loadSettings();


        if (
            ![
                "auto",
                "manual",
                "off"
            ].includes(mode)
        ) {

            return;

        }


        settings.mode =
            mode;


        saveSettings(
            settings
        );


        applyCurrentSettings();

    }


    function setManualTheme(
        themeId
    ) {

        if (
            !THEMES[themeId]
        ) {

            return;

        }


        const settings =
            loadSettings();


        settings.manualTheme =
            themeId;


        settings.mode =
            "manual";


        saveSettings(
            settings
        );


        applyCurrentSettings();

    }


    function setAtmosphereEnabled(
        enabled
    ) {

        const settings =
            loadSettings();


        settings.atmosphere =
            Boolean(enabled);


        saveSettings(
            settings
        );


        applyCurrentSettings();

    }


    function getThemes() {

        return {
            ...THEMES
        };

    }


    function getSettings() {

        return loadSettings();

    }


    function initialize() {

        applyCurrentSettings();

    }


    /*
     * Dışarıya açılan API
     */

    window.StudyOSTheme = {

        initialize,

        applyCurrentSettings,

        setMode,

        setManualTheme,

        setAtmosphereEnabled,

        getThemes,

        getSettings,

        resolveAutomaticTheme,

        getSeason,

        getTimeOfDay,

        normalizeWeather

    };


    /*
     * CSS yükleme
     */

    function loadStylesheet() {

        if (
            document.querySelector(
                "link[data-study-os-themes]"
            )
        ) {

            return;

        }


        const link =
            document.createElement(
                "link"
            );


        link.rel =
            "stylesheet";


        link.href =
            `themes.css?v=${Date.now()}`;


        link.dataset.studyOsThemes =
            "true";


        document.head.appendChild(
            link
        );

    }


    function start() {

        loadStylesheet();

        initialize();

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
