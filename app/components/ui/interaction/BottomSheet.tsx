import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetModalProps,
  BottomSheetModalProvider,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Title } from '../base/TextBase';
import { ContentContainer } from '../layout/ContentContainer';
import { SvgIcon } from '../display/SvgIcon';
import {
  Dimensions,
  Keyboard,
  LayoutChangeEvent,
  Platform,
  TouchableOpacity,
} from 'react-native';

interface ModalProps extends Omit<BottomSheetModalProps, 'children'> {
  title?: string;
  opened?: boolean;
  onClose?: () => void;
  children?: React.ReactNode;
  headerPaddingBottom?: number;
  paddingBottom?: number;
}
const BottomSheet = forwardRef<BottomSheetModal, ModalProps>(
  (
    {
      title,
      opened,
      snapPoints,
      backdropComponent,
      onClose,
      paddingBottom,
      headerPaddingBottom,
      ...props
    },
    _ref,
  ) => {
    // Refs
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);

    // React hooks
    const [contentHeight, setContentHeight] = useState(0);
    const insets = useSafeAreaInsets();

    // Memoized 값
    const defaultSnapPoints = useMemo(
      () => [`${contentHeight || 60}%`],
      [contentHeight],
    );
    const _snapPoints = snapPoints ?? defaultSnapPoints;

    const defaultRenderBackdrop = useCallback(
      (backdropProps: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...backdropProps}
          pressBehavior="none"
          disappearsOnIndex={-1}
        />
      ),
      [],
    );
    const renderBackdrop = backdropComponent ?? defaultRenderBackdrop;

    const handleClose = useCallback(() => {
      bottomSheetModalRef?.current?.close();
      if (onClose) {
        onClose();
      }
    }, [onClose]);

    // Side effects
    useEffect(() => {
      if (opened) {
        bottomSheetModalRef.current?.present();
      } else {
        bottomSheetModalRef.current?.close();
      }
    }, [opened]);

    useEffect(() => {
      if (!opened) {
        return;
      }

      const hideEvent =
        Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
      const hideListener = Keyboard.addListener(hideEvent, () => {
        bottomSheetModalRef.current?.snapToIndex(0);
      });

      return () => hideListener.remove();
    }, [opened]);

    return (
      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={0}
          snapPoints={_snapPoints}
          handleComponent={null}
          backdropComponent={renderBackdrop}
          onDismiss={handleClose}
          keyboardBehavior="interactive"
          keyboardBlurBehavior="restore"
          android_keyboardInputMode="adjustResize"
        >
          <BottomSheetView>
            <ContentContainer
              borderTopRadius={20}
              useHorizontalLayout
              paddingHorizontal={20}
              paddingTop={20}
              paddingBottom={headerPaddingBottom ?? 20}
            >
              <ContentContainer width={20} />
              <Title>{title}</Title>
              <TouchableOpacity
                onPress={() => {
                  handleClose();
                }}
              >
                <SvgIcon name={'close'} />
              </TouchableOpacity>
            </ContentContainer>
            <ContentContainer
              onLayout={(e: LayoutChangeEvent) => {
                const screenHeight = Dimensions.get('window').height;
                const contentHeightOfEvent = e.nativeEvent.layout.height;
                setContentHeight(
                  ((contentHeightOfEvent + 60) / screenHeight) * 100,
                ); // padding 고려
              }}
              paddingHorizontal={20}
              paddingBottom={(paddingBottom ?? 20) + insets.bottom}
            >
              {props.children}
            </ContentContainer>
          </BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    );
  },
);
export default BottomSheet;
