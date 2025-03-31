Problem statement Idea description
Cardano doesn’t have a lightweight, autonomous login mechanism.. As a result apps depend on legacy systems to authenticate users, limiting growth and decentralization
adoption
collaboration
scaling
[GENERAL] Proposal title
Please indicate if your proposal has been auto-translated into English from another language.
No
[GENERAL] Summarize your solution to the problem.
Answer
Develop a decentralized, open-source authentication system that uses open standards and provides a way to login with just the Cardano blockchain.
[GENERAL] Summarize your relevant experience.
Answer
Developers of the AIM Community Tools. Successfully funded (since F4), active community members (PAs, vPAs). 30+ years of combined experience in software development (Java, TS, JS, PHP, Swift, bash). 15+ years of experience in devops and sysadm. Atala PRISM Pioneers (2nd cohort)
[GENERAL] Website/GitHub repository, or any other relevant link.
Relevant link 1
https://github.com/Project-Catalyst/cauth
Relevant link 2
https://cardanocataly.st
[GENERAL] Requested funds in USD.
Answer
35500
[IMPACT] Please describe your proposed solution.
Answer
The Cardano ecosystem is growing rapidly and many solutions in the ecosystem (https://www.cardanocube.io/cardano-ecosystem-interactive-map) require users to authenticate. Usually with login/e-mail and a password. This adds to what is commonly known as password chaos and password fatigue and is also a potential security risk. A common alternative for developers is to allow login via a 3rd party, such as Discord, Google, Facebook, Twitter, Apple or some other corporation. This however leads in most cases to feeding the centralization of the Internet, which can tie the app and the users to a service, creating a vendor lock in (i.e. you need to have the account to be able to login). It also prevents the system from being truly decentralized. The identity of the person is owned by the system, so it’s not self-sovereign.

Web 3 gives an opportunity to assist with the various issues associated with Web 2.0 Identity and authentication. Users can own their credentials and only show them to the service in order to access it.

The community uses a number of tools and platforms that require authentication, but we don’t have a common authentication system, so we depend on word of mouth and personal relations of trust. As the community grows it gets harder and harder to know if the person can be trusted, Cardano blockchain and existing standards like DID, Oauth 2.0 and SAML 2.0 give a way to provide authentication, while respecting users privacy and self-sovereignty. We want to promote openness and security to avoid situations where accounts can get hacked (as we have seen in the Catalyst Discord server) which can happen with legacy authentication systems.

We propose a lightweight solution that will use NFTs and CIP30(https://cips.cardano.org/cips/cip30/) compatible wallets together with enhancement of work done in F7 proposal NFT Based Authentication by Loxe (https://cardano.ideascale.com/c/idea/384854) under Apache License 2.0 to provide users a way to sign-in with Cardano wallet.

You click Login with Cardano Wallet
You connect to a wallet (CIP 30 compatible)
Your access is granted by means of an NFT, if you don’t have an NFT required to access this resource or your NFT is no longer valid your access is denied. There are more technical nuances to this process that are omitted here.
Alternatively, if the resource you want to access has specified a custom policy, it is launched

If you are wondering why we would decide to use NFTs, when there are DIDs, you are right to ask! In fact, our original Fund 8 proposal (https://cardano.ideascale.com/c/idea/398403) did just that. We received high evaluation marks and were close to getting funded.
Not getting funded turned out to be a blessing in disguise, it allowed us to reevaluate our approach. Results of the “F7 NFT Based Authentication” were published in the meantime.
We realized that we were trying to solve too many problems at once, hence the scope, size of the budget and risks were too big. The main reason for it was that the Cardano DID ecosystem is in the infrastructure building phase and thus not ready for mass adoption.

Using NFTs and existing wallets we can greatly simplify the architecture and provide a solution that can be mass adopted, fast.
We want to provide a library that will make it easy to enable Login with Cardano in existing and new dapps, websites.
We aim to build a set of scripts and a self-hosted web app that will provide a no code environment for creating those NFTs.
Additionally we want to provide a self-hosted Oauth 2.0 <-> blockchain gateway for all those web 2.0 applications which allow Oauth, but integrating a new authentication method is too cumbersome or costly.
All code will be open source and hosted in publicly available repositories.
[IMPACT] Please describe how your proposed solution will address the Challenge that you have submitted it in.
Answer
Will our solution increase the number of dapps or products available. While we can claim this will happen directly we see this mechanism as one enabling new use cases. As the community is maturing new and more complex tools are being built. These tools need to store data. Most of the data does not need to be stored on the chain, either it’s private/shared between interested parties or it’s something you are working on and don’t want to put it on the chain just yet.

Just to give a few examples. Imagine you're a PA and you want to assess proposals. You could use AIM Tool (https://cardanocataly.st/ca-tool/#/). It's great, much more convenient than ideascale, but the application doesn’t use a backend, if it did, then it would need to have a state and that state would need authentication. In order not to add to password fatigue or create a dependency on authentication provider it opted for BYOD (Bring Your Own Data) model. Data is kept in browser storage and it can be always downloaded. If you want to work on another computer (mobile) you need to migrate the state manually, it quickly becomes a pain.

Another example is Dework (https://dework.xyz/) a dApp for managing DAO projects, it has a state, hence it needs authentication, how do they solve that? By using Discord authentication.

We also have a wiki(https://wiki.cardanocataly.st/en/home) we have setup to manage content of Cardano Community Site (https://cardanocataly.st/), where we would like to test Oauth gateway.
The content of the website is public, but we don’t want just anyone to be able to edit.

By implementing this solution we will enable new scenarios. Using NFTs can provide additional levels of security, because we can encrypt data stored in the database, so only the user can read it.

We think that we have a chance to influence all Challenge KPIs. Additionally by exposing Cardano to new users.
[IMPACT] What are the main risks that could prevent you from delivering the project successfully and please explain how you will mitigate each risk?
Answer
Not all use cases can be viable due to NFT issuing costs, we intend to investigate running costs and work out solutions and strategies for minimizing them.

There is always a risk that DID based solutions will come before we have our solution running. However SSI and DID are complex and as such take a long time to develop, so we estimate it’s low probability. Nevertheless there is space in the Cardano ecosystem for more than one solution.

There is an already funded (Fund 8) proposal “Sign-in with Cardano” (https://cardano.ideascale.com/c/idea/400022), but they want to use DIDs and a dedicated wallet app. We aim to be more lightweight and leverage existing standards and wallets. CIP-30 is widely implemented. (https://www.cardano-caniuse.io/) As such we see our solution as providing value and a viable alternative.

When we wanted to implement this solution using DIDs we were worried about complexity, by reducing complexity with the use of NFTs and standards we don’t see it as an issue anymore. We have well defined parts and experience to implement them.

Obsoletion. There is a risk of this solution becoming obsolete when DIDs and wallets supporting them become widely available. We think there will still be room for our solution, not everyone wants to deploy the whole DID infrastructure or install a separate wallet just to be able to login. By using NFT Metadata Standard(CIP25)(https://cips.cardano.org/cips/cip25/), we can bridge our solution to DID infrastructure.
[FEASIBILITY] Please provide a detailed plan, including timeline and key milestones for delivering your proposal.
Answer
Roadmap:
September 2022
Plan and establish procedures
Review state of the ecosystem
UI/UX design and prototyping
Develop MVP dApp for issuing NFT credentials
October 2022
Develop client library (JS) and implement it in AIM tools
Publish client library code on GitHub and binaries in the npm registry
Presentation and result dissemination (social media, Townhall, articles etc.)
November 2022
Develop backend library for Node JS and Java
Publish code on github and binaries in respective registries
Presentation and result dissemination (social media, Townhall, articles etc.)
December 2022
Develop the OAuth <-> blockchain bridge
Publish code on github and binaries in respective registries
Presentation and result dissemination (social media, Townhall, articles etc.)
January 2022
Improve and finalize dApp for credentials (UI/UX, bugfix)
Finalize development (optimization, testing, QA, final code review)
Code freeze
Security audit
Write documentation and articles
February 2022
Implement results of security audit
Finalize documentation
Close proposal


Deliverables:
Client library code and binaries
Backend library code and binaries
Oauth bridge code and binaries
dApp code and binaries
Documentation
Security audit results
Promotional materials (articles, video, etc.)
[FEASIBILITY] Please provide a detailed budget breakdown.
Answer
Project Management - $4500 (over 6 months) ~ 90 hours
Proposal writing, Project oversight and define future directions, Manage partnerships, represent the project externally (e.g. TH and Community Initiatives), Manage project's finance.
Submission of reports, recording of meeting minutes, purchase of tools, project support staff and sundry expenses.

Design - $3000
Designing the UI/UX for the website and dApp, promotional materials brand etc.

Research - $1000
Establishing current state of the art, analyzing and adjusting planned work.

Development - $24000
Creating code for all the modules, tests, code reviews, etc. ~ 720 hours
Documentation Writing - $3000

Total of $35500
[FEASIBILITY] Please provide details of the people who will work on the project.
Answer
Phil Khoo: Project Lead - Veteran Community Advisor (vCA/vPA), co-creator of and project lead on the Community Tools (Proposer/CA/vCA/Voter Tools and Community Landing page), front end UI/UX designer and finance and business background.

Michał Wojtera: full stack developer, sysadmin and researcher with 15+ years of experience, Java, SQL, NoSQL, Javascript, Typescript, Vue.js, Node.js, Linux Administration, Docker, Virtualisation, Veteran Community Advisor (vCA/vPA), co-creator of Community Landing Page PRISM Pioneer 2nd cohort. 9 peer-reviewed publications https://github.com/mwojtera https://github.com/Project-Catalyst/

The AIM Developer team. The team is a growing part of Cardano AIM and we will look to hire/contract additional talent as needed. The team will be responsible for webpage development and wallet integration.
[FEASIBILITY] If you are funded, will you return to Catalyst in a later round for further funding? Please explain why / why not.
Answer
Additional funds will not be required to further develop this project. In the future we can see that DID integration including PRISM may prove valuable. Work by others is being done in this space so funds may be sought for development of a specific solution or integration with another’s solution. An external party security audit may also be required in the future for security testing of the code to provide surety.
[FEASIBILITY] Are you or any member of your team working on any other proposals in this Fund9?
Yes/No
No
[FEASIBILITY] Are you or your team working on any other proposals from previous Funds?
Yes/No
Yes
[AUDITABILITY] Please describe what you will measure to track your project's progress, and how will you measure these?
Answer
Number of Github commits
Milestones reached
Deliverables as specified above
Number of Github issues opened/resolved
Number of Github PR reviewed / merged / accepted
Number of feedback received and implemented
Number forks, clones, binary downloads etc.
Number of DAOs, dApps and websites that use our solution
[AUDITABILITY] What does success for this project look like?
Answer
We have a working solution that we can use in all AIM tool and Catalyst Community Website. Our project is implemented, forked, cloned and further developed by different community tools, dApps, etc.
[AUDITABILITY] Please provide information on whether this proposal is a continuation of a previously funded project in Catalyst or an entirely new one.
Answer
This is not a continuation funding of an existing project, however it is a logical step in the development of various community projects including AIM vCA-tool https://cardanocataly.st/vca-tool (to be renamed to vpa-tool), Community participation in the Community landing page https://cardanocataly.st