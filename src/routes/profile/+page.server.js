export async function load({ locals, url }) {

    const session = await locals.getUser();

    const { data: { user }, error: userError } = await locals.supabase.auth.getUser();

    const loggedIn = session ? true : false;

    let isPartner = false;

    // check if is partner
    if (loggedIn) {
        const { data: { user }, error: userError } = await locals.supabase.auth.getUser();

        const { data: partner, error: partnerError } = await locals.supabase
            .from('partners')
            .select('email')
            .eq('email', user.email)
            .single();

        if (partner) {
            isPartner = true
        }        
    }
    
    return {
        loggedIn, user, isPartner
    };
}