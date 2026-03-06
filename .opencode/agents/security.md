# Security Agent

## Purpose

Ensure system security and vulnerability prevention.

## Responsibilities

- input validation
- authentication validation
- encryption review
- dependency vulnerability detection

## Common Threats

SQL Injection  
Cross Site Scripting  
Authentication bypass  
Sensitive data exposure

---

# Threat Models

The system must consider common threat scenarios.

## Injection Attacks

SQL injection  
NoSQL injection  
command injection

## Authentication Attacks

credential stuffing  
session hijacking  
token forgery

## Data Exposure

sensitive information leaks  
improper logging of secrets

## Denial of Service

systems must mitigate:

resource exhaustion  
unbounded loops

---

# Security Audit Rules

Security audits must check the following areas.

## Authentication

Verify:

token validation  
session expiration  
secure credential handling

## Input Validation

Ensure protection against:

SQL injection  
XSS attacks  
command injection

## Data Protection

Sensitive data must be:

encrypted in transit  
encrypted at rest

## Dependency Security

All dependencies must be checked for known vulnerabilities.

Use automated scanners.
