// Provides dev-time type structures for  `danger` - doesn't affect runtime.
import lint from '@commitlint/lint';
import { LintOutcome } from '@commitlint/types';
import { DangerDSLType } from '../node_modules/danger/distribution/dsl/DangerDSL';
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

interface Rules {
  'body-leading-blank': Array<number | string>;
  'footer-leading-blank': Array<number | string>;
  'header-max-length': Array<number | string>;
  'scope-case': Array<number | string>;
  'subject-case': Array<string[] | number | string>;
  'subject-empty': Array<number | string>;
  'subject-full-stop': Array<number | string>;
  'type-case': Array<number | string>;
  'type-empty': Array<number | string>;
  'type-enum': Array<string[] | number | string>;
}

const defaultConfig = {
  severity: 'fail' as const,
  messageReplacer: ({ ruleOutcome, commitMessage }) => {
    let failureMessage = `There is a problem with the commit message\n> ${commitMessage}`;

    ruleOutcome.errors.forEach((error) => {
      failureMessage = `${failureMessage}\n- ${error.message}`;
    });

    return failureMessage;
  },
};

export default async function commitlint(
  rules: Rules,
  userConfig?: CommitlintPluginConfig
): Promise<void> {
  const config = { ...defaultConfig, ...userConfig };

  for (const commit of danger.git.commits) {
    await lintCommitMessage(commit.message, rules, config);
  }
}

async function lintCommitMessage(
  commitMessage,
  rules,
  config: Required<CommitlintPluginConfig>
) {
  return lint(commitMessage, rules).then((ruleOutcome) => {
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
  });
}
