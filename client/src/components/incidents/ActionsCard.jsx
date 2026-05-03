import { Link } from 'react-router-dom';
import { FileText, Share2, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function ActionsCard({ incident, onClose }) {
  const isResolved = incident.status === 'resolved';

  const copyShareLink = async () => {
    const url = `${window.location.origin}/status/opswatch-demo`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Public link copied', { description: url });
    } catch {
      toast.error('Could not copy link');
    }
  };

  return (
    <Card className="p-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
        Actions
      </h3>
      <div className="mt-3 space-y-2">
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start"
          onClick={copyShareLink}
        >
          <Share2 className="h-3.5 w-3.5" />
          Share public link
        </Button>
        {!isResolved && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-red-400 hover:bg-red-500/10 hover:text-red-300"
            onClick={onClose}
          >
            <XCircle className="h-3.5 w-3.5" />
            Close without resolution
          </Button>
        )}
      </div>
    </Card>
  );
}
