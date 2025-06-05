<script>
    import Infographic from "$lib/components/Infographic.svelte";
    import FulfiledTable from "$lib/components/FulfiledTable.svelte";
    import RequestsTable from "$lib/components/RequestsTable.svelte";
    import Footer from "$lib/components/Footer.svelte";

    export let data;

    let activeTable = null;

    function showTable(event, table) {
        event.preventDefault();
        event.stopPropagation();
        activeTable = table;
    }
</script>

<svelte:head>
    <title
        >Bread Breakers Singapore | We partner with social workers to
        transparently provide material essentials to those in need</title
    >
</svelte:head>

<section class="section">
    <Infographic
        beneficiaryCount={data.beneficiaryCount}
        nInNeed={data.nInNeed}
        balanceN={data.balanceN}
        ringfenceN={data.ringfenceN}
        nWip={data.nWip}
    />
    <div class="container">
        <div class="content mt-6">
            <div class="columns">
                <div class="column">
                    <button
                        on:click={(event) => showTable(event, "fulfilled")}
                        class="is-fullwidth button is-info is-light"
                        >🎁 Items Fulfilled</button
                    >
                </div>
                <div class="column">
                    <button
                        on:click={(event) => showTable(event, "requests")}
                        class="is-fullwidth button is-primary is-light"
                        >📦 Items Requested</button
                    >
                </div>
            </div>
        </div>
    </div>

    {#if activeTable === "fulfilled"}
        <div class="content mt-6 mb-6">
            <FulfiledTable />
        </div>
    {/if}

    {#if activeTable === "requests"}
        <div class="content mt-6 mb-6">
            <RequestsTable loggedIn={data.loggedIn} />
        </div>
    {/if}

    <div class="container">
        <div class="content mt-3">
            <div class="columns">
                <div class="column">
                    <button class="is-fullwidth button is-warning is-light"
                        >🤝 Partner With Us</button
                    >
                </div>
            </div>
        </div>
    </div>

    <Footer />
</section>



<style>
button {
    font-weight: 400;
    letter-spacing: -0.5px;
}
</style>