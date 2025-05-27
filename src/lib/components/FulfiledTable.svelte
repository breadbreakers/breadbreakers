<script>
    import { onMount } from "svelte";
    
    let latestTable;

    onMount(async () => {
        globalThis.$(latestTable).DataTable({
            serverSide: true,
            processing: true,
            order: [[0, "desc"]],
            ajax: function (data, callback, settings) {
                fetch(`/api/latest`, {
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
                { data: "fulfiled", title: "Date", className: "dt-left" },
                { data: "item", title: "Item" },
                { data: "Verified By", title: "VWO" },
                { data: "POC", title: "Point of Contact" },
                { data: "id", title: "Reference" },
            ],
        });
    })
</script>

<section class="section">
    <div class="container">
        <h2 class="subtitle has-text-weight-semibold">Fulfiled</h2>
        <table
            bind:this={latestTable}
            id="latestTable"
            class="compact row-border responsive"
        >
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Item</th>
                    <th>VWO</th>
                    <th>Point of Contact</th>
                    <th>Reference</th>
                </tr>
            </thead>
            <tbody> </tbody>
        </table>
    </div>
</section>