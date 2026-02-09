import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetAllMembers } from '../hooks/useMembers';
import { useIsCallerAdmin } from '../hooks/useCurrentUser';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, UserPlus, Loader2 } from 'lucide-react';
import { MemberStatus } from '../backend';
import MemberFormDialog from '../components/members/MemberFormDialog';

export default function MembersPage() {
  const navigate = useNavigate();
  const { data: members, isLoading, error } = useGetAllMembers();
  const { data: isAdmin } = useIsCallerAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const filteredMembers = members?.filter((member) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Failed to load members</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Members</h1>
          <p className="text-muted-foreground">Manage your gym members</p>
        </div>
        {isAdmin && (
          <Button onClick={() => setShowCreateDialog(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Member
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Members</CardTitle>
          <CardDescription>Search and view member details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search members by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredMembers && filteredMembers.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Member Since</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMembers.map((member) => (
                    <TableRow key={member.id.toString()} className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="font-medium">{member.name}</TableCell>
                      <TableCell>{member.contact}</TableCell>
                      <TableCell>
                        <Badge variant={member.status === MemberStatus.active ? 'default' : 'secondary'}>
                          {member.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(Number(member.createdAt) / 1000000).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate({ to: '/members/$memberId', params: { memberId: member.id.toString() } })}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {searchQuery ? 'No members found matching your search' : 'No members yet'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {showCreateDialog && <MemberFormDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />}
    </div>
  );
}
