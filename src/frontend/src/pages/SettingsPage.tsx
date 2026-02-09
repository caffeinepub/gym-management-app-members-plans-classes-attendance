import { useState } from 'react';
import { useIsCallerAdmin } from '../hooks/useCurrentUser';
import { useActor } from '../hooks/useActor';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Shield } from 'lucide-react';
import { UserRole } from '../backend';
import { Principal } from '@icp-sdk/core/principal';
import AccessDeniedScreen from '../components/auth/AccessDeniedScreen';

export default function SettingsPage() {
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const [principalInput, setPrincipalInput] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.user);
  const [memberIdInput, setMemberIdInput] = useState('');
  const [linkPrincipalInput, setLinkPrincipalInput] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const assignRole = useMutation({
    mutationFn: async ({ principal, role }: { principal: Principal; role: UserRole }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.assignCallerUserRole(principal, role);
    },
    onSuccess: () => {
      setSuccess('Role assigned successfully');
      setPrincipalInput('');
      setError('');
      queryClient.invalidateQueries({ queryKey: ['currentUserRole'] });
    },
    onError: (err: any) => {
      setError(err.message || 'Failed to assign role');
      setSuccess('');
    },
  });

  const linkPrincipal = useMutation({
    mutationFn: async ({ principal, memberId }: { principal: Principal; memberId: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.linkPrincipalToMember(principal, memberId);
    },
    onSuccess: () => {
      setSuccess('Principal linked to member successfully');
      setLinkPrincipalInput('');
      setMemberIdInput('');
      setError('');
    },
    onError: (err: any) => {
      setError(err.message || 'Failed to link principal');
      setSuccess('');
    },
  });

  const handleAssignRole = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const principal = Principal.fromText(principalInput.trim());
      assignRole.mutate({ principal, role: selectedRole });
    } catch (err) {
      setError('Invalid principal ID format');
    }
  };

  const handleLinkPrincipal = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const principal = Principal.fromText(linkPrincipalInput.trim());
      const memberId = BigInt(memberIdInput.trim());
      linkPrincipal.mutate({ principal, memberId });
    } catch (err) {
      setError('Invalid principal ID or member ID format');
    }
  };

  if (adminLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAdmin) {
    return <AccessDeniedScreen />;
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-4xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage system settings and user permissions</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <CardTitle>Assign User Role</CardTitle>
          </div>
          <CardDescription>Grant admin or user permissions to principals</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAssignRole} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="principal">Principal ID</Label>
              <Input
                id="principal"
                value={principalInput}
                onChange={(e) => setPrincipalInput(e.target.value)}
                placeholder="Enter principal ID"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as UserRole)}>
                <SelectTrigger id="role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={UserRole.admin}>Admin</SelectItem>
                  <SelectItem value={UserRole.user}>User</SelectItem>
                  <SelectItem value={UserRole.guest}>Guest</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={assignRole.isPending || !principalInput.trim()}>
              {assignRole.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Assigning...
                </>
              ) : (
                'Assign Role'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Link Principal to Member</CardTitle>
          <CardDescription>Associate a principal ID with a member record</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLinkPrincipal} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="linkPrincipal">Principal ID</Label>
              <Input
                id="linkPrincipal"
                value={linkPrincipalInput}
                onChange={(e) => setLinkPrincipalInput(e.target.value)}
                placeholder="Enter principal ID"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="memberId">Member ID</Label>
              <Input
                id="memberId"
                value={memberIdInput}
                onChange={(e) => setMemberIdInput(e.target.value)}
                placeholder="Enter member ID"
                type="number"
                required
              />
            </div>
            <Button
              type="submit"
              disabled={linkPrincipal.isPending || !linkPrincipalInput.trim() || !memberIdInput.trim()}
            >
              {linkPrincipal.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Linking...
                </>
              ) : (
                'Link Principal'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
