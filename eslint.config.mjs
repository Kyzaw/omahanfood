// eslint.config.mjs
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  // ⛔️ Gantikan .eslintignore
  {
    ignores: [
      "**/node_modules/**",
      ".next/**",
      "build/**",
      "dist/**",
      "app/generated/**",
      "app/generated/prisma/**",
    ],
  },

  // ✅ Extend konfigurasi Next.js + TypeScript
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // 🔧 Aturan tambahan (opsional)
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      // Contoh: mencegah penggunaan console.log di production
      "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",

      // Aturan tambahan bisa ditaruh di sini
      "@typescript-eslint/no-unused-vars": ["warn"],
    },
  },
];
