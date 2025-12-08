import * as Keychain from 'react-native-keychain';
import { AuthTokens } from '../../types/auth/auth.type.ts';

const AUTH_TOKEN_SERVICE = 'io.itmca.lifepuzzle.authToken';

/**
 * Secure storage service for sensitive data using react-native-keychain.
 * Uses iOS Keychain and Android Keystore for encrypted storage.
 */
export class SecureStorage {
  /**
   * Store auth tokens securely
   */
  static async setAuthTokens(tokens: AuthTokens): Promise<boolean> {
    try {
      await Keychain.setGenericPassword('authToken', JSON.stringify(tokens), {
        service: AUTH_TOKEN_SERVICE,
      });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Retrieve auth tokens from secure storage
   */
  static async getAuthTokens(): Promise<AuthTokens | null> {
    try {
      const credentials = await Keychain.getGenericPassword({
        service: AUTH_TOKEN_SERVICE,
      });
      if (credentials && credentials.password) {
        return JSON.parse(credentials.password) as AuthTokens;
      }
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Remove auth tokens from secure storage
   */
  static async removeAuthTokens(): Promise<boolean> {
    try {
      await Keychain.resetGenericPassword({ service: AUTH_TOKEN_SERVICE });
      return true;
    } catch {
      return false;
    }
  }
}
