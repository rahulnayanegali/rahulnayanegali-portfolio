---
title: "Why We Module Federated Widget Instead of Publishing It as an npm Package"
tldr: "Module Federation gives teams independent deployments inside a company. npm packages give external consumers upgrade control. The right choice depends on how many teams you cannot coordinate with."
date: "2026-05-17"
tags: [module-federation, micro-frontends, webpack, architecture, javascript]
---


#### Why Micro-services ??

I remember an Amazon engineer narrating a story from 2000s where they used to hit compile at the end of day go home and come back next day to let it finish compiling. Re-deploying one service change meant, re-deploying everything. One of the main reasons teams shifted was to give each service its own ownership, which then unblocked scaling and fault isolation. Not all moved due to this concern though, mostly they wanted to surface microservices on their resumes because big tech like Amazon and Netflix were bullish on this lol..

#### Why Micro-frontend though ?

Well before digging into this, we need clarity on the problem we are facing because there are many types of micro-frontends out there and we are mainly narrowing on the module federated type and understanding how it is different from moving a piece of frontend into a separate npm package.

Consider a subset of your DOM, say a checkout widget or a navigation bar, that is owned by a team who has their own development life cycle with their own context as well as some shared context from the parent.

#### Problems in a shared frontend app

Even though there is a clear separation of ownership, the code still gets modified by other teams to get things done, creating weekly or bi-weekly merge conflicts and jamming the deployment pipeline.

#### Module Federate the DOM subset

We moved to a separate package by clearly defining a contract to be honoured by the host application. We call the host application the shell and the micro-frontend as remote. It requires some webpack configuration on both sides because, we want to share the same libraries, in this case if both shell and remote have their own react version, it could break the application due to two versions. Two React instances in the same page create two separate event systems that conflict silently at runtime. So the webpack configuration allows either shell or remote to share libraries.

#### Why not publish this as separate npm package?

npm package has an overhead of adding shell's bundle size and shell does not get latest features unless it downloads the latest version.

That said, as long as the host base is small, module federation works because contract changes and breaking changes can be coordinated, but as the userbase grows, I would recommend making this into its own package because the shell team can upgrade on their own schedule without being forced into an immediate breaking change.