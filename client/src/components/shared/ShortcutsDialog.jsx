import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useUIStore } from '@/store/uiStore';
import { KEYBOARD_SHORTCUTS } from '@/lib/constants';

export function ShortcutsDialog() {
  const { shortcutsOpen, setShortcutsOpen } = useUIStore();
  return (
    <Dialog open={shortcutsOpen} onOpenChange={setShortcutsOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Keyboard shortcuts</DialogTitle>
          <DialogDescription>Move faster without leaving the keyboard.</DialogDescription>
        </DialogHeader>
        <ul className="space-y-2.5">
          {KEYBOARD_SHORTCUTS.map((s) => (
            <li
              key={s.description}
              className="flex items-center justify-between gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2"
            >
              <span className="text-sm">{s.description}</span>
              <span className="flex items-center gap-1">
                {s.combo.map((k, i) => (
                  <kbd
                    key={i}
                    className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-2 py-0.5 text-[11px] font-medium tabular-nums"
                  >
                    {k}
                  </kbd>
                ))}
              </span>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
