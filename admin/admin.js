const PASSWORD = "StelinaDheMolla";

const loginPage = document.getElementById("loginPage");
const adminPage = document.getElementById("adminPage");
const passwordInput = document.getElementById("password");
const loginButton = document.getElementById("loginButton");
const errorMessage = document.getElementById("errorMessage");


// =========================
// LOGIN
// =========================

function login() {
    const password = passwordInput.value;

    if (password === PASSWORD) {
        loginPage.style.display = "none";
        adminPage.style.display = "block";
    } else {
        errorMessage.style.display = "block";
        passwordInput.value = "";
        passwordInput.focus();
    }
}

loginButton.addEventListener("click", login);

passwordInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        login();
    }
});


// =========================
// SUPABASE
// =========================

const SUPABASE_URL = "https://wzlcpnvymfdhqbamumwp.supabase.co";
const SUPABASE_KEY = "sb_publishable_HpAzGQC7K5N_xvP2QKEUaA_4rCHI6zX";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


// =========================
// ELEMENTET
// =========================

const dateInput = document.getElementById("date");
const timeButtons = document.querySelectorAll(".time-button");
const saveButton = document.getElementById("saveButton");


// =========================
// DATA E SOTME
// =========================

const today = new Date();

const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, "0");
const day = String(today.getDate()).padStart(2, "0");

dateInput.value = `${year}-${month}-${day}`;


// =========================
// ZGJEDHJA E ORAREVE
// =========================

timeButtons.forEach(button => {

    button.addEventListener("click", function() {

        button.classList.toggle("active");

    });

});


// =========================
// RUAJ ORARET E ZËNA
// =========================

saveButton.addEventListener("click", async function() {

    const selectedDate = dateInput.value;

    if (!selectedDate) {
        alert("Zgjidh një datë!");
        return;
    }


    // Marrim vetëm oraret që Stelina ka zgjedhur
    const busyTimes = [];

    timeButtons.forEach(button => {

        if (button.classList.contains("active")) {
            busyTimes.push(button.dataset.time);
        }

    });


    // =========================
    // FSHIJ ORARET E VJETRA
    // =========================

    const { error: deleteError } = await supabaseClient
        .from("availability")
        .delete()
        .eq("date", selectedDate);


    if (deleteError) {

        console.error(deleteError);

        alert("Gabim gjatë fshirjes së orareve të vjetra!");

        return;
    }


    // =========================
    // NËSE NUK KA ORARE TË ZËNA
    // =========================

    if (busyTimes.length === 0) {

        alert("Nuk ka orare të zëna për këtë datë.");

        return;
    }


    // =========================
    // KRIJOJMË ORARET E ZËNA
    // =========================

    const rows = busyTimes.map(time => {

        return {
            date: selectedDate,
            time: time,
            available: false
        };

    });


    // =========================
    // RUAJ NË SUPABASE
    // =========================

    const { error: insertError } = await supabaseClient
        .from("availability")
        .insert(rows);


    if (insertError) {

        console.error(insertError);

        alert("Gabim gjatë ruajtjes!");

        return;
    }


    // =========================
    // SUKSES
    // =========================

    alert("Orari u ruajt me sukses! 🤎");

});
