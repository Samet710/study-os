const statsUrl =
    `data/stats.json?cache=${Date.now()}`;


function formatNumber(value) {

    return new Intl.NumberFormat(
        "tr-TR"
    ).format(value);

}


function getRepositoryUrl() {

    const hostname =
        window.location.hostname;

    const username =
        hostname.split(".")[0];

    const repository =
        window.location.pathname
            .split("/")
            .filter(Boolean)[0];

    return `https://github.com/${username}/${repository}`;

}


function setupAddSessionButton() {

    const button =
        document.getElementById(
            "addSession"
        );

    button.href =
        `${getRepositoryUrl()}/issues/new?template=study-session.yml`;

}


function cleanOptionalValue(value) {

    if (
        value === null ||
        value === undefined ||
        value === "" ||
        value === "null" ||
        value === "undefined"
    ) {

        return "";

    }

    return String(value).trim();

}


function renderStats(data) {

    const totals =
        data.totals;

    const today =
        data.today_stats;

    document.getElementById(
        "xp"
    ).textContent =
        formatNumber(totals.xp);


    document.getElementById(
        "level"
    ).textContent =
        totals.level;


    document.getElementById(
        "questions"
    ).textContent =
        formatNumber(
            totals.questions
        );


    document.getElementById(
        "streak"
    ).textContent =
        `${data.streak} 🔥`;


    const goal =
        data.daily_goal || 50;


    const questions =
        today.questions || 0;


    const percentage =
        Math.min(
            100,
            Math.round(
                questions / goal * 100
            )
        );


    document.getElementById(
        "todayPercentage"
    ).textContent =
        `${percentage}%`;


    document.getElementById(
        "todayProgress"
    ).style.width =
        `${percentage}%`;


    document.getElementById(
        "todayQuestions"
    ).textContent =
        formatNumber(
            questions
        );


    document.getElementById(
        "dailyGoal"
    ).textContent =
        formatNumber(
            goal
        );


    document.getElementById(
        "todayMinutes"
    ).textContent =
        `${formatNumber(
            today.minutes || 0
        )} dk`;


    renderWeeklyChart(
        data.daily || {}
    );


    renderSubjectChart(
        data.subjects || {}
    );


    renderRecentEvents(
        data.recent_events || []
    );


    renderMessage(data);

}


function renderWeeklyChart(
    dailyData
) {

    const container =
        document.getElementById(
            "weeklyChart"
        );

    container.innerHTML = "";

    const dates =
        Object.keys(
            dailyData
        ).sort();


    const lastSeven =
        dates.slice(-7);


    if (lastSeven.length === 0) {

        container.innerHTML =
            `<div class="empty">
                Henüz çalışma verisi yok.
            </div>`;

        return;
    }


    const values =
        lastSeven.map(
            date =>
                dailyData[date]
                    .questions || 0
        );


    const maximum =
        Math.max(
            ...values,
            1
        );


    lastSeven.forEach(
        (date, index) => {

            const value =
                values[index];


            const column =
                document.createElement(
                    "div"
                );

            column.className =
                "bar-column";


            const valueLabel =
                document.createElement(
                    "div"
                );

            valueLabel.className =
                "bar-value";

            valueLabel.textContent =
                value;


            const bar =
                document.createElement(
                    "div"
                );

            bar.className =
                "bar";


            const height =
                Math.max(
                    5,
                    value / maximum * 120
                );


            bar.style.height =
                `${height}px`;


            const label =
                document.createElement(
                    "div"
                );

            label.className =
                "bar-label";


            const day =
                new Date(
                    `${date}T12:00:00`
                );


            label.textContent =
                day.toLocaleDateString(
                    "tr-TR",
                    {
                        weekday: "short"
                    }
                ).replace(
                    ".",
                    ""
                );


            column.appendChild(
                valueLabel
            );

            column.appendChild(
                bar
            );

            column.appendChild(
                label
            );


            container.appendChild(
                column
            );

        }
    );

}


function renderSubjectChart(
    subjects
) {

    const container =
        document.getElementById(
            "subjectChart"
        );

    container.innerHTML = "";


    const entries =
        Object.entries(
            subjects
        )
        .sort(
            (
                [, a],
                [, b]
            ) =>
                b.questions
                - a.questions
        )
        .slice(0, 6);


    if (entries.length === 0) {

        container.innerHTML =
            `<div class="empty">
                Henüz ders verisi yok.
            </div>`;

        return;
    }


    const max =
        Math.max(
            ...entries.map(
                ([, value]) =>
                    value.questions
            ),
            1
        );


    entries.forEach(
        ([name, value]) => {

            const row =
                document.createElement(
                    "div"
                );

            row.className =
                "subject-row";


            const subjectName =
                document.createElement(
                    "div"
                );

            subjectName.className =
                "subject-name";

            subjectName.textContent =
                name;


            const track =
                document.createElement(
                    "div"
                );

            track.className =
                "subject-track";


            const fill =
                document.createElement(
                    "div"
                );

            fill.className =
                "subject-fill";


            fill.style.width =
                `${
                    Math.max(
                        4,
                        value.questions
                        / max * 100
                    )
                }%`;


            const subjectValue =
                document.createElement(
                    "div"
                );

            subjectValue.className =
                "subject-value";

            subjectValue.textContent =
                value.questions;


            track.appendChild(
                fill
            );


            row.appendChild(
                subjectName
            );

            row.appendChild(
                track
            );

            row.appendChild(
                subjectValue
            );


            container.appendChild(
                row
            );

        }
    );

}


function renderRecentEvents(
    events
) {

    const container =
        document.getElementById(
            "recentEvents"
        );

    container.innerHTML = "";


    if (events.length === 0) {

        container.innerHTML =
            `<div class="empty">
                Henüz çalışma kaydı yok.
            </div>`;

        return;
    }


    events.forEach(
        event => {

            const item =
                document.createElement(
                    "div"
                );

            item.className =
                "event";


            const main =
                document.createElement(
                    "div"
                );

            main.className =
                "event-main";


            const title =
                document.createElement(
                    "strong"
                );

            const subject =
                cleanOptionalValue(
                    event.subject
                );

            const topic =
                cleanOptionalValue(
                    event.topic
                );


            if (topic) {

                title.textContent =
                    `${subject} · ${topic}`;

            } else {

                title.textContent =
                    subject;

            }


            const info =
                document.createElement(
                    "span"
                );


            const questionCount =
                cleanOptionalValue(
                    event.questions
                );

            const minutes =
                cleanOptionalValue(
                    event.minutes
                );


            if (minutes) {

                info.textContent =
                    `${questionCount} soru · ${minutes} dk`;

            } else {

                info.textContent =
                    `${questionCount} soru`;

            }


            main.appendChild(
                title
            );

            main.appendChild(
                info
            );


            const xp =
                document.createElement(
                    "div"
                );

            xp.className =
                "event-xp";

            xp.textContent =
                `+${event.xp} XP`;


            item.appendChild(
                main
            );

            item.appendChild(
                xp
            );


            container.appendChild(
                item
            );

        }
    );

}


function renderMessage(data) {

    const today =
        data.today_stats.questions || 0;


    const accuracy =
        data.totals.accuracy;


    let message;


    if (today === 0) {

        message =
            "Bugünün hikâyesini sen yazacaksın. Bir çalışma kaydıyla başlayabilirsin.";

    } else if (accuracy >= 90) {

        message =
            `Bugünkü performansın güçlü. Genel doğruluk oranın %${accuracy}. Bu ivmeyi koru.`;

    } else if (accuracy >= 75) {

        message =
            `İyi gidiyorsun. Bugün ${today} soru sisteme işlendi. Bir sonraki adımda biraz daha ileri gidebiliriz.`;

    } else {

        message =
            "Bugün kusursuz olmak zorunda değilsin. Önemli olan yeniden başlaman.";

    }


    document.getElementById(
        "message"
    ).textContent =
        message;

}


async function loadStats() {

    try {

        const response =
            await fetch(
                statsUrl
            );


        if (!response.ok) {

            throw new Error(
                "Stats dosyası okunamadı."
            );

        }


        const data =
            await response.json();


        renderStats(data);

    } catch (error) {

        console.error(error);

        document.getElementById(
            "message"
        ).textContent =
            "Study OS verileri henüz yüklenemedi.";

    }

}


setupAddSessionButton();

loadStats();
