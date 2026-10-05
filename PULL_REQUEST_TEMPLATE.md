## Description

This PR stabilizes MC-7Epsilon by addressing critical bugs in RCON connection handling, status posting, and voice functionality. It also refreshes the README for public use.

## Type of Change

- [x] Bug fix (non-breaking change which fixes an issue)
- [x] Documentation update
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)

## Related Issues

Closes #(issue number)

## Key Changes

### Critical Fixes
1. **RCON Connection Pooling** - Prevents connection exhaustion and improves reliability
2. **Status Message Spam Prevention** - Edits messages instead of creating new ones
3. **Voice Handling Hardening** - Per-guild players, timeouts, and error handling

### Documentation
- Rewrote README for clarity and English-first presentation
- Added troubleshooting section
- Improved environment variable documentation

## Testing Done

- [x] Code compiles without errors
- [x] All imports route correctly through pooled RCON
- [x] Status posting behavior reviewed
- [x] Voice handler timeout logic verified
- [x] README structure and content reviewed

## Checklist

- [x] My code follows the project's style guidelines
- [x] I have commented my code, particularly in hard-to-understand areas
- [x] I have made corresponding changes to the documentation
- [x] My changes generate no new warnings
- [x] I have removed any console.log statements or debug code
- [x] This PR does not introduce breaking changes

## Screenshots (if applicable)

N/A

## Migration Guide

No migration needed. All changes are backward compatible.

1. Update your local branch: `git pull origin fix/critical-bugs-phase1`
2. Install/update dependencies: `npm install`
3. Build: `npm run build`
4. Test in development: `npm run dev`

## Additional Notes

- See `CHANGES.md` for detailed commit-by-commit information
- All existing environment variables continue to work
- New optional: `RCON_POOL_SIZE` (default: 3)
