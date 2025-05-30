export async function POST({ request, locals }) {
    const body = await request.json();
    const itemId = body.itemId;

    const user = await locals.getUser();
    if (!user) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const supabase = locals.supabase;

    // Check if the user already voted
    const { data: existingVote, error: fetchError } = await supabase
        .from("votes")
        .select("*")
        .eq("user_id", user.id)
        .eq("item_id", itemId)
        .single();

    if (fetchError && fetchError.code !== "PGRST116") {
        // Not "row not found"
        return new Response(JSON.stringify({ error: fetchError.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    let result;

    if (existingVote) {
        // Remove vote
        const { error: deleteError } = await supabase
            .from("votes")
            .delete()
            .eq("user_id", user.id)
            .eq("item_id", itemId);

        if (deleteError) {
            return new Response(JSON.stringify({ error: deleteError.message }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        result = { message: "Vote removed", voted: false };
    } else {
        // Add vote
        const { error: insertError } = await supabase
            .from("votes")
            .insert({ user_id: user.id, item_id: itemId, vote_type: 1 });

        if (insertError) {
            return new Response(JSON.stringify({ error: insertError.message }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        result = { message: "Vote added", voted: true };
    }

    return new Response(JSON.stringify(result), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}
