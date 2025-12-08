import { PhotoIdentifier } from '@react-native-camera-roll/camera-roll';
import { extractFileName } from './file-path.util.ts';

/**
 * FormData에 추가할 파일 정보 타입
 */
interface FormDataFile {
  uri: string;
  type: string;
  name?: string;
}

/**
 * FormData에 추가할 JSON 정보 타입
 */
interface FormDataJson {
  string: string;
  type: 'application/json';
}

/**
 * FormData 생성을 위한 공통 유틸리티 클래스
 */
export class PayloadBuilder {
  /**
   * 새로운 FormData 인스턴스를 생성합니다.
   */
  static createFormData(): FormData {
    return new FormData();
  }

  /**
   * FormData에 파일을 추가합니다.
   */
  static addFileToFormData(
    formData: FormData,
    fieldName: string,
    uri: string,
    fileName: string | undefined,
    mimeType: string,
  ): void {
    const fileData: FormDataFile = {
      uri,
      type: mimeType,
      name: fileName,
    };
    formData.append(fieldName, fileData as any);
  }

  /**
   * FormData에 JSON 데이터를 추가합니다.
   */
  static addJsonToFormData<T = unknown>(
    formData: FormData,
    fieldName: string,
    data: T,
  ): void {
    const jsonData: FormDataJson = {
      string: JSON.stringify(data),
      type: 'application/json',
    };
    formData.append(fieldName, jsonData as any);
  }

  /**
   * PhotoIdentifier에서 이미지 파일을 FormData에 추가합니다.
   */
  static addPhotoToFormData(
    formData: FormData,
    fieldName: string,
    photo: PhotoIdentifier | undefined,
    mimeType: string,
  ): void {
    if (!photo?.node?.image?.uri) {
      return;
    }

    const uri = photo.node.image.uri;
    const fileName = extractFileName(uri);

    this.addFileToFormData(formData, fieldName, uri, fileName, mimeType);
  }

  /**
   * 음성 파일을 FormData에 추가합니다.
   */
  static addVoiceToFormData(
    formData: FormData,
    fieldName: string,
    voiceUrl: string,
    mimeType: string,
  ): void {
    if (!voiceUrl) {
      return;
    }

    const fileName = extractFileName(voiceUrl);
    this.addFileToFormData(formData, fieldName, voiceUrl, fileName, mimeType);
  }
}
