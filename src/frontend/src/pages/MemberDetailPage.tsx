import { useParams } from '@tanstack/react-router';
import { useGetMember } from '../hooks/useMembers';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import ProfilePanel from '../components/members/ProfilePanel';
import MembershipEditor from '../components/members/MembershipEditor';
import PaymentsPanel from '../components/members/PaymentsPanel';
import AttendancePanel from '../components/members/AttendancePanel';

export default function MemberDetailPage() {
  const { memberId } = useParams({ from: '/members/$memberId' });
  const { data: member, isLoading, error } = useGetMember(BigInt(memberId));

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (error || !member) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Failed to load member details. Member may not exist or you don't have permission.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">{member.name}</h1>
        <p className="text-muted-foreground">Member ID: {member.id.toString()}</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="membership">Membership</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfilePanel member={member} />
        </TabsContent>

        <TabsContent value="membership">
          <MembershipEditor member={member} />
        </TabsContent>

        <TabsContent value="payments">
          <PaymentsPanel memberId={member.id} />
        </TabsContent>

        <TabsContent value="attendance">
          <AttendancePanel memberId={member.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
