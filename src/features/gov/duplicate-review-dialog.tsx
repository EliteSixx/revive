"use client";

import { useState } from "react";
import { Dialog as DialogPrimitive } from "radix-ui";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Merge,
  UserCheck,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import {
  dismissDuplicateRecord,
  flagDuplicateForReview,
  mergeDuplicateRecord,
  type DuplicateCandidateItem,
  type TraineeRecordDetail,
} from "./duplicates-store";
import { formatDate } from "@/lib/format";

interface DuplicateReviewDialogProps {
  candidate: DuplicateCandidateItem | null;
  officerName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onActionComplete?: () => void;
}

type ActiveActionView = "NONE" | "MERGE" | "DISMISS" | "FLAG";

export function DuplicateReviewDialog({
  candidate,
  officerName,
  open,
  onOpenChange,
  onActionComplete,
}: DuplicateReviewDialogProps) {
  const { showToast } = useToast();
  const [activeAction, setActiveAction] = useState<ActiveActionView>("NONE");
  const [winningRecordId, setWinningRecordId] = useState<string>("");
  const [confirmMergeCheckbox, setConfirmMergeCheckbox] = useState(false);
  const [officerNotes, setOfficerNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!candidate) return null;

  const { recordA, recordB, differingFields, matchReason, status, auditTrail } =
    candidate;

  const comparisonFields: {
    key: keyof TraineeRecordDetail;
    label: string;
  }[] = [
    { key: "fullName", label: "Full Name" },
    { key: "phone", label: "Mobile Phone" },
    { key: "dob", label: "Date of Birth" },
    { key: "gender", label: "Gender" },
    { key: "district", label: "District" },
    { key: "provider", label: "Training Provider" },
    { key: "course", label: "Course / Qualification" },
    { key: "cohort", label: "Certification Cohort" },
    { key: "enrolmentId", label: "Enrolment ID" },
    { key: "outcomeStatus", label: "Outcome Status" },
    { key: "verificationLevel", label: "Verification Level" },
  ];

  function resetActionState() {
    setActiveAction("NONE");
    setWinningRecordId(recordA.id);
    setConfirmMergeCheckbox(false);
    setOfficerNotes("");
    setIsSubmitting(false);
  }

  function handleOpenChange(isOpen: boolean) {
    if (!isOpen) resetActionState();
    onOpenChange(isOpen);
  }

  async function handleExecuteMerge() {
    if (!confirmMergeCheckbox) return;
    setIsSubmitting(true);
    try {
      await mergeDuplicateRecord(
        candidate!.id,
        winningRecordId || recordA.id,
        officerName,
        officerNotes.trim() ||
          `Merged records. Canonical master profile: ${winningRecordId || recordA.id}.`,
      );
      showToast(
        "success",
        `Records merged into canonical master profile ${winningRecordId || recordA.id}.`,
      );
      handleOpenChange(false);
      onActionComplete?.();
    } catch {
      showToast(
        "error",
        "An unexpected error occurred while processing the merge request.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleExecuteDismiss() {
    setIsSubmitting(true);
    try {
      await dismissDuplicateRecord(
        candidate!.id,
        officerName,
        officerNotes.trim() ||
          "Confirmed as two separate individuals after manual review.",
      );
      showToast(
        "success",
        "Duplicate flag dismissed. Marked as distinct trainees.",
      );
      handleOpenChange(false);
      onActionComplete?.();
    } catch {
      showToast(
        "error",
        "An unexpected error occurred while dismissing the duplicate flag.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleExecuteFlag() {
    setIsSubmitting(true);
    try {
      await flagDuplicateForReview(
        candidate!.id,
        officerName,
        officerNotes.trim() ||
          "Flagged for further physical verification with district coordinator.",
      );
      showToast(
        "success",
        "Flagged for further review. Case marked for physical verification.",
      );
      handleOpenChange(false);
      onActionComplete?.();
    } catch {
      showToast(
        "error",
        "An unexpected error occurred while flagging for review.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-40 bg-fg/40 backdrop-blur-xs transition-opacity duration-200" />
        <DialogPrimitive.Content className="fixed top-1/2 left-1/2 z-50 max-h-[90vh] w-[calc(100%-2rem)] max-w-4xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-md border border-border bg-surface p-6 shadow-overlay">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
            <div>
              <div className="flex items-center gap-2">
                <DialogPrimitive.Title className="text-h2 font-semibold text-fg">
                  Review duplicate candidate
                </DialogPrimitive.Title>
                {status === "MERGED" && (
                  <span className="rounded-sm bg-primary/10 px-2 py-0.5 text-label font-medium text-primary">
                    Merged
                  </span>
                )}
                {status === "DISMISSED" && (
                  <span className="rounded-sm bg-surface-muted px-2 py-0.5 text-label font-medium text-fg-muted">
                    Not a duplicate
                  </span>
                )}
                {status === "NEEDS_REVIEW" && (
                  <span className="rounded-sm bg-warning-subtle px-2 py-0.5 text-label font-medium text-warning">
                    Under review
                  </span>
                )}
              </div>
              <DialogPrimitive.Description className="mt-1 text-small text-fg-muted">
                Candidate pair detected on {formatDate(candidate.detectedAt)}.
                Inspect differing attributes side by side before taking action.
              </DialogPrimitive.Description>
            </div>
            <DialogPrimitive.Close
              className="rounded-sm p-1.5 text-fg-muted hover:bg-surface-muted"
              aria-label="Close"
            >
              <X className="size-5" aria-hidden="true" />
            </DialogPrimitive.Close>
          </div>

          {/* Reason Banner */}
          <div className="my-4 flex items-start gap-3 rounded-md border border-warning/30 bg-warning/5 p-3.5 text-small text-fg">
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden="true" />
            <div>
              <span className="font-semibold text-fg">Why flagged: </span>
              <span className="text-fg-muted">{matchReason}</span>
            </div>
          </div>

          {/* Side-by-side comparison table */}
          <div className="mb-6 overflow-hidden rounded-md border border-border">
            <table className="w-full border-collapse text-small">
              <thead>
                <tr className="border-b border-border bg-surface-muted/60 text-left font-medium text-fg">
                  <th className="w-1/4 p-3 font-semibold">Attribute</th>
                  <th className="w-[37.5%] border-l border-border p-3 font-semibold">
                    <span className="text-label text-fg-muted">Record A: </span>
                    <span className="font-mono text-fg">{recordA.id}</span>
                  </th>
                  <th className="w-[37.5%] border-l border-border p-3 font-semibold">
                    <span className="text-label text-fg-muted">Record B: </span>
                    <span className="font-mono text-fg">{recordB.id}</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {comparisonFields.map(({ key, label }) => {
                  const valA = String(recordA[key] ?? "—");
                  const valB = String(recordB[key] ?? "—");
                  const isDiffering =
                    differingFields.includes(key) || valA !== valB;

                  return (
                    <tr
                      key={key}
                      className={
                        isDiffering
                          ? "bg-warning/10 font-medium text-fg"
                          : "text-fg-muted hover:bg-surface-muted/30"
                      }
                    >
                      <td className="p-3">
                        <div className="flex items-center gap-1.5">
                          <span>{label}</span>
                          {isDiffering && (
                            <span className="rounded-xs bg-warning/20 px-1.5 py-0.5 text-2xs font-semibold text-warning uppercase">
                              Differs
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="border-l border-border p-3 tabular-nums">
                        {valA}
                      </td>
                      <td className="border-l border-border p-3 tabular-nums">
                        {valB}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Action Panels */}
          {activeAction === "NONE" && (
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
              <span className="text-small text-fg-muted">
                Choose an action to resolve this duplicate pair:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setActiveAction("FLAG");
                    setOfficerNotes("");
                  }}
                >
                  <Clock className="mr-1.5 size-3.5" aria-hidden="true" />
                  Flag for further review
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setActiveAction("DISMISS");
                    setOfficerNotes("");
                  }}
                >
                  <UserCheck className="mr-1.5 size-3.5" aria-hidden="true" />
                  Not a duplicate
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    setActiveAction("MERGE");
                    setWinningRecordId(recordA.id);
                    setConfirmMergeCheckbox(false);
                    setOfficerNotes("");
                  }}
                >
                  <Merge className="mr-1.5 size-3.5" aria-hidden="true" />
                  Merge records
                </Button>
              </div>
            </div>
          )}

          {/* Merge Workflow */}
          {activeAction === "MERGE" && (
            <div className="rounded-md border border-primary/30 bg-primary/5 p-4 text-small">
              <div className="flex items-center gap-2 text-h3 font-semibold text-fg">
                <Merge className="size-4 text-primary" aria-hidden="true" />
                Merge candidate records
              </div>
              <p className="mt-1 text-fg-muted">
                Select which record&apos;s details serve as the primary canonical profile.
                The duplicate ID will be preserved as a verified alias with outcome records retained.
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label
                  className={`flex cursor-pointer flex-col gap-1 rounded-md border p-3 transition-colors ${
                    winningRecordId === recordA.id
                      ? "border-primary bg-surface shadow-xs"
                      : "border-border bg-surface/50 hover:bg-surface"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="winningRecord"
                      value={recordA.id}
                      checked={winningRecordId === recordA.id}
                      onChange={() => setWinningRecordId(recordA.id)}
                      className="text-primary focus:ring-primary"
                    />
                    <span className="font-semibold text-fg">
                      Retain Record A as Master
                    </span>
                  </div>
                  <span className="font-mono text-label text-fg-muted">
                    {recordA.id} ({recordA.fullName})
                  </span>
                  <span className="text-2xs text-fg-subtle">
                    {recordA.course} • {recordA.provider}
                  </span>
                </label>

                <label
                  className={`flex cursor-pointer flex-col gap-1 rounded-md border p-3 transition-colors ${
                    winningRecordId === recordB.id
                      ? "border-primary bg-surface shadow-xs"
                      : "border-border bg-surface/50 hover:bg-surface"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="winningRecord"
                      value={recordB.id}
                      checked={winningRecordId === recordB.id}
                      onChange={() => setWinningRecordId(recordB.id)}
                      className="text-primary focus:ring-primary"
                    />
                    <span className="font-semibold text-fg">
                      Retain Record B as Master
                    </span>
                  </div>
                  <span className="font-mono text-label text-fg-muted">
                    {recordB.id} ({recordB.fullName})
                  </span>
                  <span className="text-2xs text-fg-subtle">
                    {recordB.course} • {recordB.provider}
                  </span>
                </label>
              </div>

              <div className="mt-3">
                <label
                  htmlFor="merge-notes"
                  className="block text-label font-medium text-fg"
                >
                  Consolidation rationale / Officer notes
                </label>
                <textarea
                  id="merge-notes"
                  rows={2}
                  placeholder="e.g. Identity corroborated through phone and Aadhaar-backed assessment data."
                  value={officerNotes}
                  onChange={(e) => setOfficerNotes(e.target.value)}
                  className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-small text-fg focus:border-primary focus:outline-none"
                />
              </div>

              <div className="mt-3 flex items-start gap-2">
                <input
                  id="confirm-merge-check"
                  type="checkbox"
                  checked={confirmMergeCheckbox}
                  onChange={(e) => setConfirmMergeCheckbox(e.target.checked)}
                  className="mt-0.5 size-4 rounded-sm border-border text-primary focus:ring-primary"
                />
                <label
                  htmlFor="confirm-merge-check"
                  className="text-small text-fg"
                >
                  I confirm that these records belong to the same trainee and
                  authorise merging under DPDP data consolidation guidelines.
                </label>
              </div>

              <div className="mt-4 flex items-center justify-end gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={resetActionState}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleExecuteMerge}
                  disabled={!confirmMergeCheckbox || isSubmitting}
                >
                  {isSubmitting ? "Merging..." : "Confirm & merge records"}
                </Button>
              </div>
            </div>
          )}

          {/* Dismiss Workflow */}
          {activeAction === "DISMISS" && (
            <div className="rounded-md border border-border bg-surface-muted/40 p-4 text-small">
              <div className="flex items-center gap-2 text-h3 font-semibold text-fg">
                <UserCheck className="size-4 text-fg-muted" aria-hidden="true" />
                Confirm as not a duplicate
              </div>
              <p className="mt-1 text-fg-muted">
                Dismisses the duplicate flag and confirms both records are separate and independent individuals.
                Both records will remain active in all cohort reports.
              </p>

              <div className="mt-3">
                <label
                  htmlFor="dismiss-notes"
                  className="block text-label font-medium text-fg"
                >
                  Review note (Required)
                </label>
                <input
                  id="dismiss-notes"
                  type="text"
                  placeholder="e.g. Verified two distinct individuals with separate parentage and addresses."
                  value={officerNotes}
                  onChange={(e) => setOfficerNotes(e.target.value)}
                  className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-small text-fg focus:border-primary focus:outline-none"
                />
              </div>

              <div className="mt-4 flex items-center justify-end gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={resetActionState}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleExecuteDismiss}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Confirm not a duplicate"}
                </Button>
              </div>
            </div>
          )}

          {/* Flag for Further Review Workflow */}
          {activeAction === "FLAG" && (
            <div className="rounded-md border border-warning/30 bg-warning/5 p-4 text-small">
              <div className="flex items-center gap-2 text-h3 font-semibold text-fg">
                <Clock className="size-4 text-warning" aria-hidden="true" />
                Flag for physical verification
              </div>
              <p className="mt-1 text-fg-muted">
                Leaves this pair unmerged while logging an inquiry request for training centre coordinators or field verifiers.
              </p>

              <div className="mt-3">
                <label
                  htmlFor="flag-notes"
                  className="block text-label font-medium text-fg"
                >
                  Inquiry instructions / Officer note
                </label>
                <textarea
                  id="flag-notes"
                  rows={2}
                  placeholder="e.g. Center coordinator to verify physical admission registry and original batch attendance sheet."
                  value={officerNotes}
                  onChange={(e) => setOfficerNotes(e.target.value)}
                  className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-small text-fg focus:border-primary focus:outline-none"
                />
              </div>

              <div className="mt-4 flex items-center justify-end gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={resetActionState}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleExecuteFlag}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save review note & keep open"}
                </Button>
              </div>
            </div>
          )}

          {/* Audit Trail Section */}
          {auditTrail.length > 0 && (
            <div className="mt-6 border-t border-border pt-4">
              <h4 className="text-label font-semibold text-fg">
                Audit Trail ({auditTrail.length} action{auditTrail.length > 1 ? "s" : ""})
              </h4>
              <div className="mt-2 space-y-2">
                {auditTrail.map((entry, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col gap-1 rounded-md border border-border bg-surface-muted/30 p-2.5 text-2xs text-fg-muted"
                  >
                    <div className="flex items-center justify-between font-medium text-fg">
                      <span className="flex items-center gap-1.5">
                        {entry.action === "MERGED" && (
                          <Merge className="size-3.5 text-primary" aria-hidden="true" />
                        )}
                        {entry.action === "DISMISSED" && (
                          <CheckCircle2 className="size-3.5 text-success" aria-hidden="true" />
                        )}
                        {entry.action === "FLAGGED_FOR_REVIEW" && (
                          <Clock className="size-3.5 text-warning" aria-hidden="true" />
                        )}
                        <span>{entry.action.replace(/_/g, " ")}</span>
                        {entry.survivingRecordId && (
                          <span className="font-mono text-fg-subtle">
                            (Master: {entry.survivingRecordId})
                          </span>
                        )}
                      </span>
                      <span>{formatDate(entry.performedAt.slice(0, 10))}</span>
                    </div>
                    <p className="text-small text-fg">{entry.notes}</p>
                    <span className="text-fg-subtle">By: {entry.performedBy}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
