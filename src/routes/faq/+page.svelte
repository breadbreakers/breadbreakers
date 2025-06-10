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

        <h1 class="title has-text-weight-bold pt-4">Frequently Asked Questions</h1>
        <h2 class="subtitle has-text-weight-semibold">About Bread Breakers Singapore</h2>

        <div class="accordion">

            <div class="accordion-item" class:is-active="{activeIndex === 0}">
                <div class="accordion-header" on:click={() => toggleAccordion(0)}>
                    <h3 class="is-6 has-text-weight-bold">What is Bread Breakers Singapore and what do you do?</h3>
                    <span class="icon is-small"><i class="fas fa-angle-down"></i></span>
                </div>
                <div class="accordion-content">
                    <div class="content">
                        <p>
                            Our vision at Bread Breakers Singapore is to see faith transformed into compassionate action, ensuring that no one lacks essential material support. Our mission is to **transparently procure and deliver essential items to vulnerable individuals and families**, working in partnership with social service professionals. Beyond providing goods, we aim to offer **care, dignity, and hope**.
                        </p>
                        <p>
                            The name "Breaking Bread" symbolizes sharing, reflecting our mission to provide essentials from food to household items, ensuring no one is left without their daily bread. For Christians, Jesus is the "Bread of Life," and our work also aims to reflect this deeper provision, sharing Christ's love. It also alludes to the Christian practice of communion, a symbol of unity and equality, with the hope that those we serve may one day share a common table in fellowship.
                        </p>
                    </div>
                </div>
            </div>

            <div class="accordion-item" class:is-active="{activeIndex === 1}">
                <div class="accordion-header" on:click={() => toggleAccordion(1)}>
                    <h3 class="is-6 has-text-weight-bold">Why is a charity like Bread Breakers needed in a progressive nation like Singapore?</h3>
                    <span class="icon is-small"><i class="fas fa-angle-down"></i></span>
                </div>
                <div class="accordion-content">
                    <div class="content">
                        <p>
                            While Singapore is known for its remarkable progress and generosity, the reality of need persists. Many individuals and families struggle daily to afford basic necessities such as **food, diapers, milk powder, or essential appliances like refrigerators or washing machines**, which are fundamental to dignity and well-being. Needs are often urgent, specific, and deeply personal, but connecting them to the right resources is frequently hindered by logistical and administrative complexity.
                        </p>
                        <p>
                            Despite Singapore's image of prosperity, there are often unseen individuals and families facing material hardships, hunger, and even homelessness. The acknowledgement of and grappling with income and wealth inequalities has been slow to reach Singapore's shores, making it difficult to integrate these realities into the narrative of prosperity.
                        </p>
                    </div>
                </div>
            </div>

            <div class="accordion-item" class:is-active="{activeIndex === 2}">
                <div class="accordion-header" on:click={() => toggleAccordion(2)}>
                    <h3 class="is-6 has-text-weight-bold">What challenges do vulnerable individuals and families in Singapore specifically face?</h3>
                    <span class="icon is-small"><i class="fas fa-angle-down"></i></span>
                </div>
                <div class="accordion-content">
                    <div class="content">
                        <p>
                            Low-income individuals and families face a myriad of challenges that go beyond just a lack of money:
                        </p>
                        <ul>
                            <li>
                                <strong>Housing Conditions:</strong> Many live in small HDB rental flats, which are typically 1-room (around 35 sq m) or 2-room (around 45 sq m), significantly smaller than the modal 4-room flats (90 sq m). These flats often suffer from high density, leading to issues with **dirty common areas, pervasive smells, trash, and bed bugs that spread easily**. The limited interior space often means living rooms double as sleeping areas, and there's little privacy for growing children, especially teenagers.
                            </li>
                            <li>
                                <strong>Housing Insecurity:</strong> Despite the HDB's intention not to evict, residents often feel a deep sense of insecurity due to past experiences of homelessness or constant renewals of tenancy and arrears letters, leading to worries about their children becoming homeless if something happens to them.
                            </li>
                            <li>
                                <strong>Economic Strain and Consumerism:</strong> Families often run out of money for food and make choices to eat fewer meals so their children can eat more. Living in a highly consumerist society, surrounded by malls and branded goods, creates constant reminders of their inability to meet their children's desires, leading to frustration and guilt.
                            </li>
                            <li>
                                <strong>Low-Wage Work Challenges:</strong> Many work in the service sector (cleaners, cashiers, delivery personnel) where they are often ignored, invisible, or treated with disrespect. Their jobs often involve **irregular and unpredictable shifts**, making it difficult to plan for childcare or family needs, and they have little to no bargaining power or leave benefits. Fear and anxiety about asking for time off are common.
                            </li>
                            <li>
                                <strong>Childcare and Education Gaps:</strong> Parents struggle to secure stable employment due to childcare challenges. While government-linked childcare is accessible, conditions for full subsidies can be circular (requiring employment), and location issues or care gaps during sickness or holidays persist. Many parents struggle to help children with schoolwork, leading to children falling behind in school and being identified as "weak." This early tracking can lead to low self-esteem and resistance to school.
                            </li>
                            <li>
                                <strong>Dignity and Stigma:</strong> Low-income persons frequently experience micro instances of rudeness and disrespect in daily life. Seeking public assistance is often stigmatizing, involving intrusive personal questions, repeated reviews, and a feeling of being distrusted or interrogated. This process can be dignity-harming and belittling, making people reluctant to seek the help they need.
                            </li>
                            <li>
                                <strong>Lack of Youth Protection:</strong> Older children often spend long hours away from home due to limited private space and find it more pleasant to be out with friends. Low-income parents have limited influence over their kids, as their financial dependence is lower due to part-time work, leading to concerns about kids getting into trouble. Youth in these families bear higher levels of risk and are more vulnerable during familial crises.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="accordion-item" class:is-active="{activeIndex === 3}">
                <div class="accordion-header" on:click={() => toggleAccordion(3)}>
                    <h3 class="is-6 has-text-weight-bold">How does Bread Breakers ensure its operations are trustworthy and effective?</h3>
                    <span class="icon is-small"><i class="fas fa-angle-down"></i></span>
                </div>
                <div class="accordion-content">
                    <div class="content">
                        <p>
                            We are committed to several guiding principles to ensure our work is impactful and reliable:
                        </p>
                        <ul>
                            <li>
                                <strong>Faith-Driven:</strong> Our work is rooted in the teachings of Jesus Christ, exemplifying love in action and serving the poor and marginalized as a spiritual calling centered on individual dignity.
                            </li>
                            <li>
                                <strong>Radical Transparency:</strong> We believe in building trust through openness. Our finances and operations, including monthly bank statements, procurement records, and delivery reports, are fully shared. This open-book approach builds confidence in how donations are used and underscores our commitment to integrity.
                            </li>
                            <li>
                                <strong>Robust Governance:</strong> We combine compassion with sound governance. Our volunteer-led structure has clear roles, policies, and automated oversight mechanisms to ensure ethical and effective operations, believing that love and accountability go hand in hand.
                            </li>
                            <li>
                                <strong>Direct Impact:</strong> Every contribution goes towards verified, urgent needs, delivered quickly and with minimal overhead. By focusing on direct provision and leveraging existing relationships with social workers, we maximize the practical impact of each donation on the ground.
                            </li>
                            <li>
                                <strong>Support for Frontline Workers:</strong> We aim to be a reliable and efficient channel for procuring specific items, directly supporting social workers and freeing up their time to focus on casework and relationship-building with their clients.
                            </li>
                            <li>
                                <strong>Cultivating Community Empathy:</strong> We create opportunities for families, especially those with young children, to connect meaningfully with diverse realities in society. Through acts of giving, they gain a deeper understanding of others' needs and develop empathy and social awareness from a young age.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="accordion-item" class:is-active="{activeIndex === 4}">
                <div class="accordion-header" on:click={() => toggleAccordion(4)}>
                    <h3 class="is-6 has-text-weight-bold">How does Bread Breakers address the issue of dignity for recipients?</h3>
                    <span class="icon is-small"><i class="fas fa-angle-down"></i></span>
                </div>
                <div class="accordion-content">
                    <div class="content">
                        <p>
                            Our work is not only about providing goods; it is fundamentally about offering **care, dignity, and hope**. Each item delivered serves as a tangible reminder that the recipient is seen, valued, and supported. We believe that providing specific items that children want, such as yellow and white soccer boots, is crucial because what we often think of as "wants" are, in certain contexts, actually "dignity needs" that enable belonging and respect within social groups.
                        </p>
                        <p>
                            We understand that dignity is like clean air – its absence is only truly noticed when it's in short supply. Low-income individuals frequently face micro instances of rudeness and disrespect in their daily lives. The current systems of social support can sometimes be dignity-harming due to intrusive questioning and repeated scrutiny. Bread Breakers aims to counteract this by providing support in a way that affirms the recipient's inherent worth, without the stigma often attached to seeking aid. We recognize that true dignity stems from the belief in the inherent worth and integrity of other human beings, not from conditional economic productivity or social status.
                        </p>
                    </div>
                </div>
            </div>

            <div class="accordion-item" class:is-active="{activeIndex === 5}">
                <div class="accordion-header" on:click={() => toggleAccordion(5)}>
                    <h3 class="is-6 has-text-weight-bold">Is poverty in Singapore just about individuals making "bad choices"?</h3>
                    <span class="icon is-small"><i class="fas fa-angle-down"></i></span>
                </div>
                <div class="accordion-content">
                    <div class="content">
                        <p>
                            No, the sources strongly argue against this misconception. Poverty is not primarily about individual failings or "bad choices." While common prejudices suggest low-income persons have different "values" or avoid employment, these are empirically inaccurate and damaging. It is more accurate to say that low-income parents have **bad options** for managing their need for money and their children's need for care, largely due to poor employment conditions and a lack of continuous, unconditional public support.
                        </p>
                        <p>
                            The idea that poverty is an individual "mindset" problem is a powerful distraction from looking at poverty as linked to inequality. The sources highlight that people in positions of authority often hold the mindset that low-income persons' problems are due to not having the "right mindsets," despite the fact that power is a material condition, not a frame of mind. Changing how low-income individuals think about themselves will not change their lack of control over time, leverage in the labor market, or bargaining power with various authorities.
                        </p>
                        <p>
                            Instead, poverty is deeply linked to **structural conditions of inequality**. To study poverty without acknowledging inequality can lead to misrecognizing structural issues as individual failings.
                        </p>
                    </div>
                </div>
            </div>

            <div class="accordion-item" class:is-active="{activeIndex === 6}">
                <div class="accordion-header" on:click={() => toggleAccordion(6)}>
                    <h3 class="is-6 has-text-weight-bold">How does inequality manifest in the everyday lives of low-income families?</h3>
                    <span class="icon is-small"><i class="fas fa-angle-down"></i></span>
                </div>
                <div class="accordion-content">
                    <div class="content">
                        <p>
                            Inequality is an experiential reality, felt in everyone's daily lives. For low-income families, it manifests in:
                        </p>
                        <ul>
                            <li>
                                <strong>Limited Mobility:</strong> While Singapore is seen as a small island, for low-income individuals, it can feel large and rarely explored beyond a few essential places (schools, markets, banks, post office). Their lives are characterized by physical hardship and a strong sense of being "left behind."
                            </li>
                            <li>
                                <strong>Resource Disparity:</strong> They face a lack of private space, limited options for leisure and memory-building activities, and reduced parental authority over older children compared to higher-income families. The quality of services they can access (housing, healthcare, education, childcare) is often dependent on their ability to pay, normalizing different levels of service based on wealth.
                            </li>
                            <li>
                                <strong>Negative Messaging:</strong> Growing up in low-income rental flats means being immersed daily in an environment dominated by negative signage and constant reminders of dangers, in stark contrast to the uplifting messages in other neighborhoods.
                            </li>
                            <li>
                                <strong>Lack of Class Protections:</strong> Youth from low-income families lack the "luxury of time to ride this stage out," often facing early independence, responsibilities (household chores, wage work, parenthood), and higher risks during familial crises.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="accordion-item" class:is-active="{activeIndex === 7}">
                <div class="accordion-header" on:click={() => toggleAccordion(7)}>
                    <h3 class="is-6 has-text-weight-bold">What is the role of the education system in the struggles of low-income families?</h3>
                    <span class="icon is-small"><i class="fas fa-angle-down"></i></span>
                </div>
                <div class="accordion-content">
                    <div class="content">
                        <p>
                            While Singapore's education system is lauded internationally, it also has notable differentiating mechanisms and unequal outcomes:
                        </p>
                        <ul>
                            <li>
                                <strong>Stratified System:</strong> A highly stratified system of tracking (streaming) with high-stakes examinations has existed since 1980, leading to inequalities along ethnic and class lines. Students from "elite" schools disproportionately come from higher socioeconomic backgrounds, while lower educational tracks ('Normal Technical') have a disproportionate number of ethnic minority and low-income students.
                            </li>
                            <li>
                                <strong>Early Disadvantage:</strong> Many low-income children fall behind almost immediately in Primary 1, often lacking sufficient preschool education, English exposure, or reading materials at home. They are often labeled "slow" despite having normal intelligence, leading to low self-esteem and demotivation.
                            </li>
                            <li>
                                <strong>Meritocracy's Flaw:</strong> The system rewards precocity and certain qualities cultivated by wealthier parents (like academic know-how), which can be subtly transmitted as "cultural capital." This means that while the system aspires to fair competition, inequality is a logical outcome, legitimizing those who succeed as "deserving" and implicitly branding those at the bottom as "failed." The tuition and enrichment industries further deepen these disparities, as they are largely inaccessible to low-income families.
                            </li>
                            <li>
                                <strong>Parental Limitations:</strong> Low-income parents struggle to help with homework due to their own educational backgrounds and often feel helpless despite wanting the best for their children. Their authority is also suspect when their own life paths are not seen as "admirable" by conventional societal standards.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="accordion-item" class:is-active="{activeIndex === 8}">
                <div class="accordion-header" on:click={() => toggleAccordion(8)}>
                    <h3 class="is-6 has-text-weight-bold">How do public policies and aid systems impact low-income families?</h3>
                    <span class="icon is-small"><i class="fas fa-angle-down"></i></span>
                </div>
                <div class="accordion-content">
                    <div class="content">
                        <p>
                            Singapore's approach to welfare is characterized by "differentiated deservedness":
                        </p>
                        <ul>
                            <li>
                                <strong>Reliance on Wage Work and Marriage:</strong> Access to public goods like housing, healthcare, and retirement is primarily tied to regular employment and stable marriages. There are no universal provisions, and those without stable wage work or marital ties must depend on family members or, as a last resort, public support.
                            </li>
                            <li>
                                <strong>Individualized and Differentiated Access:</strong> Public goods are accessed based on one's capacity to pay, reinforced by systems like the Central Provident Fund (CPF), where an individual's ability to fund needs depends on their continuous employment and earnings. This means services vary widely in price and quality, normalizing inequality.
                            </li>
                            <li>
                                <strong>Residual, Targeted, and Conditional Aid:</strong> "Welfare" for the "needy" is seen as exceptional, not a universal right. Aid schemes are narrowly targeted (through asset and means tests) and highly conditional, often requiring recipients to prove extreme need and demonstrate specific "mindsets" of self-reliance. This leads to immense social stigma and feelings of indignity for those seeking help.
                            </li>
                            <li>
                                <strong>Institutionalized Tolerance of Suffering:</strong> The rules and criteria for social service providers, including Key Performance Indicators (KPIs) focused on closing cases, can lead to a "tolerated" level of suffering, where chronic needs are rarely resolved sustainably, despite the best intentions of social workers.
                            </li>
                            <li>
                                <strong>Perpetuation of Inequality:</strong> This system, by reinforcing individualism and differentiated deservedness, deepens rather than alleviates inequalities generated by the capitalist economy. It creates a society where people accept that some are more "deserving" than others, hindering collective action for broader change.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="accordion-item" class:is-active="{activeIndex === 9}">
                <div class="accordion-header" on:click={() => toggleAccordion(9)}>
                    <h3 class="is-6 has-text-weight-bold">How can individuals and communities partner with Bread Breakers to help?</h3>
                    <span class="icon is-small"><i class="fas fa-angle-down"></i></span>
                </div>
                <div class="accordion-content">
                    <div class="content">
                        <p>
                            The need for support is present, often unseen yet deeply personal, and the mandate to act is clear. Bread Breakers Singapore exists to be a **trustworthy, efficient, and radically transparent channel for compassionate action**. We invite individuals and communities to partner with us in transforming "wish lists" into real, delivered relief, lightening the load of social workers, and bringing practical faith, hope, and love to those most in need.
                        </p>
                        <p>
                            To address the persistence of poverty and inequality, it is crucial to disrupt the narrative that views poverty as an individual problem and acknowledge that everyone is implicated and entangled in the existing social matrix. We must move beyond viewing "the poor" as an "other" group to "help" and instead understand that wealth and elitism are two sides of the same coin as poverty and marginality. By expanding our narratives and confronting uncomfortable truths about our society, we can begin to talk about meaningful solutions and foster a more empathetic community.
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
        background-color: #f5f5f5;
        padding: 1rem 1.25rem;
        cursor: pointer;
        border-bottom: 1px solid #dbdbdb;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .accordion .accordion-header:hover {
        background-color: #eee;
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

    .accordion .accordion-header .icon {
        transition: transform 0.3s ease-in-out;
    }

    .accordion .accordion-item.is-active .accordion-header .icon {
        transform: rotate(180deg);
    }
</style>
