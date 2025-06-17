<script>
    import { onMount } from "svelte";
    import { env } from "$env/dynamic/public";
    import { OFFER_SUBJECT, OFFER_EMAIL } from "$lib/strings";

    let requestsTable;

    let isVoting = false;
    let userVotesMap = {};
    let voteCounts;

    //export let loggedIn;
    export let isPartner;
    export let catData;

    // Sort descending
    $: sorted = [...catData].sort((a, b) => b.percentage - a.percentage);

    // Slice top 5
    $: topFive = sorted.slice(0, 5);

    // Combine the rest into "Others"
    $: othersTotal = sorted
        .slice(5)
        .reduce((sum, item) => sum + item.percentage, 0);
    $: displayData = [
        ...topFive,
        ...(othersTotal > 0
            ? [
                  {
                      category: "Others",
                      percentage: parseFloat(othersTotal.toFixed(2)),
                  },
              ]
            : []),
    ];

    // Color palette
    const colors = [
        "#E82C0C",
        "#FF530D",
        "#FF9900",
        "#E8C700",
        "#AEE815",
        "#ddd", // last color = "Others"
    ];

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

    /*async function getVotes() {
        const getVotes = await fetch("/api/votes/get", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({}), // You can send empty or minimal payload
        });

        const { voteCounts: serverVoteCounts, userVotes: serverUserVotes } =
            await getVotes.json();

        voteCounts = serverVoteCounts || {};
        userVotesMap = serverUserVotes || {};
    }*/

    async function initRequestsTable() {
        if (globalThis.$.fn.dataTable.isDataTable(requestsTable)) {
            globalThis.$(requestsTable).DataTable().clear().destroy();
        }

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
                //{ data: "title", title: "Item" },
                {
                    data: "title",
                    title: "Item",
                    className: "dt-left",
                    render: function (data, type, row, meta) {
                        return data;
                    },
                },
                { data: "id", title: "ID" },
                { data: "contact_clean", title: "VWO" },
                /*{
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
                },*/

                { data: "description", title: "Description" },
                {
                    data: "id",
                    title: "Actions",
                    className: "dt-left",
                    render: function (data, type, row, meta) {
                        if (isPartner) {
                            return `<i class="demo-icon icon-mail">&#xe804;</i><a href="mailto:?subject=${OFFER_SUBJECT} ${row.title}&body=${OFFER_EMAIL}%0D%0A%0D%0A${row.title}%0D%0A${row.description}%0D%0A%0D%0ARef: ${row.id}%0D%0A%0D%0A" class="pr-2 has-text-weight-normal is-underlined has-text-black">Offer</a><i class="demo-icon icon-shop">&#xe805;</i><a class="has-text-weight-normal has-text-black" target="_blank" href="${env.PUBLIC_SITE_URL}/ringfence?id=${row.id}">Ringfence</a>`;
                        } else {
                            return "";
                        }
                    },
                },
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

                //await getVotes();
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

<div class="container">
    <h2 class="subtitle is-5 has-text-weight-semibold">📦 Items Requested</h2>
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
                <th class="none">ID</th>
                <th class="none">VWO</th>
                <!--th class="all">Priority</th>-->
                <th class="none">Description</th>
                {#if isPartner}
                    <th class="none">Actions</th>
                {/if}
            </tr>
        </thead>
        <tbody></tbody>
    </table>

    <div class="stacked-bar">
        {#each displayData as item, i}
            <div
                class="segment"
                style="width: {item.percentage}%; background-color: {colors[
                    i % colors.length
                ]}"
                title="{item.category}: {item.percentage}%"
            ></div>
        {/each}
    </div>

    <div class="legend mt-4">
        {#each displayData as item, i}
            <div class="legend-item">
                <div
                    class="legend-color"
                    style="background-color: {colors[i % colors.length]}"
                ></div>
                <span>{item.category} ({item.percentage}%)</span>
            </div>
        {/each}
    </div>
</div>

<style>
    table {
        font-size: 0.95em;
    }

    .stacked-bar {
        display: flex;
        height: 1rem;
        border-radius: 6px;
        overflow: hidden;
        border: 1px solid #ddd;
    }

    .segment {
        height: 100%;
    }

    .legend {
        display: flex;
        flex-wrap: wrap;
        margin-top: 1rem;
        font-size: 0.9rem;
    }

    .legend-item {
        display: flex;
        align-items: center;
        margin-right: 1rem;
        margin-bottom: 0.5rem;
    }

    .legend-color {
        width: 1rem;
        height: 1rem;
        margin-right: 0.5rem;
        border-radius: 2px;
    }
</style>
