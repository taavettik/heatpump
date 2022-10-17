import { useQuery } from '@tanstack/react-query';
import { api } from '../common/api';
import { QueryOpts } from '../common/utils/types';

export function useMeQuery(opts: QueryOpts) {
  return useQuery(['me'], api.me, opts);
}

export function useHeatpumpQuery() {
  return useQuery(['heatpump'], api.fetchHeatpump, {
    refetchOnWindowFocus: true,
  });
}
