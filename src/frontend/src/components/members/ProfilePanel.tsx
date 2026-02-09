import { useState } from 'react';
import { useIsCallerAdmin } from '../../hooks/useCurrentUser';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit } from 'lucide-react';
import type { Member } from '../../backend';
import { MemberStatus } from '../../backend';
import MemberFormDialog from './MemberFormDialog';

interface ProfilePanelProps {
  member: Member;
}

export default function ProfilePanel({ member }: ProfilePanelProps) {
  const { data: isAdmin } = useIsCallerAdmin();
  const [showEditDialog, setShowEditDialog] = useState(false);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Member details and status</CardDescription>
            </div>
            {isAdmin && (
              <Button variant="outline" size="sm" onClick={() => setShowEditDialog(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Name</p>
              <p className="text-lg">{member.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Contact</p>
              <p className="text-lg">{member.contact}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <Badge variant={member.status === MemberStatus.active ? 'default' : 'secondary'} className="mt-1">
                {member.status}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Member Since</p>
              <p className="text-lg">{new Date(Number(member.createdAt) / 1000000).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
              <p className="text-lg">{new Date(Number(member.updatedAt) / 1000000).toLocaleDateString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {showEditDialog && <MemberFormDialog open={showEditDialog} onOpenChange={setShowEditDialog} member={member} />}
    </>
  );
}
