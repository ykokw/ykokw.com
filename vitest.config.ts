import { getViteConfig } from 'astro/config';

export default getViteConfig({
  test: {
    globals: true,
    projects: [
      {
        extends: true,
        test: {
          include: ['src/libs/**/*.test.ts', 'src/contents/**/*.test.ts'],
          environment: 'node',
        },
      },
    ],
  },
});