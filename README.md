# PR Stress-Test Kit

Five files designed to probe an AI/automated PR-review tool across
security, logic, concurrency, trustworthiness, and scale dimensions.

1. 01_security_vulns.ts - SQL injection, hardcoded secret, disabled TLS, missing auth
2. 02_logic_bug.ts - Off-by-one pagination bug, divide-by-zero edge case
3. 03_race_condition.ts - Async race condition on shared counter
4. 04_misleading_comment.ts - Comments that lie about actual behavior
5. 05_large_file_stub.ts - Instructions to generate a large/noisy diff with one buried bug

Open a single PR containing all (or a subset) of these files and observe:
- Does it correctly flag the SQL injection and hardcoded secret as critical?
- Does it catch the pagination off-by-one and divide-by-zero?
- Does it mention the race condition risk in reserveItem()?
- Does it trust the misleading docstrings or verify actual code behavior?
- Does it stay accurate when the diff is large/noisy?
