<script>
    import { onMount } from "svelte";

    let requestsTable;

    let isVoting = false;
    let userVotesMap = {};
    let voteCounts;

    export let loggedIn;

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
    });

    async function getVotes() {
        const getVotes = await fetch("/api/votes/get", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({}), // You can send empty or minimal payload
        });

        const { voteCounts: serverVoteCounts, userVotes: serverUserVotes } =
            await getVotes.json();

        voteCounts = serverVoteCounts || {};
        userVotesMap = serverUserVotes || {};
    }

    async function initRequestsTable() {
        globalThis.$(requestsTable).DataTable({
            serverSide: true,
            processing: true,
            responsive: true,
            lengthChange: false,
            language: {
                searchPlaceholder: "Search",
            },
            order: [[0, "desc"]],
            createdRow: function (row, data, dataIndex, cells) {
                if (data.id) {
                    globalThis.$(row).attr("id", "row-" + data.id);
                }
            },
            ajax: async function (data, callback, settings) {
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
            columnDefs: [
                {
                    targets: 0, // date column
                    createdCell: function (td) {
                        globalThis.$(td).css("white-space", "nowrap");
                    },
                },
            ],
            columns: [
                { data: "date", title: "Date", className: "dt-left" },
                { data: "title", title: "Item" },
                { data: "contact_clean", title: "VWO" },
                {
                    data: "votes",
                    title: "Priority",
                    orderable: true,

                    render: function (data, type, row) {
                        const hasVoted = !!userVotesMap[row.id];
                        const isDisabled = !loggedIn || isVoting;

                        return `
                            <button 
                                class="button vote-button" 
                                data-id="${row.id}" 
                                style="border:0; box-shadow: none; padding: 0; font-size: 0.85em;" 
                                ${isDisabled ? "disabled" : ""}
                            >
                                <span style="padding-right: 0.25em;">${row.votes}</span>
                                ${
                                    loggedIn
                                        ? hasVoted
                                            ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="gold" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L14.94 8.63L22 9.24L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.24L9.06 8.63L12 2Z"/></svg>'
                                            : '<svg width="24" height="24" viewBox="0 0 24 24" fill="#ddd" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L14.94 8.63L22 9.24L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.24L9.06 8.63L12 2Z"/></svg>'
                                        : ""
                                }
                                
                            </button>
                        `;
                    },
                },
                { data: "id", title: "ID" },
                { data: "description", title: "Description" },
            ],
        });
    }

    async function handleVote(itemId) {
        if (!isVoting) {
            try {
                isVoting = true;
                const response = await fetch("/api/votes/handle", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ itemId }),
                });

                const result = await response.json();

                if (!response.ok) {
                    console.error("Vote failed:", result.error);
                    return;
                }

                await getVotes();
                const table = globalThis.$(requestsTable).DataTable();
                table.ajax.reload(null, false);
            } catch (e) {
                console.error("Request error:", e);
            } finally {
                isVoting = false;
            }
        }
    }
</script>

<section class="section">
    <div class="container">
        <h2 class="subtitle is-6 has-text-weight-semibold">
            📦 Items Requested
        </h2>
        <table
            bind:this={requestsTable}
            id="requestsTable"
            style="width:100%"
            class="compact row-border responsive"
        >
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Item</th>
                    <th>VWO</th>
                    <th class="all">Priority</th>
                    <th class="none">ID</th>
                    <th class="none">Description</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    </div>
</section>

<style>
    table {
        font-size: 0.95em;
    }
</style>
