import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetModalProps,
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
import {BottomSheetHandleProps} from '@gorhom/bottom-sheet';
import Title from './Title';
import {ContentContainer} from '../container/ContentContainer';
import {SvgIcon} from './SvgIcon';
import {Dimensions, TouchableOpacity} from 'react-native';

interface HandleProps extends BottomSheetHandleProps {
  title: string;
  onClose: () => {};
}
interface ModalProps extends BottomSheetModalProps {
  title?: string;
  opened?: boolean;
  onClose?: () => void;
}
const HeaderHandleComponent: React.FC<HandleProps> = memo(
  ({title, onClose}) => {
    return (
      <ContentContainer
        borderTopRadius={20}
        useHorizontalLayout
        paddingHorizontal={20}
        paddingVertical={20}>
        <ContentContainer width="20" />
        <Title alignCenter>{title}</Title>
        <TouchableOpacity onPress={onClose}>
          <SvgIcon name={'close'} />
        </TouchableOpacity>
      </ContentContainer>
    );
  },
);
const BottomSheet = forwardRef<BottomSheetModal, ModalProps>(
  ({title, opened, snapPoints, backdropComponent, ...props}, ref) => {
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const [contentHeight, setContentHeight] = useState(0);

    const _snapPoints =
      snapPoints ?? useMemo(() => [`${contentHeight || 60}%`], [contentHeight]);
    const renderBackdrop =
      backdropComponent ??
      useCallback(
        (props: BottomSheetBackdropProps) => (
          <BottomSheetBackdrop
            {...props}
            pressBehavior="none"
            disappearsOnIndex={-1}
          />
        ),
        [],
      );
    const handleClose = useCallback(() => {
      bottomSheetModalRef?.current?.close();
      if (props.onClose) {
        props.onClose();
      }
    }, [props.onClose, bottomSheetModalRef]);

    const renderCustomHandle = useCallback(
      props => (
        <HeaderHandleComponent
          title={title ?? ''}
          onClose={handleClose}
          {...props}
        />
      ),
      [],
    );
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
        onDismiss={handleClose}>
        <ContentContainer
          onLayout={e => {
            const screenHeight = Dimensions.get('window').height;
            const contentHeight = e.nativeEvent.layout.height;
            setContentHeight(((contentHeight + 60) / screenHeight) * 100); // padding 고려
          }}
          paddingHorizontal={20}
          paddingBottom={38}>
          {props.children}
        </ContentContainer>
      </BottomSheetModal>
    );
  },
);
export default BottomSheet;
