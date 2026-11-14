# QuietNeeds

Share what you need to participate—not the private story behind it.

The application currently lives in [docs/quietneeds-starter](docs/quietneeds-starter). This is a P1 prototype: private on-device preparation, editable requests, explicit approval, and local JSON export. It does not yet share cards with organizers.

```sh
cd docs/quietneeds-starter
npm ci
npm test
npm run build
npm run dev
```

Use Node 22.14+ on the 22.x line. Manual entry works without Firebase configuration. Use synthetic notes until the full privacy audit passes.

- [Current state and remaining gates](docs/quietneeds-starter/STATE.md)
- [Execution plan](docs/quietneeds-starter/QUIETNEEDS_EXECUTION_PLAN.md)
- [Architecture](docs/quietneeds-starter/ARCHITECTURE.md)
- [Verification evidence](docs/quietneeds-starter/TEST_PLAN.md)
- [Actual synthetic model evaluation](docs/quietneeds-starter/evaluation/RESULTS.md)
- [GitHub workflow](CONTRIBUTING.md)

CI runs domain/privacy tests, TypeScript, production build, debug-token exclusion and dependency audit. These checks do not prove browser privacy, model semantics or completion of P1.
