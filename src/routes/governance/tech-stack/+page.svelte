<script>
    import BackToTop from "$lib/components/BackToTop.svelte";
</script>

<svelte:head>
    <title>Bread Breakers (SG) | Technology Stack</title>
</svelte:head>

<section class="section">
    <div class="container">

        <h2 class="subtitle is-4 has-text-weight-bold pt-4">Technology Stack</h2>

        <div class="content">
            
            <p>
                Bread Breakers (SG) uses a secure, cost-efficient architecture
                with modern cloud tooling. Static site hosting on Netlify,
                self-managed PostgreSQL database, AWS email services, and
                cloud-based storage APIs.
            </p>

            <p>
                This overview provides transparency into our technology choices and security measures, demonstrating our commitment to robust, multi-layered security architecture while maintaining operational security for sensitive implementation details.
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
                            <td><span class="tag is-success">Netlify</span></td>
                            <td
                                ><span class="tag is-success">Oracle Cloud</span
                                ></td
                            >
                            <td><span class="tag is-success">AWS</span></td>
                            <td
                                ><span class="tag is-success">Cloudflare</span
                                ></td
                            >
                        </tr>
                        <tr>
                            <td>VM / OS</td>
                            <td><span class="tag is-success">Netlify</span></td>
                            <td
                                ><span class="tag is-link">CIS Hardened</span
                                ></td
                            >
                            <td
                                ><span class="tag is-success">AWS Lambda</span
                                ></td
                            >
                            <td
                                ><span class="tag is-success">R2</span
                                ></td
                            >
                        </tr>
                        <tr>
                            <td>Managed Platform</td>
                            <td><span class="tag is-success">Netlify</span></td>
                            <td
                                ><span class="tag is-link">Docker Compose</span
                                ></td
                            >
                            <td><span class="tag is-success">AWS SES</span></td>
                            <td
                                ><span class="tag is-success"
                                    >R2</span
                                ></td
                            >
                        </tr>
                        <tr>
                            <td>Application / Code</td>
                            <td><span class="tag is-link">SvelteKit</span></td>
                            <td
                                ><span class="tag is-link"
                                    >Supabase/PostgreSQL</span
                                ></td
                            >
                            <td
                                ><span class="tag is-link">Custom Logic</span
                                ></td
                            >
                            <td
                                ><span class="tag is-link"
                                    >Custom Integration</span
                                ></td
                            >
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
                            <td
                                ><span class="tag is-warning">GitHub SSO</span
                                ></td
                            >
                            <td
                                ><span class="tag is-link">OAuth2 Proxy</span
                                ></td
                            >
                            <td><span class="tag is-warning">AWS IAM</span></td>
                            <td
                                ><span class="tag is-warning">Google SSO</span
                                ></td
                            >
                        </tr>
                        <tr>
                            <td>Security / Compliance</td>
                            <td
                                ><span class="tag is-warning"
                                    >Cloudflare WAF</span
                                ></td
                            >
                            <td
                                ><span class="tag is-link">RLS + Logging</span
                                ></td
                            >
                            <td><span class="tag is-success">AWS</span></td>
                            <td><span class="tag is-success">Cloudflare</span></td>
                        </tr>
                        <tr>
                            <td>CI / CD</td>
                            <td
                                ><span class="tag is-link"
                                    >GitHub → Netlify</span
                                ></td
                            >
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="content mt-5">
                <p>
                    <span class="legend-box legend-csp"></span> Cloud Service Provider
                    Managed
                </p>
                <p><span class="legend-box legend-self"></span> Self-Managed</p>
                <p>
                    <span class="legend-box legend-shared"></span> Shared Responsibility
                    / Third-Party
                </p>
            </div>

            <h3 class="subtitle is-5 mt-5 has-text-weight-bold">
                Operating Considerations
            </h3>
            <ul>
                <li>
                    <strong class="is-underlined">Web Hosting</strong> – Netlify free-tier deployment with
                    GitHub integration
                </li>
                <li>
                    <strong class="is-underlined">DNS & CDN</strong> – Cloudflare DNS with DDoS protection
                    and WAF rules
                </li>
                <li>
                    <strong class="is-underlined">Source Control</strong> – GitHub repository with automated
                    builds
                </li>
                <li>
                    <strong class="is-underlined">Database</strong> – Self-managed Supabase (PostgreSQL)
                    on Oracle Cloud
                </li>
                <li>
                    <strong class="is-underlined">Database Security</strong> – Row-level security, audit
                    logging, OAuth2 proxy for admin access
                </li>
                <li>
                    <strong class="is-underlined">Email Services</strong> – AWS SES for outbound, Lambda
                    functions for inbound processing
                </li>
                <li>
                    <strong class="is-underlined">File Storage</strong> – Cloudflare R2 integration
                    for document storage
                </li>
                <li>
                    <strong class="is-underlined">Infrastructure Security</strong> – CIS-hardened VM, regular
                    patching, MFA on all cloud accounts
                </li>
                <li>
                    <strong class="is-underlined">SSL/TLS</strong> – Automated certificate management via
                    Caddy reverse proxy
                </li>
            </ul>

            <h3 class="subtitle is-5 mt-5 has-text-weight-bold">
                Architecture Overview
            </h3>
            <div class="content">
                <p>
                    <strong class="is-underlined">Frontend</strong> SvelteKit static site deployed on Netlify,
                    with domain managed through Cloudflare DNS. Cloudflare provides DDoS protection and WAF security
                    rules.
                </p>

                <p>
                    <strong class="is-underlined">Backend</strong> Self-managed Supabase instance running
                    PostgreSQL in Docker on Oracle Cloud. Database
                    endpoints secured with reverse proxy for automatic HTTPS,
                    OAuth2 proxy for admin access, and row-level security for data
                    protection. Automated backups are performed daily and stored in S3.
                </p>

                <p>
                    <strong class="is-underlined">Email</strong> AWS SES handles outbound emails, with
                    inbound processing via Lambda functions. Messages temporarily
                    stored in S3 with daily lifecycle cleanup, routed through SNS
                    topics.
                </p>

                <p>
                    <strong class="is-underlined">Storage</strong> Document uploads stored via Cloudflare R2. All transactional emails BCC'd to Bread Breakers (SG) for audit trail (except approval emails for
                    proper segregation of duties).
                </p>

                <p>
                    <strong class="is-underlined">Security</strong> Multi-factor authentication required
                    for all cloud provider access. VM regularly patched and CIS-hardened.
                    Database logging enabled for all changes. Access controls implemented
                    at multiple layers.
                </p>
            </div>
            <nav class="breadcrumb has-arrow-separator is-centered pt-5" aria-label="breadcrumbs">
            <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/governance">Governance</a></li>
                <li class="is-active">
                    <a href="./" aria-current="page">Tech Stack</a>
                </li>
            </ul>
        </nav>
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
    .legend-csp {
        background-color: #48c774;
    } /* Green */
    .legend-self {
        background-color: #3273dc;
    } /* Blue */
    .legend-shared {
        background-color: #ffdd57;
    } /* Yellow */
</style>