<script>
    import Infographic from "$lib/components/Infographic.svelte";
    import FulfiledTable from "$lib/components/FulfiledTable.svelte";
    import RequestsTable from "$lib/components/RequestsTable.svelte";

    export let data;

    let activeTable = null;

    function showTable(event, table) {
        event.preventDefault();
        event.stopPropagation();
        activeTable = activeTable === table ? null : table;
    }
</script>

<svelte:head>
    <title
        >Bread Breakers (SG) | We partner with social workers to transparently
        provide material essentials to those in need</title
    >
</svelte:head>

<section class="section">
    <Infographic
        beneficiaryCount={data.beneficiaryCount}
        nInNeed={data.nInNeed}
        balanceN={data.balanceN / 100}
        ringfenceN={data.ringfenceN / 100}
        nWip={data.nWip}
        householdsWaiting={data.householdsWaiting}
        householdsPaired={data.householdsPaired}
    />
    <div class="container">
        <div class="content mt-6">
            <div class="columns is-mobile">
                <div class="column">
                    <button
                        on:click={(event) => showTable(event, "requests")}
                        class="is-fullwidth button is-primary"
                        class:is-light={activeTable !== "requests"}
                    >
                        📦 Items In Need
                    </button>
                </div>

                <div class="column">
                    <button
                        on:click={(event) => showTable(event, "fulfilled")}
                        class="is-fullwidth button is-info"
                        class:is-light={activeTable !== "fulfilled"}
                    >
                        🎁 Items Fulfilled
                    </button>
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
            <RequestsTable
                loggedIn={data.loggedIn}
                isPartner={data.isPartner}
                catData={data.catData}
            />
        </div>
    {/if}

    <div class="container">
        <div class="content mt-3">
            <div class="columns is-mobile">
                <div class="column">
                    <a href="/donate"
                        ><button class="is-fullwidth button is-warning is-light"
                            >💝 Donate</button
                        ></a
                    >
                </div>
                <div class="column">
                    <a href="/get-involved"
                        ><button class="is-fullwidth button is-success is-light"
                            >🤝 Get Involved</button
                        ></a
                    >
                </div>
            </div>
        </div>
    </div>
</section>

<style>
</style>
