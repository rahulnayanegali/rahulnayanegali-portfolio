---
title: "Hybrid Claude with open source models"
tldr: "Frequent Claude top ups in the midst of development running out of session tokens forced to adopt a hybrid approach with open source models"
date: "2026-05-03"
tags: [claude code, open source, hybrid]
---

My prompt engineer wizard tendencies were costing me more than the $20 Claude subscription session bandwidth so I had to come up with a way to address it rather than unending top ups. So I did the following:

**Prerequisites**
- Ollama: https://ollama.com/download
- Claude Code VS Code extension: https://marketplace.visualstudio.com/items?itemName=anthropic.claude-code

**Steps**

1. Pull the model
```bash
ollama pull qwen3-coder-next
```

2. Verify the model downloaded
```bash
ollama list
```

3. Open Claude's VS Code settings.json
`Cmd/Ctrl + ,` → Extensions → Claude Code → Edit `settings.json`

4. Configure settings
```json
"claudeCode.environmentVariables": [
    { "name": "ANTHROPIC_API_KEY", "value": "not-needed" },
    { "name": "ANTHROPIC_BASE_URL", "value": "http://localhost:11434" },
    { "name": "ANTHROPIC_MODEL", "value": "qwen3-coder-next:latest" },
    { "name": "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC", "value": "1" }
]
```

5. Save and restart VS Code


This process enabled local development with the Qwen3 Code model but the performance was terrible because the local machine memory is 16GB while the model's uncompressed size is 51GB. So in an ideal case, the machine requires additional 35GB of memory just to run this model. No wonder data center's water requirement exceeds entire city's consumption. Here are some screenshots of the process in action.

Struggling to take a screenshot while ollama was exponentially invading the memory.
![Memory usage reaching 25GB](/blogs/memory-usage.png)

Here the memory is back breathing from ollama's attempt of suffocation.
![Memory graph after process kill](/blogs/memory-graph.png)


It was definitely not worth the bucks I'm saving while it takes ages to complete simple tasks.


### The workaround
Instead of wrestling with the local model, I pivoted to a cloud based solution by using the Qwen3 Code model in the cloud.

To do that, I replaced the local model configuration with a cloud-based one.

```json
"claudeCode.environmentVariables": [
    { "name": "ANTHROPIC_API_KEY", "value": "not-needed" },
    { "name": "ANTHROPIC_BASE_URL", "value": "http://localhost:11434" },
    { "name": "ANTHROPIC_MODEL", "value": "qwen3-coder-next:cloud" },
    { "name": "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC", "value": "1" }
]
```

The trade-off was limited tokens per session but they were free. So the additional top up costs were eventually reduced by having a $20 Claude subscription to do research tasks while the Claude Code with open source cloud model for coding is sustainable in the long run.