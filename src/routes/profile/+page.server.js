export async function load({ locals, url }) {

    const session = await locals.getUser();

    const { data: { user }, error: userError } = await locals.supabase.auth.getUser();

    const loggedIn = session ? true : false;
    
    return {
        loggedIn, user
    };
}