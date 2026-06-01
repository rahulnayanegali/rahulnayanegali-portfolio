---
title: "knowing closures and knowing where they bite you"
tldr: "Tracing two closure traps that quietly cause memory leaks, and how I found them"
date: "2026-03-29"
tags: [memory leaks, closures, javascript]
---

There is knowing how closures work, and then there is knowing where they will quietly ruin your day. I knew closures remembered their lexical scope. What I did not know was how many ways that memory could hold onto things I thought I had already let go. This post is about two of those ways, and how I traced them down.

---

## Trap 1: The Listener That Would Not Let Go

Suppose we have a list of users and we want to mount them onto the DOM:

```javascript
const users = [  
  { id: 1, name: "Alice", bio: "Long bio...".repeat(1000) },
  { id: 2, name: "Bob", bio: "Another long bio...".repeat(1000) },
  { id: 3, name: "Charlie", bio: "Yet another long bio...".repeat(1000) }
];

users.forEach((user) => {
  const div = document.createElement("div");
  div.className = "user-card";
  div.innerHTML = `
    <p>${user.name}</p>
    <button>Delete</button>
  `;
  document.body.appendChild(div);

  div.querySelector("button").addEventListener("click", () => {
    alert(`Deleting ${user.name}`);
    div.remove();
  });
});
```

This looked innocent to me for a long time. Each user gets a card, each card gets a delete button, clicking removes the card. Clean.

Except it was not clean. Here is what was actually happening:

Each `addEventListener` call created a new closure. That closure captured the `user` object, including `user.bio`, which was a very large string — think 1MB or more per user. When I clicked delete and called `div.remove()`, the element left the DOM visually. But the event listener was still sitting in memory, holding onto that `user` object. The garbage collector saw a live reference inside the listener and left it alone. So even though the card was gone from the screen, its data was not gone from memory.

Multiply that by hundreds of users and the memory tab starts telling a very uncomfortable story.

The fix was to stop creating N closures in the first place. Event delegation: one listener on the parent, no per-user data captured:

```javascript
document.body.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") {
    const card = e.target.closest(".user-card");
    card.remove();
  }
});
```

One listener. No captured user object. The garbage collector is now free to clean up as soon as the DOM node is removed.

---

## Trap 2: The Node That Was Already Gone (But Was Not)

The second trap was more subtle, and I could not see it by reading code. I had to watch it happen.

So I built a small lab. Two buttons: one spawns ten user cards into the DOM, each carrying about 1MB of junk data so the cost shows up clearly in the memory tab. The other clears them. Each card has its own Delete button that removes itself the "correct" way: it strips its own event listener first, then removes itself from the DOM. On paper, nothing should leak.

```javascript
let detachedNodesTracker = [];

const container = document.getElementById("container");
const spawnBtn = document.getElementById("spawn");

spawnBtn.addEventListener("click", () => {
  for (let i = 0; i < 10; i++) {
    const user = {
      id: i,
      name: `User ${i}`,
      heavyData: "X".repeat(1024 * 1024), // ~1MB per user
    };

    const div = document.createElement("div");
    div.className = "user-card";
    div.innerHTML = `
      <p>${user.name}</p>
      <button class="delete-btn">Delete Me</button>
    `;

    detachedNodesTracker.push(div); // The mistake

    div.querySelector(".delete-btn").addEventListener("click", function handler() {
      console.log(`Removing ${user.name}...`);
      this.removeEventListener("click", handler);
      div.remove();
    });

    container.appendChild(div);
  }
});
```

The delete handler here was doing the right things. It removed its own listener before removing the div from the DOM. I thought that was enough.

It was not. The problem was `detachedNodesTracker`.

Every `div` reference was being pushed into that global array. When `div.remove()` ran, the element left the DOM. But the global array still held a reference to it. The garbage collector saw a live reference in `detachedNodesTracker` and kept the node in memory. The node was detached from the DOM, invisible on the screen, but very much alive underneath. Ten spawns at roughly 1MB each, and the memory tab climbed without coming back down.

The fix was one line, on the second button:

```javascript
const spawnRmvBtn = document.getElementById("spawn-rmv");

spawnRmvBtn.addEventListener("click", () => (detachedNodesTracker = []));
```

Once the array was cleared, no more live references. The GC could finally do its job.

---

## What Both Traps Had In Common

A reference that outlived its usefulness.

In the first case, an event listener held onto a large object longer than the DOM node that needed it. In the second, a global array kept pointing to nodes that were already gone from the screen. In both cases the fix was not complex code. It was understanding what was still holding on, and why.

Closures are not the problem. References that stay alive without reason are. Knowing closures is one thing. Knowing what your closures are still holding onto, and for how long, is where the real work begins.