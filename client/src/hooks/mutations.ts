import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { api } from '../common/api';

type Opts = Omit<UseMutationOptions<any, any, any, any>, 'mutationFn'>;

export function useLoginMutation(opts: Opts = {}) {
  return useMutation(api.login, {
    ...opts,
  });
}

export function useUpdateHeatpumpStateMutation(opts: Opts = {}) {
  return useMutation(api.updateHeatpumpState, {
    ...opts,
  });
}
