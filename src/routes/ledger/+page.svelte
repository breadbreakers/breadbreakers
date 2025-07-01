<script>
	import { onMount } from "svelte";
	import CurrencyFormatter from "$lib/components/CurrencyFormat.svelte";

	let ledgerTable;
	export let data;

	let notification = null;

	const balanceN = data.balanceN;
	const ringfenceN = data.ringfenceN;
	const operatingN = data.operatingN;

	const MIN_YEAR = 2025;
	const MIN_MONTH = 4; // from May 2025 onwards

	let selectedYear = MIN_YEAR;
	let selectedMonth = "";
	const currentYear = new Date().getFullYear();
	const currentMonth = new Date().getMonth(); // 0-11

	function formatBankStatementTitle(dateString) {
		const date = new Date(dateString);

		const monthNames = [
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

		if (isNaN(date)) {
			throw new Error("Invalid date format");
		}

		const month = monthNames[date.getMonth()];
		const year = date.getFullYear();

		return `Bank Statement (${month} ${year})`;
	}

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
			return months.slice(MIN_MONTH, currentMonth); // May to June
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
						"Statement not available for the selected month. It may take up to 5 working days before the statement is available. ";
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
						return data;
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
							return "NA";
						}
						if (row.id === null && row.flow_type === "inflow") {
							// direct bank transfer
							return "NA";
						}
						if (String(row.id).substring(0, 4) === "http") {
							// donation from stripe
							return "Donation";
						}
						if (data == null) {
							// regular expense submitted from the form;
							return "Operating Fund Expense";
						}
						return data;
					},
				},
				{
					data: "contact",
					title: "Reference",
					render: function (data, type, row, meta) {
						if (data !== null) {
							return (
								data +
								'<br><i class="demo-icon icon-attach">&#xe801;</i>' +
								'<a class="has-text-weight-normal is-underlined has-text-black" target="_blank" href="' +
								row.link +
								'">Proof of Delivery</a>' +
								(row.receipt !== null
									? '<br><i class="demo-icon icon-attach">&#xe801;</i><a class="has-text-weight-normal is-underlined has-text-black" target="_blank" href="' +
										row.receipt +
										'">Receipt</a>'
									: " (Donated item)")
							);
						} else {
							if (row.receipt !== null) {
								return (
									'<i class="demo-icon icon-attach">&#xe801;</i><a class="has-text-weight-normal is-underlined has-text-black" target="_blank" href="' +
									row.receipt +
									'">Receipt</a>'
								);
							}
							if (
								String(row.description).substring(0, 8) ===
								"Donation"
							) {
								return formatBankStatementTitle(row.timestamp);
							}
							if (String(row.id).substring(0, 4) === "http") {
								// donation from stripe
								return (
									'<i class="demo-icon icon-attach">&#xe801;</i><a target="_blank" class="has-text-weight-normal is-underlined has-text-black" href="' +
									row.id +
									'">Receipt</a>'
								);
							}

							return "NA";
						}
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
	<title>Bread Breakers (SG) | Ledger</title>
</svelte:head>

<section class="section">
	<div class="container">
		<div class="columns is-multiline is-mobile">
			<div class="column is-half-mobile">
				<div class="box">
					<div class="box-content has-text-centered">
						<div class="is-size-7 pt-4">(A)</div>
						<p class="title is-3 pb-2 nowrap dashboard">
							<CurrencyFormatter
								value={balanceN}
								currency="SGD"
								locale="en-SG"
							/>
						</p>
						<p class="is-size-6 pb-4 tagtext">Total Funds</p>
					</div>
				</div>
			</div>
			<div class="column is-half-mobile">
				<div class="box">
					<div class="box-content has-text-centered">
						<div class="is-size-7 pt-4">(B)</div>
						<p class="title is-3 pb-2 nowrap dashboard">
							<CurrencyFormatter
								value={operatingN}
								currency="SGD"
								locale="en-SG"
							/>
						</p>
						<p class="is-size-6 pb-4 tagtext">Operating Fund</p>
					</div>
				</div>
			</div>
			<div class="column is-half-mobile">
				<div class="box">
					<div class="box-content has-text-centered">
						<div class="is-size-7 pt-4">(C)</div>
						<p class="title is-3 pb-2 nowrap dashboard">
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
			<div class="column is-half-mobile">
				<div class="box">
					<div class="box-content has-text-centered">
						<div class="is-size-7 pt-4">(A - B - C)</div>
						<p class="title is-3 pb-2 nowrap dashboard">
							<CurrencyFormatter
								value={balanceN - ringfenceN - operatingN}
								currency="SGD"
								locale="en-SG"
							/>
						</p>
						<p class="is-size-6 pb-4 tagtext">Ready to Serve</p>
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
					<th class="none">Reference</th>
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
</style>
