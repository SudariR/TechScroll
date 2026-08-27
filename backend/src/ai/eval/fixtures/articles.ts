export interface EvalArticle {
  slug: string;
  title: string;
  expectedCategory: string;
  content: string;
}

export const EVAL_ARTICLES: EvalArticle[] = [
  {
    slug: 'chip-export-controls',
    title: 'New Export Rules Reshape the Global AI Chip Market',
    expectedCategory: 'HARDWARE',
    content: `
Regulators introduced new restrictions this week limiting the export of
advanced AI accelerators to several markets. The rules cover chips above a
defined performance threshold, measured in total processing performance and
interconnect bandwidth.

Manufacturers had already begun designing region-specific variants that fall
just below previous thresholds. The updated rules narrow that gap, and analysts
expect at least two product lines to be discontinued.

Cloud providers operating in affected regions say they will rely on existing
installed capacity for the next eighteen months. One provider noted that
utilisation of older accelerators has risen from 61 percent to 89 percent
since the first restrictions were announced two years ago.

Industry groups warn the rules may accelerate domestic chip programmes in
affected markets, with three national funding initiatives announced in the
past quarter totalling an estimated 40 billion dollars.
    `.trim(),
  },
  {
    slug: 'npm-supply-chain',
    title: 'Popular Build Tool Compromised in Maintainer Account Takeover',
    expectedCategory: 'CYBERSECURITY',
    content: `
A widely used JavaScript build utility shipped malicious code for roughly six
hours after an attacker gained access to a maintainer account through a
phishing page that mimicked the package registry login.

The injected payload scanned environment variables for cloud credentials and
exfiltrated them to a remote endpoint. Because the package is a transitive
dependency of several popular frameworks, the affected version was downloaded
approximately 190,000 times before it was pulled.

The registry has since revoked the compromised token and published an
advisory. Maintainers of the package have enabled hardware-key two-factor
authentication and moved publishing to a signed CI workflow.

Security researchers note that the median project now carries more than 1,000
transitive dependencies, most of which developers never explicitly选择. Trust
in the supply chain, rather than code quality, is increasingly the weak point.
    `.trim(),
  },
//   {
//     slug: 'database-relicense',
//     title: 'Infrastructure Project Moves From Apache 2.0 to Business Source License',
//     expectedCategory: 'OPEN_SOURCE',
//     content: `
// The maintainers of a widely deployed data streaming platform announced a
// licence change for its next major version, moving from Apache 2.0 to the
// Business Source License with a four-year conversion window.

// The company behind the project cited managed-service competition as the
// reason. Three major cloud providers currently offer hosted versions of the
// software, and the company estimates those services generate several times the
// revenue of its own commercial offering.

// Under the new licence the source remains readable and usable in production,
// but offering it as a competing managed service is prohibited until the
// conversion date, at which point each release reverts to Apache 2.0.

// Within 48 hours, a group of contributors announced a fork of the final
// Apache-licensed commit. Two Linux distributions have said they will package
// the fork rather than the relicensed version.
//     `.trim(),
//   },
//   {
//     slug: 'runtime-release',
//     title: 'JavaScript Runtime Ships Native TypeScript Execution',
//     expectedCategory: 'PROGRAMMING',
//     content: `
// The latest release of a major JavaScript runtime adds the ability to execute
// TypeScript files directly, stripping type annotations at load time without a
// separate build step.

// The implementation performs type erasure only — it does not type-check. Files
// using TypeScript features that require code generation, such as enums and
// parameter properties, are rejected unless a flag is passed.

// Benchmarks published alongside the release show cold-start times for a small
// API server dropping from 840ms with a bundler-based workflow to 310ms with
// native execution.

// The runtime team says the feature is intended for development and scripting
// rather than production builds, where bundling still provides tree-shaking and
// minification.
//     `.trim(),
//   },
//   {
//     slug: 'inference-funding',
//     title: 'Inference Infrastructure Startup Raises Series B at 2.4 Billion Valuation',
//     expectedCategory: 'STARTUPS',
//     content: `
// A startup building inference-optimised serving infrastructure has raised 240
// million dollars in a Series B round, valuing the company at 2.4 billion
// dollars roughly fourteen months after its Series A.

// The company's product routes model requests across heterogeneous hardware,
// selecting the cheapest accelerator that meets a latency target. It claims
// customers reduce inference spend by 38 percent on average.

// Revenue reportedly grew from 4 million dollars to 61 million dollars in
// annualised terms over the last year, driven largely by companies moving from
// prototype to production deployments.

// Investors described inference, rather than training, as the segment where
// long-term compute spending will concentrate, noting that a model is trained
// once but served continuously.
//     `.trim(),
//   },
];