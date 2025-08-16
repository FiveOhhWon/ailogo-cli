import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import os from "node:os";

export type AILogoConfig = {
  text?: string;
  theme?: string;
  font?: string;
  colors?: string | string[];
  box?: boolean | { [k: string]: unknown };
  align?: "left" | "center" | "right";
  width?: number | "auto";
};

export const defaultConfig: Required<Pick<AILogoConfig, "align">> & Partial<AILogoConfig> = {
  align: "left",
};

const projectConfigFiles = [
  ".ailogorc.json",
  "ailogo.config.json",
];

export function findProjectConfig(cwd: string): string | undefined {
  for (const name of projectConfigFiles) {
    const p = join(cwd, name);
    if (existsSync(p)) return p;
  }
  return undefined;
}

export function globalConfigPath(): string {
  const home = os.homedir();
  const base = process.platform === "win32"
    ? join(process.env.APPDATA || join(home, "AppData", "Roaming"), "ailogo")
    : join(home, ".config", "ailogo");
  return join(base, "config.json");
}

export function readConfigFile(path: string): AILogoConfig {
  try {
    const raw = readFileSync(path, "utf8");
    const json = JSON.parse(raw);
    return sanitizeConfig(json);
  } catch {
    return {};
  }
}

export function loadConfig(cwd: string = process.cwd()): AILogoConfig {
  const projectPath = findProjectConfig(cwd);
  const project = projectPath ? readConfigFile(projectPath) : {};
  const globalPath = globalConfigPath();
  const global = existsSync(globalPath) ? readConfigFile(globalPath) : {};
  return mergeConfigs(global, project);
}

export function mergeConfigs(a: AILogoConfig, b: AILogoConfig): AILogoConfig {
  return { ...a, ...b };
}

function sanitizeConfig(input: any): AILogoConfig {
  const out: AILogoConfig = {};
  if (typeof input !== "object" || !input) return out;
  if (typeof input.text === "string") out.text = input.text;
  if (typeof input.theme === "string") out.theme = input.theme;
  if (typeof input.font === "string") out.font = input.font;
  if (typeof input.align === "string" && ["left", "center", "right"].includes(input.align)) out.align = input.align;
  if (typeof input.width === "number" || input.width === "auto") out.width = input.width;
  if (typeof input.box === "boolean" || typeof input.box === "object") out.box = input.box;
  if (Array.isArray(input.colors) || typeof input.colors === "string") out.colors = input.colors;
  return out;
}

