import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetModalProps,
} from '@gorhom/bottom-sheet';
import React, {forwardRef, useCallback, useMemo} from 'react';

const BottomSheet = forwardRef<BottomSheetModal, BottomSheetModalProps>(
  (props, ref) => {
    const snapPoints = useMemo(() => ['30%', '55%'], []);

    const handleSheetChanges = useCallback(() => {}, []);
    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop {...props} pressBehavior="close" />
      ),
      [],
    );

    return (
      <BottomSheetModal
        ref={ref}
        {...props}
        index={1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        backdropComponent={renderBackdrop}>
        {props.children}
      </BottomSheetModal>
    );
  },
);
export default BottomSheet;
