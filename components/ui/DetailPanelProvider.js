'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import DetailPanel from './DetailPanel';

const DetailPanelContext = createContext(null);

export function useDetailPanel() {
  return useContext(DetailPanelContext);
}

export default function DetailPanelProvider({ children }) {
  const [selected, setSelected] = useState(null);
  const [mediaType, setMediaType] = useState('movie');

  const openDetail = useCallback((item, type) => {
    setSelected(item);
    setMediaType(type || item.media_type || 'movie');
  }, []);

  const closeDetail = useCallback(() => {
    setSelected(null);
  }, []);

  return (
    <DetailPanelContext.Provider value={openDetail}>
      {children}
      {selected && (
        <DetailPanel
          item={selected}
          mediaType={mediaType}
          onClose={closeDetail}
        />
      )}
    </DetailPanelContext.Provider>
  );
}
