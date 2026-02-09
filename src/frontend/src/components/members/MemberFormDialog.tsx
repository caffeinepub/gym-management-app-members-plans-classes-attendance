import { useState, useEffect } from 'react';
import { useCreateMember, useUpdateMember } from '../../hooks/useMembers';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import type { Member } from '../../backend';

interface MemberFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member?: Member;
}

export default function MemberFormDialog({ open, onOpenChange, member }: MemberFormDialogProps) {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const createMember = useCreateMember();
  const updateMember = useUpdateMember();

  useEffect(() => {
    if (member) {
      setName(member.name);
      setContact(member.contact);
    } else {
      setName('');
      setContact('');
    }
  }, [member, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (member) {
        await updateMember.mutateAsync({ id: member.id, name: name.trim(), contact: contact.trim() });
      } else {
        await createMember.mutateAsync({ name: name.trim(), contact: contact.trim() });
      }
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to save member:', error);
    }
  };

  const isPending = createMember.isPending || updateMember.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{member ? 'Edit Member' : 'Add New Member'}</DialogTitle>
          <DialogDescription>
            {member ? 'Update member information' : 'Create a new member profile'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter member name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact">Contact</Label>
            <Input
              id="contact"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="Email or phone number"
              required
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || !name.trim() || !contact.trim()}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : member ? (
                'Update'
              ) : (
                'Create'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
