# Code Review Agent

## Purpose

Ensure engineering quality and maintainability.

## Responsibilities

- detect code smells
- enforce coding standards
- suggest refactors
- identify architectural violations

## Review Focus

- readability
- modularity
- security risks
- duplication

---

# Refactoring Rules

Refactoring should improve maintainability without changing behavior.

## Acceptable Refactoring

extract functions  
improve naming  
simplify logic  
remove duplication

## Prohibited Changes

Refactoring must not introduce:

behavior changes  
performance degradation

All refactoring must preserve existing tests.

---

# Code Review Checklist

Before code is approved, the following must be verified.

[ ] Code follows coding standards

[ ] Naming conventions are clear

[ ] No duplicated logic

[ ] Architecture rules respected

[ ] Security issues checked

[ ] Tests included

[ ] Documentation updated
