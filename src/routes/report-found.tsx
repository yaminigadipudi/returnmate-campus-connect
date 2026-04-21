import { createFileRoute } from "@tanstack/react-router";
import { ReportForm } from "@/components/ReportForm";
import { AppLayout } from "@/components/AppLayout";

export const Route = createFileRoute("/report-found")({
  component: () => (
    <AppLayout>
      <ReportForm
        kind="found"
        title="Report a found item"
        subtitle="Help a fellow student — share details about what you found on campus."
      />
    </AppLayout>
  ),
});
