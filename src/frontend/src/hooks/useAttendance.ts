import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { CheckIn } from '../backend';

export function useGetCheckInsForMember(memberId: bigint | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<CheckIn[]>({
    queryKey: ['checkIns', memberId?.toString()],
    queryFn: async () => {
      if (!actor || !memberId) return [];
      try {
        return await actor.getCheckInsForMember(memberId);
      } catch (error) {
        console.error('Error fetching check-ins:', error);
        return [];
      }
    },
    enabled: !!actor && !isFetching && !!memberId,
  });
}

export function useCheckIn() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (memberId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.checkIn(memberId);
    },
    onSuccess: (_, memberId) => {
      queryClient.invalidateQueries({ queryKey: ['checkIns', memberId.toString()] });
    },
  });
}
