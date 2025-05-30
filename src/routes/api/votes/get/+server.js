import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function POST({ locals }) {
    const supabase = locals.supabase;

    // Fetch all votes
    const { data: votesData, error: votesError } = await supabase
        .from("votes")
        .select("item_id, user_id");

    let voteCounts = {};
    if (!votesError && votesData) {
        for (const v of votesData) {
            voteCounts[v.item_id] = (voteCounts[v.item_id] || 0) + 1;
        }
    }

    // Identify current user
    const user = await locals.getUser();

    let userVotesMap = {};
    if (user) {
        const { data: userVotesData, error: userVotesError } = await supabase
            .from("votes")
            .select("item_id")
            .eq("user_id", user.id);

        if (!userVotesError && userVotesData) {
            for (const v of userVotesData) {
                userVotesMap[v.item_id] = true;
            }
        }
    }

    return json({ voteCounts, userVotes: userVotesMap });
}
