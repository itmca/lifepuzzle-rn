import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetModalProps,
} from '@gorhom/bottom-sheet';
import React, {forwardRef, useCallback, useMemo} from 'react';

const BottomSheet = forwardRef<BottomSheetModal, BottomSheetModalProps>(
  (props, ref) => {
    const snapPoints = props.snapPoints ?? useMemo(() => ['60%'], []);

    const handleSheetChanges = useCallback(() => {}, []);
    const renderBackdrop =
      props.backdropComponent ??
      useCallback(
        (props: BottomSheetBackdropProps) => (
          <BottomSheetBackdrop
            {...props}
            pressBehavior="close"
            disappearsOnIndex={-1}
          />
        ),
        [],
      );

    return (
      <BottomSheetModal
        ref={ref}
        {...props}
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        backdropComponent={renderBackdrop}>
        {props.children}
      </BottomSheetModal>
    );
  },
);
export default BottomSheet;
