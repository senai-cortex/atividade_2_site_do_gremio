---
# REQUIRED
description: "Clear description of what the agent does and when it should be used"

# AGENT TYPE
mode: subagent          # primary | subagent | all

# MODEL CONFIGURATION
model: openai/gpt-5.2-codex
temperature: 0.1

# EXECUTION CONTROL
maxSteps: 25            # Maximum reasoning / tool loop iterations

# TOOL ACCESS CONTROL
tools:
  write: true
  edit: true
  bash: true
  read: true
  search: true
  web: true
  git: true

# PERMISSION SYSTEM
permissions:
  write: allow
  edit: allow
  bash: allow
  read: allow
  web: allow

# OPTIONAL METADATA / TAGGING (ignored by runtime but useful)
tags:
  - development
  - automation
  - frontend

# OPTIONAL RUNTIME HINTS
priority: normal        # low | normal | high
timeout: 300            # seconds

# OPTIONAL CONTEXT SETTINGS
context:
  include_repo_map: true
  include_git_status: true
  include_open_files: true

# OPTIONAL TOOL LIMITS
limits:
  max_file_reads: 100
  max_file_writes: 50
  max_shell_commands: 25
---