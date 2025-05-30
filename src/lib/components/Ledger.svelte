<script>
    import { onMount } from "svelte";

    let ledgerTable;

    onMount(async () => {
        globalThis.$(ledgerTable).DataTable({
            serverSide: true,
            processing: true,
            order: [[0, "desc"]],
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
            columns: [
                { data: "timestamp", title: "Date", className: "dt-left" },
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
                </tr>
            </thead>
            <tbody> </tbody>
        </table>
    </div>
</section>

<style>
    table {
        font-size: 0.85em;
    }
</style>
