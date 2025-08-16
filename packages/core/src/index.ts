import figlet from "figlet";
import chalk from "chalk";
import gradient from "gradient-string";
import boxen, { Options as BoxenOptions } from "boxen";
export * from "./config";

export type RenderOptions = {
  font?: string;
  colors?: string | string[]; // single color or gradient
  box?: BoxenOptions | false;
  width?: number | "auto";
  align?: "left" | "center" | "right";
};

export function render(text: string, options: RenderOptions = {}): string {
  const {
    font = "Standard",
    colors,
    box = false,
    align = "left",
  } = options;

  const ascii = figlet.textSync(text, { font, width: 120, whitespaceBreak: true });

  let colored = ascii;
  if (Array.isArray(colors) && colors.length > 1) {
    const grad = gradient(colors as any);
    colored = ascii
      .split("\n")
      .map(line => grad.multiline(line))
      .join("\n");
  } else if (typeof colors === "string") {
    const fn = (chalk as any)[colors] || chalk.hex(colors);
    colored = ascii
      .split("\n")
      .map(line => fn(line))
      .join("\n");
  }

  let aligned = colored;
  if (align !== "left") {
    aligned = colored
      .split("\n")
      .map(line => alignLine(line, align))
      .join("\n");
  }

  if (box) {
    return boxen(aligned, {
      padding: 1,
      borderStyle: "round",
      ...box,
    });
  }
  return aligned;
}

function alignLine(line: string, align: "left" | "center" | "right") {
  const columns = Number(process.env.COLUMNS || 80);
  const len = stripAnsi(line).length;
  if (len >= columns) return line;
  const space = columns - len;
  if (align === "center") return " ".repeat(Math.floor(space / 2)) + line;
  if (align === "right") return " ".repeat(space) + line;
  return line;
}

function stripAnsi(s: string) {
  // Simple ANSI escape matcher
  return s.replace(/\u001b\[[0-9;]*m/g, "");
}

export type Theme = {
  name: string;
  font?: string;
  colors?: string | string[];
  box?: BoxenOptions | false;
  align?: "left" | "center" | "right";
  sampleText?: string;
};

const registry = new Map<string, Theme>();

export function registerTheme(theme: Theme) {
  registry.set(theme.name, theme);
}

export function getThemes() {
  return Array.from(registry.values());
}

export function renderTheme(name: string, text?: string, overrides: Partial<RenderOptions> = {}) {
  const theme = registry.get(name);
  if (!theme) throw new Error(`Unknown theme: ${name}`);
  return render(text || theme.sampleText || name, {
    font: theme.font,
    colors: theme.colors,
    box: theme.box,
    align: theme.align,
    ...overrides,
  });
}

// Minimal built-in theme
registerTheme({
  name: "gemini",
  font: "Standard",
  colors: ["#30cfd0", "#330867"],
  box: { borderStyle: "double" },
  align: "left",
  sampleText: "AILogo",
});

registerTheme({
  name: "claude",
  font: "Standard",
  colors: ["#f6d365", "#fda085"],
  box: { borderStyle: "round" },
  align: "left",
  sampleText: "AILogo",
});
