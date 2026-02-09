import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

// This file manages all React Query calls to the backend and state invalidation
export function useGetAllData() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['data'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllMembers();
    },
    enabled: !!actor && !isFetching,
  });
}
