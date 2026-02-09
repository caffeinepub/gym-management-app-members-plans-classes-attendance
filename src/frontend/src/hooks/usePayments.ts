import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Payment } from '../backend';

export function useGetPaymentsForMember(memberId: bigint | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<Payment[]>({
    queryKey: ['payments', memberId?.toString()],
    queryFn: async () => {
      if (!actor || !memberId) return [];
      try {
        return await actor.getPaymentsForMember(memberId);
      } catch (error) {
        console.error('Error fetching payments:', error);
        return [];
      }
    },
    enabled: !!actor && !isFetching && !!memberId,
  });
}

export function useAddPayment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      memberId,
      amount,
      method,
      notes,
    }: {
      memberId: bigint;
      amount: number;
      method: string;
      notes: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addPayment(memberId, amount, method, notes);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['payments', variables.memberId.toString()] });
    },
  });
}
