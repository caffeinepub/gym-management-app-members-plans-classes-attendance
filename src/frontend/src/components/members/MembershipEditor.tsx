import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import type { Member } from '../../backend';

interface MembershipEditorProps {
  member: Member;
}

export default function MembershipEditor({ member }: MembershipEditorProps) {
  return (
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Membership plans feature is coming soon. Backend implementation is required to enable this functionality.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Current Membership</CardTitle>
          <CardDescription>View and manage membership plan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Plan</p>
              <p className="text-lg">{member.planId ? `Plan ID: ${member.planId.toString()}` : 'No plan assigned'}</p>
            </div>
            {member.membershipStart && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Start Date</p>
                <p className="text-lg">{new Date(Number(member.membershipStart) / 1000000).toLocaleDateString()}</p>
              </div>
            )}
            {member.membershipEnd && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">End Date</p>
                <p className="text-lg">{new Date(Number(member.membershipEnd) / 1000000).toLocaleDateString()}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
