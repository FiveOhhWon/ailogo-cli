#!/usr/bin/env node
import { Command } from "commander";
import { render, renderTheme, getThemes } from "@ailogo/core";

const program = new Command();
program
  .name("ailogo")
  .description("Render configurable ASCII logos")
  .version("0.1.0");

program
  .command("show")
  .description("Render a logo")
  .option("-t, --text <text>", "Text to render", "AILogo")
  .option("--theme <name>", "Theme name")
  .option("--font <font>", "FIGlet font")
  .option("--color <color...>", "Color or gradient colors")
  .option("--boxed", "Wrap in a box")
  .option("--align <align>", "left|center|right", "left")
  .action((opts) => {
    let out: string;
    if (opts.theme) {
      out = renderTheme(opts.theme, opts.text, {
        font: opts.font,
        colors: opts.color,
        box: opts.boxed ? {} : false,
        align: opts.align,
      });
    } else {
      out = render(opts.text, {
        font: opts.font,
        colors: opts.color,
        box: opts.boxed ? {} : false,
        align: opts.align,
      });
    }
    process.stdout.write(out + "\n");
  });

program
  .command("themes")
  .description("List available themes")
  .action(() => {
    const themes = getThemes();
    for (const t of themes) {
      process.stdout.write(`- ${t.name}\n`);
    }
  });

program.parseAsync(process.argv);

