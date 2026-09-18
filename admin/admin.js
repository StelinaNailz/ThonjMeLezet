const PASSWORD = "StelinaDheMolla";


// LOGIN
const loginPage = document.getElementById("loginPage");
const adminPage = document.getElementById("adminPage");

const passwordInput = document.getElementById("password");
const loginButton = document.getElementById("loginButton");
const errorMessage = document.getElementById("errorMessage");

loginButton.addEventListener("click", function () {

    if (passwordInput.value === PASSWORD) {

        loginPage.style.display = "none";
        adminPage.style.display = "block";

    } else {

        errorMessage.style.display = "block";

    }

});


// SUPABASE
const SUPABASE_URL = "https://wzlcpnvymfdhqbamumwp.supabase.co";

const SUPABASE_KEY = "sb_publishable_HpAzGQC7K5N_xvP2QKEUa_4rCHI6zX";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


// DATA
const dateInput = document.getElementById("date");

const timeButtons = document.querySelectorAll(".time");

const saveButton = document.getElementById("saveButton");


// DATA E SOTME
const today = new Date();

dateInput.value =
    today.getFullYear() +
    "-" +
    String(today.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(today.getDate()).padStart(2, "0");


// KLIKO ORARIN
timeButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        button.classList.toggle("active");

    });

});


// RUAJ
saveButton.addEventListener("click", async function () {

    const selectedDate = dateInput.value;

    if (!selectedDate) {

        alert("Zgjidh një datë!");

        return;

    }


    const busyTimes = [];


    timeButtons.forEach(function (button) {

        if (button.classList.contains("active")) {

            busyTimes.push(button.dataset.time);

        }

    });


    // FSHI ORARET E VJETRA
    const { error: deleteError } =
        await supabaseClient
            .from("availability")
            .delete()
            .eq("date", selectedDate);


    if (deleteError) {

        console.log(deleteError);

        alert("Gabim gjatë fshirjes!");

        return;

    }


    // RUAJ ORARET E ZËNA
    if (busyTimes.length > 0) {

        const rows = busyTimes.map(function (time) {

            return {
                date: selectedDate,
                time: time,
                available: false
            };

        });


        const { error: insertError } =
            await supabaseClient
                .from("availability")
                .insert(rows);


        if (insertError) {

            console.log(insertError);

            alert("Gabim gjatë ruajtjes!");

            return;

        }

    }


    alert("Orari u ruajt me sukses! 🤎");

});
