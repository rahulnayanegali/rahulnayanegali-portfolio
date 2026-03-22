---
title: "A deliberate problem solving framework from Raw Instincts"
tldr: "Stepping back from reflexive coding to become a problem solving engineer"
date: "2026-03-21"
tags: [The Shapes of Code, Uncle Bob, discipline, simplicity]
---

I realised subconsciously jumping towards picking up the tool before clearly understanding the nature of the problem. This not only affected my problem solving muscle memory but pushed my mind to wonder breadth wise and not depth.

The reason behind this structure is to enforce a guardrails to approach a problem and reduce default mode overwhelming drifting across the ocean of ways. It forces you to narrow down the nature of the problem to help our brain pop a similar known problem or an early admit of not knowing the approach. This helps in saving time as well as an early realisation of unknown patterns or concepts.

The structure I am following is inspired from the talk: [Hammock Driven Development - Rich Hickey](https://youtu.be/f84n5oFoZBc?si=0-HZKRxVmKbCzIw4)

Steps taken to solve 435. Non-overlapping Intervals
 `const intervals = [[1,3], [5,8], [4,10], [11,13]]` 
 
BEFORE
Whenever I come across an intervals problem, number line strikes to my mind and I drew it because it felt like progress.

![Number line showing intervals [1,3], [5,8], [4,10], [11,13] to visualize overlaps](/blogs/intervals-number-line.jpg)

If we looked at it from a raw human intelligence, we can clearly make out removing `[4, 10]` makes rest of the intervals non overlapping right? so did I. Now how do you bring the problem down to a programetic level... 

Since I have solved `insertInterval` and `canAttendMeetings` before, it made sense to check previous interval with current one whether to incremenet the count or not.

``` javascript
// [[1,3], [5,8], [4,10], [11,13]]
prevEnd = 3, currStart = 5, count = 0
    if prevEnd > currStart ---> false
    
    else ---> true
        // no overlap
        prevEnd = 8

prevEnd = 8, currStart = 4, count = 0
    if prevEnd > currStart ---> true
        // overlap
        count += 1
        prevEnd = min(8, 10)
    else ---> false

prevEnd = 8, currStart = 11, count = 1
    if prevEnd > currStart ---> false

    else --- > true
    // no overlap
    prevEnd = 13

// for loop exits
return count // 1
```

This process felt like solving the problem for the sake of solving with raw instincts. This is definately a correct approach from not a sustainaible way to a problem solving wizard.

This is when I forced myself to check the solution from hellointerview.io and initially I felt down seeing the solution because it was different approach but this time I stood extra reslient to trace the solution without self-judgemental to discover a very gentle soothing approach they have choosen by treating the problem in a total different way and by just looking at the solution I felt the warmth.

## Joinig the dots ... --> .. --> .

I asked my claude chat, what am I missing here? Upon multiple iterative feedback loop I realised that I am striving to get the code running while I should be stepping back to get coherence with the problem. I had to correct my own BEFORE approach mid-draft. That was another feedback in real time. I figured Rich Hickey's talk earlier -- sleep on a problem, in this case I just need to give attention to the problem by following the steps inside the guardrail.

1. State the problem or Nature of the problem
    how many minimum intervals removed to make intervals non-overlapping

2. Unknowns and edge cases
   - end === start means overlap `[1,3]` and `[3,4]`   
   - intervals already sorted

3. Simple restatement
    - See if a similar problem strikes..
    - what if we flip it, finding non-overlapping intervals greedily and subtract with total intervals to get minimum intervals to remove. This approach is a single phase cares only next non overlapping interval greedily.

4. Atleast two solution with trade offs
    1. Intuitive approach to find min-intervals but has branching logic to conciously decide what to do with `end`
    2. Handle only one case (non-overlap) and min-intervals count deduced with math operation

5. Heads Down -- to code it up the the approach 2


## My honest take
Both the approaches will help pass interivew, however my bias is towards the second approach as it forces us to think with a wider context by mapping the a more mature understanding of algorithms and data structures in our mind, which is definately a cognitively overhead task to start with but with deliberte practice, we could subconciously use this displine in other problem solving.

