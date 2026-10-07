import { useMutation, useQueryClient } from '@tanstack/react-query';
import { describeError } from './errors';
import { useToast } from './toastContext';

interface Options<TInput, TResult> {
  mutationFn: (input: TInput) => Promise<TResult>;
  success?: string;
  onSuccess?: (result: TResult) => void;
}

export function useAdminMutation<TInput = void, TResult = void>({ mutationFn, success, onSuccess }: Options<TInput, TResult>) {
  const queryClient = useQueryClient();
  const notify = useToast();

  return useMutation({
    mutationFn,
    onSuccess: async (result) => {
      await queryClient.invalidateQueries();
      if (success) notify(success);
      onSuccess?.(result);
    },
    onError: (error) => notify(describeError(error), 'error'),
  });
}
