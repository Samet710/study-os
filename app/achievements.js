
(() => {
    "use strict";

    const STATS_URL =
        `data/stats.json?cache=${Date.now()}`;

    const SEEN_KEY =
        "studyOsSeenAchievements";


    const ACHIEVEMENTS = [
        {
            id: "first-step",
            icon: "compass",
            title: "İlk Adım",
            description:
                "İlk çalışma kaydını oluşturdun.",
            check: data =>
                (data.totals?.questions || 0) >= 1
        },

        {
            id: "questions-50",
            icon: "target",
            title: "İlk Hedef",
            description:
                "Toplam 50 soruyu tamamladın.",
            check: data =>
                (data.totals?.questions || 0) >= 50
        },

        {
            id: "xp-500",
            icon: "zap",
            title: "Enerji Birikiyor",
            description:
                "500 XP kazandın.",
            check: data =>
                (data.totals?.xp || 0) >= 500
        },

        {
            id: "streak-3",
            icon: "flame",
            title: "Ateşi Yak",
            description:
                "3 gün üst üste çalıştın.",
            check: data =>
                (data.streak || 0) >= 3
        },

        {
            id: "streak-7",
            icon: "calendar-days",
            title: "Kesintisiz Hafta",
            description:
                "7 günlük çalışma serisi yaptın.",
            check: data =>
                (data.streak || 0) >= 7
        },

        {
            id: "level-5",
            icon: "crown",
            title: "Yeni Zirve",
            description:
                "Level 5'e ulaştın.",
            check: data =>
                (data.totals?.level || 0) >= 5
        },

        {
            id: "xp-1000",
            icon: "rocket",
            title: "Yükseliş",
            description:
                "1000 XP kazandın.",
            check: data =>
                (data.totals?.xp || 0) >= 1000
        },

        {
            id: "questions-500",
            icon: "trophy",
            title: "500 Soru",
            description:
                "500 soruyu tamamladın.",
            check: data =>
                (data.totals?.questions || 0) >= 500
        }
    ];


    function getSeen() {
        try {
            return JSON.parse(
                localStorage.getItem(SEEN_KEY)
            ) || [];
        } catch {
            return [];
        }
    }


    function saveSeen(ids) {
        localStorage.setItem(
            SEEN_KEY,
            JSON.stringify(ids)
        );
    }


    function createSection(unlocked) {

        const old =
            document.getElementById(
                "achievementSection"
            );

        if (old) {
            old.remove();
        }


        const section =
            document.createElement("section");

        section.id =
            "achievementSection";

        section.className =
            "panel achievement-section";


        section.innerHTML = `
            <div class="panel-heading">

                <div>
                    <p class="eyebrow">
                        ACHIEVEMENTS
                    </p>

                    <h2>
                        Başarımlar
                    </h2>
                </div>

                <span class="achievement-count">
                    ${unlocked.length} /
                    ${ACHIEVEMENTS.length}
                    açık
                </span>

            </div>

            <div
                class="achievement-grid"
            ></div>
        `;


        const grid =
            section.querySelector(
                ".achievement-grid"
            );


        ACHIEVEMENTS.forEach(item => {

            const isUnlocked =
                unlocked.some(
                    achievement =>
                        achievement.id === item.id
                );


            const card =
                document.createElement("article");


            card.className =
                "achievement-card " +
                (isUnlocked
                    ? "unlocked"
                    : "locked");


            card.innerHTML = `
                <div class="achievement-icon">

                    <i
                        data-lucide="${item.icon}"
                    ></i>

                </div>

                <div>
                    <strong>
                        ${item.title}
                    </strong>

                    <small>
                        ${
                            isUnlocked
                                ? item.description
                                : "Henüz açılmadı."
                        }
                    </small>
                </div>
            `;


            grid.appendChild(card);

        });


        const target =
            document.querySelector(
                ".message-panel"
            )?.nextElementSibling;


        if (target) {
            target.before(section);
        } else {
            document
                .querySelector(".dashboard")
                ?.appendChild(section);
        }


        if (
            window.lucide &&
            typeof lucide.createIcons ===
                "function"
        ) {
            lucide.createIcons();
        }
    }


    function getNewAchievements(
        unlocked
    ) {

        const seen =
            getSeen();


        return unlocked.filter(
            item =>
                !seen.includes(item.id)
        );
    }


    async function showUnlock(
        achievement
    ) {

        if (
            typeof window.playAchievementUnlock !==
            "function"
        ) {
            return;
        }


        await window.playAchievementUnlock(
            achievement
        );
    }


    async function load() {

        try {

            const response =
                await fetch(STATS_URL);


            if (!response.ok) {
                throw new Error(
                    "stats.json okunamadı."
                );
            }


            const data =
                await response.json();


            const unlocked =
                ACHIEVEMENTS.filter(
                    item =>
                        item.check(data)
                );


            createSection(unlocked);


            const seen =
                getSeen();


            /*
             * İlk kurulumda geçmiş başarımlar
             * animasyonla gösterilmez.
             */

            if (!seen.length) {

                saveSeen(
                    unlocked.map(
                        item => item.id
                    )
                );

                return;
            }


            const newAchievements =
                getNewAchievements(
                    unlocked
                );


            saveSeen(
                unlocked.map(
                    item => item.id
                )
            );


            for (
                const achievement
                of newAchievements
            ) {

                await showUnlock(
                    achievement
                );
            }

        } catch (error) {

            console.error(
                "Achievements:",
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
            start,
            { once: true }
        );

    } else {

        start();

    }

})();
