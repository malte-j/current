import { exec } from 'child_process';

exec('docker-compose --env-file .env.test up -d', (e, stdout, stderr) => {
  if (e) {
    console.log(`error: ${e.message}`);
    return;
  }
  if (stderr) {
    console.log(`${stderr}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
});