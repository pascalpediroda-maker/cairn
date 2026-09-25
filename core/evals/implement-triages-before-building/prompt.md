---
name: implement-triages-before-building
description: A build request should reach the implement skill, which reads the zone first and states a size before touching anything.
tags: [implement, positive]
max_turns: 12
allowed_tools: [Read, Glob, Grep, Skill, TodoWrite]
---

Add a user preferences table with a per-user theme setting, plus the API route to read and
update it, and wire it to the settings page.
