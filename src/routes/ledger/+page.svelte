<script>
	import { onMount } from "svelte";
	import CurrencyFormatter from "$lib/components/CurrencyFormat.svelte";

	let ledgerTable;
	export let data;

	let notification = null;

	const balanceN = data.balanceN;
	const ringfenceN = data.ringfenceN;

	const MIN_YEAR = 2025;
	const MIN_MONTH = "May"; // Must match one of the month names below

	let selectedYear = MIN_YEAR;
	let selectedMonth = "";
	const currentYear = new Date().getFullYear();
	const currentMonth = new Date().getMonth(); // 0-11

	$: {
		// Reset month selection when year changes
		if (selectedYear && selectedMonth) {
			const availableMonths = getAvailableMonths(selectedYear);
			if (!availableMonths.includes(selectedMonth)) {
				selectedMonth = "";
			}
		}
	}

	function getAvailableMonths(selectedYear) {
		const months = [
			"January",
			"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"August",
			"September",
			"October",
			"November",
			"December",
		];

		if (selectedYear === currentYear) {
			let result = months.slice(currentMonth - 1, currentMonth);
			return result;
		}

		return months;
	}

	const downloadStatement = () => {
		if (!selectedYear || !selectedMonth) return;
		const monthIndex =
			getAvailableMonths(selectedYear).indexOf(selectedMonth) + 1;
		const monthPadded = String(monthIndex).padStart(2, "0");
		const url = `/${selectedYear}/${selectedMonth}.pdf`;

		fetch(url)
			.then((response) => {
				if (response.status === 404) {
					notification =
						"Statement not available for the selected month.";
				} else {
					window.open(url, "_blank");
					notification = null;
				}
			})
			.catch((error) => {
				notification =
					"An error occurred while downloading the statement.";
				console.error(error);
			});
	};

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
					title: "Fulfilled",
					className: "dt-left",
					render: function (data, type, row, meta) {
						return typeof data === "string"
							? data.substring(0, 10)
							: data;
					},
				},
				{
					data: "description",
					title: "Description",
					render: function (data, type, row, meta) {
						if (row.receipt !== null) {
							if (row.receipt.substring(0, 4) == "http") {
								return (
									'🔗<a target="_blank" href="' +
									row.receipt +
									'">' +
									data +
									"</a>"
								);
							} else {
								return data;
							}
						} else {
							return data;
						}
					},
				},
				{
					data: "amount",
					title: "Amount",
					className: "dt-right",
					render: function (data, type, row) {
						let amount = parseFloat(data);
						let formatted = "$" + (amount / 100).toFixed(2);
						let colorClass =
							amount < 0
								? "has-text-danger"
								: amount > 0
									? "has-text-success"
									: "has-text-black";
						return `<span class="${colorClass}">${formatted}</span>`;
					},
				},
				{
					data: "id",
					title: "ID",
					render: function (data, type, row, meta) {
						if (row.description === "Stripe Transaction Fee") {
							return row.receipt;
						}
						if (data == null) {
							// regular expense submitted from the form;
							return "NA";
						}
						return data;
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

<svelte:head>
	<title>Bread Breakers Singapore | Ledger</title>
</svelte:head>

<section class="section">
	<div class="container">
		<div class="columns is-multiline is-mobile">
			<div class="column is-half-mobile">
				<div class="box">
					<div class="box-content has-text-centered">
						<p class="title is-3 pt-4 pb-2 nowrap dashboard">
							<CurrencyFormatter
								value={balanceN - ringfenceN}
								currency="SGD"
								locale="en-SG"
							/>
						</p>
						<p class="is-size-6 pb-4 tagtext">Available</p>
					</div>
				</div>
			</div>
			<div class="column is-half-mobile">
				<div class="box">
					<div class="box-content has-text-centered">
						<p class="title is-3 pt-4 pb-2 nowrap dashboard">
							<CurrencyFormatter
								value={ringfenceN}
								currency="SGD"
								locale="en-SG"
							/>
						</p>
						<p class="is-size-6 pb-4 tagtext">Ringfenced</p>
					</div>
				</div>
			</div>
		</div>

		<h2 class="subtitle has-text-weight-semibold pt-4">
			💰 Statement of Accounts
		</h2>
		<table
			bind:this={ledgerTable}
			id="ledgerTable"
			class="compact row-border responsive"
		>
			<thead>
				<tr>
					<th>Fulfilled</th>
					<th>Description</th>
					<th>Amount</th>
					<th class="none">ID</th>
					<th class="none">VWO</th>
				</tr>
			</thead>
			<tbody> </tbody>
		</table>
	</div>

	<div class="container">
		<h2 class="subtitle has-text-weight-semibold pt-4">
			🏛️ Bank Statements
		</h2>

		<div class="field is-grouped">
			<div class="control is-expanded">
				<div class="select is-fullwidth">
					<select bind:value={selectedYear}>
						{#each Array(currentYear - MIN_YEAR + 1)
							.fill()
							.map((_, i) => MIN_YEAR + i) as year}
							<option value={year}>{year}</option>
						{/each}
					</select>
				</div>
			</div>
			<div class="control is-expanded">
				<div class="select is-fullwidth">
					<select bind:value={selectedMonth} disabled={!selectedYear}>
						<option value="">Select Month</option>
						{#if selectedYear}
							{#each getAvailableMonths(selectedYear) as month}
								<option value={month}>{month}</option>
							{/each}
						{/if}
					</select>
				</div>
			</div>
		</div>
		<button
			class="button is-fullwidth is-link"
			on:click={downloadStatement}
			disabled={!selectedYear || !selectedMonth}
		>
			View
		</button>

		{#if notification}
			<div class="notification is-light mt-4">
				{notification}
			</div>
		{/if}
	</div>
</section>

<style>
	table {
		font-size: 0.95em;
	}

	.nowrap {
		white-space: nowrap;
	}

	.box {
		height: 100%;
		display: flex;
		flex-direction: column;
		--bulma-box-padding: 0;
		padding: 0;
	}
	.dashboard {
		font-weight: 700;
		color: black;
		margin-bottom: 0;
	}
	.tagtext {
		letter-spacing: -0.5px;
	}
</style>
