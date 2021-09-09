import { rules } from '@commitlint/config-conventional';
import commitlint from './index';

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
