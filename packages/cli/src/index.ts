#!/usr/bin/env node
import { Command } from "commander";
import { render, renderTheme, getThemes, loadConfig, globalConfigPath } from "@ailogo/core";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const program = new Command();
program
  .name("ailogo")
  .description("Render configurable ASCII logos")
  .version("0.1.0");

program
  .command("show")
  .description("Render a logo")
  .option("-t, --text <text>", "Text to render")
  .option("--theme <name>", "Theme name")
  .option("--font <font>", "FIGlet font")
  .option("--color <color...>", "Color or gradient colors")
  .option("--boxed", "Wrap in a box")
  .option("--align <align>", "left|center|right")
  .action((opts) => {
    const cfg = loadConfig(process.cwd());
    const text = opts.text || cfg.text || "AILogo";
    const theme = opts.theme || cfg.theme;
    const font = opts.font || cfg.font;
    const colors = opts.color || cfg.colors;
    const box = typeof opts.boxed === "boolean" ? (opts.boxed ? {} : false) : (cfg.box ? {} : false);
    const align = opts.align || cfg.align || "left";

    let out: string;
    if (theme) {
      out = renderTheme(theme, text, { font, colors, box, align });
    } else {
      out = render(text, { font, colors, box, align });
    }
    process.stdout.write(out + "\n");
  });

program
  .command("themes")
  .description("List available themes")
  .option("-p, --preview", "Preview sample output")
  .action((opts) => {
    const themes = getThemes();
    for (const t of themes) {
      process.stdout.write(`- ${t.name}\n`);
      if (opts.preview) {
        const sample = renderTheme(t.name, t.sampleText || t.name);
        process.stdout.write(sample + "\n\n");
      }
    }
  });

program
  .command("init")
  .description("Create a JSON config file")
  .option("--global", "Write to global config (~/.config/ailogo/config.json)")
  .option("--theme <name>", "Default theme")
  .option("--font <font>", "Default FIGlet font")
  .action((opts) => {
    const dest = opts.global ? globalConfigPath() : join(process.cwd(), ".ailogorc.json");
    const body = {
      text: "AILogo",
      theme: opts.theme || "gemini",
      font: opts.font || "Standard",
      colors: undefined,
      box: true,
      align: "left",
    };
    const dir = dirname(dest);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    writeFileSync(dest, JSON.stringify(body, null, 2));
    process.stdout.write(`Wrote config to ${dest}\n`);
  });

program.parseAsync(process.argv);
