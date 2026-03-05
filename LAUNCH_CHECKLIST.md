# Revenue Brain Launch Checklist

## P0 (Must-have to ship)

- [x] Wire dashboard KPIs to live Convex data (`calls.getStats`)
- [x] Wire calls table to live Convex data (`calls.list`)
- [x] Wire contacts table to live Convex data (`contacts.list`)
- [x] Wire settings page to persist/retrieve Convex settings (`settings.get`/`settings.upsert`)
- [x] Enforce `smsEnabled` in webhook/send flow
- [x] Enforce `responseDelaySeconds` in scheduling
- [x] Add basic send idempotency guard (`calls.getByCallSid` + skip if already sent)
- [ ] Validate end-to-end in staging Twilio account (real callbacks)
- [ ] Verify Twilio paid number setup + webhook URLs in console

## P1 (Should-have right after ship)

- [ ] Add smoke tests for missed-call → SMS, inbound SMS → lead
- [ ] Add minimal monitoring/alerting for webhook and send failures
- [ ] Add explicit STOP/opt-out behavior for compliance
- [ ] Add pagination/filtering/search for calls and contacts
- [ ] Add export actions for calls/contacts

## Notes

- Build passes locally (`npm run build`).
- Lint has warnings only (no blocking errors).
