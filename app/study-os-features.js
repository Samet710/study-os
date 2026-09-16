(() => {
    "use strict";

    const files = [
        "achievements.js",
        "themes.js",
        "settings.js",
        "effects.js"
    ];

    files.forEach(file => {
        const script =
            document.createElement("script");

        script.src =
            `${file}?v=${Date.now()}`;

        script.async = false;

        document.body.appendChild(script);
    });
})();
