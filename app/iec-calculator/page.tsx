"use client";

import { useLanguage } from "@/lib/i18n/language-context";
import IECCalculator from "@/components/iec-calculator";
import { CommandShell } from "@/components/assessment/command-shell";
import { assessmentCopy } from "@/lib/assessment-ui-copy";

export default function IECCalculatorPage() {
  const { language } = useLanguage();
  const c = assessmentCopy(language);
  return (
    <CommandShell section="iec" title={c.compliance} subtitle={c.disclaimer}>
      <IECCalculator />
    </CommandShell>
  );
}
