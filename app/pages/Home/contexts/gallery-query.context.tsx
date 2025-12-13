import React, { createContext, PropsWithChildren, useContext } from 'react';

import { useGalleries } from '../../../services/gallery/gallery.query';

type GalleryQueryContextValue = {
  isLoading: boolean;
  isError: boolean;
  hasInitialData: boolean;
  refetch: () => void;
};

const GalleryQueryContext = createContext<GalleryQueryContextValue | null>(
  null,
);

export const GalleryQueryProvider = ({
  children,
}: PropsWithChildren): React.ReactElement => {
  const { isLoading, isError, hasInitialData, refetch } = useGalleries();

  return (
    <GalleryQueryContext.Provider
      value={{ isLoading, isError, hasInitialData, refetch }}
    >
      {children}
    </GalleryQueryContext.Provider>
  );
};

export const useGalleryQueryContext = (): GalleryQueryContextValue => {
  const ctx = useContext(GalleryQueryContext);
  if (!ctx) {
    throw new Error(
      'useGalleryQueryContext must be used within GalleryQueryProvider',
    );
  }
  return ctx;
};
