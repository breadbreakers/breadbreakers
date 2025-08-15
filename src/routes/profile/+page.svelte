<script>
	import { goto } from '$app/navigation';
	import RingfencedTable from '$lib/components/RingfencedTable.svelte';
	import ApproverTable from '$lib/components/ApproverTable.svelte';
	import RecurringTable from '$lib/components/RecurringTable.svelte';

	export let data;

	let loggedInEmail = '';

	if (data.user !== null) {
		loggedInEmail = data.user.email;
	}

	let isLoading = false;
	let isGoogleLoading = false;
	let isAzureLoading = false;

	function signInWithGoogle() {
		isGoogleLoading = true;
		const redirectTo = window.location.pathname + window.location.search;
		const encodedRedirectTo = encodeURIComponent(redirectTo);
		window.location.href = `/auth/google?redirectTo=${encodedRedirectTo}`;
	}

	function signInWithMicrosoft() {
		isAzureLoading = true;
		const redirectTo = window.location.pathname + window.location.search;
		const encodedRedirectTo = encodeURIComponent(redirectTo);
		window.location.href = `/auth/azure?redirectTo=${encodedRedirectTo}`;
	}

	// needed because svelte tries to be smart and loads the a href if you mouseover, unintentionally logging out
	async function logout(event) {
		event.preventDefault();
		isLoading = true;
		await goto('/logout');
	}
</script>

<svelte:head>
	<title>Bread Breakers (SG) | Profile</title>
</svelte:head>

{#if data.loggedIn}
	<section class="section">
		<div class="container">
			{#if data.isPartner}
				<h2 class="is-size-5 has-text-weight-semibold">👨‍👩‍👧‍👦 Partners</h2>
				<RingfencedTable {loggedInEmail} />
				<a target="_blank" class="button is-small mt-2" rel="noopener" href="/ringfence/manual"
					>✍🏻 Manual Ringfence</a
				>
				<a target="_blank" class="button is-small mt-2" rel="noopener" href="/Partner Guide.pdf"
					><i class="demo-icon icon-attach">&#xe801;</i>Guide</a
				>
				<a
					target="_blank"
					class="button is-small mt-2"
					rel="noopener"
					href="/CSA_SGCyberSafe_Employees-Toolkit_2022.pdf"
					><i class="demo-icon icon-attach">&#xe801;</i> Cybersecurity Toolkit</a
				>
				<h2 class="is-size-5 has-text-weight-semibold mt-6">🏠 Recurring Needs</h2>
				<RecurringTable />
			{/if}

			{#if data.isApprover}
				<h2 class="is-size-5 has-text-weight-semibold mt-6">✅ Approvers</h2>
				<ApproverTable />
			{/if}
		</div>
		<div class="container mt-6 has-text-centered">
			<button class="button is-small" disabled={isLoading} on:click|preventDefault={logout}>
				{#if isLoading}
					Signing Out... <i class="demo-icon icon-spin6 animate-spin">&#xe839;</i>
				{:else}
					🚪 Sign Out
				{/if}</button
			>
		</div>
	</section>
{:else}
	<section class="section">
		<div class="container has-text-centered">
			<div class="buttons-container">
				<button
					on:click={signInWithGoogle}
					name="submitbtn"
					type="submit"
					disabled={isGoogleLoading || isAzureLoading}
					class="button button-auth"
				>
					<span class="button-icon">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							x="0px"
							y="0px"
							width="20"
							height="20"
							viewBox="0 0 48 48"
						>
							<path
								fill="#fbc02d"
								d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12	s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20	s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
							></path><path
								fill="#e53935"
								d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039	l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
							></path><path
								fill="#4caf50"
								d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
							></path><path
								fill="#1565c0"
								d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
							></path>
						</svg>
					</span>
					Sign in with Google
				</button>

				<button
					on:click={signInWithMicrosoft}
					name="submitbtn"
					type="submit"
					disabled={isGoogleLoading || isAzureLoading}
					class="button button-auth"
				>
					<span class="button-icon">
						<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
							<path fill="#f25022" d="M0 0h11v11H0z" />
							<path fill="#00a4ef" d="M13 0h11v11H13z" />
							<path fill="#7fba00" d="M0 13h11v11H0z" />
							<path fill="#ffb900" d="M13 13h11v11H13z" />
						</svg>
					</span>
					Sign in with Microsoft
				</button>
			</div>
		</div>
	</section>
{/if}

<style>
	.buttons-container {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		align-items: center;
	}

	.button-auth {
		width: 15em;
	}

	.button-icon {
		display: inline-block;
		position: relative;
		top: 4px;
		margin-right: 8px;
	}
</style>
