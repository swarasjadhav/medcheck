
Topics data · JS
/**
 * topics-data.js — FINAL 20 curated topics
 * Same content as the planning version, just using `export` instead of
 * `module.exports` since Vite/React projects use ES modules.
 */
 
export const TOPICS = [
  // ---------- STRONG (2) ----------
  {
    id: "exercise-depression",
    claim: "Exercise helps treat depression",
    verdict: "strong",
    short: "Yes — multiple RCTs show real, measurable benefit.",
    explanation:
      "A 2024 meta-analysis of randomized controlled trials found exercise meaningfully reduces depressive symptoms. Walking/jogging, yoga, and strength training showed the strongest effects, with more intense exercise generally producing a bigger effect.",
    limitations: "The result is an average across many trials that used different types and amounts of exercise.",
    wouldChange: "Large trials showing no benefit, or showing the benefit doesn't hold for a specific group.",
    sources: [
      { title: "Exercise for depression: meta-analysis of RCTs", publisher: "BMJ", year: 2024, url: "https://doi.org/10.1136/bmj-2023-075847" },
    ],
  },
  {
    id: "outdoor-time-myopia",
    claim: "Spending time outdoors reduces nearsightedness in kids",
    verdict: "strong",
    short: "A well-designed, large trial found a real, meaningful effect.",
    explanation:
      "A randomized trial in China gave kids an extra 40 minutes outside at school each day. After 3 years, about 30% developed myopia versus nearly 40% in the control group — a meaningful, measured difference from a well-controlled trial.",
    limitations: "This comes from one trial, run in schools in China.",
    wouldChange: "Trials in other countries finding a smaller effect or none.",
    sources: [
      { title: "Outdoor time and myopia incidence in children", publisher: "JAMA", year: 2015, url: "https://jamanetwork.com/journals/jama/article-abstract/2441261" },
    ],
  },
 
  // ---------- LIMITED (4) ----------
  {
    id: "vitamin-c-colds",
    claim: "Vitamin C prevents the common cold",
    verdict: "limited",
    short: "It doesn't prevent colds for most people, but may modestly shorten them.",
    explanation:
      "For most people, regular vitamin C doesn't reduce how often they catch a cold. A Cochrane review of over 11,000 people found it modestly shortens cold duration (8% in adults, 14% in children). It may help prevent colds specifically in people under heavy physical stress, like marathon runners.",
    limitations: "The shortening effect was modest, and the prevention benefit appeared only in people under heavy physical stress.",
    wouldChange: "Large new trials showing vitamin C reduces how often ordinary people catch colds.",
    sources: [
      { title: "Vitamin C for preventing and treating the common cold", publisher: "Cochrane Database of Systematic Reviews", year: 2013, url: "https://pubmed.ncbi.nlm.nih.gov/23440782/" },
    ],
  },
  {
    id: "multivitamins-disease",
    claim: "Multivitamins prevent heart disease and cancer in healthy adults",
    verdict: "limited",
    short: "Major reviews find no meaningful protective effect for most healthy adults.",
    explanation:
      "A USPSTF-commissioned review of 84 RCTs and 6 cohort studies found most vitamin/mineral supplements provide no clinically important protection against cardiovascular disease, cancer, or death in healthy adults without a diagnosed deficiency, with a possible small exception for cancer incidence that has real limitations.",
    limitations: "The findings apply to healthy adults without a deficiency, and the possible small cancer effect has real limitations.",
    wouldChange: "Better trials showing a clear benefit for heart disease, cancer, or death in healthy adults.",
    sources: [
      { title: "Vitamin and mineral supplements for primary prevention of CVD and cancer", publisher: "USPSTF / Annals of Internal Medicine", year: 2022, url: "https://www.uspreventiveservicestaskforce.org/" },
    ],
  },
  {
    id: "probiotics-gut-health",
    claim: "Probiotics improve gut health",
    verdict: "limited",
    short: "Benefit is real but depends heavily on strain and condition — not a blanket fix.",
    explanation:
      "Current gastroenterology guidelines only recommend probiotics within clinical trials for specific conditions like IBS, Crohn's disease, and C. diff infection — not as a general-purpose gut-health booster for everyone.",
    limitations: "Results depend on the strain and the condition, so one finding doesn't apply to every probiotic.",
    wouldChange: "Trials showing a specific strain improves gut health in people without a diagnosed condition.",
    sources: [
      { title: "AGA Clinical Practice Guidelines on Probiotics", publisher: "Gastroenterology (American Gastroenterological Association)", year: 2020, url: "https://doi.org/10.1053/j.gastro.2020.05.059" },
    ],
  },
  {
    id: "energy-drinks-teens",
    claim: "Energy drinks are bad for teens",
    verdict: "limited",
    short: "Linked to several health issues, but mostly through correlational data.",
    explanation:
      "A 2024 review of 57 studies linked energy drink consumption in teens to mental health issues, ADHD symptoms, insulin resistance, and tooth damage. Most of this evidence is correlational rather than proven cause-and-effect.",
    limitations: "Most of the evidence is correlational, so it can't prove energy drinks cause these problems.",
    wouldChange: "Controlled studies that show cause and effect, in either direction.",
    sources: [
      { title: "Energy drink consumption and health outcomes in adolescents", publisher: "Public Health", year: 2024, url: "https://doi.org/10.1016/j.puhe.2023.08.024" },
    ],
  },
 
  // ---------- UNCLEAR (6) ----------
  {
    id: "water-8-glasses",
    claim: "You need to drink 8 glasses of water a day",
    verdict: "unclear",
    short: "There's no strong evidence behind this exact number.",
    explanation:
      "There's no strong clinical evidence behind this specific number. Actual water needs vary by body size, activity level, climate, and diet, since food also provides water.",
    limitations: "Actual needs vary with body size, activity, climate, and diet, so no single number fits everyone.",
    wouldChange: "A strong clinical trial showing a specific daily amount that benefits most people.",
    sources: [
      { title: "Dietary Reference Intakes for Water", publisher: "National Academies of Sciences, Engineering, and Medicine", year: 2005, url: "https://www.nationalacademies.org/" },
    ],
  },
  {
    id: "intermittent-fasting-benefits",
    claim: "Intermittent fasting has proven health benefits beyond calorie restriction",
    verdict: "unclear",
    short: "Works about as well as regular calorie restriction — not clearly superior.",
    explanation:
      "A 2025 review of 99 randomized trials with over 6,500 participants found intermittent fasting produces weight loss similar to standard calorie-restricted diets, not clearly superior. Alternate-day fasting showed a modest short-term edge, but researchers say longer studies are needed.",
    limitations: "Longer studies are still needed, and the short-term edge for alternate-day fasting was modest.",
    wouldChange: "Longer trials showing intermittent fasting clearly beats standard calorie restriction.",
    sources: [
      { title: "Comparative effectiveness of intermittent fasting for weight loss", publisher: "The BMJ", year: 2025, url: "https://temertymedicine.utoronto.ca/" },
    ],
  },
  {
    id: "detox-tea-cleanse",
    claim: "Detox teas and juice cleanses remove toxins from your body",
    verdict: "unclear",
    short: "No evidence they work — but also almost no studies exist either way.",
    explanation:
      "The National Center for Complementary and Integrative Health (part of NIH) states the liver and kidneys already handle detoxification in healthy people, and marketed detox products aren't proven to remove specific toxins. A 2015 review found zero human clinical trials on detox diets at all. Any weight loss comes from severe calorie restriction and typically returns once normal eating resumes.",
    limitations: "Almost no human trials exist, so the lack of evidence reflects a lack of research.",
    wouldChange: "Well-designed human trials showing a detox product removes specific toxins.",
    sources: [
      { title: "Detoxes and Cleanses: What You Need to Know", publisher: "NCCIH (NIH)", year: 2019, url: "https://www.nccih.nih.gov/" },
      { title: "Detox diets for toxin elimination and weight management: a critical review", publisher: "PubMed", year: 2015, url: "https://pubmed.ncbi.nlm.nih.gov/25522674/" },
    ],
  },
  {
    id: "mouth-taping-sleep",
    claim: "Mouth taping helps you sleep better",
    verdict: "unclear",
    short: "Barely studied, and some research flags a safety risk.",
    explanation:
      "A 2025 review of 10 small studies (233 people total) found only 2 showed any benefit, while 4 raised concerns about suffocation risk. This is a case of too little research existing yet, not research disproving the idea.",
    limitations: "The 10 studies reviewed were small (233 people total), and the safety concern came from some of them.",
    wouldChange: "Larger, well-designed trials on both the benefits and the safety.",
    caution: "Some studies flagged a suffocation risk — this isn't just 'unproven,' it may carry real safety concerns.",
    sources: [
      { title: "Mouth taping for sleep: a systematic review", publisher: "PMC", year: 2025, url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12094774" },
    ],
  },
  {
    id: "carrots-night-vision",
    claim: "Eating carrots dramatically improves your night vision",
    verdict: "unclear",
    short: "Vitamin A matters for vision — but carrots won't give you superhuman eyesight.",
    explanation:
      "Carrots contain vitamin A, which is genuinely necessary for normal vision. But the popular version of this myth — that eating lots of carrots gives exceptional night vision — traces back to WWII-era British propaganda used to cover for early radar technology. Getting adequate vitamin A supports normal vision; eating more than you need doesn't improve vision beyond that.",
    limitations: "Vitamin A is needed for normal vision, so the myth exaggerates something partly true.",
    wouldChange: "Research showing extra carrots improve vision in people who already get enough vitamin A.",
    sources: [
      { title: "Common eye and vision myths", publisher: "American Academy of Ophthalmology", year: 2024, url: "https://www.aao.org/" },
    ],
  },
  {
    id: "cold-plunges-immunity",
    claim: "Cold plunges boost your immune system",
    verdict: "unclear",
    short: "A big review found no immune benefit, and one marker briefly got worse.",
    explanation:
      "A 2025 meta-analysis of 11 trials found no effect on immune function, and inflammation markers actually rose short-term after cold exposure. One single study found fewer sick days among people taking cold showers, but one study isn't enough to call this settled either way.",
    limitations: "The review covered 11 trials, and one study found fewer sick days, so the picture isn't settled.",
    wouldChange: "Larger trials showing fewer infections or better immune markers after cold exposure.",
    sources: [
      { title: "Cold water immersion and immune function: a meta-analysis", publisher: "PubMed", year: 2025, url: "https://pubmed.ncbi.nlm.nih.gov/39879231/" },
    ],
  },
 
  // ---------- CONTRADICTS (8) ----------
  {
    id: "mmr-vaccine-autism",
    claim: "The MMR vaccine causes autism",
    verdict: "contradicts",
    short: "Large studies covering hundreds of thousands of children find no link.",
    explanation:
      "Large epidemiological studies and systematic reviews haven't found an increased risk of autism from MMR vaccination. A nationwide Danish cohort study of 657,461 children found no increased autism risk among vaccinated children, including those considered higher-risk for autism. A WHO evidence review published in September 2026 concluded the most methodologically rigorous research doesn't support a causal link between vaccines and autism.",
    limitations: "These are observational studies, since children can't be randomly assigned to go unvaccinated.",
    wouldChange: "Large, rigorous studies finding a higher autism risk after MMR vaccination.",
    sources: [
      { title: "Measles, Mumps, Rubella Vaccination and Autism: A Nationwide Cohort Study", publisher: "Annals of Internal Medicine", year: 2019, url: "https://pubmed.ncbi.nlm.nih.gov/" },
      { title: "Vaccines, thiomersal and autism spectrum disorder: evidence review 2010–2025", publisher: "World Health Organization", year: 2026, url: "https://www.who.int/" },
    ],
  },
  {
    id: "antibiotics-cold-flu",
    claim: "Antibiotics can treat colds and the flu",
    verdict: "contradicts",
    short: "No — antibiotics don't work on viruses.",
    explanation:
      "Antibiotics work against bacteria, not viruses. Colds and the flu are viral illnesses, so antibiotics don't treat the underlying infection or speed recovery from an uncomplicated viral cold or flu. A Cochrane review found no benefit from antibiotics for colds specifically — and taking them unnecessarily still causes side effects and contributes to antibiotic resistance.",
    limitations: "This applies to uncomplicated viral colds and flu, not to bacterial infections.",
    wouldChange: "Trials showing antibiotics speed recovery from an uncomplicated viral cold or flu.",
    sources: [
      { title: "Antibiotic Do's and Don'ts", publisher: "CDC", year: 2024, url: "https://www.cdc.gov/" },
      { title: "Antibiotics for the common cold", publisher: "Cochrane Database of Systematic Reviews", year: 2013, url: "https://doi.org/10.1002/14651858.CD000247.pub3" },
    ],
  },
  {
    id: "sugar-hyperactivity",
    claim: "Sugar causes hyperactivity in children",
    verdict: "contradicts",
    short: "No — at least 12 controlled trials found no link.",
    explanation:
      "At least 12 double-blind, randomized controlled trials have tested this, including in children described as 'sugar-sensitive' and those with ADHD. None found a link between sugar intake and hyperactive behavior. One study found that when mothers were simply told (falsely) their child had eaten sugar, they rated the child as significantly more hyperactive — suggesting the effect comes from expectation, not sugar.",
    limitations: "The conclusion rests on the pattern across at least 12 trials, and parents' expectations can change how they rate behavior.",
    wouldChange: "A well-controlled trial showing a clear effect of sugar on children's behavior.",
    sources: [
      { title: "Medical myths", publisher: "BMJ", year: 2007, url: "https://www.bmj.com/" },
      { title: "Maternal expectancy effects on perceived child behavior", publisher: "Journal of Abnormal Child Psychology", year: 1994, url: "" },
    ],
  },
  {
    id: "knuckle-cracking-arthritis",
    claim: "Cracking your knuckles causes arthritis",
    verdict: "contradicts",
    short: "Studies comparing crackers to non-crackers find no difference.",
    explanation:
      "Studies comparing habitual knuckle-crackers with people who don't crack their knuckles haven't found an increased risk of hand osteoarthritis. One case-control study found that neither years of cracking nor cumulative amount of cracking was significantly associated with osteoarthritis.",
    limitations: "The evidence comes from comparison studies, including one case-control study.",
    wouldChange: "A long-term study following knuckle-crackers over time and finding more hand osteoarthritis.",
    sources: [
      { title: "Knuckle cracking and hand osteoarthritis", publisher: "Journal of the American Board of Family Medicine", year: 2011, url: "https://pubmed.ncbi.nlm.nih.gov/" },
      { title: "Effect of habitual knuckle cracking on hand function", publisher: "PubMed", year: 1990, url: "https://pubmed.ncbi.nlm.nih.gov/" },
    ],
  },
  {
    id: "natural-products-safer",
    claim: "Herbal or 'natural' products are automatically safer than medicines",
    verdict: "contradicts",
    short: "'Natural' isn't a safety guarantee.",
    explanation:
      "Natural products can cause side effects, interact with medications, or cause serious harm. NCCIH notes some herbal products have been linked to liver injury, and supplements can interact with prescription drugs in unpredictable ways.",
    limitations: "This says natural isn't automatically safe. It doesn't say every herbal product is harmful.",
    wouldChange: "Safety evidence for one specific product would apply to that product only, not to all natural products.",
    sources: [
      { title: "Natural Doesn't Necessarily Mean Safer, or Better", publisher: "NIH NCCIH", year: 2023, url: "https://www.nccih.nih.gov/" },
    ],
  },
  {
    id: "acne-dirty-skin",
    claim: "Acne is caused by dirty skin, so washing more will clear it",
    verdict: "contradicts",
    short: "Acne comes from clogged pores and bacteria, not dirt.",
    explanation:
      "Acne develops when pores become clogged with oil and dead skin cells, with bacteria and inflammation contributing to some lesions. Blackheads aren't black because they're filled with dirt — the material darkens after reacting with oxygen. Dermatologists actually warn that over-washing or scrubbing acne-prone skin can irritate it and make breakouts worse.",
    limitations: "Acne has several causes, and bacteria and inflammation play a role in some lesions.",
    wouldChange: "Studies showing that washing more often clears acne.",
    sources: [
      { title: "Acne: Signs and symptoms", publisher: "American Academy of Dermatology", year: 2024, url: "https://www.aad.org/" },
    ],
  },
  {
    id: "blue-light-eye-damage",
    claim: "Blue light from your phone permanently damages your eyes",
    verdict: "contradicts",
    short: "No evidence of permanent damage from normal screen use.",
    explanation:
      "Current human evidence hasn't shown that the small amount of blue light from phones and computer screens causes retinal damage or age-related macular degeneration. Long screen sessions can cause temporary eye strain and dry eyes, and nighttime exposure can interfere with sleep — but those are different from permanent eye damage.",
    limitations: "The evidence covers normal screen use, and long sessions can still cause temporary eye strain and affect sleep.",
    wouldChange: "Long-term human studies linking screen blue light to retinal damage.",
    sources: [
      { title: "Digital Devices and Your Eyes", publisher: "American Academy of Ophthalmology", year: 2025, url: "https://www.aao.org/" },
    ],
  },
  {
    id: "cold-weather-catching-cold",
    claim: "Cold weather directly causes you to catch a cold",
    verdict: "contradicts",
    short: "No — colds are caused by viruses, not temperature.",
    explanation:
      "Colds are caused by viruses, not temperature. Cold weather doesn't cause illness by itself, but it does increase your chances of catching one — people spend more time indoors in close contact with others, and dry winter air can make nasal passages more susceptible to infection.",
    limitations: "Cold weather raises your chances indirectly, through time indoors near others and dry air.",
    wouldChange: "Evidence that cold temperature alone, without a virus, causes a cold.",
    sources: [
      { title: "Can Cold Weather Cause a Cold?", publisher: "Mayo Clinic Minute", year: 2023, url: "https://newsnetwork.mayoclinic.org/" },
    ],
  },
];
 
Claude finished the response
