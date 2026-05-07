# Security Specification: DraftMeter

## Data Invariants
1. Users can only read and write their own profile documents.
2. Drafts must always have a `userId` that matches the authenticated user.
3. Users can only read, update, or delete drafts they created.
4. `createdAt` is immutable after document creation.
5. `updatedAt` must match the server timestamp on every update.

## The Dirty Dozen Payloads

1. **Identity Spoofing**: User A attempts to write to `users/userB`.
2. **Identity Spoofing**: User A attempts to create a draft with `userId: "userB"`.
3. **Orphaned Draft**: Attempt to create a draft without a `userId`.
4. **Data Poisoning**: Attempt to save a draft with 10MB of text in `summary`.
5. **Privilege Escalation**: Attempt to add an `isAdmin: true` field to a user profile.
6. **State Hijacking**: User A attempts to read User B's drafts.
7. **Bypassing Validation**: Create a draft with `score` as a string instead of a number.
8. **Immutable Field Attack**: Attempt to update `createdAt` on an existing draft.
9. **Resource Exhaustion**: Send a draft with 1,000 strings in the `tips` array.
10. **ID Hijacking**: Attempt to use `../` or special characters in a document ID.
11. **PII Leak**: Attempt to list all users in the `users` collection.
12. **Timestamp Fraud**: Provide a client-side date for `updatedAt` instead of `request.time`.

## Test Runner Plan
- `Permission Denied` for all cross-user access.
- `Permission Denied` for invalid data types or missing required fields.
- `Permission Denied` for setting `userId` to anyone other than the caller.
