import { getViteConfig } from 'astro/config';

export default getViteConfig({
  test: {
    globals: true,
    projects: [
      {
        extends: true,
        test: {
          include: ['src/libs/*', 'src/contents/*'],
          environment: 'node',
        },
      },
    ],
  },
});