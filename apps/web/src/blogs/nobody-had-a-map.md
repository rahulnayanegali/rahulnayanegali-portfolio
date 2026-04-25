---
title: "Not Every Solution Is a Product"
tldr: "Won a hackathon, started building the idea, hit a rules-based dead end, then realized the problem itself was more nuanced than an MCP server could solve. Somewhere in that failure the thinking shifted from solving one problem to building for a larger audience."
date: "2026-04-24"
tags: [mcp, sentry, typescript, triage, architecture]
---

### The excitement
In the excitement of celebrating winning a hackathon, I started imagining a system plugging into any source of issues, with enough context, it can root cause and delegate to the right team.

### The build
When I started implementing, I decided to launch a skeleton version, where it only classifies the issue with a triage-context.md file but after building the skeleton I realised that what I am building is a rules-based engine, and there is no AI in play which is what people love these days and how would people adopt it when there is no AI in play.

I was worried about whether people would adopt this, but that was the wrong thing to worry about. This is something teams can implement in their own teams by customizing the triage-context.md and evolving this rulebook every time a new issue surfaces. Building this is more of a consulting engagement than a product.

### The deeper problem
Not every solution could be a product on its own. This was not understood back then when I embarked on the ride to build an MCP server that would make the issue triaging delegated and teams could be productive. Well I was wrong, because the issue I am describing is way more complicated to be solved by an MCP server alone without digging into the nuance of the problem.

Let's see what I had when I started. The team gets issues and they end up spending hours to debug to find it doesn't belong to them. Well this statement is so sloppy because in real time that's not how it works. It is way more. A team gets an issue assigned because their product is surfacing it. Yes the external system you're depending on could be the reason but delegating that is, I guess, my job. To delegate this fast, I need robust test coverage that helps AI to root cause and classify the issue. And for that, AI does not need an MCP server.

### What this means
I think this realization would be a stepping stone to create an upcoming product not just about solving a problem but going out of my way to understand how it caters to a larger audience.