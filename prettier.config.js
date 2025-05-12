/** @type {import("prettier").Config & import("prettier-plugin-tailwindcss").PluginOptions} */
const config = {
  tailwindConfig: "./apps/web/tailwind.config.ts",
  plugins: ["prettier-plugin-tailwindcss"],
};

export default config;
