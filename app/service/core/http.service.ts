import axios, {AxiosInstance, AxiosRequestConfig} from 'axios';
import {SERVER_HOST} from '../../constants/url.constant';
import {convertDateStringToDate} from '../utils/json-convert.service';
import logger from '../../utils/logger';

/**
 * HTTP 클라이언트를 위한 순수 서비스 로직
 */
export class HttpService {
  /**
   * 기본 axios 인스턴스를 생성합니다.
   */
  static createAxiosInstance(timeout: number = 5000): AxiosInstance {
    const client = axios.create({timeout});

    client.interceptors.response.use(response => {
      return convertDateStringToDate(response);
    });

    return client;
  }

  /**
   * URL을 정규화합니다 (SERVER_HOST 추가)
   */
  static normalizeUrl(url: string): string {
    return url.startsWith('http') ? url : SERVER_HOST + url;
  }

  /**
   * 요청 설정을 준비합니다.
   */
  static prepareRequestConfig(
    axiosConfig: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const url = axiosConfig.url || '';
    const normalizedUrl = this.normalizeUrl(url);

    logger.debug(normalizedUrl);

    return {
      ...axiosConfig,
      url: normalizedUrl,
    };
  }
}
