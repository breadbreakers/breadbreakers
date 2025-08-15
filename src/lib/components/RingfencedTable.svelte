<script>
	import { onMount } from 'svelte';
	import { env } from '$env/dynamic/public';

	export let loggedInEmail;

	let ringfencedTable;
	let isLoading = true;

	onMount(async () => {
		isLoading = true;

		globalThis.$(ringfencedTable).DataTable({
			serverSide: true,
			processing: true,
			lengthChange: false,
			responsive: true,
			order: [[0, 'desc']],
			language: {
				searchPlaceholder: 'Search'
			},
			ajax: function (data, callback, settings) {
				fetch(`/api/workdone`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: (() => {
						data.partneremail = loggedInEmail;
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
						const $span = globalThis.$(td).find('span');
						$span.css('border-bottom', '#b87333 0.05em solid');
					}
				}
			],
			columns: [
				{
					data: 'created_at',
					title: 'Date',
					className: 'dt-left',
					render: function (data, type, row, meta) {
						const d = typeof data === 'string' ? data.substring(0, 10) : data;
						return "<span class='has-text-weight-normal'>" + d + '</span>';
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
				},
				{
					data: 'id',
					title: 'Actions',
					className: 'dt-left',
					render: function (data, type, row, meta) {
						let buttons = `<i class="demo-icon icon-trash-empty">&#xe802;</i><a class="pr-2 link cancel-button" data-id="${row.id}">Cancel</a>`;

						setTimeout(() => {
							document.querySelectorAll('.cancel-button').forEach((button) => {
								button.addEventListener('click', function (event) {
									const id = this.dataset.id;
									if (
										confirm(
											'Are you sure you want to cancel this request? The entire workflow will need to be restarted again. This action cannot be reversed.'
										)
									) {
										window.location.href = `${env.PUBLIC_SITE_URL}/cancel?id=${id}`;
									}
								});
							});
						}, 0);
						if (row.status === 'ringfence_approved') {
							buttons += `<i class="demo-icon icon-basket-1">&#xe803;</i><a target="_blank" rel="noopener" class="link" href="${env.PUBLIC_SITE_URL}/claim?id=${row.id}">Claim</a>`;
						}
						return buttons;
					}
				},
				{
					data: 'amount',
					title: 'Cost',
					className: 'dt-left',
					render: function (data, type, row, meta) {
						return `$${(data / 100).toFixed(2)}`;
					}
				},
				{
					data: 'contact',
					title: 'Contact',
					className: 'dt-left',
					render: function (data, type, row, meta) {
						const pattern = /\b[89]\d{7}\b/g;
						let mobileN = false;
						mobileN = String(data).match(pattern);
						if (mobileN) {
							return `<a class="link" target="_blank" rel="noopener" href="https://wa.me/65${mobileN}"><i class="demo-icon icon-whatsapp">&#xF232;</i>WhatsApp</a> ${data}`;
						} else {
							return data;
						}
					}
				}
			]
		});
	});
</script>

<table
	bind:this={ringfencedTable}
	id="ringfencedTable"
	class="compact row-border responsive"
	style:visibility={isLoading ? 'hidden' : 'visible'}
>
	<thead>
		<tr>
			<th>Date</th>
			<th>Title</th>
			<th class="none">ID</th>
			<th>Status</th>
			<th class="none">Actions</th>
			<th class="none">Cost</th>
			<th class="none">Contact</th>
		</tr>
	</thead>
	<tbody></tbody>
</table>
