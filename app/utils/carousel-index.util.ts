/**
 * 배열에서 아이템 삭제 후 다음 인덱스를 계산합니다.
 *
 * @param deletedIndex - 삭제되는 아이템의 인덱스
 * @param currentIndex - 현재 선택된 인덱스
 * @param newArrayLength - 삭제 후 배열의 길이
 * @returns 삭제 후 이동할 인덱스
 *
 * @example
 * // 3개 중 마지막(index 2) 삭제 -> index 1로 이동
 * calculateNextIndexAfterDeletion({ deletedIndex: 2, currentIndex: 2, newArrayLength: 2 })
 * // returns 1
 *
 * @example
 * // 3개 중 중간(index 1) 삭제, 현재 마지막 보고 있음 -> index 1 유지 (다음 아이템이 그 자리로)
 * calculateNextIndexAfterDeletion({ deletedIndex: 1, currentIndex: 2, newArrayLength: 2 })
 * // returns 1
 */
export function calculateNextIndexAfterDeletion({
  deletedIndex,
  currentIndex,
  newArrayLength,
}: {
  deletedIndex: number;
  currentIndex: number;
  newArrayLength: number;
}): number {
  // 삭제되는 항목의 인덱스를 기준으로 시작
  let targetIndex = deletedIndex;

  // 범위를 벗어나면 마지막 인덱스로 조정
  if (targetIndex >= newArrayLength) {
    targetIndex = newArrayLength - 1;
  }

  // 삭제되는 항목이 현재 보고 있는 항목보다 앞에 있으면 인덱스 -1
  if (deletedIndex < currentIndex) {
    targetIndex = currentIndex - 1;
  }

  // 최소 0 이상 보장
  return Math.max(targetIndex, 0);
}
