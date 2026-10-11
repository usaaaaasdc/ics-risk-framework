"use client";

import { useState, useMemo } from "react";
import { useHydrated } from "@/hooks/use-hydrated";
import { DeviceInputForm } from "@/components/device-input-form";
import { RiskDisplay } from "@/components/risk-display";
import { AttackSurfaceMap } from "@/components/attack-surface-map";
import { AdvancedAnalysisTabs } from "@/components/advanced-analysis-tabs";
import { useLanguage } from "@/lib/i18n/language-context";
import { CommandShell, ModeSwitch } from "@/components/assessment/command-shell";
import { AssessmentOverview } from "@/components/assessment/assessment-overview";
import { assessmentCopy } from "@/lib/assessment-ui-copy";
import { type SystemConfig, type RiskAssessment, assessSystem } from "@/lib/risk-engine";
import { generatePDF } from "@/lib/pdf-generator";
import { ProjectManager, type Project } from "@/lib/project-manager";
import vulnerabilitiesData from "@/lib/data/vulnerabilities.json";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AssessmentPage() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");
  const hydrated = useHydrated();
  const project = useMemo(
    () => (hydrated && projectId ? ProjectManager.getProject(projectId) : null),
    [hydrated, projectId]
  );

  // Mount once browser data is ready so hydration cannot reset the one-time handoff.
  if (!hydrated) return null;

  return <AssessmentForm key={projectId ?? "new"} initialProject={project} />;
}

function AssessmentForm({ initialProject }: { initialProject: Project | null }) {
  const { t, language } = useLanguage();
  const copy = assessmentCopy(language);

  const [assessment, setAssessment] = useState<RiskAssessment | null>(() => {
    const result = initialProject?.assessment as RiskAssessment | undefined;
    if (!result) return null;
    // JSON project storage cannot preserve Map methods. Restore saved entries
    // without inventing confidence values that were absent from older projects.
    const saved = result.vulnerabilityConfidence;
    return {
      ...result,
      vulnerabilityConfidence:
        saved instanceof Map
          ? saved
          : new Map(
              Object.entries(saved ?? {}).filter(
                (entry): entry is [string, number] => typeof entry[1] === "number"
              )
            ),
    };
  });
  const [currentConfig, setCurrentConfig] = useState<SystemConfig | null>(() => {
    if (initialProject?.config) return initialProject.config;
    try {
      const quickConfig = localStorage.getItem("quick-config");
      return quickConfig ? JSON.parse(quickConfig) : null;
    } catch {
      // DeviceInputForm reports malformed handoffs using its existing error handling.
      return null;
    }
  });
  const [currentProject, setCurrentProject] = useState<Project | null>(initialProject);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [exportLanguage, setExportLanguage] = useState<"ar" | "en" | "de" | "tr">("ar");

  const handleSubmit = (config: SystemConfig) => {
    const result = assessSystem(config, vulnerabilitiesData.vulnerabilities);
    setAssessment(result);
    setCurrentConfig(config);

    if (currentProject) {
      ProjectManager.updateProject(currentProject.id, {
        config,
        assessment: result,
      });
      setCurrentProject(ProjectManager.getProject(currentProject.id));
    } else {
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "lastAssessment",
          JSON.stringify({
            config,
            result,
            timestamp: new Date().toISOString(),
          })
        );
      }
    }
  };

  const handleSaveAsProject = () => {
    if (!currentConfig || !assessment) return;

    const projectName = prompt(
      t("projectName") + ":",
      "Security Assessment " + new Date().toLocaleDateString()
    );
    if (!projectName) return;

    const project = ProjectManager.saveProject({
      name: projectName,
      description: `${currentConfig.deviceType} - ${currentConfig.model}`,
      industry: "Manufacturing",
      config: currentConfig,
      assessment: assessment,
    });

    setCurrentProject(project);
    alert(t("importSuccess") || "Project saved successfully!");
  };

  const handleExportCSV = () => {
    if (!assessment) return;

    const csvHeaders = [
      "CVE ID",
      "Description",
      "CVSS Score",
      "Severity",
      "Category",
      "Recommendation",
    ];
    const csvRows = assessment.vulnerabilities.map((v) => [
      v.id,
      v.description,
      v.cvss.toString(),
      v.severity,
      v.category,
      v.recommendation,
    ]);

    const csvContent = [
      csvHeaders.join(","),
      ...csvRows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `ics-security-assessment-${Date.now()}.csv`;
    link.click();
  };

  const handleExportPDF = () => {
    if (!assessment || !currentConfig) return;
    setExportLanguage(language as "ar" | "en" | "de" | "tr");
    setIsExportDialogOpen(true);
  };

  const confirmExportPDF = () => {
    if (!assessment || !currentConfig) return;
    generatePDF(assessment, currentConfig, exportLanguage);
    setIsExportDialogOpen(false);
  };

  return (
    <CommandShell
      section="assessment"
      title={
        language === "ar"
          ? "تقييم المخاطر الأمنية"
          : language === "de"
            ? "Sicherheitsrisikobewertung"
            : language === "tr"
              ? "Güvenlik Risk Değerlendirmesi"
              : "Security Risk Assessment"
      }
      subtitle={t("inputDescription")}
    >
      <div className="ac-toolbar">
        <ModeSwitch projectId={currentProject?.id} />
        <span className="ac-badge">
          {copy.scope}: {currentProject?.name ?? copy.local}
        </span>
        {assessment && !currentProject && (
          <Button variant="outline" size="sm" onClick={handleSaveAsProject}>
            <Save size={15} />
            {t("saveProject")}
          </Button>
        )}
      </div>
      <AssessmentOverview config={currentConfig} assessment={assessment} />
      <div className="ac-configuration-grid">
        <section className="ac-panel ac-existing-tools">
          <div className="ac-panel-heading">
            <h2>{copy.configuration}</h2>
          </div>
          <DeviceInputForm onSubmit={handleSubmit} initialConfig={currentConfig} />
        </section>
        <section className="ac-panel ac-existing-tools">
          <div className="ac-panel-heading">
            <h2>{t("results")}</h2>
          </div>
          {assessment && currentConfig ? (
            <div className="space-y-6">
              <AttackSurfaceMap config={currentConfig} riskLevel={assessment.riskLevel} />
              <RiskDisplay
                assessment={assessment}
                onExportCSV={handleExportCSV}
                onExportPDF={handleExportPDF}
              />
            </div>
          ) : (
            <div className="ac-empty">
              <Save size={36} />
              <p>{t("emptyState")}</p>
            </div>
          )}
        </section>
      </div>
      {assessment && currentConfig && (
        <section className="ac-panel ac-existing-tools ac-advanced">
          <div className="ac-panel-heading">
            <h2>{copy.tools}</h2>
          </div>
          <p className="ac-help">
            {copy.hypothetical} &middot; {copy.disclaimer}
          </p>
          <AdvancedAnalysisTabs config={currentConfig} assessment={assessment} />
        </section>
      )}
      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {language === "ar" && "تصدير التقرير"}
              {language === "en" && "Export Report"}
              {language === "de" && "Bericht exportieren"}
              {language === "tr" && "Raporu Dışa Aktar"}
            </DialogTitle>
            <DialogDescription>
              {language === "ar" && "اختر لغة التقرير الذي تريد تصديره"}
              {language === "en" && "Choose the language for the exported report"}
              {language === "de" && "Wählen Sie die Sprache für den exportierten Bericht"}
              {language === "tr" && "Dışa aktarılacak raporun dilini seçin"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="language" className="text-right">
                {t("language")}
              </Label>
              <Select
                value={exportLanguage}
                onValueChange={(val: "ar" | "en" | "de" | "tr") => setExportLanguage(val)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ar">العربية (Arabic)</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="de">Deutsch (German)</SelectItem>
                  <SelectItem value="tr">Türkçe (Turkish)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsExportDialogOpen(false)}>
              {t("cancel")}
            </Button>
            <Button onClick={confirmExportPDF}>{t("confirm")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </CommandShell>
  );
}
