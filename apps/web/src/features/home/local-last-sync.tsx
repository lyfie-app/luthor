'use client';

import { useMemo } from 'react';

type LocalLastSyncProps = {
  isoTimestamp: string | null;
};

export function LocalLastSync({ isoTimestamp }: LocalLastSyncProps) {
  const label = useMemo(() => {
    if (!isoTimestamp) return 'N/A';
    const date = new Date(isoTimestamp);
    if (Number.isNaN(date.getTime())) return 'N/A';
    return date.toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'medium',
    });
  }, [isoTimestamp]);

  return <>{label}</>;
}

