import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { api } from '../common/api';
import { MutationOpts } from '../common/utils/types';

export function useLoginMutation(opts: MutationOpts = {}) {
  return useMutation(api.login, {
    ...opts,
  });
}

export function useUpdateHeatpumpStateMutation(opts: MutationOpts = {}) {
  return useMutation(api.updateHeatpumpState, {
    ...opts,
  });
}

export function useUpdateScheduleMutation(opts: MutationOpts = {}) {
  return useMutation(api.updateSchedule, {
    ...opts,
  });
}

export function useCreateScheduleMutation(opts: MutationOpts = {}) {
  return useMutation(api.createSchedule, {
    ...opts,
  });
}

export function useDeleteScheduleMutation(opts: MutationOpts = {}) {
  return useMutation(api.deleteSchedule, {
    ...opts,
  });
}
