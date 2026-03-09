// Команды os --EOL/--cpus/--homedir/--username/--architecture

import os from 'node:os';

export function osCommand(flag) {
  switch (flag) {
    case '--EOL':
      console.log(JSON.stringify(os.EOL));
      break;
    case '--cpus': {
      const cpus = os.cpus() || [];
      console.log('Total CPUs:', cpus.length);
      const info = cpus.map((c, i) => ({
        index: i,
        model: c.model,
        speedGHz: (c.speed / 1000).toFixed(2),
      }));
      console.table(info);
      break;
    }
    case '--homedir':
      console.log(os.homedir());
      break;
    case '--username':
      console.log(os.userInfo().username);
      break;
    case '--architecture':
      console.log(process.arch);
      break;
    default:
      throw new Error('bad flag');
  }
}

