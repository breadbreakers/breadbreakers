// src/routes/api/dashboard-stats/+server.js
import { json } from '@sveltejs/kit';

export async function GET({ locals }) {
    const session = await locals.getUser();
    const loggedIn = !!session;
    
    let userName = "";
    let userEmail = null;

    if (loggedIn) {
        const { data: { user }, error } = await locals.supabase.auth.getUser();
        userEmail = user.email;
        userName = userEmail.split("@")[0];
    } else {
        userName = "Partners"
    }

    return json({ userName });
}