import { getViteConfig } from "astro/config";

export default getViteConfig({
  test: {
    globals: true,
    projects: [
      {
        extends: true,
        test: {
          include: ["src/libs/**/*.test.ts", "src/contents/**/*.test.ts"],
          environment: "node",
        },
      },
    ],
    reporters: process.env.CI ? "dot" : "default",
    coverage: {
      include: [
        "src/components/*",
        "src/contents/*",
        "src/layouts/*",
        "src/libs/*",
      ],
      // you can include other reporters, but 'json-summary' is required, json is recommended
      reporter: ["text", "json-summary", "json"],
      // If you want a coverage reports even if your tests are failing, include the reportOnFailure option
      reportOnFailure: true,
    },
  },
});
