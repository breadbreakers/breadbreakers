<script>
    import BackToTop from "$lib/components/BackToTop.svelte";
</script>

<svelte:head>
    <title>Bread Breakers (SG) | Technology Stack</title>
</svelte:head>

<section class="section">
    <div class="container">
        <nav class="breadcrumb has-arrow-separator" aria-label="breadcrumbs">
            <ul>
                <li><a href="/">🏠Home</a></li>
                <li><a href="/governance">Governance</a></li>
                <li class="is-active">
                    <a href="./" aria-current="page">Tech Stack</a>
                </li>
            </ul>
        </nav>

        <h2 class="subtitle has-text-weight-semibold pt-4">Technology Stack</h2>

        <div class="content">
            <h3 class="subtitle is-6 mt-5 has-text-weight-bold">Purpose</h3>
            <p>
                Bread Breakers (SG) uses a secure, cost-efficient architecture with modern cloud tooling: static site hosting, self-managed database, cloud-based email and storage APIs.
            </p>

            <div style="overflow-x: auto;">
                <table class="table is-bordered is-striped is-fullwidth">
                    <thead>
                        <tr>
                            <th>Layer</th>
                            <th>Web Hosting</th>
                            <th>Database</th>
                            <th>Email</th>
                            <th>File Storage</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Physical Infra</td>
                            <td><span class="tag is-success">CSP</span></td>
                            <td><span class="tag is-success">CSP</span></td>
                            <td><span class="tag is-success">CSP</span></td>
                            <td><span class="tag is-success">CSP</span></td>
                        </tr>
                        <tr>
                            <td>VM / OS</td>
                            <td><span class="tag is-success">CSP</span></td>
                            <td><span class="tag is-link">Self</span></td>
                            <td><span class="tag is-success">CSP</span></td>
                            <td><span class="tag is-success">CSP</span></td>
                        </tr>
                        <tr>
                            <td>Managed Platform</td>
                            <td><span class="tag is-success">CSP</span></td>
                            <td><span class="tag is-link">Self-Managed</span></td>
                            <td><span class="tag is-success">CSP</span></td>
                            <td><span class="tag is-success">CSP</span></td>
                        </tr>
                        <tr>
                            <td>Application / Code</td>
                            <td><span class="tag is-link">Self</span></td>
                            <td><span class="tag is-link">Self</span></td>
                            <td><span class="tag is-link">Self</span></td>
                            <td><span class="tag is-link">Self</span></td>
                        </tr>
                        <tr>
                            <td>Data / Config</td>
                            <td><span class="tag is-link">Self</span></td>
                            <td><span class="tag is-link">Self</span></td>
                            <td><span class="tag is-link">Self</span></td>
                            <td><span class="tag is-link">Self</span></td>
                        </tr>
                        <tr>
                            <td>Access & Identity</td>
                            <td><span class="tag is-warning">Shared</span></td>
                            <td><span class="tag is-link">Self</span></td>
                            <td><span class="tag is-warning">Shared</span></td>
                            <td><span class="tag is-warning">Shared</span></td>
                        </tr>
                        <tr>
                            <td>Security / Compliance</td>
                            <td><span class="tag is-warning">Shared</span></td>
                            <td><span class="tag is-link">Self</span></td>
                            <td><span class="tag is-success">CSP</span></td>
                            <td><span class="tag is-success">CSP</span></td>
                        </tr>
                        <tr>
                            <td>CI / CD</td>
                            <td><span class="tag is-link">Self</span></td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="content mt-5">
                <p><span class="legend-box legend-csp"></span> Cloud Service Provider Managed (CSP)</p>
                <p><span class="legend-box legend-self"></span> Self-Managed</p>
                <p><span class="legend-box legend-shared"></span> Shared Responsibility</p>
            </div>

            <h3 class="subtitle is-6 mt-5 has-text-weight-bold">Operating Considerations</h3>
            <ul>
                <li><strong>Web Hosting</strong> – Free-tier deployment platform</li>
                <li><strong>Source Control</strong> – Versioned using free private repositories</li>
                <li><strong>Database</strong> – Self-managed instance hosted on private cloud VM</li>
                <li><strong>Email</strong> – Cloud-based email service (pay-as-you-go)</li>
                <li><strong>Cloud Functions</strong> – Cost-efficient event-driven logic</li>
                <li><strong>Object Storage</strong> – Usage-billed API-based file storage</li>
            </ul>

         
  In line with principles of <a class="link" target="_blank"  href="https://en.wikipedia.org/wiki/Security_through_obscurity">security through obscurity</a>,
  this overview focuses on high-level architecture and responsibility boundaries only.


            <BackToTop />
        </div>
    </div>
</section>

<style>
    .legend-box {
        display: inline-block;
        width: 1em;
        height: 1em;
        border-radius: 3px;
        margin-right: 0.5em;
    }
    .legend-csp { background-color: #48c774; }     /* Green */
    .legend-self { background-color: #3273dc; }    /* Blue */
    .legend-shared { background-color: #ffdd57; }  /* Yellow */
</style>
