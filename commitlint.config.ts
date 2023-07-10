import type {UserConfig} from '@commitlint/types';

const Configuration: UserConfig = {
  extends: ['@commitlint/config-conventional'],
  parserPreset: {
    parserOpts: {
      headerPattern: /^(\[\w*-\d*\] )?(\w*)(\(\w*\))?: (.*)$/,
      headerCorrespondence: ['ticket', 'type', 'scope', 'subject'],
    },
  },
};

export default Configuration;
