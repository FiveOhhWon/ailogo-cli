# AILogo

ASCII logo renderer – a CLI and SDK to print themed ASCII logos at shell start or on demand.

## Packages

- `@ailogo/core`: Rendering SDK
- `@ailogo/cli`: CLI binary (`ailogo`)

## Quick Start

```bash
npm install
npm run build
npx ailogo show --text "Hello"
```

## Configuration (JSON)

- Project: `.ailogorc.json` or `ailogo.config.json` in your repo
- Global: `~/.config/ailogo/config.json` (macOS/Linux)

Create a config:

```bash
npx ailogo init               # writes ./.ailogorc.json
npx ailogo init --global      # writes ~/.config/ailogo/config.json
```

Example:

```json
{
  "text": "AILogo",
  "theme": "gemini",
  "font": "Standard",
  "box": true,
  "align": "left"
}
```

Use it:

```bash
npx ailogo show              # uses config
npx ailogo show --theme claude --boxed --align center
```

## Commands

- `ailogo show` – render a logo (`--text`, `--theme`, `--font`, `--color`, `--boxed`, `--align`)
- `ailogo themes` – list themes; add `--preview` to print samples
- `ailogo init` – write a JSON config (use `--global` for user-wide)

## OSS

Licensed under MIT. Contributions welcome! See `CONTRIBUTING.md` and `CODE_OF_CONDUCT.md`.

See `examples/USAGE.md` for more examples.
