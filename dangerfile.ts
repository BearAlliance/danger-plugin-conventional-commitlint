import { message, danger } from 'danger';
import commitlint, { CommitlintPluginConfig } from './src/index';
import configConventional from '@commitlint/config-conventional';

const modifiedMD = danger.git.modified_files.join('- ');
message('Changed Files in this PR: \n - ' + modifiedMD);

// Run conventional commitlint from this project
(async function dangerReport() {
  const commitlintConfig: CommitlintPluginConfig = {
    severity: 'warn',
  };
  await commitlint(configConventional.rules, commitlintConfig);
})();
