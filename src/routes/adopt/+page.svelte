<script>
	import Page from '../+page.svelte';

	let type;
	let region;
	let isLoading = false;
	let success = false;
	let error;
	let remarks = '';
	let swname;
	let swemail;
	let frequency;
	let period;
	let acknowledged = false;

	async function handleSubmit(event) {
		event.preventDefault();
		isLoading = true;
		error = '';

		try {
			const response = await fetch('/api/adopt/send', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					swname,
					swemail,
					type,
					region,
					frequency,
					period,
					remarks
				})
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.error || 'Failed to send adoption request');
			}

			success = true;
		} catch (err) {
			console.error('Upload error:', err);
		} finally {
			isLoading = false;
		}
	}
</script>

<svelte:head>
	<title>Bread Breakers (SG) | Recurring Request</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="section">
	<div class="container">
		<h2 class="subtitle is-4 has-text-weight-bold pt-4">Recurring Request</h2>

		<p>
			This form is for social workers to submit recurring requests on behalf of their clients. The
			details provided here will be shared with our pool of volunteers, who may commit to the
			request based on their availablity.
		</p>

		{#if success}
			<div class="mt-4 notification is-success">Submitted!</div>
		{:else if error}
			<div class="mt-4 notification is-danger">
				{error}
			</div>
		{/if}

		{#if !success}
			<form class="mt-6" on:submit={handleSubmit}>
				<div class="columns">
					<div class="column">
						<div class="field">
							<label for="socialWorkerName" class="label">Social Worker Name</label>
							<div class="control">
								<input
									id="socialWorkerName"
									class="input"
									type="text"
									required
									bind:value={swname}
									disabled={isLoading}
								/>
							</div>
						</div>
					</div>

					<div class="column">
						<div class="field">
							<label for="socialWorkerEmail" class="label">Social Worker Email</label>

							<div class="control">
								<input
									id="socialWorkerEmail"
									class="input"
									type="email"
									required
									bind:value={swemail}
									disabled={isLoading}
								/>
							</div>
							<p>⚠️ Do not use personal email address. A confirmation email will be sent here.</p>
						</div>
					</div>
				</div>

				<div class="columns">
					<div class="column">
						<div class="field">
							<label for="type" class="label">Request Type</label>
							<div class="control">
								<label class="radio">
									<input
										type="radio"
										name="itemType"
										value="Diapers"
										bind:group={type}
										disabled={isLoading}
										required
									/>
									Diapers
								</label>
								<br />
								<label class="radio">
									<input
										type="radio"
										name="itemType"
										value="Milk Powder"
										bind:group={type}
										disabled={isLoading}
										required
									/>
									Milk Powder
								</label>
								<br />
								<label class="radio">
									<input
										type="radio"
										name="itemType"
										value="Groceries"
										bind:group={type}
										disabled={isLoading}
										required
									/>
									Groceries
								</label>
							</div>
						</div>
					</div>

					<div class="column">
						<div class="field">
							<label for="region" class="label">Beneficiary located in Singapore</label>
							<div class="control pt-2">
								<label class="radio">
									<input
										type="radio"
										name="region"
										value="North"
										bind:group={region}
										disabled={isLoading}
										required
									/>
									North
								</label>
								<br />
								<label class="radio">
									<input
										type="radio"
										name="region"
										value="North-East"
										bind:group={region}
										disabled={isLoading}
										required
									/>
									North-East
								</label>
								<br />
								<label class="radio">
									<input
										type="radio"
										name="region"
										value="South"
										bind:group={region}
										disabled={isLoading}
										required
									/>
									South
								</label>
								<br />
								<label class="radio">
									<input
										type="radio"
										name="region"
										value="East"
										bind:group={region}
										disabled={isLoading}
										required
									/>
									East
								</label>
								<br />
								<label class="radio">
									<input
										type="radio"
										name="region"
										value="West"
										bind:group={region}
										disabled={isLoading}
										required
									/>
									West
								</label>
							</div>
						</div>
					</div>
				</div>

				<div class="columns">
					<div class="column">
						<div class="field">
							<label for="frequency" class="label">Delivery Frequency</label>
							<div class="control">
								<label class="radio">
									<input
										type="radio"
										name="frequency"
										value="Weekly"
										bind:group={frequency}
										disabled={isLoading}
										required
									/>
									Weekly
								</label>
								<br />
								<label class="radio">
									<input
										type="radio"
										name="frequency"
										value="Fortnightly"
										bind:group={frequency}
										disabled={isLoading}
										required
									/>
									Fortnightly
								</label>
								<br />
								<label class="radio">
									<input
										type="radio"
										name="frequency"
										value="Monthly"
										bind:group={frequency}
										disabled={isLoading}
										required
									/>
									Monthly
								</label>
							</div>
						</div>
					</div>

					<div class="column">
						<div class="field">
							<label for="period" class="label">Over a Period of</label>
							<div class="control">
								<label class="radio">
									<input
										type="radio"
										name="period"
										value="1 month"
										bind:group={period}
										disabled={isLoading}
										required
									/>
									1 month
								</label>
								<br />
								<label class="radio">
									<input
										type="radio"
										name="period"
										value="3 months"
										bind:group={period}
										disabled={isLoading}
										required
									/>
									3 months
								</label>
								<br />
								<label class="radio">
									<input
										type="radio"
										name="period"
										value="6 months"
										bind:group={period}
										disabled={isLoading}
										required
									/>
									6 months
								</label>
							</div>
						</div>
					</div>
				</div>

				<div class="field">
					<label class="label" for="remarks">Remarks</label>
					<div class="content">
						<p>
							Please help us better understand the beneficiary's situation and specifics relating to
							the need (E.g. quantity, brand, etc.). If requesting groceries, please include the
							required list of items.
						</p>
					</div>
				</div>
				<div class="control">
					<textarea required class="textarea" disabled={isLoading} id="remarks" bind:value={remarks}
					></textarea>
				</div>
				<p>⚠️ Do not disclose any personal data.</p>

				<div class="field mt-6">
					<div class="control">
						<label class="checkbox">
							<input type="checkbox" bind:checked={acknowledged} disabled={isLoading} />
							I acknowledge that support will be provided on a best-effort basis, depending on volunteer
							availability.
						</label>
					</div>
				</div>

				<div class="field">
					<div class="control mt-6">
						<button
							class="button is-info is-light is-fullwidth"
							type="submit"
							disabled={isLoading || !acknowledged}
						>
							{#if isLoading}
								Processing... <i class="demo-icon icon-spin6 animate-spin">&#xe839;</i>
							{:else}
								Submit
							{/if}
						</button>
					</div>
				</div>
			</form>
		{/if}
	</div>
</div>
