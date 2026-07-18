import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();

function existingTypeScriptFile(candidate) {
  for (const file of [candidate, `${candidate}.ts`, `${candidate}.tsx`, path.join(candidate, "index.ts")]) {
    if (fs.existsSync(file)) return pathToFileURL(file).href;
  }
  return null;
}

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith("@/")) {
    const resolved = existingTypeScriptFile(path.resolve(root, specifier.slice(2)));
    if (resolved) return { shortCircuit: true, url: resolved };
  }

  if (specifier.startsWith(".") && context.parentURL) {
    const parentPath = new URL(context.parentURL);
    if (parentPath.protocol === "file:") {
      const resolved = existingTypeScriptFile(path.resolve(path.dirname(parentPath.pathname.slice(1)), specifier));
      if (resolved) return { shortCircuit: true, url: resolved };
    }
  }

  return nextResolve(specifier, context);
}
