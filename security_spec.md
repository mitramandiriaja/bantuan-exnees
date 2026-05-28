# Security Specifications (TDD Spec)

## 1. Data Invariants
- **User Role Restriction**: Users cannot register or update their profiles to assign themselves the `admin` role. Role modification is strictly forbidden unless the requester is an authorized Admin or the Bootstrapped Admin (`ronggoumi@gmail.com`).
- **Audit Log Immutability**: Activity logs `activity_logs` cannot be updated or deleted once written. Only creation is allowed by authenticated users for their own UID.
- **Identity Integrity**: For both profile updates and activity logs, the record's user ID fields (`userId` and document mapping) must match the authenticated caller's UID (`request.auth.uid`).
- **Temporal Enforcement**: Timestamps (e.g., `createdAt`, `lastLoginAt`, and `timestamp`) must match `request.time` exactly at creation time.
- **Bootstrapped Admin Access**: The email address `ronggoumi@gmail.com` is granted administrative master key privileges through the Firebase rules mapping.

---

## 2. The "Dirty Dozen" Malicious Payloads
The following payloads list exact attacks designed to probe updates, privilege escalation, PII leaks, and immutable history gaps:

### P1: Privilege Escalation on Profile Creation
- **Path**: `/users/attacker_uid`
- **Method**: `create`
- **Payload**: `{"email": "hacker@evil.com", "displayName": "Evil", "role": "admin", "createdAt": "request.time", "lastLoginAt": "request.time"}`
- **Expected Outcome**: `PERMISSION_DENIED` - Attacker attempts to self-assign the `admin` role.

### P2: Timestamp Spoofing on Profile Creation
- **Path**: `/users/attacker_uid`
- **Method**: `create`
- **Payload**: `{"email": "hacker@evil.com", "displayName": "Evil", "role": "user", "createdAt": "2020-01-01T00:00:00Z", "lastLoginAt": "request.time"}`
- **Expected Outcome**: `PERMISSION_DENIED` - Client-side provided pre-dated timestamp is rejected.

### P3: Shadow Field Injection (Anti-Update-Gap)
- **Path**: `/users/attacker_uid`
- **Method**: `create`
- **Payload**: `{"email": "hacker@evil.com", "displayName": "Evil", "role": "user", "createdAt": "request.time", "lastLoginAt": "request.time", "isVerified": true}`
- **Expected Outcome**: `PERMISSION_DENIED` - Field `isVerified` is a shadow field not present in the strict schema.

### P4: Identity Spoofing on Profile Write
- **Path**: `/users/victim_uid`
- **Method**: `create`
- **Payload**: `{"email": "hacker@evil.com", "displayName": "Evil", "role": "user", "createdAt": "request.time", "lastLoginAt": "request.time"}`
- **Auth context**: `auth.uid = attacker_uid`
- **Expected Outcome**: `PERMISSION_DENIED` - Attempting to write into a victim's document path.

### P5: Role Escalation via Profile Update
- **Path**: `/users/attacker_uid`
- **Method**: `update`
- **Payload**: `{"email": "hacker@evil.com", "displayName": "Evil", "role": "admin", "createdAt": "existing().createdAt", "lastLoginAt": "request.time"}`
- **Expected Outcome**: `PERMISSION_DENIED` - Changing role from 'user' to 'admin'.

### P6: Timestamp Overwriting on Profile Update
- **Path**: `/users/attacker_uid`
- **Method**: `update`
- **Payload**: `{"email": "hacker@evil.com", "displayName": "Evil", "role": "user", "createdAt": "request.time", "lastLoginAt": "request.time"}`
- **Expected Outcome**: `PERMISSION_DENIED` - Attempting to mutate the immutable `createdAt` field.

### P7: Audit Log Tampering (Update Log)
- **Path**: `/activity_logs/log_123`
- **Method**: `update`
- **Payload**: `{"userId": "attacker_uid", "email": "hacker@evil.com", "activity": "Erased history", "timestamp": "request.time"}`
- **Expected Outcome**: `PERMISSION_DENIED` - Activity logs are completely immutable.

### P8: Audit Log Erasure (Delete Log)
- **Path**: `/activity_logs/log_123`
- **Method**: `delete`
- **Expected Outcome**: `PERMISSION_DENIED` - Deletion of activity logs is prohibited.

### P9: Identity Spoofing in Audit Log Creation
- **Path**: `/activity_logs/log_123`
- **Method**: `create`
- **Payload**: `{"userId": "victim_uid", "email": "victim@gmail.com", "activity": "Authorized login", "timestamp": "request.time"}`
- **Auth context**: `auth.uid = attacker_uid`
- **Expected Outcome**: `PERMISSION_DENIED` - Attempting to log arbitrary events for other users.

### P10: Arbitrary User Profile Scraping (PII Blanket read)
- **Path**: `/users` (list queries)
- **Method**: `list`
- **Expected Outcome**: `PERMISSION_DENIED` - General user query list is blocked for normal users.

### P11: Resource Poisoning via Document ID (Path variable hardening)
- **Path**: `/activity_logs/super_long_junk_string_over_128_characters_intended_to_cause_resource_exhaustion`
- **Method**: `create`
- **Payload**: `{"userId": "attacker_uid", "email": "hacker@evil.com", "activity": "Poisoning ID", "timestamp": "request.time"}`
- **Expected Outcome**: `PERMISSION_DENIED` - ID validation rules block non-alphanumeric or excessively long string paths.

### P12: Unauthenticated Write
- **Path**: `/users/some_uid`
- **Method**: `create`
- **Payload**: `{"email": "hacker@evil.com", "displayName": "Evil", "role": "user", "createdAt": "request.time", "lastLoginAt": "request.time"}`
- **Auth context**: `NULL`
- **Expected Outcome**: `PERMISSION_DENIED` - All writes require active sessions.

---

## 3. Test Runner Structure
The test assertions are automated by checking that all "Dirty Dozen" malicious writes return permission error codes from Firestore, while valid requests for self profiles evaluate successfully. Given the server sandbox environment, we compile these validation structures directly into our live `firestore.rules`.
