<svelte:head>
    <title>Bread Breakers Singapore | We partner with social workers to transparently provide material essentials to those in need</title>
    <link rel="stylesheet" href="css/dataTables.dataTables.min.css">
	<link rel="stylesheet" href="css/responsive.dataTables.css">
	<script src="js/jquery-3.7.1.min.js"></script>
	<script src="js/dataTables.min.js"></script>
	<script src="js/dataTables.responsive.js"></script>
	<script src="js/responsive.dataTables.js"></script>
</svelte:head>

<script>
    //import { onMount } from "svelte";    
    //import { page } from "$app/stores";    
    import Infographic from "$lib/components/Infographic.svelte";
    import FulfiledTable from "$lib/components/FulfiledTable.svelte";
    import RequestsTable from "$lib/components/RequestsTable.svelte";

    export let data;

    /*onMount(async () => {
        //if ($page.url.pathname !== "/") return; // fix - cuz the about page seems to load onMount. to review how to prevent.
    });*/

</script>


<Infographic 
    beneficiaryCount={data.beneficiaryCount} 
    nInNeed={data.nInNeed} 
    balanceN={data.balanceN}
    ringfenceN={data.ringfenceN}
    nWip={data.nWip}
/>

<FulfiledTable />

<RequestsTable loggedIn={data.loggedIn} />
