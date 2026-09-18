// ========================================
// PASSWORD
// ========================================

const PASSWORD = "StelinaDheMolla";

const loginPage = document.getElementById("loginPage");
const adminPage = document.getElementById("adminPage");

const passwordInput = document.getElementById("password");
const loginButton = document.getElementById("loginButton");
const errorMessage = document.getElementById("errorMessage");


// ========================================
// LOGIN
// ========================================

function login() {

    const password = passwordInput.value;

    if (password === PASSWORD) {

        loginPage.style.display = "none";
        adminPage.style.display = "block";

        errorMessage.style.display = "none";

    } else {

        errorMessage.style.display = "block";

        passwordInput.value = "";
        passwordInput.focus();

    }

}


// Klik "Hyr"

loginButton.addEventListener("click", login);


// Mund të shtypë edhe Enter

passwordInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {

        login();

    }

});


// ========================================
// SUPABASE
// ========================================

const SUPABASE_URL = "https://wzlcpnvymfdhqbamumwp.supabase.co";
const SUPABASE_KEY = "sb_publishable_HpAzGQC7K5N_xvP2QKEUaA_4rCHI6zX";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


// ========================================
// ELEMENTET
// ========================================

const dateInput = document.getElementById("date");
const timeButtons = document.querySelectorAll(".time");
const saveButton = document.getElementById("saveButton");


// ========================================
// DATA E SOTME
// ========================================

const today = new Date();

const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, "0");
const day = String(today.getDate()).padStart(2, "0");

dateInput.value = `${year}-${month}-${day}`;


// ========================================
// KLIKIMI I ORAREVE
// ========================================

timeButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        button.classList.toggle("active");

    });

});


// ========================================
// RUAJ ORARIN
// ========================================

saveButton.addEventListener("click", async function() {

    const date = dateInput.value;

    if (!date) {

        alert("Zgjidh një datë.");

        return;

    }


    const activeTimes = [];


    timeButtons.forEach(function(button) {

        if (button.classList.contains("active")) {

            activeTimes.push(button.dataset.time);

        }

    });


    // FSHIJ ORARET E VJETRA

    const { error: deleteError } = await supabaseClient
        .from("availability")
        .delete()
        .eq("date", date);


    if (deleteError) {

        console.error(deleteError);

        alert("Pati një problem gjatë ruajtjes.");

        return;

    }


    // NUK KA ORARE

    if (activeTimes.length === 0) {

        alert("Orari u ruajt. Nuk ka orare të lira për këtë datë.");

        return;

    }


    // KRIJO ORARET

    const data = activeTimes.map(function(time) {

        return {

            date: date,
            time: time,
            available: true

        };

    });


    // RUAJ

    const { error: insertError } = await supabaseClient
        .from("availability")
        .insert(data);


    if (insertError) {

        console.error(insertError);

        alert("Pati një problem gjatë ruajtjes.");

        return;

    }


    alert("Orari u ruajt me sukses! 🤎");

});
