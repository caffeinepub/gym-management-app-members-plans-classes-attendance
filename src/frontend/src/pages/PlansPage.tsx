import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

export default function PlansPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">Membership Plans</h1>
        <p className="text-muted-foreground">Manage your gym's membership plans and pricing</p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Membership plans feature is coming soon. Backend implementation is required to enable this functionality.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Available Plans</CardTitle>
          <CardDescription>Create and manage membership plans for your gym</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            No plans available yet. This feature will allow you to create monthly, quarterly, and annual membership
            plans with custom pricing.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
