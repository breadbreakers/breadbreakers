<script>
    import { onMount } from "svelte";
    import { env } from "$env/dynamic/public";

    let requestsTable;

    export let isPartner;
    export let catData;

    let isLoading = true;

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
    });

    async function initRequestsTable() {
        isLoading = true;

        if (globalThis.$.fn.dataTable.isDataTable(requestsTable)) {
            globalThis.$(requestsTable).DataTable().clear().destroy();
        }

        const columns = [
            {
                data: "date",
                title: "Date",
                className: "dt-left",
                render: function (data) {
                    return `<span>${data}</span>`;
                },
            },
            {
                data: "title",
                title: "Item",
                className: "dt-left",
                render: function (data) {
                    return data;
                },
            },
            { data: "contact_clean", title: "VWO" },
            {
                data: "description",
                title: "Description",
                className: "tablet-l tablet-p desktop",
            },
            { data: "id", title: "ID" },
        ];

        if (isPartner) {
            columns.push({
                data: "id",
                title: "Actions",
                className: "dt-left",
                render: function (data, type, row) {
                    return `
                <i class="demo-icon icon-mail">&#xe804;</i>
                <a target="_blank" rel="noopener" href="/offer?id=${row.id}" class="link">Offer</a>
                <i class="demo-icon icon-shop">&#xe805;</i>
                <a class="link" rel="noopener" target="_blank" href="${env.PUBLIC_SITE_URL}/ringfence?id=${row.id}">Ringfence</a>
            `;
                },
            });
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
            initComplete: function (settings, json) {
                isLoading = false;
            },
            columnDefs: [
                {
                    targets: 0, // date column
                    createdCell: function (td) {
                        globalThis.$(td).css("white-space", "nowrap");

                        const $span = globalThis.$(td).find("span");
                        $span.css("color", "#8a5a44");
                        $span.css("border-bottom", "#b87333 0.05em solid");
                    },
                },
            ],
            columns,
        });
    }
</script>

<div class="container">
    <h2 class="subtitle is-5 has-text-weight-semibold">📦 Items In Need</h2>
    <table
        bind:this={requestsTable}
        id="requestsTable"
        style="width:100%"
        class="row-border responsive"
        style:visibility={isLoading ? "hidden" : "visible"}
    >
        <thead>
            <tr>
                <th>Date</th>
                <th>Item</th>
                <th class="none">VWO</th>
                <th>Description</th>
                <th class="none">ID</th>
                {#if isPartner}
                    <th class="none">Actions</th>
                {/if}
            </tr>
        </thead>
        <tbody></tbody>
    </table>

    <div class="stacked-bar">
        {#each displayData as item, i (item.category)}
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
        {#each displayData as item, i (item.category)}
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
