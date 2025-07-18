export async function load({ locals }) {

    const session = await locals.getUser();

    const { data: { user } } = await locals.supabase.auth.getUser();

    const loggedIn = session ? true : false;

    let isPartner = false;
    let isApprover = false;

    // check if is partner
    if (loggedIn) {
        const { data: { user } } = await locals.supabase.auth.getUser();

        const { data: partner } = await locals.supabase
            .from('partners')
            .select('email')
            .eq('email', user.email)
            .single();

        if (partner) {
            isPartner = true
        }

        const { data: approver } = await locals.supabase
            .from('approvers')
            .select('email')
            .eq('email', user.email)
            .single();

        if (approver) {
            isApprover = true
        }
    }
    
    return {
        loggedIn, user, isPartner, isApprover
    };
}