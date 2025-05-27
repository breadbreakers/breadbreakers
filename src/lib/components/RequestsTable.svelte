<script>
    import { onMount } from "svelte";
    import { session } from "$lib/stores";
    import { supabase } from "$lib/supabase";
    
    let requestsTable;

    let isVoting = false;
    let voteCounts = {};
    let userVotesMap = {};
    let userVotes = {};

    onMount(async () => {
        initRequestsTable();

         document.addEventListener("click", (e) => {
            if (
                e.target.closest(".vote-button") &&
                !e.target.closest(".vote-button:disabled")
            ) {
                const button = e.target.closest(".vote-button");
                const requestId = button.dataset.id;
                handleVote(requestId);
            }
        });
    })

    async function getVotes() {
        const { data: votesData, error: votesError } = await supabase
            .from("votes")
            .select("item_id, user_id");
        voteCounts = {};
        if (!votesError && votesData) {
            for (const v of votesData) {
                voteCounts[v.item_id] = (voteCounts[v.item_id] || 0) + 1;
            }
        }

        userVotesMap = {};
        if ($session?.user) {
            const { data: userVotesData, error: userVotesError } =
                await supabase
                    .from("votes")
                    .select("item_id")
                    .eq("user_id", $session.user.id);
            if (!userVotesError && userVotesData) {
                for (const v of userVotesData) {
                    userVotesMap[v.item_id] = true;
                }
            }
        }
        userVotes = userVotesMap;
    }

    async function initRequestsTable() {
        console.log("#")
        await getVotes();

        globalThis.$(requestsTable).DataTable({
            serverSide: true,
            processing: true,
            responsive: true,
            order: [[0, "desc"]],
            createdRow: function (row, data, dataIndex, cells) {
                if (data.id) {
                    globalThis.$(row).attr("id", "row-" + data.id);
                }
            },
            ajax: function (data, callback, settings) {
                fetch("/api/requests", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                })
                    .then((response) => response.json())
                    .then((result) => {
                        callback({
                            draw: data.draw,
                            recordsTotal: result.recordsTotal,
                            recordsFiltered: result.recordsFiltered,
                            data: result.data,
                        });
                    });
            },
            columns: [
                { data: "date", title: "Date", className: "dt-left" },
                { data: "title", title: "Item" },
                { data: "contact_clean", title: "VWO" },
                {
                    data: "votes",
                    title: "Vote",
                    orderable: true,

                    render: function (data, type, row) {
                        const hasVoted = !!userVotesMap[row.id];
                        const isDisabled = !$session || isVoting;

                        return `
                    <button 
                        class="button vote-button" 
                        data-id="${row.id}" 
                        style="border:0; box-shadow: none;" 
                        ${isDisabled ? "disabled" : ""}
                    >
                        ${
                            $session
                                ? hasVoted
                                    ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="gold" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L14.94 8.63L22 9.24L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.24L9.06 8.63L12 2Z"/></svg>'
                                    : '<svg width="24" height="24" viewBox="0 0 24 24" fill="#ddd" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L14.94 8.63L22 9.24L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.24L9.06 8.63L12 2Z"/></svg>'
                                : ""
                        }
                        ${row.votes}
                    </button>
                `;
                    },
                },
                { data: "description", title: "Description" },
            ],
        });
    }

    async function handleVote(itemId) {
        isVoting = true; // signal voting started

        try {
            const hasVoted = userVotes[itemId];
            if (hasVoted) {
                const { error: delError, data: delData } = await supabase
                    .from("votes")
                    .delete()
                    .eq("user_id", $session.user.id)
                    .eq("item_id", itemId);
                await getVotes();
                const table = globalThis.$(requestsTable).DataTable();
                table.ajax.reload(null, false);
                console.log("Deleted vote for", itemId, "data:", delData);
            } else {
                const { error: insertError } = await supabase
                    .from("votes")
                    .insert({
                        user_id: $session.user.id,
                        item_id: itemId,
                        vote_type: 1,
                    });
                await getVotes();
                const table = globalThis.$(requestsTable).DataTable();
                table.ajax.reload(null, false);
                console.log("Inserted vote for", itemId);
            }
        } finally {
            isVoting = false; // signal voting finished regardless of success or failure
        }
    }
</script>

<section class="section">
    <div class="container">
        <h2 class="subtitle has-text-weight-semibold">Requests</h2>
        <table
            bind:this={requestsTable}
            id="requestsTable"
            style="width:100%"
            class="  compact row-border responsive"
        >
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Item</th>
                    <th>VWO</th>
                    <th>Vote</th>
                    <th class="none">Description</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    </div>
</section>