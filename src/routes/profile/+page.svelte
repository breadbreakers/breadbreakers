<script>
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import { env } from "$env/dynamic/public";

    export let data;

    let loggedInEmail = "";

    if (data.user !== null) {
        loggedInEmail = data.user.email;
    }

    let workTable;
    let approverTable;
    let householdsTable;
    let isLoading = false;
    let workTableLoading = true;
    let householdTableLoading = true;
    let approverTableLoading = true;

    function signInWithGoogle() {
        isLoading = true;
        const redirectTo = window.location.pathname + window.location.search;
        const encodedRedirectTo = encodeURIComponent(redirectTo);
        window.location.href = `/auth/google?redirectTo=${encodedRedirectTo}`;
    }

    // needed because svelte tries to be smart and loads the a href if you mouseover, unintentionally logging out
    async function logout(event) {
        event.preventDefault();
        isLoading = true;
        await goto("/logout");
    }

    onMount(async () => {
        if (data.isPartner) {
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
                        body: (() => {
                            data.partneremail = loggedInEmail;
                            return JSON.stringify(data);
                        })(),
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
                initComplete: function (settings, json) {
                    workTableLoading = false;
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
                    { data: "title", title: "Title", className: "dt-left" },
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
                                                        "Are you sure you want to cancel this request? The entire workflow will need to be restarted again. This action cannot be reversed.",
                                                    )
                                                ) {
                                                    window.location.href = `${env.PUBLIC_SITE_URL}/cancel?id=${id}`;
                                                }
                                            },
                                        );
                                    });
                            }, 0);
                            if (row.status === "ringfence_approved") {
                                buttons += `<i class="demo-icon icon-basket-1">&#xe803;</i><a target="_blank" class="has-text-weight-normal has-text-black" href="${env.PUBLIC_SITE_URL}/claim?id=${row.id}">Claim</a>`;
                            }
                            return buttons;
                        },
                    },
                    {
                        data: "amount",
                        title: "Cost",
                        className: "dt-left",
                        render: function (data, type, row, meta) {
                            return `$${(data / 100).toFixed(2)}`;
                        },
                    },
                    {
                        data: "contact",
                        title: "Contact",
                        className: "dt-left",
                        render: function (data, type, row, meta) {
                            const pattern = /\b[89]\d{7}\b/g;
                            let mobileN = false;
                            mobileN = String(data).match(pattern);
                            if (mobileN) {
                                return `<a target="_blank" href="https://wa.me/65${mobileN}"><i class="demo-icon icon-whatsapp">&#xF232;</i>WhatsApp</a> ${data}`;
                            } else {
                                return data;
                            }
                        },
                    },
                ],
            });

            globalThis.$(householdsTable).DataTable({
                serverSide: true,
                processing: true,
                lengthChange: false,
                responsive: true,
                order: [[0, "desc"]],
                language: {
                    searchPlaceholder: "Search",
                },
                ajax: function (data, callback, settings) {
                    fetch(`/api/households`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: (() => {
                            return JSON.stringify(data);
                        })(),
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
                initComplete: function (settings, json) {
                    householdTableLoading = false;
                },
                columns: [
                    { data: "type", title: "Type", className: "dt-left" },
                    {
                        data: "frequency",
                        title: "Frequency",
                        className: "dt-left",
                    },
                    { data: "region", title: "Region", className: "dt-left" },
                    { data: "id", title: "ID", className: "dt-left" },
                    {
                        data: "qty",
                        title: "Quantity",
                        className: "dt-left",
                        render: function (data, type, row, meta) {
                            return row.qty + " " + row.frequency;
                        },
                    },
                    { data: "period", title: "Period", className: "dt-left" },
                    { data: "remarks", title: "Remarks", className: "dt-left" },
                    {
                        data: "link",
                        title: "Link",
                        className: "dt-left",
                        render: function (data, type, row, meta) {
                            if (row.link) {
                                return `<a class="link" target="_blank" href="${row.link}">${row.link}</a> `;
                            } else {
                                return "NA";
                            }
                        },
                    },
                    {
                        data: "id",
                        title: "Actions",
                        className: "dt-left",
                        render: function (data, type, row, meta) {
                            setTimeout(() => {
                                document
                                    .querySelectorAll(".confirm-button")
                                    .forEach((button) => {
                                        button.addEventListener(
                                            "click",
                                            function (event) {
                                                const id = this.dataset.id;
                                                if (
                                                    confirm(
                                                        "Confirm adoption of this household? Once confirmed, we’ll connect you with the social worker via email.",
                                                    )
                                                ) {
                                                    window.location.href = `${env.PUBLIC_SITE_URL}/adopt/pair?id=${id}`;
                                                }
                                            },
                                        );
                                    });
                            }, 0);
                            return `<i class="demo-icon icon-shop">&#xe805;</i><button class="pr-2 has-text-weight-normal is-underlined has-text-black confirm-button" data-id="${row.id}">Adopt Household</button>`;
                        },
                    },
                ],
            });
        }

        if (data.isApprover) {
            globalThis.$(approverTable).DataTable({
                serverSide: true,
                processing: true,
                lengthChange: false,
                responsive: true,
                order: [[0, "desc"]],
                language: {
                    searchPlaceholder: "Search",
                },
                ajax: function (data, callback, settings) {
                    fetch(`/api/to-approve`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: (() => {
                            return JSON.stringify(data);
                        })(),
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
                initComplete: function (settings, json) {
                    approverTableLoading = false;
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
                    { data: "title", title: "Title", className: "dt-left" },
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
                ],
            });
        }
    });
</script>

<svelte:head>
    <title>Bread Breakers (SG) | Profile</title>
</svelte:head>

{#if data.loggedIn}
    <section class="section">
        <div class="container">
            {#if data.isPartner}
                <h2 class="subtitle is-5 has-text-weight-semibold">
                    🎁 Ringfenced Items
                </h2>

                <table
                    bind:this={workTable}
                    id="workTable"
                    class="compact row-border responsive"
                    style:visibility={workTableLoading ? "hidden" : "visible"}
                >
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Title</th>
                            <th class="none">ID</th>
                            <th>Status</th>
                            <th class="none">Actions</th>
                            <th class="none">Cost</th>
                            <th class="none">Contact</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>

                <p class="pb-5">
                    <i class="demo-icon icon-shop">&#xe805;</i><a
                        target="_blank"
                        class="link"
                        href="/ringfence/manual">Manual Ringfence</a
                    >
                </p>

                <h2 class="subtitle is-5 mt-6 has-text-weight-semibold">
                    🏠 Households With Recurring Needs
                </h2>

                <table
                    bind:this={householdsTable}
                    id="householdsTable"
                    class="compact row-border responsive"
                    style:visibility={householdTableLoading
                        ? "hidden"
                        : "visible"}
                >
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Frequency</th>
                            <th>Region</th>
                            <th class="none">ID</th>
                            <th class="none">Qty</th>
                            <th class="none">Period</th>
                            <th class="none">Link</th>
                            <th class="none">Remarks</th>
                            <th class="none">Actions</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            {/if}

            {#if data.isApprover}
                <h2 class="subtitle is-5 mt-6 has-text-weight-semibold">
                    ✅ To Approve
                </h2>
                <table
                    bind:this={approverTable}
                    id="approverTable"
                    class="compact row-border responsive"
                    style:visibility={approverTableLoading
                        ? "hidden"
                        : "visible"}
                >
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Title</th>
                            <th class="none">ID</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>

                <div class="columns">
                    <div class="column">
                        <p>
                            <i class="demo-icon icon-attach">&#xe801;</i><a
                                target="_blank"
                                class="link"
                                href="/Partner Guide.pdf">Guide for Partners</a
                            >
                        </p>
                        <p>
                            <i class="demo-icon icon-attach">&#xe801;</i><a
                                target="_blank"
                                class="link"
                                href="/CSA_SGCyberSafe_Employees-Toolkit_2022.pdf"
                                >Cybersecurity Toolkit</a
                            >
                        </p>
                    </div>
                </div>
            {/if}
            <div class="has-text-centered">
                <button
                    class="button"
                    disabled={isLoading}
                    on:click|preventDefault={logout}>Sign Out</button
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
                <span
                    style="display: inline-block; position: relative; top: 4px;"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        x="0px"
                        y="0px"
                        width="20"
                        height="20"
                        viewBox="0 0 48 48"
                    >
                        <path
                            fill="#fbc02d"
                            d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12	s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20	s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                        ></path><path
                            fill="#e53935"
                            d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039	l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                        ></path><path
                            fill="#4caf50"
                            d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                        ></path><path
                            fill="#1565c0"
                            d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                        ></path>
                    </svg>
                </span>

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
