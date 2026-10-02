import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog, DialogClose } from "@/components/ui/dialog";
import { formatDate } from "@/lib/format";

interface ConsentCardProps {
  title: string;
  description: string;
  isRequired: boolean;
  isGranted: boolean;
  changedAt: string | null;
}

/** One consent purpose with its state and a give or withdraw control (design.md section 6). */
export function ConsentCard({
  title,
  description,
  isRequired,
  isGranted,
  changedAt,
}: ConsentCardProps) {
  return (
    <li className="rounded-md border border-border bg-surface p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="max-w-prose">
          <h2 className="text-h3">{title}</h2>
          <p className="mt-0.5 text-small text-fg-muted">
            {isRequired ? "Required to take part" : "Optional"}
          </p>
        </div>
        <Badge tone={isGranted ? "success" : "neutral"}>
          {isGranted ? "Agreed" : "Not agreed"}
        </Badge>
      </div>
      <p className="mt-3">{description}</p>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-small text-fg-muted">
          {changedAt
            ? `Last changed ${formatDate(changedAt)}`
            : "Never changed"}
        </p>
        {isGranted ? (
          <ConfirmDialog
            trigger={<Button variant="secondary">Withdraw</Button>}
            title={`Withdraw "${title}"?`}
            description={
              isRequired
                ? "This purpose is needed to take part in tracking. If you withdraw it, we will stop contacting you and stop using your answers from now on."
                : "We will stop this from now on. Anything already done before today is not undone."
            }
            footer={
              <>
                <DialogClose asChild>
                  <Button variant="secondary">Keep consent</Button>
                </DialogClose>
                <Button variant="danger">Withdraw consent</Button>
              </>
            }
          />
        ) : (
          <Button>Agree</Button>
        )}
      </div>
    </li>
  );
}
