---
name: debug-reproduces-first
description: The reproduce-before-editing checkpoint. A plausible cause is not a reproduction, and a fix applied to an unseen failure is a guess.
tags: [debug, positive]
max_turns: 12
allowed_tools: [Read, Glob, Grep, Skill]
---

Users are telling us the saved filters on the dashboard reset themselves after a while. I have no
idea why. Fix it.
