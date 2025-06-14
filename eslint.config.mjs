// eslint.config.mjs
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  // Ensure that .eslintignore files are also read if they exist
  // though for simple cases like this, defining in config is sufficient.
  // resolvePluginsRelativeTo: __dirname, // Potentially useful if plugins are local
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    // This is a new configuration object specifically for ignore patterns
    // You can also add rules here that apply globally
    ignores: [
      "lib/generated/prisma/", // <--- THIS IS THE CRUCIAL LINE
      // Add any other files or directories you want ESLint to ignore here
      // For example, if you have a separate build output folder like 'dist/' or 'build/'
      "node_modules/", // Typically ignored by default, but good to be explicit
      ".next/", // Next.js build output
    ],
  },
];

export default eslintConfig;