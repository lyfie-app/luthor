import React from "react";
import { PACKAGE_DEFINITIONS } from "../data/siteContent";

export type PackageStats = {
  packageName: string;
  description: string;
  npmUrl: string;
  weeklyDownloads: number | null;
  version: string | null;
  unpackedSize: number | null;
};

export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

export function formatUnpackedSize(bytes: number | null): string {
  if (!bytes || bytes <= 0) {
    return "N/A";
  }

  const inKb = bytes / 1024;
  if (inKb < 1024) {
    return `${inKb.toFixed(1)} KB`;
  }

  return `${(inKb / 1024).toFixed(2)} MB`;
}

export function usePackageStats() {
  const [packageStatsStatus, setPackageStatsStatus] = React.useState<"idle" | "loading" | "ready" | "error">("idle");
  const [packageStats, setPackageStats] = React.useState<PackageStats[]>(() =>
    PACKAGE_DEFINITIONS.map((entry) => ({
      packageName: entry.packageName,
      description: entry.description,
      npmUrl: entry.npmUrl,
      weeklyDownloads: null,
      version: null,
      unpackedSize: null,
    })),
  );

  React.useEffect(() => {
    const controller = new AbortController();

    async function loadPackageStats() {
      setPackageStatsStatus("loading");

      try {
        const results = await Promise.all(
          PACKAGE_DEFINITIONS.map(async (entry) => {
            const encodedName = encodeURIComponent(entry.packageName);
            const [downloadResponse, registryResponse] = await Promise.all([
              fetch(`https://api.npmjs.org/downloads/point/last-week/${encodedName}`, { signal: controller.signal }),
              fetch(`https://registry.npmjs.org/${encodedName}`, { signal: controller.signal }),
            ]);

            if (!downloadResponse.ok || !registryResponse.ok) {
              throw new Error(`Failed to load npm metrics for ${entry.packageName}`);
            }

            const downloadData = (await downloadResponse.json()) as { downloads?: number };
            const registryData = (await registryResponse.json()) as {
              "dist-tags"?: { latest?: string };
              versions?: Record<string, { dist?: { unpackedSize?: number } }>;
            };

            const latestVersion = registryData["dist-tags"]?.latest ?? null;
            const unpackedSize = latestVersion ? registryData.versions?.[latestVersion]?.dist?.unpackedSize ?? null : null;

            return {
              packageName: entry.packageName,
              description: entry.description,
              npmUrl: entry.npmUrl,
              weeklyDownloads: downloadData.downloads ?? null,
              version: latestVersion,
              unpackedSize,
            } satisfies PackageStats;
          }),
        );

        setPackageStats(results);
        setPackageStatsStatus("ready");
      } catch {
        if (controller.signal.aborted) {
          return;
        }
        setPackageStatsStatus("error");
      }
    }

    loadPackageStats();

    return () => {
      controller.abort();
    };
  }, []);

  const totalWeeklyDownloads = packageStats.reduce((total, current) => total + (current.weeklyDownloads ?? 0), 0);

  return {
    packageStats,
    packageStatsStatus,
    totalWeeklyDownloads,
  };
}
