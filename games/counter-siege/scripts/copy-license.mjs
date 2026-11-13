import { copyFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const outputDirectory = fileURLToPath(new URL('../../../public/games/counter-siege/', import.meta.url));

await mkdir(outputDirectory, { recursive: true });
await Promise.all([
  copyFile(fileURLToPath(new URL('../LICENSE', import.meta.url)), fileURLToPath(new URL('../../../public/games/counter-siege/LICENSE', import.meta.url))),
  copyFile(fileURLToPath(new URL('../online.js', import.meta.url)), fileURLToPath(new URL('../../../public/games/counter-siege/online.js', import.meta.url))),
]);
