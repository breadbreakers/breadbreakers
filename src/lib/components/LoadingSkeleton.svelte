<!-- LoadingSkeleton.svelte -->
<div class="container">
    <div class="columns is-multiline is-mobile">
        <div class="column is-half-mobile">
            <div class="box">
                <div class="box-content has-text-centered">
                    <div class="skeleton-title"></div>
                    <div class="skeleton-text"></div>
                </div>
            </div>
        </div>

        <div class="column is-half-mobile">
            <div class="box">
                <div class="box-content has-text-centered">
                    <div class="skeleton-title"></div>
                    <div class="skeleton-text"></div>
                </div>
            </div>
        </div>
        
        <div class="column is-half-mobile">
            <div class="box">
                <div class="box-content has-text-centered">
                    <div class="skeleton-title"></div>
                    <div class="skeleton-text"></div>
                </div>
            </div>
        </div>

        <div class="column">
            <div class="box">
                <div class="box-content has-text-centered">
                    <div class="skeleton-title"></div>
                    <div class="skeleton-text"></div>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .box {
        height: 100%;
        display: flex;
        flex-direction: column;
        --bulma-box-padding: 0;
        padding: 0;
    }
    
    .box-content {
        padding: 1rem;
    }
    
    .skeleton-title {
        height: 2rem;
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: loading 1.5s infinite;
        border-radius: 4px;
        margin-bottom: 1rem;
    }
    
    .skeleton-text {
        height: 1rem;
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: loading 1.5s infinite;
        border-radius: 4px;
        width: 70%;
        margin: 0 auto;
    }
    
    @keyframes loading {
        0% {
            background-position: 200% 0;
        }
        100% {
            background-position: -200% 0;
        }
    }
</style>