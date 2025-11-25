import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetHandleProps,
  BottomSheetModal,
  BottomSheetModalProps,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Title } from '../base/TextBase';
import { ContentContainer } from '../layout/ContentContainer';
import { SvgIcon } from '../display/SvgIcon';
import { Dimensions, TouchableOpacity } from 'react-native';

interface HandleProps extends BottomSheetHandleProps {
  title: string;
  onClose: () => void;
}
interface ModalProps extends Omit<BottomSheetModalProps, 'children'> {
  title?: string;
  opened?: boolean;
  onClose?: () => void;
  children?: React.ReactNode;
}
const HeaderHandleComponent: React.FC<HandleProps> = memo(
  ({ title, onClose }) => {
    return (
      <ContentContainer
        borderTopRadius={20}
        useHorizontalLayout
        paddingHorizontal={20}
        paddingVertical={20}
      >
        <ContentContainer width={20} />
        <Title>{title}</Title>
        <TouchableOpacity onPress={onClose}>
          <SvgIcon name={'close'} />
        </TouchableOpacity>
      </ContentContainer>
    );
  },
);
const BottomSheet = forwardRef<BottomSheetModal, ModalProps>(
  ({ title, opened, snapPoints, backdropComponent, ...props }, ref) => {
    // Refs
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);

    // React hooks
    const [contentHeight, setContentHeight] = useState(0);

    // Memoized 값
    const defaultSnapPoints = useMemo(
      () => [`${contentHeight || 60}%`],
      [contentHeight],
    );
    const _snapPoints = snapPoints ?? defaultSnapPoints;

    const defaultRenderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          pressBehavior="none"
          disappearsOnIndex={-1}
        />
      ),
      [],
    );
    const renderBackdrop = backdropComponent ?? defaultRenderBackdrop;

    const handleClose = useCallback(() => {
      bottomSheetModalRef?.current?.close();
      if (props.onClose) {
        props.onClose();
      }
    }, [props.onClose, bottomSheetModalRef]);

    const renderCustomHandle = useCallback(
      (props: BottomSheetHandleProps) => (
        <HeaderHandleComponent
          title={title ?? ''}
          onClose={handleClose}
          {...props}
        />
      ),
      [handleClose, title],
    );

    // Side effects
    useEffect(() => {
      if (opened) {
        bottomSheetModalRef.current?.present();
      } else {
        bottomSheetModalRef.current?.close();
      }
    }, [opened]);
    return (
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={_snapPoints}
        handleComponent={renderCustomHandle}
        backdropComponent={renderBackdrop}
        onDismiss={handleClose}
      >
        <BottomSheetView>
          <ContentContainer
            onLayout={e => {
              const screenHeight = Dimensions.get('window').height;
              const contentHeight = e.nativeEvent.layout.height;
              setContentHeight(((contentHeight + 60) / screenHeight) * 100); // padding 고려
            }}
            paddingHorizontal={20}
            paddingBottom={38}
          >
            {props.children}
          </ContentContainer>
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);
export default BottomSheet;
