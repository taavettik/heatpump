import { useQuery } from '@tanstack/react-query';
import { api } from '../common/api';

export function useMeQuery() {
  return useQuery(['me'], api.me);
}

export function useHeatpumpQuery() {
  return useQuery(['heatpump'], api.fetchHeatpump, {
    refetchOnWindowFocus: true,
  });
}
