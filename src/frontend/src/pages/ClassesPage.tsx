import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

export default function ClassesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">Classes</h1>
        <p className="text-muted-foreground">Schedule and manage gym classes</p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Class scheduling feature is coming soon. Backend implementation is required to enable this functionality.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Class Schedule</CardTitle>
          <CardDescription>View and manage upcoming classes</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            No classes scheduled yet. This feature will allow you to create classes, manage capacity, and handle member
            registrations.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
