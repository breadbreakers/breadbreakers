<script>
	import { onMount } from 'svelte';

	let approverTable;
	let isLoading = true;

	onMount(async () => {
		isLoading = true;

		globalThis.$(approverTable).DataTable({
			serverSide: true,
			processing: true,
			lengthChange: false,
			responsive: true,
			order: [[0, 'desc']],
			language: {
				searchPlaceholder: 'Search'
			},
			ajax: function (data, callback, settings) {
				fetch(`/api/to-approve`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: (() => {
						return JSON.stringify(data);
					})()
				})
					.then((response) => response.json())
					.then((result) => {
						callback({
							draw: data.draw,
							recordsTotal: result.recordsTotal,
							recordsFiltered: result.recordsFiltered,
							data: result.data
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
						globalThis.$(td).css('white-space', 'nowrap');
					}
				}
			],
			columns: [
				{
					data: 'created_at',
					title: 'Date',
					className: 'dt-left',
					render: function (data, type, row, meta) {
						return typeof data === 'string' ? data.substring(0, 10) : data;
					}
				},
				{ data: 'title', title: 'Title', className: 'dt-left' },
				{ data: 'id', title: 'ID', className: 'dt-left' },
				{
					data: 'status',
					title: 'Status',
					className: 'dt-left',
					render: function (data, type, row, meta) {
						if (data) {
							return data.replace(/_/g, ' ').replace(/\w\S*/g, function (txt) {
								return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
							});
						}
						return data;
					}
				}
			]
		});
	});
</script>

<table
	bind:this={approverTable}
	id="approverTable"
	class="compact row-border responsive"
	style:visibility={isLoading ? 'hidden' : 'visible'}
>
	<thead>
		<tr>
			<th>Date</th>
			<th>Title</th>
			<th class="none">ID</th>
			<th>Status</th>
		</tr>
	</thead>
	<tbody></tbody>
</table>
