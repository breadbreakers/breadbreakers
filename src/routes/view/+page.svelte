<svelte:head>
    <title>Bread Breakers (SG) | View Data</title>
</svelte:head>

<script>
    export let data;
    const name = data.decryptedName;
    const address = data.decryptedAddress;
    const mobile = data.decryptedMobile;
    const itemId = data.itemId;
    const lift = data.lift;

</script>

<section class="section">
    <div class="container">
        <p><strong>ID</strong> {itemId}</p>
        <p class="mt-4"><strong>Name</strong> {name}</p>
        <p><strong>Address</strong> {address}</p>
        <p><strong>Has lift?</strong> {lift}</p>
        <p><strong>Mobile</strong> {mobile}</p>
        <div class="notification is-danger mt-4"><p><strong>Bread Breakers (SG) places the highest priority on protecting personal data and operates in accordance with the Personal Data Protection Act (PDPA). Any failure to uphold this responsibility may incur severe penalties. Please do not store this data on any personal device. For future reference, kindly access the link provided in your email.</strong></p></div>
    </div>
</section>
