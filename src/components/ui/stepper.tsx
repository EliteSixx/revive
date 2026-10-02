interface StepProgressProps {
  current: number;
  total: number;
}

/** "Question 2 of 5" with a thin progress bar (design.md section 6). */
export function StepProgress({ current, total }: StepProgressProps) {
  return (
    <div>
      <p className="text-small text-fg-muted">
        Question {current} of {total}
      </p>
      <div
        className="mt-2 h-1 w-full rounded-sm bg-surface-muted"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={current}
        aria-label="Follow-up progress"
      >
        <div
          className="h-1 rounded-sm bg-primary"
          style={{ width: `${(current / total) * 100}%` }}
        />
      </div>
    </div>
  );
}
