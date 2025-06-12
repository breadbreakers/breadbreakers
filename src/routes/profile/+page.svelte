<script>
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import { env } from '$env/dynamic/public';

    export let data;

    let loggedInEmail = "";

    if (data.user !== null) {
        loggedInEmail = data.user.email;
    }

    let workTable;
    let isLoading = false;

    function signInWithGoogle() {
        isLoading = true;
        window.location.href = "/auth/google";
    }

    // needed because svelte tries to be smart and loads the a href if you mouseover, unintentionally logging out
    async function logout(event) {
        event.preventDefault();
        isLoading = true;
        await goto("/logout");
    }

    onMount(async () => {
        globalThis.$(workTable).DataTable({
            serverSide: true,
            processing: true,
            lengthChange: false,
            responsive: true,
            order: [[0, "desc"]],
            language: {
                searchPlaceholder: "Search",
            },
            ajax: function (data, callback, settings) {
                fetch(`/api/workdone`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                })
                    .then((response) => response.json())
                    .then((result) => {
                        callback({
                            draw: data.draw,
                            recordsTotal: result.recordsTotal,
                            recordsFiltered: result.recordsFiltered,
                            data: result.data,
                        });
                    });
            },
            columnDefs: [
                {
                    targets: 0, // date column
                    createdCell: function (td) {
                        globalThis.$(td).css("white-space", "nowrap");
                    },
                },
            ],
            columns: [
                {
                    data: "created_at",
                    title: "Date",
                    className: "dt-left",
                    render: function (data, type, row, meta) {
                        return typeof data === "string"
                            ? data.substring(0, 10)
                            : data;
                    },
                },
                { data: "id", title: "ID", className: "dt-left" },
                {
                    data: "status",
                    title: "Status",
                    className: "dt-left",
                    render: function (data, type, row, meta) {
                        if (data) {
                            return data
                                .replace(/_/g, " ")
                                .replace(/\w\S*/g, function (txt) {
                                    return (
                                        txt.charAt(0).toUpperCase() +
                                        txt.substr(1).toLowerCase()
                                    );
                                });
                        }
                        return data;
                    },
                },
                {
                    data: "id",
                    title: "Actions",
                    className: "dt-left",
                    render: function (data, type, row, meta) {
                        let buttons = `<i class="demo-icon icon-trash-empty">&#xe802;</i><button class="pr-2 has-text-weight-normal has-text-black cancel-button" data-id="${row.id}">Cancel</button>`;

                        setTimeout(() => {
                            document
                                .querySelectorAll(".cancel-button")
                                .forEach((button) => {
                                    button.addEventListener(
                                        "click",
                                        function (event) {
                                            const id = this.dataset.id;
                                            if (
                                                confirm(
                                                    "Are you sure you want to cancel?",
                                                )
                                            ) {
                                                window.location.href = `${env.PUBLIC_SITE_URL}/cancel?id=${id}`;
                                            }
                                        },
                                    );
                                });
                        }, 0);
                        if (row.status === "ringfence_approved") {
                            buttons += `<i class="demo-icon icon-basket-1">&#xe803;</i><a class="has-text-weight-normal has-text-black" href="${env.PUBLIC_SITE_URL}/claim?id=${row.id}">Claim</a>`;
                        }
                        return buttons;
                    },
                },
                {
                    data: "link",
                    title: "Link",
                    className: "dt-left",
                    render: function (data, type, row, meta) {
                        return (
                            '<a class="has-text-weight-normal has-text-black" href="' +
                            data +
                            '">' +
                            data +
                            "</a>"
                        );
                    },
                },
            ],
        });
    });
</script>

<svelte:head>
    <title>Bread Breakers Singapore | Profile</title>
</svelte:head>

{#if data.loggedIn}
    <section class="section">
        <div class="container">
            <h2 class="subtitle is-6 has-text-weight-semibold">
                🎁 Your Items
            </h2>
            <p>Logged in as {loggedInEmail}</p>
            <table
                bind:this={workTable}
                id="workTable"
                class="compact row-border responsive"
            >
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>ID</th>
                        <th>Status</th>
                        <th class="none">Actions</th>
                        <th class="none">Link</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
            <div class="has-text-centered">
                <button
                    class="button"
                    disabled={isLoading}
                    on:click|preventDefault={logout}>Logout</button
                >
            </div>
        </div>
    </section>
{:else}
    <section class="section">
        <div class="container has-text-centered">
            <button
                on:click={signInWithGoogle}
                name="submitbtn"
                type="submit"
                disabled={isLoading}
                class="button-logo button-sso"
            >
                <svg
                    width="17"
                    height="16"
                    viewBox="0 0 17 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M17 8.18371C17 7.63989 16.9551 7.09314 16.8591 6.55814H9.16046V9.63879H13.5691C13.3862 10.6324 12.7983 11.5113 11.9376 12.0698V14.0687H14.5678C16.1123 12.6754 17 10.6177 17 8.18371Z"
                        fill="#4285F4"
                    />
                    <path
                        d="M9.16042 16C11.3617 16 13.2182 15.2916 14.5707 14.0687L11.9406 12.0698C11.2088 12.5578 10.2641 12.8341 9.16342 12.8341C7.03409 12.8341 5.22865 11.4261 4.58085 9.53299H1.8667V11.5936C3.25227 14.2951 6.07438 16 9.16042 16V16Z"
                        fill="#34A853"
                    />
                    <path
                        d="M4.57786 9.53298C4.23596 8.53941 4.23596 7.46353 4.57786 6.46996V4.40933H1.8667C0.709065 6.66985 0.709065 9.33309 1.8667 11.5936L4.57786 9.53298V9.53298Z"
                        fill="#FBBC04"
                    />
                    <path
                        d="M9.16042 3.16589C10.3241 3.14825 11.4487 3.57743 12.2914 4.36523L14.6217 2.0812C13.1462 0.72312 11.1878 -0.0235267 9.16042 -1.02057e-05C6.07438 -1.02057e-05 3.25227 1.70493 1.8667 4.40932L4.57785 6.46995C5.22265 4.57394 7.03109 3.16589 9.16042 3.16589V3.16589Z"
                        fill="#EA4335"
                    />
                </svg>

                Sign in with Google
                {#if isLoading}
                    <i class="demo-icon icon-spin6 animate-spin">&#xe839;</i>
                {/if}
            </button>
        </div>
    </section>
{/if}

<style>
    button {
        background-color: white;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        color: #242424;
        color: var(--gray9);
        border: 1px solid #d8d6d4;
        transition-property: color, border-color, background-color, box-shadow;
        transition-duration: 200ms;
        transition-timing-function: ease;
        padding: 0.75em;
        width: 17em;
    }
</style>
