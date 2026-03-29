---
title: "Memory is an asset for theory but a liability during active problem solving"
tldr: "How a half-remembered solution led me to the wrong answer and what I do about it now"
date: "2026-03-29"
tags: [javascript, dsa, problem solving]
---

During a deliberate problem solving session, you come across a previously solved problem, you do not remember the entire solution but a superficial one could bite you very hard without even realising. 

I came across a `twoSum` problem a pretty long time ago and deep down I knew `diff = target - num` is the other part of the sum pair but I did not realise trusting this instinct alone could bite me really bad. let's see how

```javascript
function twoSum(nums, target) {
    const set = new Set();

    for (let num of nums) {
        const diff = target - num;
        if (set.has(diff)) {
            return [diff, num]
        } else set.add(diff)
    }
}
```

Here I know the `diff` is the other half of the sum pair, I will add diff in the set.

#### The trace

`nums = [1, 2, 3, 5], target = 5`
```
i = 0, set = ()
num = 1
diff = 5 - 1 => 4
4 not in set:
 add 4 in set

i = 1, set = (4)
num = 2
diff = 5 - 2 => 3
3 not in set:
 add 3 in set

i = 2, set = (4, 3)
num = 3
diff = 5 - 3 => 2
2 not in set:
  add 2 in set

i = 3, set = (4, 3, 2)
num = 5
diff = 5 - 5 => 0
0 not in set:
  add 0 in set
```
The mistake here is storing `diff` in set instead of `num` itself.
Suppose this happens in an interview, this will panic us to freeze if I don't have coping skills.

#### The Skill

The skill I am trying to deliberately place into my practice is to discard the solution in my memory and force myself to think through from scratch, then you can see that placing the `num` in the set lets us find the other pair right at third iteration.

#### Here's the corrected solution:
```javascript
function twoSum(nums, target) {
    const set = new Set();

    for (let num of nums) {
        const diff = target - num;
        if (set.has(diff)) {
            return [diff, num]  // num is the current, diff is its pair
        } else set.add(num)     // store num, not diff
    }
}
```

#### The fixed trace
`nums = [1, 2, 3, 5], target = 5`
```
i = 0, set = ()
num = 1
diff = 5 - 1 => 4
4 not in set:
 add 1 (num) in set

i = 1, set = (1)
num = 2
diff = 5 - 2 => 3
3 not in set:
 add 2 (num) in set

i = 2, set = (1, 2)
num = 3
diff = 5 - 3 => 2
2 in set:
  return [2, 3]

```

#### How to build this skill?

This isn't a skill you build overnight, and it looks different for everyone. 

Prioritizing the pattern practice by not coding instead on pen-paper or whiteboard with at least five different types of input test cases is something that is very effective at least for me. Because here coding is the easiest part where as thinking through the solution phases is the most hard part which requires building muscle memory pulling the right data structures and algorithm. 

This is not about how to learn data structures and various algorithms instead a subtle blackboxing technique of their under the hood and practicing their usage as a tool.

