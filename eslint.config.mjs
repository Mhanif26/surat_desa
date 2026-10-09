import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Vendored iconiq components under evaluation (see /docs/components/reusable).
    // They trip the React Compiler rules; a head-to-head winner gets cleaned up when promoted.
    "components/iconiq/**",
  ]),
]);

export default eslintConfig;
