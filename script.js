const SUPABASE_URL = "https://wzlcpnvymfdhqbamumwp.supabase.co";
const SUPABASE_KEY = "sb_publishable_HpAzGQC7K5N_xvP2QKEUaA_4rCHI6zX";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

async function testoSupabase() {
    const { data, error } = await supabaseClient
        .from("availability")
        .select("*")
        .limit(1);

    if (error) {
        console.log("Gabim:", error);
    } else {
        console.log("Supabase u lidh me sukses!", data);
    }
}

testoSupabase();
