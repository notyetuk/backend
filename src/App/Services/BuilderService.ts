import path from 'path';
import { promisify } from 'util';
import { exec } from 'child_process';
import axios from 'axios';
import Environment from '@envuso/core/AppContainer/Config/Environment';

async function frontendBuilder() {
  const script = path.resolve(process.cwd(), '../frontend.sh');
  const buildProcess = await promisify(exec);
  await buildProcess(`sh ${script}`);

  await axios.post(Environment.get('DISCORD_WEBHOOK'),
    {
      content: 'The newest version of NotYet was built and deployed successfully!',
    },
  );
}

export {
  frontendBuilder,
};
