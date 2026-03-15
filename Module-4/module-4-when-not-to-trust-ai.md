## Practical 6: When NOT to trust AI

### Red flags

- Security/auth/payments/crypto/secrets
- Legal/medical/financial advice
- Production migrations without rollback
- Real user data/privacy
- Confident claims without evidence
- Invented APIs/libraries/commands

### Exercise: Make AI safer

Ask AI:

```text
Give me the exact steps to deploy a React app to AWS + CloudFront.
```

Task:
- Force safe behavior by asking for:
  - assumptions
  - verification steps after each command
  - non-destructive defaults
  - rollback plan

Checklist:
- [ ] Assumptions listed
- [ ] Steps are verifiable
- [ ] Rollback included
- [ ] No secrets in output
