export async function load({ locals, url }) {

    const session = await locals.getUser();

    const loggedIn = session ? true : false;
    return {
        loggedIn
    };
}