import { rules } from '@commitlint/config-conventional';
import { LintRuleOutcome } from '@commitlint/types';
import commitlint from './index';

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
declare const global: any;

describe('commitlint', () => {
  beforeEach(() => {
    global.warn = jest.fn();
    global.message = jest.fn();
    global.fail = jest.fn();
    global.markdown = jest.fn();
  });

  afterEach(() => {
    global.warn = undefined;
    global.message = undefined;
    global.fail = undefined;
    global.markdown = undefined;
    global.danger = undefined;
  });

  describe('single message', () => {
    describe('when the commit message is good', () => {
      beforeEach(() => {
        global.danger = { git: { commits: [{ message: 'chore: foo' }] } };
      });
      it('should do nothing', async () => {
        await commitlint(rules);
        expect(global.fail).toHaveBeenCalledTimes(0);
      });
    });

    describe('when the commit message is bad', () => {
      beforeEach(() => {
        global.danger = { git: { commits: [{ message: 'foo' }] } };
      });
      describe('with default config', () => {
        it('should generate a message and fail', async () => {
          await commitlint(rules);
          expect(global.fail).toHaveBeenCalledTimes(1);
          expect(global.fail).toHaveBeenCalledWith(
            'There is a problem with the commit message\n> foo\n- subject may not be empty\n- type may not be empty'
          );
        });
      });

      describe('with custom messageReplacer function', () => {
        it('should generate a custom message, and fail', async () => {
          const customMessagePrefix = `This is a beginning of the failure message:`;
          const customMessageSuffix =
            'To learn more about Conventional Commits, visit <a href="https://www.conventionalcommits.org">https://www.conventionalcommits.org/</a>';

          const messageReplacer = (
            errors: LintRuleOutcome[],
            commitMessage: string
          ): string => {
            const errorsDescription = errors
              .map((error) => `- ${error.message}`)
              .join('<br>');

            return `${customMessagePrefix} ${commitMessage}<br>${errorsDescription}<br>${customMessageSuffix}`;
          };

          await commitlint(rules, { messageReplacer });
          expect(global.fail).toHaveBeenCalledTimes(1);
          expect(global.fail).toHaveBeenCalledWith(
            `${customMessagePrefix} foo<br>- subject may not be empty<br>- type may not be empty<br>${customMessageSuffix}`
          );
        });
      });

      describe('with warn configured', () => {
        it('should generate a message and fail', async () => {
          await commitlint(rules, { severity: 'warn' });
          expect(global.fail).toHaveBeenCalledTimes(0);
          expect(global.warn).toHaveBeenCalledTimes(1);
          expect(global.warn).toHaveBeenCalledWith(
            'There is a problem with the commit message\n> foo\n- subject may not be empty\n- type may not be empty'
          );
        });
      });
    });
  });

  describe('multiple messages', () => {
    describe('when the commit message is good', () => {
      beforeEach(() => {
        global.danger = {
          git: {
            commits: [{ message: 'chore: foo' }, { message: 'feat: bar' }],
          },
        };
      });
      it('should do nothing', async () => {
        await commitlint(rules);
        expect(global.fail).toHaveBeenCalledTimes(0);
      });
    });

    describe('when the commit message is bad', () => {
      beforeEach(() => {
        global.danger = {
          git: { commits: [{ message: 'foo' }, { message: 'bar' }] },
        };
      });

      describe('with default config', () => {
        it('should generate a message and fail', async () => {
          await commitlint(rules);
          expect(global.fail).toHaveBeenCalledTimes(2);
          expect(global.fail).toHaveBeenCalledWith(
            'There is a problem with the commit message\n> foo\n- subject may not be empty\n- type may not be empty'
          );
          expect(global.fail).toHaveBeenCalledWith(
            'There is a problem with the commit message\n> bar\n- subject may not be empty\n- type may not be empty'
          );
        });
      });
    });
  });
});
