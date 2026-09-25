
const SUPABASE_URL =
    "https://wzlcpnvymfdhqbamumwp.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_HpAzGQC7K5N_xvP2QKEUaA_4rCHI6zX";

const supabaseClient = window.supabase
    ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY)
    : null;

alert("SCRIPT PO PUNON");

// =========================
// NUMRI WHATSAPP
// =========================

const WHATSAPP_NUMBER = "355699128681";


// =========================
// ELEMENTET
// =========================

const openCalendarButton =
    document.getElementById("openCalendar");

const calendarContainer =
    document.getElementById("calendarContainer");

const calendarDays =
    document.getElementById("calendarDays");

const calendarMonth =
    document.getElementById("calendarMonth");

const prevMonth =
    document.getElementById("prevMonth");

const nextMonth =
    document.getElementById("nextMonth");

const timesContainer =
    document.getElementById("timesContainer");

const timesGrid =
    document.getElementById("timesGrid");

const selectedDateTitle =
    document.getElementById("selectedDateTitle");

const bookingForm =
    document.getElementById("bookingForm");

const bookingMessage =
    document.getElementById("bookingMessage");

const contactOptions =
    document.getElementById("contactOptions");

const whatsappButton =
    document.getElementById("whatsappButton");


// =========================
// ORARET E PUNËS
// =========================

const workingTimes = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00"
];


// =========================
// DATA
// =========================

let currentDate = new Date();

let selectedDate = null;

let selectedTime = null;

let busyTimes = [];


// =========================
// HAP KALENDARIN
// =========================

openCalendarButton.addEventListener("click", function () {

    calendarContainer.style.display = "block";

    openCalendarButton.style.display = "none";

    shfaqKalendarin();
});


// =========================
// NDRYSHO MUAJIN
// =========================

prevMonth.addEventListener("click", function () {

    currentDate.setMonth(
        currentDate.getMonth() - 1
    );

    shfaqKalendarin();
});


nextMonth.addEventListener("click", function () {

    currentDate.setMonth(
        currentDate.getMonth() + 1
    );

    shfaqKalendarin();
});


// =========================
// EMRI I MUAJIT
// =========================

function emriMuajit(month) {

    const months = [
        "Janar",
        "Shkurt",
        "Mars",
        "Prill",
        "Maj",
        "Qershor",
        "Korrik",
        "Gusht",
        "Shtator",
        "Tetor",
        "Nëntor",
        "Dhjetor"
    ];

    return months[month];
}


// =========================
// SHFAQ KALENDARIN
// =========================

async function shfaqKalendarin() {

    calendarDays.innerHTML = "";

    calendarMonth.textContent =
        `${emriMuajit(currentDate.getMonth())} ${currentDate.getFullYear()}`;


    const year =
        currentDate.getFullYear();

    const month =
        currentDate.getMonth();


    const firstDay =
        new Date(year, month, 1);

    let firstDayIndex =
        firstDay.getDay();


    if (firstDayIndex === 0) {

        firstDayIndex = 6;

    } else {

        firstDayIndex =
            firstDayIndex - 1;
    }


    const daysInMonth =
        new Date(
            year,
            month + 1,
            0
        ).getDate();


    const firstDate =
        `${year}-${String(month + 1).padStart(2, "0")}-01`;

    const lastDate =
        `${year}-${String(month + 1).padStart(2, "0")}-${String(daysInMonth).padStart(2, "0")}`;


    // MERR ORARET NGA SUPABASE

    const { data, error } =
        await supabaseClient
            .from("availability")
            .select("date, time, available")
            .gte("date", firstDate)
            .lte("date", lastDate);


    if (error) {

        console.error("Gabim:", error);

        calendarDays.innerHTML =
            "<p>Gabim gjatë ngarkimit të kalendarit.</p>";

        return;
    }


    // DITËT BOSHE

    for (
        let i = 0;
        i < firstDayIndex;
        i++
    ) {

        const emptyDay =
            document.createElement("div");

        emptyDay.className =
            "calendar-day empty";

        calendarDays.appendChild(
            emptyDay
        );
    }


    // DITËT E MUAJIT

    for (
        let day = 1;
        day <= daysInMonth;
        day++
    ) {

        const dayElement =
            document.createElement("div");

        dayElement.className =
            "calendar-day";


        const dateString =
            `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;


        const dayNumber =
            document.createElement("div");

        dayNumber.className =
            "day-number";

        dayNumber.textContent =
            day;


        dayElement.appendChild(
            dayNumber
        );


        // SHFAQ SOT

        const today =
            new Date();


        if (
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        ) {

            dayElement.classList.add(
                "today"
            );
        }


        // KUR KLIKOJMË DATËN

        dayElement.addEventListener(
            "click",
            function () {

                zgjidhDaten(
                    dateString,
                    dayElement
                );
            }
        );


        calendarDays.appendChild(
            dayElement
        );
    }
}


// =========================
// ZGJIDH DATËN
// =========================

async function zgjidhDaten(
    dateString,
    element
) {

    selectedDate =
        dateString;

    selectedTime =
        null;


    bookingForm.style.display =
        "none";

    bookingMessage.textContent =
        "";

    contactOptions.style.display =
        "none";


    // HIQ DATËN E VJETËR

    document
        .querySelectorAll(".calendar-day")
        .forEach(function (day) {

            day.classList.remove(
                "selected"
            );
        });


    // ZGJIDH DATËN E RE

    element.classList.add(
        "selected"
    );


    // MERR ORARET E ZËNA

    const { data, error } =
        await supabaseClient
            .from("availability")
            .select("time, available")
            .eq("date", selectedDate);


    if (error) {

        console.error(
            "Gabim:",
            error
        );

        alert(
            "Nuk u arrit të ngarkohej orari."
        );

        return;
    }


    busyTimes =
        data
            .filter(function (item) {

                return item.available === false;

            })
            .map(function (item) {

                return item.time.slice(
                    0,
                    5
                );

            });


    shfaqOret();
}


// =========================
// SHFAQ ORARET
// =========================

function shfaqOret() {

    timesContainer.style.display =
        "block";

    timesGrid.innerHTML =
        "";

    bookingForm.style.display =
        "none";


    const parts =
        selectedDate.split("-");


    const year =
        parts[0];

    const month =
        parts[1];

    const day =
        parts[2];


    selectedDateTitle.textContent =
        `Orari për ${day}/${month}/${year}`;


    workingTimes.forEach(
        function (time) {

            const timeButton =
                document.createElement(
                    "button"
                );


            timeButton.type =
                "button";


            timeButton.className =
                "time-slot";


            timeButton.textContent =
                time;


            // ORARI I ZËNË

            if (
                busyTimes.includes(time)
            ) {

                timeButton.classList.add(
                    "busy"
                );

                timeButton.disabled =
                    true;

            } else {

                // ORARI I LIRË

                timeButton.addEventListener(
                    "click",
                    function () {

                        zgjidhOrarin(
                            time,
                            timeButton
                        );
                    }
                );
            }


            timesGrid.appendChild(
                timeButton
            );
        }
    );
}


// =========================
// ZGJIDH ORARIN
// =========================

function zgjidhOrarin(
    time,
    button
) {

    selectedTime =
        time;


    document
        .querySelectorAll(".time-slot")
        .forEach(function (slot) {

            slot.classList.remove(
                "selected"
            );
        });


    button.classList.add(
        "selected"
    );


    bookingForm.style.display =
        "block";

    contactOptions.style.display =
        "none";


    bookingForm.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}


// =========================
// DËRGO KËRKESËN
// =========================

bookingForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        // KONTROLLO DATËN DHE ORARIN

        if (
            !selectedDate ||
            !selectedTime
        ) {

            alert(
                "Zgjidh një datë dhe një orar!"
            );

            return;
        }


        // MERR TË DHËNAT

        const firstName =
            document
                .getElementById("firstName")
                .value
                .trim();


        const surname =
            document
                .getElementById("surname")
                .value
                .trim();


        const phone =
            document
                .getElementById("phone")
                .value
                .trim();


        const instagram =
            document
                .getElementById("instagram")
                .value
                .trim();


        // KONTROLLO FUSHAT

        if (
            !firstName ||
            !surname ||
            !phone ||
            !instagram
        ) {

            alert(
                "Plotëso të gjitha fushat!"
            );

            return;
        }


        bookingMessage.textContent =
            "Po dërgohet kërkesa...";


        // RUAJ KËRKESËN NË SUPABASE

        const { error } =
            await supabaseClient
                .from("reservations")
                .insert({

                    name:
                        firstName,

                    surname:
                        surname,

                    phone:
                        phone,

                    instagram:
                        instagram,

                    service:
                        "Nail appointment",

                    date:
                        selectedDate,

                    time:
                        selectedTime,

                    note:
                        "",

                    status:
                        "pending"
                });


        // NËSE KA GABIM

        if (error) {

            console.error(
                "Gabim:",
                error
            );

            bookingMessage.textContent =
                "Diçka shkoi keq. Provo përsëri.";

            return;
        }


        // SUKSES

        bookingMessage.textContent =
            "Kërkesa u dërgua me sukses! 🤎";


        // =========================
        // WHATSAPP
        // =========================

        const whatsappMessage =
            `Përshëndetje! Sapo dërgova një kërkesë për takim. 🤎\n\n` +
            `Emër: ${firstName} ${surname}\n` +
            `Data: ${selectedDate}\n` +
            `Ora: ${selectedTime}\n` +
            `Instagram: ${instagram}`;


        const whatsappURL =
            `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                whatsappMessage
            )}`;


        whatsappButton.href =
            whatsappURL;


        // SHFAQ BUTONAT

        contactOptions.style.display =
            "block";


        // PASTRO FORMËN

        bookingForm.reset();
    }
);
```
