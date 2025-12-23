import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { LayoutChangeEvent, ScrollView } from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { BottomSheet } from '../../../../components/ui/interaction/BottomSheet';
import { ContentContainer } from '../../../../components/ui/layout/ContentContainer';
import { BasicButton } from '../../../../components/ui/form/Button';
import { GalleryTag } from '../../../Home/components/gallery/GalleryTag';
import { Color } from '../../../../constants/color.constant';
import { BodyTextB, BodyTextM } from '../../../../components/ui/base/TextBase';
import { AgeType, TagType } from '../../../../types/core/media.type';
import { HeroType } from '../../../../types/core/hero.type';
import {
  calculateAgeGroupFromDate,
  isDateInAgeGroup,
} from '../../../../utils/age-calculator.util';
import { formatDateWithDay } from '../../../../utils/date-formatter.util';

type Props = {
  opened: boolean;
  onClose: () => void;
  initialDate?: Date;
  initialAgeGroup?: AgeType;
  tags: TagType[];
  hero: HeroType;
  onConfirm: (date: Date, ageGroup: AgeType) => void;
};

const StoryDateAgeBottomSheet = ({
  opened,
  onClose,
  initialDate,
  initialAgeGroup,
  tags,
  hero,
  onConfirm,
}: Props): React.ReactElement => {
  // React hooks - UI States
  const [selectedDate, setSelectedDate] = useState<Date>(
    initialDate ?? new Date(),
  );
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<AgeType | null>(
    initialAgeGroup ?? null,
  );
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Refs
  const tagScrollRef = useRef<ScrollView>(null);
  const tagOffsetsRef = useRef<number[]>([]);
  const layoutCompletedRef = useRef(false);

  // Memoized 값
  // AI_PHOTO 태그 제외한 태그만 필터링
  const filteredTags = useMemo(
    () => tags.filter(tag => tag.key !== 'AI_PHOTO'),
    [tags],
  );

  // 날짜 유효성 검증
  const isValidDateForAgeGroup = useMemo(() => {
    if (!selectedAgeGroup || selectedAgeGroup === 'UNCATEGORIZED') {
      return true;
    }
    return isDateInAgeGroup(hero.birthday, selectedDate, selectedAgeGroup);
  }, [hero.birthday, selectedDate, selectedAgeGroup]);

  // 확인 버튼 활성화 여부
  const isConfirmDisabled = !selectedAgeGroup || !isValidDateForAgeGroup;

  // Custom functions
  const scrollToTagIndex = useCallback((index: number, animated: boolean) => {
    if (!tagScrollRef.current) {
      return;
    }

    const offset = tagOffsetsRef.current[index];
    if (offset === undefined) {
      return;
    }

    tagScrollRef.current.scrollTo({ x: offset, animated });
  }, []);

  const handleTagPress = useCallback(
    (index: number) => {
      const tag = filteredTags[index];
      if (tag) {
        setSelectedAgeGroup(tag.key as AgeType);
        scrollToTagIndex(index, true);
      }
    },
    [filteredTags, scrollToTagIndex],
  );

  const handleTagLayout = useCallback(
    (index: number, event: LayoutChangeEvent) => {
      const { x } = event.nativeEvent.layout;
      tagOffsetsRef.current[index] = x;

      if (
        !layoutCompletedRef.current &&
        tagOffsetsRef.current.length === filteredTags.length &&
        tagOffsetsRef.current.every(offset => offset !== undefined)
      ) {
        layoutCompletedRef.current = true;

        if (selectedAgeGroup) {
          const selectedIndex = filteredTags.findIndex(
            tag => tag.key === selectedAgeGroup,
          );
          if (selectedIndex !== -1) {
            setTimeout(() => {
              scrollToTagIndex(selectedIndex, false);
            }, 100);
          }
        }
      }
    },
    [filteredTags, scrollToTagIndex, selectedAgeGroup],
  );

  const handleDateChange = useCallback(
    (date: Date) => {
      setSelectedDate(date);
      setShowDatePicker(false);

      // 날짜 변경 시 해당 날짜의 나이대로 자동 제안
      const suggestedAgeGroup = calculateAgeGroupFromDate(hero.birthday, date);
      setSelectedAgeGroup(suggestedAgeGroup);
    },
    [hero.birthday],
  );

  const handleConfirm = useCallback(() => {
    if (selectedAgeGroup && isValidDateForAgeGroup) {
      onConfirm(selectedDate, selectedAgeGroup);
      onClose();
    }
  }, [
    selectedDate,
    selectedAgeGroup,
    isValidDateForAgeGroup,
    onConfirm,
    onClose,
  ]);

  // Side effects
  useEffect(() => {
    if (opened) {
      // BottomSheet가 열릴 때 초기값 설정
      setSelectedDate(initialDate ?? new Date());
      const initialAgeGroupValue =
        initialAgeGroup ??
        calculateAgeGroupFromDate(hero.birthday, initialDate ?? new Date());
      setSelectedAgeGroup(initialAgeGroupValue);
    }
  }, [opened, initialDate, initialAgeGroup, hero.birthday]);

  useEffect(() => {
    tagOffsetsRef.current = [];
    layoutCompletedRef.current = false;
  }, [filteredTags]);

  useEffect(() => {
    if (!selectedAgeGroup) {
      return;
    }

    const selectedIndex = filteredTags.findIndex(
      tag => tag.key === selectedAgeGroup,
    );
    if (selectedIndex === -1) {
      return;
    }

    scrollToTagIndex(selectedIndex, true);
  }, [filteredTags, scrollToTagIndex, selectedAgeGroup]);

  return (
    <>
      <BottomSheet
        title="날짜 및 나이대 선택"
        opened={opened}
        onClose={onClose}
        snapPoints={[400]}
      >
        <ContentContainer gap={24}>
          {/* 나이대 선택 영역 */}
          <ContentContainer gap={12}>
            <BodyTextM color={Color.GREY_700}>나이대</BodyTextM>
            <ScrollView
              ref={tagScrollRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8 }}
            >
              {filteredTags.map((tag, index) => (
                <GalleryTag
                  key={tag.key}
                  item={tag}
                  index={index}
                  selectedTag={
                    selectedAgeGroup
                      ? { key: selectedAgeGroup, label: '' }
                      : null
                  }
                  onPress={handleTagPress}
                  onLayout={event => handleTagLayout(index, event)}
                  showCount={false}
                  compact
                />
              ))}
            </ScrollView>
          </ContentContainer>

          {/* 날짜 선택 영역 */}
          <ContentContainer gap={12}>
            <BodyTextM color={Color.GREY_700}>날짜</BodyTextM>
            <BasicButton
              iconName={'calendar'}
              text={formatDateWithDay(selectedDate)}
              onPress={() => setShowDatePicker(true)}
              textColor={Color.GREY_800}
              backgroundColor={Color.MAIN_LIGHT}
              borderColor={Color.GREY_100}
              height={48}
              borderRadius={8}
            />
          </ContentContainer>

          {/* 유효성 검증 메시지 */}
          {!isValidDateForAgeGroup && (
            <ContentContainer
              backgroundColor={Color.ERROR_100}
              paddingHorizontal={12}
              paddingVertical={8}
              borderRadius={8}
              alignCenter
            >
              <BodyTextB color={Color.ERROR_300}>
                날짜 범위가 나이대와 맞지 않습니다.
              </BodyTextB>
            </ContentContainer>
          )}

          {/* 확인/취소 버튼 */}
          <ContentContainer useHorizontalLayout gap={12}>
            <ContentContainer flex={1}>
              <BasicButton
                text="취소"
                onPress={onClose}
                textColor={Color.GREY_600}
                backgroundColor={Color.WHITE}
                borderColor={Color.GREY_300}
                height={48}
                borderRadius={24}
              />
            </ContentContainer>
            <ContentContainer flex={1}>
              <BasicButton
                text="확인"
                onPress={handleConfirm}
                textColor={Color.WHITE}
                backgroundColor={Color.MAIN_DARK}
                borderColor={Color.MAIN_DARK}
                height={48}
                borderRadius={24}
                disabled={isConfirmDisabled}
                disabledBackgroundColor={Color.GREY_100}
                disabledTextColor={Color.GREY_400}
                disabledBorderColor={Color.GREY_200}
              />
            </ContentContainer>
          </ContentContainer>
        </ContentContainer>
      </BottomSheet>

      {/* DateTimePicker Modal */}
      <DateTimePicker
        isVisible={showDatePicker}
        date={selectedDate}
        mode="date"
        display="spinner"
        onConfirm={handleDateChange}
        onCancel={() => setShowDatePicker(false)}
        locale="ko"
        confirmTextIOS="확인"
        cancelTextIOS="취소"
      />
    </>
  );
};

export { StoryDateAgeBottomSheet };
