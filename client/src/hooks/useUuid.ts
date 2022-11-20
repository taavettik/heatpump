import { useMemo } from 'preact/hooks';
import { v4 } from 'uuid';

export function useUuid() {
  return useMemo(() => v4(), []);
}
