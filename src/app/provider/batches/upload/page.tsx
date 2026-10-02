import { CircleAlert, Download } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/ui/table";
import { formatNumber } from "@/lib/format";

export const metadata = { title: "Upload roster" };

// Sample result of validating an uploaded CSV (prd.md FR-P-02). Fake phone numbers only.
const VALIDATION_PREVIEW = [
  {
    row: 2,
    name: "Pooja Jadhav",
    phone: "90000 •••21",
    dateOfBirth: "14 Feb 2004",
    error: null,
  },
  {
    row: 3,
    name: "Rahul More",
    phone: "90000 •••56",
    dateOfBirth: "2 Sep 2002",
    error: null,
  },
  {
    row: 4,
    name: "Kavita Shinde",
    phone: "",
    dateOfBirth: "30 Jan 2005",
    error: "Mobile number is missing",
  },
  {
    row: 5,
    name: "Nikhil Pawar",
    phone: "90000 •••09",
    dateOfBirth: "",
    error: "Date of birth is missing",
  },
  {
    row: 6,
    name: "Sayali Kale",
    phone: "90000 •••73",
    dateOfBirth: "11 Nov 2003",
    error: null,
  },
] as const;

const REQUIRED_COLUMNS = [
  "full_name",
  "date_of_birth (YYYY-MM-DD)",
  "gender",
  "mobile_number (10 digits)",
  "district",
  "course_code",
  "batch_start_date",
  "batch_end_date",
] as const;

export default function UploadRosterPage() {
  const errorCount = VALIDATION_PREVIEW.filter(
    (row) => row.error !== null,
  ).length;

  return (
    <>
      <PageHeader
        title="Upload roster"
        description="Add trainees for a new batch from a CSV file. Rows are checked before anything is saved."
        breadcrumbs={[{ label: "Batches", href: "/provider/batches" }]}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="1. Get the template" />
          <CardBody>
            <p>The file must have these columns, in any order:</p>
            <ul className="mt-3 list-disc pl-6 text-fg-muted">
              {REQUIRED_COLUMNS.map((column) => (
                <li key={column}>
                  <code className="text-fg">{column}</code>
                </li>
              ))}
            </ul>
            <Button variant="secondary" className="mt-5">
              <Download aria-hidden="true" />
              Download CSV template
            </Button>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="2. Choose your file" />
          <CardBody>
            <form className="flex flex-col gap-5" noValidate>
              <Field
                id="roster-file"
                label="Roster file"
                helperText="CSV, up to 2 MB and 500 rows."
              >
                <Input
                  id="roster-file"
                  type="file"
                  accept=".csv,text/csv"
                  className="h-auto py-2"
                  aria-describedby="roster-file-helper"
                />
              </Field>
              <Button className="self-start">Check file</Button>
            </form>
          </CardBody>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader
          title="3. Review and import"
          description={`${VALIDATION_PREVIEW.length} rows checked. ${errorCount} need fixing. Only valid rows will be imported.`}
          action={
            <Button>
              Import {VALIDATION_PREVIEW.length - errorCount} valid rows
            </Button>
          }
        />
        <DataTable
          caption="Roster validation results"
          rows={VALIDATION_PREVIEW}
          getRowKey={(row) => String(row.row)}
          columns={[
            {
              key: "row",
              header: "Row",
              align: "right",
              cell: (row) => formatNumber(row.row),
            },
            { key: "name", header: "Name", cell: (row) => row.name },
            {
              key: "phone",
              header: "Mobile",
              cell: (row) => row.phone || "Missing",
            },
            {
              key: "dob",
              header: "Date of birth",
              cell: (row) => row.dateOfBirth || "Missing",
            },
            {
              key: "check",
              header: "Check",
              cell: (row) =>
                row.error ? (
                  <Badge tone="danger">
                    <CircleAlert aria-hidden="true" />
                    {row.error}
                  </Badge>
                ) : (
                  <Badge tone="success">Valid</Badge>
                ),
            },
          ]}
        />
      </Card>
    </>
  );
}
