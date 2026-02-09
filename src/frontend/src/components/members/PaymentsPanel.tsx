import { useState } from 'react';
import { useGetPaymentsForMember, useAddPayment } from '../../hooks/usePayments';
import { useIsCallerAdmin } from '../../hooks/useCurrentUser';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Loader2 } from 'lucide-react';

interface PaymentsPanelProps {
  memberId: bigint;
}

export default function PaymentsPanel({ memberId }: PaymentsPanelProps) {
  const { data: payments, isLoading } = useGetPaymentsForMember(memberId);
  const { data: isAdmin } = useIsCallerAdmin();
  const addPayment = useAddPayment();
  const [showDialog, setShowDialog] = useState(false);
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addPayment.mutateAsync({
        memberId,
        amount: parseFloat(amount),
        method: method.trim(),
        notes: notes.trim(),
      });
      setShowDialog(false);
      setAmount('');
      setMethod('');
      setNotes('');
    } catch (error) {
      console.error('Failed to add payment:', error);
    }
  };

  const sortedPayments = payments ? [...payments].sort((a, b) => Number(b.date - a.date)) : [];

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>View and record payments</CardDescription>
            </div>
            {isAdmin && (
              <Button onClick={() => setShowDialog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Record Payment
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : sortedPayments.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedPayments.map((payment) => (
                    <TableRow key={payment.id.toString()}>
                      <TableCell>{new Date(Number(payment.date) / 1000000).toLocaleDateString()}</TableCell>
                      <TableCell className="font-medium">${payment.amount.toFixed(2)}</TableCell>
                      <TableCell>{payment.method}</TableCell>
                      <TableCell className="text-muted-foreground">{payment.notes || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">No payments recorded yet</p>
          )}
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
            <DialogDescription>Add a new payment record for this member</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="method">Payment Method</Label>
              <Input
                id="method"
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                placeholder="Cash, Card, Transfer, etc."
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Additional notes..."
                rows={3}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => setShowDialog(false)} disabled={addPayment.isPending}>
                Cancel
              </Button>
              <Button type="submit" disabled={addPayment.isPending || !amount || !method.trim()}>
                {addPayment.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Recording...
                  </>
                ) : (
                  'Record Payment'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
