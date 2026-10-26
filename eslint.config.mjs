import next from "eslint-config-next";

export default [
  ...next,
  { ignores: [".next/**", "public/**", "scripts/**"] },
  // Copy is written with plain apostrophes in JSX text; escaping them adds noise without benefit.
  { rules: { "react/no-unescaped-entities": "off" } },
];
