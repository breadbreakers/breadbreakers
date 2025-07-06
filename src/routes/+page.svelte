<script>
    import { browser } from '$app/environment';
    import Infographic from "$lib/components/Infographic.svelte";
    import LoadingSkeleton from "$lib/components/LoadingSkeleton.svelte";
    import FulfiledTable from "$lib/components/FulfiledTable.svelte";
    import RequestsTable from "$lib/components/RequestsTable.svelte";

    export let data;

    let activeTable = null;
    let isLoading = false;
    let dashboardData = data;

    // If data is still loading on client side
    $: if (browser && !dashboardData?.beneficiaryCount && dashboardData?.beneficiaryCount !== 0) {
        isLoading = true;
        fetchDashboardData();
    }

    async function fetchDashboardData() {
        try {
            const response = await fetch('/api/dashboard-stats');
            if (response.ok) {
                dashboardData = await response.json();
            }
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            isLoading = false;
        }
    }

    function showTable(event, table) {
        event.preventDefault();
        event.stopPropagation();
        activeTable = activeTable === table ? null : table;
    }
</script>

<svelte:head>
    <title>Bread Breakers (SG) | We partner with social workers to transparently provide material essentials to those in need</title>
</svelte:head>

<section class="section">
    {#if isLoading}
        <LoadingSkeleton />
    {:else}
        <Infographic
            beneficiaryCount={dashboardData.beneficiaryCount}
            nInNeed={dashboardData.nInNeed}
            balanceN={dashboardData.balanceN / 100}
            ringfenceN={dashboardData.ringfenceN / 100}
            nWip={dashboardData.nWip}
            householdsWaiting={dashboardData.householdsWaiting}
            householdsPaired={dashboardData.householdsPaired}
        />
    {/if}

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
                loggedIn={dashboardData.loggedIn}
                isPartner={dashboardData.isPartner}
                catData={dashboardData.catData}
            />
        </div>
    {/if}

    <div class="container">
        <div class="content mt-3">
            <div class="columns is-mobile">
                <div class="column">
                    <a href="/donate">
                        <button class="is-fullwidth button is-warning is-light">💝 Donate</button>
                    </a>
                </div>
                <div class="column">
                    <a href="/get-involved">
                        <button class="is-fullwidth button is-success is-light">🤝 Get Involved</button>
                    </a>
                </div>
            </div>
        </div>
    </div>
</section>