<script>
    import { onMount } from "svelte";

    let ledgerTable;

    onMount(async () => {
        globalThis.$(ledgerTable).DataTable({
            serverSide: true,
            processing: true,
            lengthChange: false,
            responsive: true,
            order: [[0, "desc"]],
            language: {
                searchPlaceholder: "Search",
            },
            ajax: function (data, callback, settings) {
                fetch(`/api/ledger`, {
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
                {
                    data: "timestamp",
                    title: "Date",
                    className: "dt-left",
                    render: function (data, type, row, meta) {
                        return typeof data === "string"
                            ? data.substring(0, 10)
                            : data;
                    },
                },
                { data: "description", title: "Description" },
                {
                    data: "amount",
                    title: "Amount",
                    className: "dt-right",
                    render: function (data, type, row) {
                        let amount = parseFloat(data);
                        let formatted = "$" + amount.toFixed(2);
                        let colorClass =
                            amount < 0 ? "has-text-danger" : "has-text-success";
                        return `<span class="${colorClass}">${formatted}</span>`;
                    },
                },
                {
                    data: "id",
                    title: "ID",
                    render: function (data) {
                        return data != null ? data : "NA";
                    },
                },
                {
                    data: "contact",
                    title: "VWO",
                    render: function (data) {
                        return data != null ? data : "NA";
                    },
                },
            ],
            initComplete: function (settings, json) {
                if (json && json.error) {
                    alert("Error: " + json.error);
                }
            },
        });
    });
</script>

<section class="section">
    <div class="container">
        <h2 class="subtitle has-text-weight-semibold">💰 Live Ledger</h2>
        <table
            bind:this={ledgerTable}
            id="ledgerTable"
            class="compact row-border responsive"
        >
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Amount</th>
                    <th class="none">ID</th>
                    <th class="none">VWO</th>
                </tr>
            </thead>
            <tbody> </tbody>
        </table>
    </div>
</section>

<style>
    table {
        font-size: 0.95em;
    }
</style>
