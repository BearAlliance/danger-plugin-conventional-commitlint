import lint from '@commitlint/lint';
import { LintOutcome, QualifiedRules } from '@commitlint/types';
// Provides dev-time type structures for  `danger` - doesn't affect runtime.
import { DangerDSLType } from 'danger/distribution/dsl/DangerDSL';
declare const danger: DangerDSLType;
export declare function message(message: string): void;
export declare function warn(message: string): void;
export declare function fail(message: string): void;

export interface ReplacerContext {
  ruleOutcome: LintOutcome;
  commitMessage: string;
}

export interface CommitlintPluginConfig {
  severity?: 'fail' | 'warn' | 'message' | 'disable';
  messageReplacer?: (context: ReplacerContext) => string;
}

const messageReplacer = ({
  ruleOutcome,
  commitMessage,
}: {
  ruleOutcome: LintOutcome;
  commitMessage: string;
}) => {
  let failureMessage = `There is a problem with the commit message\n> ${commitMessage}`;

  ruleOutcome.errors.forEach((error: Error) => {
    failureMessage = `${failureMessage}\n- ${error.message}`;
  });

  return failureMessage;
};

const defaultConfig = {
  severity: 'fail' as const,
  messageReplacer,
};

export default async function commitlint(
  rules: QualifiedRules,
  userConfig?: CommitlintPluginConfig,
): Promise<void> {
  const config = { ...defaultConfig, ...userConfig };

  for (const commit of danger.git.commits) {
    await lintCommitMessage(commit.message, rules, config);
  }
}

async function lintCommitMessage(
  commitMessage: string,
  rules: QualifiedRules,
  config: Required<CommitlintPluginConfig>,
) {
  const ruleOutcome: LintOutcome = await lint(commitMessage, rules);
  if (!ruleOutcome.valid) {
    const failureMessage = config.messageReplacer({
      ruleOutcome,
      commitMessage,
    });

    switch (config.severity) {
      case 'fail':
        fail(failureMessage);
        break;
      case 'warn':
        warn(failureMessage);
        break;
      case 'message':
        message(failureMessage);
        break;
      case 'disable':
        break;
    }
  }
}
