#!/usr/bin/env tsx
import { songCopyrightRegistry, verifyCopyrightRegistry } from "../lib/copyright-registry";

const issues = verifyCopyrightRegistry();

if (issues.length === 0) {
  console.log(`Copyright registry OK — ${songCopyrightRegistry.length} songs tracked.`);
  process.exit(0);
}

console.error("Copyright registry verification failed:\n");
for (const issue of issues) {
  console.error(`- ${issue.songSlug}: ${issue.message}`);
}
console.error("\nFix: npm run copyright:register -- --slug <slug>  or  --all");
process.exit(1);
