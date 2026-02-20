import { spawn } from 'node:child_process';
import readline from 'node:readline';

const ARGS_TO_FILTER = new Set(['Entry docs → 404 was not found.']);

const quoteArg = (arg) => {
  if (!arg.includes(' ') && !arg.includes('"')) return arg;
  return `"${arg.replaceAll('"', '\\"')}"`;
};

const command = `npx astro build ${process.argv.slice(2).map(quoteArg).join(' ')}`.trim();

const child = spawn(command, {
  stdio: ['inherit', 'pipe', 'pipe'],
  shell: true,
});

function pipeAndFilter(stream, targetStream) {
  const rl = readline.createInterface({ input: stream });
  rl.on('line', (line) => {
    if (ARGS_TO_FILTER.has(line.trim())) return;
    targetStream.write(`${line}\n`);
  });
}

pipeAndFilter(child.stdout, process.stdout);
pipeAndFilter(child.stderr, process.stderr);

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 1);
});
