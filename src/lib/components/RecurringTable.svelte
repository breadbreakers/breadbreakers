<script>
	import { onMount } from 'svelte';

	let householdsTable;
	let isLoading = true;

	onMount(async () => {
		isLoading = true;

		globalThis.$(householdsTable).DataTable({
                serverSide: true,
                processing: true,
                lengthChange: false,
                responsive: true,
                order: [[0, "desc"]],
                language: {
                    searchPlaceholder: "Search",
                },
                ajax: function (data, callback, settings) {
                    fetch(`/api/households`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: (() => {
                            return JSON.stringify(data);
                        })(),
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
                columns: [
                    { data: "type", title: "Type", className: "dt-left" },
                    {
                        data: "frequency",
                        title: "Frequency",
                        className: "dt-left",
                    },
                    { data: "period", title: "Period", className: "dt-left" },
                    { data: "region", title: "Region", className: "dt-left" },
                    { data: "id", title: "ID", className: "dt-left" },
                    
                    { data: "remarks", title: "Remarks", className: "dt-left" },
                    {
                        data: "id",
                        title: "Actions",
                        className: "dt-left",
                        render: function (data, type, row, meta) {
                            setTimeout(() => {
                                document
                                    .querySelectorAll(".confirm-button")
                                    .forEach((button) => {
                                        button.addEventListener(
                                            "click",
                                            function (event) {
                                                const id = this.dataset.id;
                                                if (
                                                    confirm(
                                                        "Confirm adoption of this household? We will connect you with the social worker via your logged in email.",
                                                    )
                                                ) {
                                                    window.location.href = `${env.PUBLIC_SITE_URL}/adopt/pair?id=${id}`;
                                                }
                                            },
                                        );
                                    });
                            }, 0);
                            return `<i class="demo-icon icon-shop">&#xe805;</i><button class="pr-2 has-text-weight-normal is-underlined has-text-black confirm-button" data-id="${row.id}">Adopt Household</button>`;
                        },
                    },
                ],
            });
	});
</script>

<table
					bind:this={householdsTable}
					id="householdsTable"
					class="compact row-border responsive"
					style:visibility={isLoading ? 'hidden' : 'visible'}
				>
					<thead>
						<tr>
							<th>Item</th>
							<th>Frequency</th>
                            <th>Period</th>
							<th>Region</th>
							<th class="none">ID</th>							
							<th class="none">Remarks</th>
							<th class="none">Actions</th>
						</tr>
					</thead>
					<tbody></tbody>
				</table>
