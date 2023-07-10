import * as loglevel from 'loglevel';
import Config from 'react-native-config';

if (Config.LOG_LEVEL === 'debug') {
  loglevel.setLevel('debug');
} else {
  loglevel.setLevel('error');
}

export default loglevel;
