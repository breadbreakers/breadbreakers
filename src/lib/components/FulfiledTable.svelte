<script>
    import { onMount } from "svelte";

    let latestTable;

    onMount(async () => {
        globalThis.$(latestTable).DataTable({
            serverSide: true,
            processing: true,
            lengthChange: false,
            responsive: true,
            order: [[0, "desc"]],
            language: {
                searchPlaceholder: "Search",
            },
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
            columns: [
                {
                    data: "fulfiled",
                    title: "Date",
                    className: "dt-left",
                    render: function (data, type, row, meta) {
                        const d =
                            typeof data === "string"
                                ? data.substring(0, 10)
                                : data;
                        return (
                            '<span class="has-text-weight-normal">' +
                            d +
                            "</span>"
                        );
                    },
                },                
                {
                    data: "item",
                    title: "Item",
                    render: function (data, type, row, meta) {
                        return data;
                    },
                },
                {
                    data: "id",
                    title: "ID",
                    className: "dt-right",
                    render: function (data, type, row, meta) {
                        return data;
                    },
                },
                { data: "contact", title: "VWO" },
                {
                    data: "id",
                    title: "Reference",
                    render: function (data, type, row, meta) {
                        return (                            
                            '<i class="demo-icon icon-attach">&#xe801;</i>' +
                            '<a class="has-text-weight-normal is-underlined has-text-black" target="_blank" href="' +
                            row.delivery +
                            '">Proof of Delivery</a>' +
                            (row.receipt !== null
                                ? '<i class="demo-icon icon-attach">&#xe801;</i><a class="has-text-weight-normal is-underlined has-text-black" target="_blank" href="' +
                                  row.receipt +
                                  '">Receipt</a>'
                                : " (Donated)")
                        );
                    },
                }                
            ],
        });
    });
</script>

<div class="container">
    <h2 class="subtitle is-5 has-text-weight-semibold">🎁 Items Fulfiled</h2>
    <table
        bind:this={latestTable}
        id="latestTable"
        class="row-border responsive"
    >
        <thead>
            <tr>
                <th>Date</th>                
                <th>Item</th>
                <th>ID</th>
                <th class="none">VWO</th>
                <th class="none">Reference</th>
            </tr>
        </thead>
        <tbody> </tbody>
    </table>
</div>
