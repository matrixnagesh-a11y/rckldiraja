import { defineConfig, globalIgnores } from "eslint/config";

const eslintConfig = defineConfig([
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "tmp/**",
    "scratch/**",
    "**/._*",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
