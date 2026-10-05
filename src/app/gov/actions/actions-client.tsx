"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { ActionStatusBadge } from "@/components/domain/status-badge";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CollapsibleCard } from "@/features/gov/collapsible-card";
import { useGovScope } from "@/features/gov/gov-session";
import { getScopedActions } from "@/features/gov/mock-api";
import { REMEDIAL_ACTION_TARGET_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import type { RemedialAction } from "@/types/domain";

export default function GovActionsClient() {
  const scope = useGovScope();
  const initialActions = getScopedActions(scope.districtCode);
  const [actions, setActions] = useState<RemedialAction[]>([...initialActions]);
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [targetType, setTargetType] =
    useState<RemedialAction["targetType"]>("PROVIDER");
  const [targetName, setTargetName] = useState("");
  const [assigneeName, setAssigneeName] = useState(scope.displayName);
  const [dueDate, setDueDate] = useState("2026-11-30");
  const [notes, setNotes] = useState("");

  const filteredActions = actions.filter((action) => {
    if (activeTab === "ALL") return true;
    return action.status === activeTab;
  });

  const openCount = actions.filter((a) => a.status === "OPEN").length;
  const inProgressCount = actions.filter(
    (a) => a.status === "IN_PROGRESS",
  ).length;
  const doneCount = actions.filter((a) => a.status === "DONE").length;

  function handleCreateAction(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !targetName.trim()) return;

    const newAction: RemedialAction = {
      id: `act-${Date.now().toString().slice(-4)}`,
      targetType,
      targetId: `custom-${Date.now()}`,
      targetName: targetName.trim(),
      title: title.trim(),
      assigneeName: assigneeName.trim() || scope.displayName,
      status: "OPEN",
      dueDate,
      notes: notes.trim() || "Created from government portal.",
      createdAt: new Date().toISOString().slice(0, 10),
    };

    setActions([newAction, ...actions]);
    setIsDialogOpen(false);
    setTitle("");
    setTargetName("");
    setNotes("");
  }

  return (
    <>
      <PageHeader
        title="Remedial actions"
        description={`${scope.scopeLabel}. Actions created from outcome benchmarks, tracking ownership and delivery timelines.`}
        actions={
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus aria-hidden="true" />
            New action
          </Button>
        }
      />

      <div className="mb-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="ALL">All ({actions.length})</TabsTrigger>
            <TabsTrigger value="OPEN">Open ({openCount})</TabsTrigger>
            <TabsTrigger value="IN_PROGRESS">
              In progress ({inProgressCount})
            </TabsTrigger>
            <TabsTrigger value="DONE">Done ({doneCount})</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Main active table visible by default */}
      <Card className="mb-6">
        <DataTable
          caption="Remedial actions"
          rows={filteredActions}
          getRowKey={(action) => action.id}
          totalCount={filteredActions.length}
          columns={[
            {
              key: "title",
              wrap: true,
              header: "Action",
              cell: (action) => (
                <div>
                  <span className="font-medium text-fg">{action.title}</span>
                  {action.notes && (
                    <p className="mt-0.5 text-small text-fg-muted">
                      {action.notes}
                    </p>
                  )}
                </div>
              ),
            },
            {
              key: "target",
              header: "For",
              cell: (action) =>
                `${REMEDIAL_ACTION_TARGET_LABELS[action.targetType]}: ${action.targetName}`,
            },
            {
              key: "assignee",
              header: "Owner",
              cell: (action) => action.assigneeName,
            },
            {
              key: "due",
              header: "Due",
              cell: (action) => formatDate(action.dueDate),
            },
            {
              key: "status",
              header: "Status",
              cell: (action) => <ActionStatusBadge status={action.status} />,
            },
          ]}
        />
      </Card>

      {/* Task 2: Collapsible Governance & Framework Sections */}
      <div className="space-y-4">
        <CollapsibleCard
          title="Remedial action framework and lifecycle"
          description="Guidelines for status transitions and resolution validation."
          defaultOpen={false}
        >
          <div className="space-y-2 text-body text-fg-muted">
            <p>
              Remedial actions close the loop between outcome tracking and
              operational improvement:
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <strong className="text-fg">Open:</strong> Newly logged action
                awaiting assignment or evidence upload from the provider or
                district team.
              </li>
              <li>
                <strong className="text-fg">In progress:</strong> Active
                intervention underway, such as curriculum enhancement,
                telephonic tracer sweeps, or employer outreach.
              </li>
              <li>
                <strong className="text-fg">Done:</strong> Validated resolution
                completed and verified in the subsequent cohort outcome cycle.
              </li>
            </ul>
          </div>
        </CollapsibleCard>

        <CollapsibleCard
          title="Escalation SLA and enforcement triggers"
          description="Timelines and escalation protocol for stalled actions."
          defaultOpen={false}
        >
          <p className="text-body text-fg-muted">
            Actions overdue by more than 14 days without an update note trigger
            automatic escalation notifications to the State Directorate of
            Vocational Education and Training (DVET) desk.
          </p>
        </CollapsibleCard>
      </div>

      {/* New Action Modal Dialog */}
      <DialogPrimitive.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-40 bg-fg/40 backdrop-blur-xs transition-opacity duration-200" />
          <DialogPrimitive.Content className="fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-md border border-border bg-surface p-6 shadow-overlay">
            <div className="flex items-start justify-between gap-4">
              <DialogPrimitive.Title className="text-h2 font-semibold text-fg">
                Create remedial action
              </DialogPrimitive.Title>
              <DialogPrimitive.Close
                className="rounded-sm p-1 text-fg-muted hover:bg-surface-muted"
                aria-label="Close"
              >
                <X className="size-5" aria-hidden="true" />
              </DialogPrimitive.Close>
            </div>
            <DialogPrimitive.Description className="mt-1 text-small text-fg-muted">
              Log an intervention against a low-performing provider, district,
              course, or cohort.
            </DialogPrimitive.Description>

            <form
              onSubmit={handleCreateAction}
              className="mt-4 flex flex-col gap-4"
            >
              <div>
                <label
                  htmlFor="action-title"
                  className="block text-label font-medium text-fg"
                >
                  Action title *
                </label>
                <input
                  id="action-title"
                  type="text"
                  required
                  placeholder="e.g. Conduct employer verification drive"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-body text-fg focus:border-primary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="action-target-type"
                    className="block text-label font-medium text-fg"
                  >
                    Target type
                  </label>
                  <select
                    id="action-target-type"
                    value={targetType}
                    onChange={(e) =>
                      setTargetType(
                        e.target.value as RemedialAction["targetType"],
                      )
                    }
                    className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-body text-fg focus:border-primary focus:outline-none"
                  >
                    <option value="PROVIDER">Provider</option>
                    <option value="DISTRICT">District</option>
                    <option value="COURSE">Course</option>
                    <option value="COHORT">Cohort</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="action-target-name"
                    className="block text-label font-medium text-fg"
                  >
                    Target name *
                  </label>
                  <input
                    id="action-target-name"
                    type="text"
                    required
                    placeholder="e.g. Sahyadri Trades"
                    value={targetName}
                    onChange={(e) => setTargetName(e.target.value)}
                    className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-body text-fg focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="action-assignee"
                    className="block text-label font-medium text-fg"
                  >
                    Owner
                  </label>
                  <input
                    id="action-assignee"
                    type="text"
                    value={assigneeName}
                    onChange={(e) => setAssigneeName(e.target.value)}
                    className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-body text-fg focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor="action-due"
                    className="block text-label font-medium text-fg"
                  >
                    Due date
                  </label>
                  <input
                    id="action-due"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-body text-fg focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="action-notes"
                  className="block text-label font-medium text-fg"
                >
                  Notes
                </label>
                <textarea
                  id="action-notes"
                  rows={3}
                  placeholder="Details, rationale, or expected deliverables..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-body text-fg focus:border-primary focus:outline-none"
                />
              </div>

              <div className="mt-2 flex justify-end gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Create action</Button>
              </div>
            </form>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </>
  );
}
