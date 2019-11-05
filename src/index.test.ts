import rules from '@commitlint/config-conventional';
import lint from '@commitlint/lint';
import commitlint from './index';

declare const global: any;

// jest.mock('@commitlint/lint', () => jest.fn());

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
    beforeEach(() => {
      global.danger = { git: { commits: [{ message: 'foo' }] } };
    });
    describe('when the commit message is good', () => {
      beforeEach(() => {
        lint.mockImplementationOnce(() => Promise.resolve({ valid: true }));
      });
      it('should do nothing', async () => {
        await commitlint(rules);
        expect(global.fail).toHaveBeenCalledTimes(0);
      });
    });

    describe('when the commit message is bad', () => {
      beforeEach(() => {
        lint.mockImplementationOnce(() =>
          Promise.resolve({ valid: false, errors: [{ message: 'really bad' }] })
        );
      });
      describe('with default config', () => {
        it('should generate a message and fail', async () => {
          await commitlint(rules);
          expect(global.fail).toHaveBeenCalledTimes(1);
          expect(global.fail).toHaveBeenCalledWith(
            'There is a problem with the commit message\n> foo\n- really bad'
          );
        });
      });
      describe('with warn configured', () => {
        it('should generate a message and fail', async () => {
          await commitlint(rules, { severity: 'warn' });
          expect(global.warn).toHaveBeenCalledTimes(1);
          expect(global.warn).toHaveBeenCalledWith(
            'There is a problem with the commit message\n> foo\n- really bad'
          );
        });
      });
    });
  });

  describe('multiple messages', () => {
    beforeEach(() => {
      global.danger = {
        git: { commits: [{ message: 'foo' }, { message: 'bar' }] }
      };
    });
    describe('when the commit message is good', () => {
      beforeEach(() => {
        lint.mockImplementation(() => Promise.resolve({ valid: true }));
      });
      it('should do nothing', async () => {
        await commitlint(rules);
        expect(global.fail).toHaveBeenCalledTimes(0);
      });
    });

    describe('when the commit message is bad', () => {
      beforeEach(() => {
        lint.mockImplementation(() =>
          Promise.resolve({ valid: false, errors: [{ message: 'really bad' }] })
        );
      });

      describe('with default config', () => {
        it('should generate a message and fail', async () => {
          await commitlint(rules);
          expect(global.fail).toHaveBeenCalledTimes(2);
          expect(global.fail).toHaveBeenCalledWith(
            'There is a problem with the commit message\n> foo\n- really bad'
          );
        });
      });
    });
  });
});
