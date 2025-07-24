import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useInvalidateCache(queryKey: string[]) {
  const queryClient = useQueryClient();

  const { mutate: invalidateCache } = useMutation({
    mutationFn: async () => {},
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error) => {
      toast.error('캐시 갱신 중 문제가 발생하였습니다.', {
        description: error.message,
      });
    },
  });

  if (queryKey.length === 0) {
    return { invalidateCache: () => {} };
  }

  return { invalidateCache };
}
