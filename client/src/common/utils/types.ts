import { UseMutationOptions, UseQueryOptions } from '@tanstack/react-query';

export type MutationOpts = Omit<
  UseMutationOptions<any, any, any, any>,
  'mutationFn'
>;
export type QueryOpts = Omit<UseQueryOptions<any, any, any, any>, 'queryFn'>;
