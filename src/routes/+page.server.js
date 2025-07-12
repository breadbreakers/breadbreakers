export async function load({ locals, setHeaders }) {
    const session = await locals.getUser();
    const loggedIn = !!session;
    
    // Return minimal data to render UI immediately
    return {
        beneficiaryCount: null,
        nInNeed: null,
        balanceN: null,
        ringfenceN: null,
        nWip: null,
        loggedIn,
        isPartner: false,
        catData: [],
        userName: null,
        householdsWaiting: null,
        householdsPaired: null,
        isLoading: true // Flag to indicate data is loading
    };
}