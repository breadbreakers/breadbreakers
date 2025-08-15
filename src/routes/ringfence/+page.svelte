<script>
	import { onMount } from "svelte";
	import { uploadSingleFile, checkPrivacyCompliance } from "$lib/upload.js";

	let itemId;
	let linkUrl;
	let cost;
	let isLoading = false; // For final submission state
	let success = false;
	let error;
	let remarks = "";

	// File and upload state
	let selectedFile = null;
	let itemCostFile = null;
	let swTempPath = null;
	let itemCostTempPath = null;
	let swPrivacyResult = null;
	let itemCostPrivacyResult = null;

	let isUploadingSW = false;
	let isUploadingItemCost = false;
	let uploadErrorSW = null;
	let uploadErrorItemCost = null;

	// Progress tracking
	let uploadProgress = { sw: 0, itemCost: 0 };

	export let data;
	const item = data.item;

	onMount(() => {
		const params = new URLSearchParams(window.location.search);
		itemId = params.get("id") || "";
	});

	// Helper function to update individual file progress for the UI
	function updateProgress(type, percent) {
		if (type === "ringfence_sw") {
			uploadProgress.sw = percent;
		} else if (type === "ringfence_cost") {
			uploadProgress.itemCost = percent;
		}
		uploadProgress = { ...uploadProgress }; // Trigger reactivity
	}

	async function handleFileUpload(file, type) {
		const description = `${item.title} - ${item.description}`;
		const onProgress = (t, p) => updateProgress(type, p);
		
		if (type === 'ringfence_sw') {
			isUploadingSW = true;
			uploadErrorSW = null;
			uploadProgress.sw = 0;
		} else {
			isUploadingItemCost = true;
			uploadErrorItemCost = null;
			uploadProgress.itemCost = 0;
		}

		try {
			const [uploadResult, privacyResult] = await Promise.all([
				uploadSingleFile(file, type, itemId, onProgress, true), // isTemporary = true
				checkPrivacyCompliance(file, description)
			]);

			if (type === 'ringfence_sw') {
				swTempPath = uploadResult;
				swPrivacyResult = { index: 0, file: file.name, result: privacyResult, type };
			} else {
				itemCostTempPath = uploadResult;
				itemCostPrivacyResult = { index: 1, file: file.name, result: privacyResult, type };
			}
		} catch (err) {
			console.error(`Upload error for ${type}:`, err);
			if (type === 'ringfence_sw') {
				uploadErrorSW = err.message;
			} else {
				uploadErrorItemCost = err.message;
			}
		} finally {
			if (type === 'ringfence_sw') {
				isUploadingSW = false;
			} else {
				isUploadingItemCost = false;
			}
		}
	}

	async function handleSubmit(event) {
		event.preventDefault();
		isLoading = true;
		error = "";
		success = false;

		if (!swTempPath || !itemCostTempPath) {
			error = "Please ensure both files are uploaded successfully before submitting.";
			isLoading = false;
			return;
		}

		try {
			const response = await fetch("/api/ringfence/send", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					itemId,
					linkUrl,
					cost,
					swTempPath,
					itemCostTempPath,
					remarks,
					privacyAnalysis: [swPrivacyResult, itemCostPrivacyResult]
				})
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.error);
			}

			success = true;
		} catch (err) {
			error = "Submission failed: " + err.message;
			console.error("Submission error:", err);
		} finally {
			isLoading = false;
		}
	}

	function handleConfirmSW(event) {
		const file = event.target.files[0];
		if (!file) {
			selectedFile = null;
			swTempPath = null;
			return;
		}
		const allowedTypes = ["image/png", "image/jpeg", "application/pdf"];
		if (!allowedTypes.includes(file.type)) {
			alert("Only PNG, JPG, and PDF files are allowed.");
			event.target.value = "";
			selectedFile = null;
			return;
		}
		selectedFile = file;
		handleFileUpload(selectedFile, "ringfence_sw");
	}

	function handleItemCost(event) {
		const file = event.target.files[0];
		if (!file) {
			itemCostFile = null;
			itemCostTempPath = null;
			return;
		}
		const allowedTypes = ["image/png", "image/jpeg", "application/pdf"];
		if (!allowedTypes.includes(file.type)) {
			alert("Only PNG, JPG, and PDF files are allowed.");
			event.target.value = "";
			itemCostFile = null;
			return;
		}
		itemCostFile = file;
		handleFileUpload(itemCostFile, "ringfence_cost");
	}

	function formatFileSize(bytes) {
		if (bytes === 0) return "0 Bytes";
		const k = 1024;
		const sizes = ["Bytes", "KB", "MB", "GB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
	}
</script>

<svelte:head>
	<title>Bread Breakers (SG) | Ringfence Request</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="section">
	<div class="container">
		<h2 class="subtitle is-4">Ringfence Request</h2>

		<h3 class="mt-4 has-text-weight-medium">{item.contact_full}</h3>
		<h3 class="mt-4">{item.title}</h3>
		<h3 class="mt-4">{item.description}</h3>

		{#if success}
			<div class="mt-4 notification is-success">Submitted!</div>
		{:else if error}
			<div class="mt-4 notification is-danger">
				{error}
			</div>
		{/if}

		{#if !success}
			<form class="mt-4" on:submit={handleSubmit}>
				<div class="field">
					<div class="control">
						<input class="input" type="hidden" bind:value={itemId} required />
					</div>
				</div>

				<div class="field">
					<label for="linkToPurchase" class="label">Link to purchase</label>
					<div class="control">
						<input
							id="linktoPurchase"
							class="input"
							type="url"
							bind:value={linkUrl}
							required
							disabled={isLoading || isUploadingSW || isUploadingItemCost}
							pattern="https?://.+"
							title="Please enter a valid URL starting with http:// or https://"
						/>
					</div>
				</div>

				<div class="field">
					<label for="cost" class="label">Cost including delivery (SGD)</label>
					<div class="control">
						<input
							id="cost"
							class="input"
							type="number"
							min="0"
							step="0.01"
							disabled={isLoading || isUploadingSW || isUploadingItemCost}
							bind:value={cost}
							required
						/>
					</div>
				</div>

				<div class="field">
					<label for="itemCost" class="label">
						Screenshot showing total cost, inclusive of delivery (PNG, JPG, PDF).
						<strong>Redact all name, address and mobile numbers.</strong>
					</label>
					{#if itemCostFile}
						<p class="is-size-7 has-text-grey mb-2">
							Selected: {itemCostFile.name} ({formatFileSize(itemCostFile.size)})
						</p>
						{#if isUploadingItemCost}
							<progress class="progress is-info" max="100">{uploadProgress.itemCost}%</progress>
						{:else if itemCostTempPath}
							<p class="is-size-7 has-text-success">✓ Uploaded</p>
						{:else if uploadErrorItemCost}
							<p class="is-size-7 has-text-danger">Upload failed: {uploadErrorItemCost}</p>
						{/if}
					{/if}
					<div class="control">
						<input
							id="itemCost"
							class="input"
							type="file"
							accept=".png,.jpg,.jpeg,.pdf"
							disabled={isLoading || isUploadingItemCost}
							on:change={handleItemCost}
							required
						/>
					</div>
				</div>

				<div class="field">
					<label for="socialWorkerConfirmation" class="label">
						Social Worker Confirmation (PNG, JPG, PDF)
					</label>
					<p class="mb-2">
						Please ensure the description of the item is shown in the attachment. <strong
							>Redact all name, address and mobile numbers.</strong
						>
					</p>
					{#if selectedFile}
						<p class="is-size-7 has-text-grey mb-2">
							Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
						</p>
						{#if isUploadingSW}
							<progress class="progress is-info" max="100">{uploadProgress.sw}%</progress>
						{:else if swTempPath}
							<p class="is-size-7 has-text-success">✓ Uploaded</p>
						{:else if uploadErrorSW}
							<p class="is-size-7 has-text-danger">Upload failed: {uploadErrorSW}</p>
						{/if}
					{/if}
					<div class="control">
						<input
							id="socialWorkerConfirmation"
							class="input"
							type="file"
							accept=".png,.jpg,.jpeg,.pdf"
							disabled={isLoading || isUploadingSW}
							on:change={handleConfirmSW}
							required
						/>
					</div>
				</div>

				<div class="field">
					<label class="label" for="remarks">Remarks</label>
					<div class="control">
						<textarea class="textarea" disabled={isLoading || isUploadingSW || isUploadingItemCost} id="remarks" bind:value={remarks}
						></textarea>
					</div>
				</div>

				<div class="field">
					<div class="control mt-4">
						<button class="button is-info is-light is-fullwidth" type="submit" disabled={isLoading || isUploadingSW || isUploadingItemCost || !swTempPath || !itemCostTempPath}>
							{#if isUploadingSW || isUploadingItemCost}
								Uploading files... <i class="demo-icon icon-spin6 animate-spin">&#xe839;</i>
							{:else if isLoading}
								Submitting... <i class="demo-icon icon-spin6 animate-spin">&#xe839;</i>
							{:else}
								Send
							{/if}
						</button>
					</div>
				</div>
			</form>
			<h3 class="is-size-7 mt-4">Item ID {itemId}</h3>
		{/if}
	</div>
</div>