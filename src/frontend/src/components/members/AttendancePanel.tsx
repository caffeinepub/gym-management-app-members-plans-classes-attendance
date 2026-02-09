import { useGetCheckInsForMember, useCheckIn } from '../../hooks/useAttendance';
import { useIsCallerAdmin } from '../../hooks/useCurrentUser';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle, Loader2 } from 'lucide-react';

interface AttendancePanelProps {
  memberId: bigint;
}

export default function AttendancePanel({ memberId }: AttendancePanelProps) {
  const { data: checkIns, isLoading } = useGetCheckInsForMember(memberId);
  const { data: isAdmin } = useIsCallerAdmin();
  const checkInMutation = useCheckIn();

  const handleCheckIn = async () => {
    try {
      await checkInMutation.mutateAsync(memberId);
    } catch (error) {
      console.error('Failed to check in:', error);
    }
  };

  const sortedCheckIns = checkIns ? [...checkIns].sort((a, b) => Number(b.timestamp - a.timestamp)) : [];

  // Calculate last 30 days attendance
  const thirtyDaysAgo = BigInt(Date.now()) * 1000000n - 30n * 24n * 60n * 60n * 1000000000n;
  const last30DaysCount = sortedCheckIns.filter((c) => c.timestamp > thirtyDaysAgo).length;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Attendance Summary</CardTitle>
            <CardDescription>Recent activity metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-muted-foreground">Last 30 Days</p>
                <p className="text-3xl font-bold">{last30DaysCount}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Check-ins</p>
                <p className="text-3xl font-bold">{sortedCheckIns.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {isAdmin && (
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Record attendance</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleCheckIn} disabled={checkInMutation.isPending} className="w-full" size="lg">
                {checkInMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Checking In...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Check In Now
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Check-in History</CardTitle>
          <CardDescription>All attendance records</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : sortedCheckIns.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedCheckIns.map((checkIn) => {
                    const date = new Date(Number(checkIn.timestamp) / 1000000);
                    return (
                      <TableRow key={checkIn.id.toString()}>
                        <TableCell>{date.toLocaleDateString()}</TableCell>
                        <TableCell className="text-muted-foreground">{date.toLocaleTimeString()}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">No check-ins recorded yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
