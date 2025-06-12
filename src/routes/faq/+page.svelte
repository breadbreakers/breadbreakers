<svelte:head>
    <title>Bread Breakers Singapore | FAQ</title>
</svelte:head>

<script>
    let activeIndex = null;

    function toggleAccordion(index) {
        activeIndex = activeIndex === index ? null : index;
    }
</script>

<section class="section">
    <div class="container">
        <nav class="breadcrumb has-arrow-separator" aria-label="breadcrumbs">
            <ul>
                <li><a href="/">🏠 Home</a></li>
                <li class="is-active">
                    <a href="./" aria-current="page">FAQ</a>
                </li>
            </ul>
        </nav>

        <h2 class="subtitle has-text-weight-semibold pt-4">FAQ</h2>

        <div class="accordion">
            <div class="content">
                <div class="accordion-item" class:is-active={activeIndex === 1}>
                    <button
                        type="button"
                        class="accordion-header"
                        on:click={() => toggleAccordion(1)}
                    >
                        <h3 class="is-size-6 has-text-weight-normal">
                            What challenges do vulnerable individuals and
                            families in Singapore specifically face?
                        </h3>
                    </button>
                    <div class="accordion-content">
                        <p>
                            Low-income individuals and families face a myriad of
                            challenges:
                        </p>
                        <ul>
                            <li>
                                <strong>Housing Conditions</strong> Many live in
                                small HDB rental flats, which are typically 1-room
                                (around 35 sq m) or 2-room (around 45 sq m). These
                                flats often suffer from high density, leading to
                                issues with dirty common areas, pervasive smells,
                                trash, and bed bugs that spread easily. The limited
                                interior space often means living rooms double as
                                sleeping areas, and there's little privacy for growing
                                children, especially teenagers.
                            </li>
                            <li>
                                <strong>Housing Insecurity</strong> Despite the HDB's
                                intention not to evict, residents often feel a deep
                                sense of insecurity due to past experiences of homelessness
                                or constant renewals of tenancy and arrears letters,
                                leading to worries about their children becoming
                                homeless if something happens to them.
                            </li>
                            <li>
                                <strong>Economic Strain and Consumerism</strong>
                                Families often run out of money for food and make
                                choices to eat fewer meals so their children can
                                eat more. Living in a highly consumerist society,
                                surrounded by malls and branded goods, creates constant
                                reminders of their inability to meet their children's
                                desires, leading to frustration and guilt.
                            </li>
                            <li>
                                <strong>Low-Wage Work Challenges</strong> Many work
                                in the service sector (cleaners, cashiers, delivery
                                personnel) where they may be ignored, invisible,
                                or treated with disrespect. Their jobs often involve
                                irregular and unpredictable shifts, making it difficult
                                to plan for childcare or family needs, and they have
                                little to no bargaining power or leave benefits.
                                Fear and anxiety about asking for time off are common.
                            </li>
                            <li>
                                <strong>Childcare and Education Gaps</strong> Parents
                                struggle to secure stable employment due to childcare
                                challenges. While government-linked childcare is
                                accessible, conditions for full subsidies can be
                                circular (requiring employment), and location issues
                                or care gaps during sickness or holidays persist.
                                Many parents struggle to help children with schoolwork,
                                leading to children falling behind in school and
                                being identified as "weak." This early tracking can
                                lead to low self-esteem and resistance to school.
                            </li>
                            <li>
                                <strong>Dignity and Stigma</strong> Low-income persons
                                frequently experience micro instances of rudeness
                                and disrespect in daily life. Seeking public assistance
                                is often stigmatizing, involving intrusive personal
                                questions, repeated reviews, and a feeling of being
                                distrusted or interrogated. This process can be dignity-harming
                                and belittling, making people reluctant to seek the
                                help they need.
                            </li>
                            <li>
                                <strong>Lack of Youth Protection</strong> Older children
                                often spend long hours away from home due to limited
                                private space and find it more pleasant to be out
                                with friends. Low-income parents have limited influence
                                over their kids, as their financial dependence is
                                lower due to part-time work, leading to concerns
                                about kids getting into trouble. Youth in these families
                                bear higher levels of risk and are more vulnerable
                                during familial crises.
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="accordion-item" class:is-active={activeIndex === 2}>
                    <button
                        type="button"
                        class="accordion-header"
                        on:click={() => toggleAccordion(2)}
                    >
                        <h3 class="is-size-6 has-text-weight-normal">
                            How does Bread Breakers ensure its operations are
                            trustworthy and effective?
                        </h3>
                    </button>
                    <div class="accordion-content">
                        <p>
                            We are committed to several guiding principles to
                            ensure our work is impactful and reliable:
                        </p>
                        <ul>
                            <li>
                                <strong>Faith-Driven</strong> Our work is rooted
                                in the teachings of Jesus Christ, exemplifying love
                                in action and serving the poor and marginalized as
                                a spiritual calling centered on individual dignity.
                            </li>
                            <li>
                                <strong>Radical Transparency</strong> We believe
                                in building trust through openness. Our finances
                                and operations, including monthly bank statements,
                                procurement records, and delivery reports, are fully
                                shared. This open-book approach builds confidence
                                in how donations are used and underscores our commitment
                                to integrity.
                            </li>
                            <li>
                                <strong>Robust Governance</strong> We combine compassion
                                with sound governance. Our volunteer-led structure
                                has clear roles, policies, and automated oversight
                                mechanisms to ensure ethical and effective operations,
                                believing that love and accountability go hand in
                                hand.
                            </li>
                            <li>
                                <strong>Direct Impact</strong> Every contribution
                                goes towards verified, urgent needs, delivered quickly
                                and with minimal overhead. By focusing on direct
                                provision and leveraging existing relationships with
                                social workers, we maximize the practical impact
                                of each donation on the ground.
                            </li>
                            <li>
                                <strong>Support for Frontline Workers</strong> We
                                aim to be a reliable and efficient channel for procuring
                                specific items, directly supporting social workers
                                and freeing up their time to focus on casework and
                                relationship-building with their clients.
                            </li>
                            <li>
                                <strong>Cultivating Community Empathy</strong> We
                                create opportunities for families, especially those
                                with young children, to connect meaningfully with
                                diverse realities in society. Through acts of giving,
                                they gain a deeper understanding of others' needs
                                and develop empathy and social awareness from a young
                                age.
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="accordion-item" class:is-active={activeIndex === 3}>
                    <button
                        type="button"
                        class="accordion-header"
                        on:click={() => toggleAccordion(3)}
                    >
                        <h3 class="is-size-6 has-text-weight-normal">
                            How does Bread Breakers address the issue of dignity
                            for recipients?
                        </h3>
                    </button>
                    <div class="accordion-content">
                        <p>
                            Our work is not only about providing goods; it is
                            fundamentally about offering care, dignity, and
                            hope. Each item delivered serves as a tangible
                            reminder that the recipient is seen, valued, and
                            supported. We believe that providing specific items
                            that children want, such as yellow and white soccer
                            boots, is crucial because what we often think of as
                            "wants" are, in certain contexts, actually "dignity
                            needs" that enable belonging and respect within
                            social groups.
                        </p>
                        <p>
                            Low-income individuals frequently face micro
                            instances of rudeness and disrespect in their daily
                            lives. The current systems of social support can
                            sometimes be dignity-harming due to intrusive
                            questioning and repeated scrutiny. Bread Breakers
                            aims to counteract this by providing support in a
                            way that affirms the recipient's inherent worth,
                            without the stigma often attached to seeking aid. We
                            recognize that true dignity stems from the belief in
                            the inherent worth and integrity of other human
                            beings, not from conditional economic productivity
                            or social status.
                        </p>
                    </div>
                </div>

                <div class="accordion-item" class:is-active={activeIndex === 4}>
                    <button
                        type="button"
                        class="accordion-header"
                        on:click={() => toggleAccordion(4)}
                    >
                        <h3 class="is-size-6 has-text-weight-normal">
                            Is poverty in Singapore just about individuals
                            making "bad choices"?
                        </h3>
                    </button>
                    <div class="accordion-content">
                        <p>
                            Poverty is not primarily about individual failings
                            or "bad choices." While common prejudices suggest
                            low-income persons have different "values" or avoid
                            employment, these are empirically inaccurate and
                            damaging. It is more accurate to say that low-income
                            parents have limited options for managing their need
                            for money and their children's need for care,
                            largely due to poor employment conditions and a lack
                            of continuous, unconditional public support.
                        </p>
                        <p>
                            The idea that poverty is an individual "mindset"
                            problem is a powerful distraction from looking at
                            poverty as linked to inequality. People in positions
                            of authority often hold the mindset that low-income
                            persons' problems are due to not having the "right
                            mindsets," despite the fact that power is a material
                            condition, not a frame of mind. Changing how
                            low-income individuals think about themselves will
                            not change their lack of control over time, leverage
                            in the labor market, or bargaining power with
                            various authorities.
                        </p>
                        <p>
                            Instead, poverty is deeply linked to structural
                            conditions of inequality. To study poverty without
                            acknowledging inequality can lead to misrecognizing
                            structural issues as individual failings.
                        </p>
                    </div>
                </div>

                <div class="accordion-item" class:is-active={activeIndex === 5}>
                    <button
                        type="button"
                        class="accordion-header"
                        on:click={() => toggleAccordion(5)}
                    >
                        <h3 class="is-size-6 has-text-weight-normal">
                            How can individuals and communities partner with
                            Bread Breakers to help?
                        </h3>
                    </button>
                    <div class="accordion-content">
                        <p>
                            The need for support is present, often unseen yet
                            deeply personal, and the mandate to act is clear.
                            Bread Breakers Singapore exists to be a trustworthy,
                            efficient, and radically transparent channel for
                            compassionate action. We invite individuals and
                            communities to partner with us in transforming "wish
                            lists" into real, delivered relief, lightening the
                            load of social workers, and bringing practical
                            faith, hope, and love to those most in need.
                        </p>
                        <p>
                            To address the persistence of poverty and
                            inequality, it is crucial to disrupt the narrative
                            that views poverty as an individual problem and
                            acknowledge that everyone is implicated and
                            entangled in the existing social matrix. We must
                            move beyond viewing "the poor" as an "other" group
                            to "help" and instead understand that wealth and
                            elitism are two sides of the same coin as poverty
                            and marginality. By expanding our narratives and
                            confronting uncomfortable truths about our society,
                            we can begin to talk about meaningful solutions and
                            foster a more empathetic community.
                        </p>
                    </div>
                </div>

                <div class="accordion-item" class:is-active={activeIndex === 6}>
                    <button
                        type="button"
                        class="accordion-header"
                        on:click={() => toggleAccordion(6)}
                    >
                        <h3 class="is-size-6 has-text-weight-normal">
                            Should I still donate when the beneficiary seems to
                            have an abundance of items at home?
                        </h3>
                    </button>
                    <div class="accordion-content">
                        <p>
                            Many donated items, especially consumables like
                            food, toiletries, or certain household essentials,
                            are used up quickly. What appears as 'a lot' today
                            might be depleted in a few weeks, or even days.
                            Needs are ongoing, not a one-time fix.
                        </p>
                        <p>
                            We focus on providing specific, verified items that
                            have been identified as critical by social workers.
                            The items you see might not address the precise,
                            current, and urgent need on our list. Your donation
                            ensures a very particular gap is filled.
                        </p>
                        <p>
                            Our process ensures that individuals receive exactly
                            what they need, not just generic aid. This prevents
                            waste and respects the dignity of the beneficiary by
                            not overloading them with items they don't
                            explicitly require.
                        </p>
                    </div>
                </div>

                <div class="accordion-item" class:is-active={activeIndex === 7}>
                    <button
                        type="button"
                        class="accordion-header"
                        on:click={() => toggleAccordion(7)}
                    >
                        <h3 class="is-size-6 has-text-weight-normal">
                            Can I give more than what was requested for a
                            beneficiary?
                        </h3>
                    </button>
                    <div class="accordion-content">
                        <p>
                            Providing a beneficiary with significantly more than
                            their declared or verified needs can inadvertently
                            complicate their standing with social service
                            agencies. It might create a perception that their
                            financial situation is better than what they've
                            declared, potentially impacting their eligibility
                            for crucial long-term or ongoing government and
                            social support schemes. Our priority is to ensure
                            they receive appropriate aid without jeopardizing
                            their overall support network.
                        </p>
                    </div>
                </div>

                <div class="accordion-item" class:is-active={activeIndex === 8}>
                    <button
                        type="button"
                        class="accordion-header"
                        on:click={() => toggleAccordion(8)}
                    >
                        <h3 class="is-size-6 has-text-weight-normal">
                            Can I donate to non-individuals (e.g., if a VWO
                            requests for 50 bottles of ketchup)?
                        </h3>
                    </button>
                    <div class="accordion-content">
                        <p>
                            There are many other excellent charities and
                            platforms that specialize in supporting VWOs and
                            community pantries directly. We encourage you to
                            explore those avenues if you wish to contribute in
                            that manner. Our niche is ensuring direct,
                            person-to-person impact.
                        </p>
                    </div>
                </div>

                <div class="accordion-item" class:is-active={activeIndex === 9}>
                    <button
                        type="button"
                        class="accordion-header"
                        on:click={() => toggleAccordion(9)}
                    >
                        <h3 class="is-size-6 has-text-weight-normal">
                            Some beneficiaries request
                            branded or slightly more expensive items. Should
                            these requests be fulfilled?
                        </h3>
                    </button>
                    <div class="accordion-content">
                        <p>
                            Our mission is to serve the needy without judgment.
                            While it might seem counterintuitive to provide what
                            appears to be a "luxury" item, everyone has a right
                            to choice and preferences, even in challenging
                            circumstances. There are often nuances we aren't
                            aware of. For example, a baby might experience hives
                            or rashes from certain diaper brands, necessitating
                            a specific, seemingly more expensive alternative.
                            Similarly, allergies to particular milk powders
                            could mean a child requires a specialized,
                            higher-cost formula. We trust that beneficiaries are
                            requesting items based on genuine needs and personal
                            preferences, and our role is to provide support, not
                            to question their specific requirements.
                        </p>
                    </div>
                </div>

                <div class="accordion-item" class:is-active={activeIndex === 10}>
                    <button
                        type="button"
                        class="accordion-header"
                        on:click={() => toggleAccordion(10)}
                    >
                        <h3 class="is-size-6 has-text-weight-normal">
                            How does Bread Breakers Singapore prevent conflicts of interest, such as social workers procuring, receiving or using donated items?
                        </h3>
                    </button>
                    <div class="accordion-content">
                        <p>
                            Social workers only identify and verify needs. They do not handle donations, funds, or item procurement. All purchases are made by our trusted partners. Proof of delivery is documented and reflected on our website to ensure full accountability.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<style>
    /* Basic Accordion Styles */
    .accordion .accordion-header {
        background-color: #fff;
        padding: 0.75em 0.75em;
        cursor: pointer;
        border: none;
        border-bottom: 1px solid #eee;
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        text-align: left;
    }

    .accordion .accordion-header:hover {
        text-decoration: underline;
    }

    .accordion .accordion-content {
        padding: 1.25rem;
        border-bottom: 1px solid #dbdbdb;
        display: none;
        overflow: hidden;
        transition: max-height 0.3s ease-out;
    }

    .accordion .accordion-item.is-active .accordion-content {
        display: block;
    }

    h3 {
        margin: 0;
    }
</style>
