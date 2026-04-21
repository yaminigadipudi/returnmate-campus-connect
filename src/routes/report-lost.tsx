import { createFileRoute } from "@tanstack/react-router";
import { ReportForm } from "@/components/ReportForm";
import { AppLayout } from "@/components/AppLayout";

export const Route = createFileRoute("/report-lost")({
  component: () => (
    <AppLayout>
      <ReportForm
        kind="lost"
        title="Report a lost item"
        subtitle="Describe what you lost — we'll match it against found reports automatically."
      />
    </AppLayout>
  ),
});
