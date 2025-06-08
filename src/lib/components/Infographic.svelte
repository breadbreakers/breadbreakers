<script>
    import CurrencyFormatter from "$lib/components/CurrencyFormat.svelte";

    export let beneficiaryCount;
    export let nInNeed;
    export let balanceN;
    export let ringfenceN;
    export let nWip;

</script>

<div class="container">
    <div class="columns is-multiline is-mobile">
        <div class="column is-half-mobile">
            <div class="box">
                <div class="box-content has-text-centered">
                    <p class="title is-3 pt-4 pb-2 nowrap dashboard">
                        {beneficiaryCount}
                    </p>
                    <p class="is-size-6 pb-4 tagtext">Requests Fulfilled</p>
                </div>
            </div>
        </div>
        <div class="column is-half-mobile">
            <div class="box">
                <div class="box-content has-text-centered">
                    <p class="title is-3 pt-4 pb-2 nowrap dashboard">
                        {nInNeed}
                    </p>
                    <p class="is-size-6 pb-4 tagtext">Items Requested</p>
                </div>
            </div>
        </div>
        <div class="column is-half-mobile">
            <div class="box">
                <div class="box-content has-text-centered">
                    <p class="title is-3 pt-4 pb-2 nowrap dashboard">
                        {nWip}
                    </p>
                    <p class="is-size-6 pb-4 tagtext">
                        {nWip === 1 ? "Item Processing" : "Items Processing"}
                    </p>
                </div>
            </div>
        </div>
        <div class="column is-half-mobile">
            <div class="box">
                <div class="box-content has-text-centered">
                    <p class="title is-3 pt-4 pb-2 nowrap dashboard">
                        <CurrencyFormatter
                            value={balanceN - ringfenceN}
                            currency="SGD"
                            locale="en-SG"
                        />
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
