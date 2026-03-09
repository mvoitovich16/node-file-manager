// ЛР №4. File Manager
// Запуск: npm run start -- --username=your_username
// Тут простой "студенческий" код, но теперь чуть аккуратнее разнесён по модулям.

import os from 'node:os';
import readline from 'node:readline';

import * as nav from './commands/navigation.js';
import * as files from './commands/files.js';
import { osCommand } from './commands/os.js';
import { hash as hashCmd } from './commands/hash.js';
import { compress as compressCmd, decompress as decompressCmd } from './commands/compress.js';

// достаём юзернейм из аргументов
function getUserName() {
  const arg = process.argv.slice(2).find((a) => a.startsWith('--username='));
  if (!arg) return 'Anonymous';
  return arg.split('=')[1] || 'Anonymous';
}

const userName = getUserName();

// начальная директория = домашняя
let currentDir = os.homedir();

function printCwd() {
  console.log(`You are currently in ${currentDir}`);
}

// парсинг и выполнение команд
async function handleCommand(line) {
  const trimmed = line.trim();
  if (!trimmed) return;

  if (trimmed === '.exit') {
    done();
    return 'exit';
  }

  const [cmd, ...rest] = trimmed.split(' ');

  try {
    switch (cmd) {
      case 'up':
        currentDir = nav.up(currentDir);
        break;
      case 'cd':
        currentDir = await nav.cd(currentDir, rest.join(' '));
        break;
      case 'ls':
        await nav.ls(currentDir);
        break;
      case 'cat':
        await files.cat(currentDir, rest.join(' '));
        break;
      case 'add':
        await files.add(currentDir, rest.join(' '));
        break;
      case 'rn':
        await files.rn(currentDir, rest[0], rest[1]);
        break;
      case 'cp':
        await files.cp(currentDir, rest[0], rest[1]);
        break;
      case 'mv':
        await files.mv(currentDir, rest[0], rest[1]);
        break;
      case 'rm':
        await files.rm(currentDir, rest.join(' '));
        break;
      case 'os':
        await osCommand(rest[0]);
        break;
      case 'hash':
        await hashCmd(currentDir, rest.join(' '));
        break;
      case 'compress':
        await compressCmd(currentDir, rest[0], rest[1]);
        break;
      case 'decompress':
        await decompressCmd(currentDir, rest[0], rest[1]);
        break;
      default:
        console.log('Invalid input');
        return;
    }
  } catch (e) {
    if (e && e.message === 'bad args' || e.message === 'no path' || e.message === 'no name') {
      console.log('Invalid input');
    } else {
      console.log('Operation failed');
    }
  }
}

function done() {
  console.log(`Thank you for using File Manager, ${userName}, goodbye!`);
}

// основной запуск
console.log(`Welcome to the File Manager, ${userName}!`);
printCwd();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '> ',
});

rl.prompt();

rl.on('line', async (line) => {
  const res = await handleCommand(line);
  if (res === 'exit') {
    rl.close();
    return;
  }
  printCwd();
  rl.prompt();
});

rl.on('SIGINT', () => {
  rl.close();
});

rl.on('close', () => {
  done();
  process.exit(0);
});

