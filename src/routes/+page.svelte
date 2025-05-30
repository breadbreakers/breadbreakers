<script>
    //import { onMount } from "svelte";    
    //import { page } from "$app/stores";    
    import Infographic from "$lib/components/Infographic.svelte";
    import FulfiledTable from "$lib/components/FulfiledTable.svelte";
    import RequestsTable from "../lib/components/RequestsTable.svelte";

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
