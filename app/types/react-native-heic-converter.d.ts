declare module 'react-native-heic-converter' {
  interface ConvertOptions {
    path: string;
  }

  interface ConvertResult {
    success: boolean;
    path: string;
    error?: string;
    base64?: string;
  }

  const RNHeicConverter: {
    convert(options: ConvertOptions): Promise<ConvertResult>;
  };

  export default RNHeicConverter;
}
