<script>
    import CurrencyFormatter from "$lib/components/CurrencyFormat.svelte";

    export let beneficiaryCount;
    export let nInNeed;
    export let balanceN;
    //export let householdsWaiting;
    //export let householdsPaired;
    // export let ringfenceN;
    export let nWip;

    export let isLoading = false;
</script>

<div class="container">
    <div class="columns is-multiline is-mobile">
        <div class="column is-half-mobile">
            <div class="box">
                <div class="box-content has-text-centered">
                    <p class="title is-3 pt-4 pb-2 nowrap dashboard">
                        {#if isLoading}
                            <img
                                alt="Loading animation"
                                style="vertical-align:middle; width:20px; height:10px"
                                srcset="/1.svg"
                            />
                        {:else}
                            {nInNeed}
                        {/if}
                    </p>
                    <p class="is-size-6 pb-4 tagtext">Items In Need</p>
                </div>
            </div>
        </div>

        <div class="column is-half-mobile">
            <div class="box">
                <div class="box-content has-text-centered">
                    <p class="title is-3 pt-4 pb-2 nowrap dashboard">
                        {#if isLoading}
                            <img
                                alt="Loading animation"
                                style="vertical-align:middle; width:20px; height:10px"
                                srcset="/2.svg"
                            />
                        {:else}
                            {beneficiaryCount}
                        {/if}
                    </p>
                    <p class="is-size-6 pb-4 tagtext">Items Fulfilled</p>
                </div>
            </div>
        </div>

        <div class="column is-half-mobile">
            <div class="box">
                <div class="box-content has-text-centered">
                    <p class="title is-3 pt-4 pb-2 nowrap dashboard">
                        {#if isLoading}
                            <img
                                alt="Loading animation"
                                style="vertical-align:middle; width:20px; height:10px"
                                srcset="/4.svg"
                            />
                        {:else}
                            {nWip}
                        {/if}
                    </p>
                    <p class="is-size-6 pb-4 tagtext">
                        {nWip === 1 ? "Item Processing" : "Items Processing"}
                    </p>
                </div>
            </div>
        </div>

        <!--<div class="column is-half-mobile">
            <div class="box">
                <div class="box-content has-text-centered">
                    <p class="title is-3 pt-4 pb-2 nowrap dashboard">
                        {householdsWaiting}
                    </p>
                    <p class="is-size-6 pb-4 tagtext">
                        {householdsWaiting === 1 ? "Recurring Request" : "Recurring Requests"}
                    </p>
                </div>
            </div>
        </div>

        <div class="column is-half-mobile">
            <div class="box">
                <div class="box-content has-text-centered">
                    <p class="title is-3 pt-4 pb-2 nowrap dashboard">
                        {householdsPaired}
                    </p>
                    <p class="is-size-6 pb-4 tagtext">
                        {householdsPaired === 1 ? "Recurring Request Adopted" : "Recurring Requests Adopted"}
                    </p>
                </div>
            </div>
        </div>-->

        <div class="column">
            <div class="box">
                <div class="box-content has-text-centered">
                    <p class="title is-3 pt-4 pb-2 nowrap dashboard">
                        {#if isLoading}
                            <img
                                alt="Loading animation"
                                style="vertical-align:middle; width:20px; height:10px"
                                srcset="/3.svg"
                            />
                        {:else}
                            <CurrencyFormatter
                                value={balanceN}
                                currency="SGD"
                                locale="en-SG"
                            />
                        {/if}
                    </p>
                    <p class="is-size-6 pb-4 tagtext">Ready to Serve</p>
                </div>
            </div>
        </div>
        <!--<div class="column">
                <div class="box">
                    <div class="box-content has-text-centered">
                        <p class="title is-3 pt-4 pb-2 nowrap">
                            <CurrencyFormatter value={ringfenceN} currency="SGD" locale="en-SG" />
                        </p>
                        <p class="is-size-7">Ringfenced</p>    
                    </div>
                </div>
            </div>-->
    </div>
</div>

<style>
    .nowrap {
        white-space: nowrap;
    }

    .box {
        height: 100%;
        min-height: 95px;
        display: flex;
        flex-direction: column;
        --bulma-box-padding: 0;
        padding: 0;
    }
    .dashboard {
        font-weight: 700;
        color: black;
        margin-bottom: 0;
    }
</style>
