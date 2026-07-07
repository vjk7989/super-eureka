import { droneScans, falsePositiveReports, farms, fields, inspections, predictions, profiles, treeHistory, trees } from "./mock-data";
import type { DiseaseStage, HealthStatus, InspectionStatus, Role, Tree } from "./types";

export interface TreeFilters {
  farmId?: string;
  fieldId?: string;
  state?: string;
  inChargeId?: string;
  query?: string;
  healthStatus?: HealthStatus | "all";
  diseaseStage?: DiseaseStage | "all";
  inspectionStatus?: InspectionStatus | "all";
  minConfidence?: number;
  startDate?: string;
  endDate?: string;
  mostAffectedFirst?: boolean;
}

export const repositories = {
  profiles: {
    list: () => profiles,
    byId: (id: string) => profiles.find((profile) => profile.id === id),
    byRole: (role: Role) => profiles.filter((profile) => profile.role === role)
  },
  farms: {
    list: () => farms,
    byId: (id: string) => farms.find((farm) => farm.id === id),
    states: () => Array.from(new Set(farms.map((farm) => farm.state))).sort()
  },
  fields: {
    list: () => fields,
    byId: (id: string) => fields.find((field) => field.id === id),
    byFarm: (farmId: string) => fields.filter((field) => field.farmId === farmId)
  },
  trees: {
    list: (filters: TreeFilters = {}) => sortTrees(filterTrees(trees, filters), filters),
    byId: (id: string) => trees.find((tree) => tree.id === id || tree.treeCode === id),
    byFarm: (farmId: string) => trees.filter((tree) => tree.farmId === farmId),
    byField: (fieldId: string) => trees.filter((tree) => tree.fieldId === fieldId)
  },
  scans: {
    list: () => droneScans,
    byId: (id: string) => droneScans.find((scan) => scan.id === id)
  },
  predictions: {
    list: () => predictions,
    byTree: (treeId: string) => predictions.filter((prediction) => prediction.treeId === treeId)
  },
  inspections: {
    list: () => inspections,
    byId: (id: string) => inspections.find((inspection) => inspection.id === id),
    byTree: (treeId: string) => inspections.filter((inspection) => inspection.treeId === treeId)
  },
  falsePositives: {
    list: () => falsePositiveReports,
    byId: (id: string) => falsePositiveReports.find((report) => report.id === id)
  },
  history: {
    byTree: (treeId: string) => treeHistory.filter((event) => event.treeId === treeId),
    farmEvents: (farmId: string) => treeHistory.filter((event) => {
      const tree = trees.find((item) => item.id === event.treeId);
      return tree?.farmId === farmId;
    })
  }
};

export function scopeTreesForRole(role: Role, profileId = "u-1") {
  const profile = repositories.profiles.byId(profileId) ?? profiles[0];
  if (role === "super_admin" || role === "ai_dev") return trees;
  if (role === "field_inspector") {
    const assignedTreeIds = inspections.filter((inspection) => inspection.assignedTo === profile.id).map((inspection) => inspection.treeId);
    return trees.filter((tree) => assignedTreeIds.includes(tree.id));
  }
  return trees.filter((tree) => profile.assignedFarmIds.includes(tree.farmId) || profile.assignedFieldIds.includes(tree.fieldId));
}

export function dashboardStats(sourceTrees = trees) {
  const total = sourceTrees.length;
  const affected = sourceTrees.filter((tree) => tree.currentHealthStatus === "affected").length;
  const suspected = sourceTrees.filter((tree) => tree.currentHealthStatus === "suspected").length;
  const healthy = sourceTrees.filter((tree) => tree.currentHealthStatus === "healthy").length;
  const pending = inspections.filter((inspection) => inspection.status === "pending" || inspection.status === "in_progress").length;
  return {
    totalFarms: farms.length,
    totalAcres: farms.reduce((sum, farm) => sum + farm.totalAcres, 0),
    totalFields: fields.length,
    totalMappedTrees: 530400,
    visibleTrees: total,
    healthy,
    suspected,
    affected,
    earlyStage: sourceTrees.filter((tree) => tree.currentDiseaseStage === "early_stage").length,
    stage1: sourceTrees.filter((tree) => tree.currentDiseaseStage === "stage_1").length,
    stage2: sourceTrees.filter((tree) => tree.currentDiseaseStage === "stage_2").length,
    stage3: sourceTrees.filter((tree) => tree.currentDiseaseStage === "stage_3").length,
    pendingInspections: pending,
    completedInspections: inspections.filter((inspection) => inspection.status === "completed" || inspection.status === "confirmed_positive").length,
    falsePositives: falsePositiveReports.length
  };
}

function filterTrees(sourceTrees: Tree[], filters: TreeFilters) {
  return sourceTrees.filter((tree) => {
    const farm = farms.find((item) => item.id === tree.farmId);
    const field = fields.find((item) => item.id === tree.fieldId);
    const query = filters.query?.toLowerCase().trim();
    return (!filters.farmId || tree.farmId === filters.farmId)
      && (!filters.fieldId || tree.fieldId === filters.fieldId)
      && (!filters.state || farm?.state === filters.state)
      && (!filters.inChargeId || farm?.inChargeId === filters.inChargeId || field?.inChargeId === filters.inChargeId)
      && (!query || tree.treeCode.toLowerCase().includes(query))
      && (!filters.healthStatus || filters.healthStatus === "all" || tree.currentHealthStatus === filters.healthStatus)
      && (!filters.diseaseStage || filters.diseaseStage === "all" || tree.currentDiseaseStage === filters.diseaseStage)
      && (!filters.inspectionStatus || filters.inspectionStatus === "all" || tree.inspectionStatus === filters.inspectionStatus)
      && (!filters.minConfidence || tree.currentConfidence >= filters.minConfidence)
      && (!filters.startDate || tree.latestScanDate >= filters.startDate)
      && (!filters.endDate || tree.latestScanDate <= filters.endDate);
  });
}

function sortTrees(sourceTrees: Tree[], filters: TreeFilters) {
  if (!filters.mostAffectedFirst) return sourceTrees;
  return [...sourceTrees].sort((a, b) => b.riskScore - a.riskScore || b.currentConfidence - a.currentConfidence);
}
