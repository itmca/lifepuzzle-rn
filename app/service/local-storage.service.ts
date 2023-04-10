import {MMKV} from 'react-native-mmkv';

export type ValueType = 'string' | 'number' | 'boolean' | 'json';

export class LocalStorage {
  private static storage = new MMKV();

  static set(key: string, value: string | number | boolean) {
    this.storage.set(key, value);
  }

  static get(key: string, valueType: ValueType) {
    if (valueType == 'string') return this.storage.getString(key);
    else if (valueType == 'number') return this.storage.getNumber(key);
    else if (valueType == 'boolean') return this.storage.getBoolean(key);
    else if (valueType == 'json') {
      const jsonString = this.storage.getString(key);
      return jsonString != undefined ? JSON.parse(jsonString) : jsonString;
    } else throw Error('Undefined Value Type');
  }

  static delete(key: string) {
    this.storage.delete(key);
  }
}
