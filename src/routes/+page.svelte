<script>
    import { onMount } from 'svelte';
    import { afterNavigate } from '$app/navigation';
    import Infographic from "$lib/components/Infographic.svelte";
    import FulfiledTable from "$lib/components/FulfiledTable.svelte";
    import RequestsTable from "$lib/components/RequestsTable.svelte";

    let activeTable = null;
    let isLoading = true;
    let dashboardData = {
        beneficiaryCount: null,
        nInNeed: null,
        balanceN: null,
        ringfenceN: null,
        nWip: null,
        isPartner: false,
        catData: [],
        userName: null,
        householdsWaiting: null,
        householdsPaired: null
    };

    onMount(async () => {        
        await fetchDashboardData();        
    });

    afterNavigate(async () => {
		await fetchDashboardData();
	});

    async function fetchDashboardData() {
        try {
            const response = await fetch('/api/dashboard-stats');
            if (response.ok) {
                const freshData = await response.json();
                dashboardData = {
                    ...dashboardData,
                    ...freshData,
                    isLoading: false
                };
                isLoading = false;
            } else {
                console.error('Failed to fetch dashboard data');
                isLoading = false;
            }
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
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
    <!-- Always render the infographic, but show loading state if needed -->
    <Infographic
        beneficiaryCount={dashboardData.beneficiaryCount}
        nInNeed={dashboardData.nInNeed}
        balanceN={dashboardData.balanceN ? dashboardData.balanceN / 100 : null}
        ringfenceN={dashboardData.ringfenceN ? dashboardData.ringfenceN / 100 : null}
        nWip={dashboardData.nWip}
        householdsWaiting={dashboardData.householdsWaiting}
        householdsPaired={dashboardData.householdsPaired}
        {isLoading}
    />

    <div class="container">
        <div class="content mt-6">
            <div class="columns is-mobile">
                <div class="column">
                    <button
                        on:click={(event) => showTable(event, "requests")}
                        class="is-fullwidth button is-info"
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