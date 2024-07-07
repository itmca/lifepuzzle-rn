// 프로젝트의 root 경로에 config.js라는 파일을 생성하였다.
import Reactotron from 'reactotron-react-native';

Reactotron.configure() // controls connection & communication settings
  .useReactNative() // add all built-in react native plugins
  .connect(); // let's connect!
