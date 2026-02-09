import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Member } from '../backend';

export function useGetAllMembers() {
  const { actor, isFetching } = useActor();

  return useQuery<Member[]>({
    queryKey: ['members'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllMembers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetMember(id: bigint | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<Member | null>({
    queryKey: ['member', id?.toString()],
    queryFn: async () => {
      if (!actor || !id) return null;
      try {
        return await actor.getMember(id);
      } catch (error) {
        console.error('Error fetching member:', error);
        return null;
      }
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useCreateMember() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, contact }: { name: string; contact: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createMember(name, contact);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
    },
  });
}

export function useUpdateMember() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, name, contact }: { id: bigint; name: string; contact: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateMember(id, name, contact);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      queryClient.invalidateQueries({ queryKey: ['member', variables.id.toString()] });
    },
  });
}
