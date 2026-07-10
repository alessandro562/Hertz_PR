import type { Metadata } from "next";
import { BarChart3 } from "lucide-react";
import { ComingSoon } from "@/components/common/coming-soon";

export const metadata: Metadata = { title: "Performance" };

export default function PerformancePage() {
  return (
    <ComingSoon
      title="Performance"
      phase="Fase 5–6"
      icon={BarChart3}
      description="Analisi aggregate per capo PR, squadra e collaboratore: conversion rate, trend, dormienti e score nel tempo."
    />
  );
}
