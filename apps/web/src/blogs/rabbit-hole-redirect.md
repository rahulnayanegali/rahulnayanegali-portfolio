---
title: "Rabbit-hole Redirect"
tldr: "Paid $20 to attend a PM hackathon as an engineer, pivoted our idea during a throttling error, and won by trusting instinct over comparison. Still trying to put into words what letting go actually means."
date: "2026-04-20"
tags: [hackathon, ai, letting-go, product-management, engineering]
---

I was invited to a product manager’s AI meetup from a friend and by that time early bird seats were filled and I had to pay $20. Well I was hesitant paying for PMs while being an engineer should be investing that money in an engineering hackathon. 

To be honest I was positive about the meetup because AI in the PM space felt like a driving force and I did imagine giving success speech but it didn’t go as imagined (spoiler - we won!). We were given three choices: a mascot, Solve for NYC, and an AI tool for PM. We chose AI tool for PM.

We started taking ideas off our minds onto paper and considering the rubric, the collective consensus was to give them what they want i.e., create a tool under the boundary of the host applications’ capabilities.

### Seed

Initial idea was to implement a PM handover - departing PM hands over the context to the new. It usually takes months to get overall understanding for the new PM but an AI assistant with all the context can reduce the context-switching overhead to unblock the PM to focus on doing real work. 

### Pivot

During the hackathon, the host application started throwing almighty `429 lambda throttling error`
 and it kind of paralysed us from making progress but it turned out to be great `Do Nothing`
time for me to join the dots with an existing webhook in the host app to come up with a path to solve the notorious rabbit-hole redirect issue we’ve all faced.

The host application had a Sentry issues webhook which I quickly tested by creating issues from a dummy react app and tried fetching those issues via the host AI super agent and DAMN, it listed all the unresolved issues.

### The digressing

We were getting distracted by others doing heads down coding and lots of gymnastics to present but we stopped ourselves from going towards building a fancy tech solution because the expectation was totally different here by making the PM’s life easier when using the host application at their disposal.

### The Edge

Our idea was to bring something the existing host application cannot do. It was the context. We created a triage context with information about the different projects and teams’ email IDs and instructions for the AI agent to root cause the Sentry issue with this context and give results with the root cause and relevant team assignment to resolve this.

### ???

We could get the full root cause issue description with classification but further emailing to the relevant team could not be achieved due to limited capabilities of the host app. With less than 4 minutes to submission, we quickly recorded the YouTube video and hosted the triage context doc in GitHub Gist and submitted. 

### The winning

It was a surprise to some extent because in the entire hackathon I had decided I would stick to my gut and take actions to do the right thing based on my instinctual understanding, not pivot by comparing with others and definitely was not needy for a win. 

Letting go is tricky to understand like you are doing the right thing as per the rubric but not distracted by any intermediate attractions because if you get distracted then you are desperate to win otherwise you trust yourself. But in reality the same instinct could be followed by others as well still they would win and you may lose even though you did everything right. 

At this very moment I am writing this, it is so tricky to put into words because the mind is the same desire and desired. Dog trying to catch its own tail. 

So letting go is about trusting your instinctual actions and not being swayed by your identity (that hesitated to pay $20) as long as you are certain about yours?
