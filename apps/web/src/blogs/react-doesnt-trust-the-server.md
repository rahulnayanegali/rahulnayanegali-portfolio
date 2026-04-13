---
title: "React Doesn't Trust the Server"
tldr: "I thought SSR just 'ran React on the server.' Then I asked why the browser runs it again."
date: "2026-04-13"
tags: ["react", "csr", "ssr", "event delegation", "hydration"]
---

Someone at a meetup once said 'Next.js does more than SEO', I nodded and moved on. It only clicked when I deployed a CSR app on a CDN and stared at an empty div.

### Why SSR at first place?

It is a bit nuanced than SEO argument. CSR just ships an empty div, browser needs time to render First Contentful Paint by running javascript to create a DOM whereas SSR comes with HTML skeleton ready significantly reduces the FCP impacting bounce rate and conversion on a slow internet devices. 

### React Hydration

When a server side rendered component renders, why is javascript running immediately on a browser?

Well it turns out it is far simpler than we think, we need to understand react or next as tools and not something different. Like no matter what tools do we use, browser still wants html, css and javascript; three separate files and it does not partially support any specific tool files. All these tools are made to make a developers lives as well as UX better from behind the scenes to only end up making the fundamental html css and js files. 

The better way to understand these tools is to understand the browser critical rendering path and where tools intersect in this path is the first principle way approach.

![critical-rendering-path.webp](/blogs/critical-rendering-path.webp)

Client Side Rendering - browser receives an html with body containing just `<div id="root"></div>` this div elements starts populating at stage 6 when browser runs the downloaded javascript eventually re-starting the process again after from stage 3.

Server Side Rendering - browser receives the actual ready html but still runs javascript at stage 6 because at this moment the html is still a static site with no interactivity. Here running javascript is to attach event listeners to the static html to make it interactive and this is a react process called ***hydration running in client browser.***

### Does React trust the server's HTML or validate it?

React doesn't trust the server, it verifies. When the deferred script executes, it calls hydrateRoot with the root container and the App component:

``` javascript
import { hydrateRoot } from 'react-dom/client';
import App from './App';
// Hydrate reuses existing DOM, attaches event listeners 
hydrateRoot(document.getElementById('root'), <App />);
```
This triggers a single O(n) pass.  React walks its fiber tree and the existing server-rendered DOM simultaneously, matching nodes positionally by tag name. When a node matches, React doesn't create a new DOM element. It adopts the existing one:
```javascript 
fiber.stateNode = domNode
```
That reference is what makes future state updates and event delegation work. React now owns that real node.

If tags don't match at a position, React logs `Expected server HTML to contain a matching…` and throws away the server HTML for that subtree, falling back to client-side rendering from that node down. You already paid the SSR cost on the server. Now you pay the CSR cost in the browser too. Worst of both worlds.

This is why hydration mismatches aren't just a console warning, they're a correctness and performance failure.

### How those listeners actually attach

In any vanillaJs code, we would add event listeners to the respective elements or do a slight optimisation by adding one at the parent to leverage event delegation but React leverages event delegation astronomically by adding one listener per event type at the root and when an event fires, walks the fiber tree from the event target upward to find and trigger the matching callback.

### How UX impacts in both these cases

We need to focus FCP (First-Contentful-Paint) and TTI(Time-To-Interactive).
**CSR**
FCP and TTI are basically the same event. The page is blank until JS runs, but once JS runs it renders and wires up listeners in the same pass. So:

```blank → [JS executes] → painted + interactive simultaneously```

**SSR**
The browser paints real HTML fast, user sees a product page, a nav, a button. But that button does nothing. Clicks are silently swallowed. JS hasn't run yet so no listeners exist. This gap between FCP and TTI is called the "**uncanny valley**" — the page looks alive but isn't.

```painted (FCP) → [JS downloads + executes hydrateRoot] → interactive (TTI)```

References:

https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/Critical_rendering_path

https://18.react.dev/reference/react-dom/client/hydrateRoot
