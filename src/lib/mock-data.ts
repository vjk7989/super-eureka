import type { DroneScan, FalsePositiveReport, Farm, Field, Inspection, ModelPrediction, Profile, Tree, TreeHistoryEvent } from "./types";

export const profiles: Profile[] = [
  { id: "u-1", fullName: "Asha Menon", email: "asha@example.com", phone: "+91 90000 00001", role: "super_admin", status: "active", assignedFarmIds: ["farm-1", "farm-2"], assignedFieldIds: ["field-1", "field-2", "field-3"], lastActiveAt: "Today" },
  { id: "u-2", fullName: "Ramesh Kumar", email: "ramesh@example.com", phone: "+91 90000 00002", role: "field_inspector", status: "active", assignedFarmIds: ["farm-1"], assignedFieldIds: ["field-1"], lastActiveAt: "Today" },
  { id: "u-3", fullName: "Nadia Singh", email: "nadia@example.com", phone: "+91 90000 00003", role: "farm_manager", status: "active", assignedFarmIds: ["farm-1"], assignedFieldIds: ["field-1", "field-2"], lastActiveAt: "Yesterday" },
  { id: "u-4", fullName: "Dev Patel", email: "dev@example.com", phone: "+91 90000 00004", role: "ai_dev", status: "active", assignedFarmIds: ["farm-1", "farm-2"], assignedFieldIds: ["field-1", "field-2", "field-3"], lastActiveAt: "2 hours ago" },
  { id: "u-5", fullName: "Meera Rao", email: "meera@example.com", phone: "+91 90000 00005", role: "viewer", status: "active", assignedFarmIds: ["farm-2"], assignedFieldIds: ["field-3"], lastActiveAt: "This week" }
];

export const farms: Farm[] = [
  { id: "farm-1", name: "Farm 01", code: "FARM-01", location: "Gudivada Estate", district: "Krishna", state: "Andhra Pradesh", country: "India", totalAcres: 24800, totalTrees: 312000, riskScore: 72, status: "active", boundary: [[80.12, 16.12], [80.18, 16.12], [80.18, 16.18], [80.12, 16.18]] },
  { id: "farm-2", name: "Farm 02", code: "FARM-02", location: "Eluru Estate", district: "West Godavari", state: "Andhra Pradesh", country: "India", totalAcres: 17450, totalTrees: 218400, riskScore: 38, status: "active", boundary: [[81.05, 16.55], [81.12, 16.55], [81.12, 16.62], [81.05, 16.62]] }
];

export const fields: Field[] = [
  { id: "field-1", farmId: "farm-1", name: "Block B12", code: "BLOCK-B12", areaAcres: 850, totalTrees: 10420, riskScore: 86, status: "active", boundary: [[80.123, 16.123], [80.145, 16.123], [80.145, 16.147], [80.123, 16.147]] },
  { id: "field-2", farmId: "farm-1", name: "Block C08", code: "BLOCK-C08", areaAcres: 620, totalTrees: 7890, riskScore: 64, status: "active", boundary: [[80.15, 16.13], [80.17, 16.13], [80.17, 16.16], [80.15, 16.16]] },
  { id: "field-3", farmId: "farm-2", name: "Block A04", code: "BLOCK-A04", areaAcres: 910, totalTrees: 11260, riskScore: 31, status: "active", boundary: [[81.06, 16.56], [81.09, 16.56], [81.09, 16.60], [81.06, 16.60]] }
];

export const trees: Tree[] = [
  { id: "tree-1", treeCode: "OP-B12-000342", farmId: "farm-1", fieldId: "field-1", latitude: 16.123456, longitude: 80.123456, currentHealthStatus: "affected", currentDiseaseStage: "stage_2", currentConfidence: 0.87, modelVersion: "v1.2.0", latestImageUrl: "/placeholder-tree.jpg", latestScanDate: "2026-07-07", inspectionStatus: "pending", treatmentStatus: "recommended", riskScore: 91 },
  { id: "tree-2", treeCode: "OP-B12-000343", farmId: "farm-1", fieldId: "field-1", latitude: 16.128, longitude: 80.132, currentHealthStatus: "suspected", currentDiseaseStage: "early_stage", currentConfidence: 0.68, modelVersion: "v1.2.0", latestImageUrl: "/placeholder-tree.jpg", latestScanDate: "2026-07-07", inspectionStatus: "in_progress", treatmentStatus: "none", riskScore: 58 },
  { id: "tree-3", treeCode: "OP-C08-001024", farmId: "farm-1", fieldId: "field-2", latitude: 16.151, longitude: 80.157, currentHealthStatus: "affected", currentDiseaseStage: "stage_3", currentConfidence: 0.94, modelVersion: "v1.2.0", latestImageUrl: "/placeholder-tree.jpg", latestScanDate: "2026-07-06", inspectionStatus: "confirmed_positive", treatmentStatus: "in_progress", riskScore: 98 },
  { id: "tree-4", treeCode: "OP-A04-000111", farmId: "farm-2", fieldId: "field-3", latitude: 16.58, longitude: 81.074, currentHealthStatus: "healthy", currentDiseaseStage: "none", currentConfidence: 0.96, modelVersion: "v1.1.8", latestImageUrl: "/placeholder-tree.jpg", latestScanDate: "2026-07-04", inspectionStatus: "completed", treatmentStatus: "none", riskScore: 12 },
  { id: "tree-5", treeCode: "OP-A04-000118", farmId: "farm-2", fieldId: "field-3", latitude: 16.594, longitude: 81.082, currentHealthStatus: "suspected", currentDiseaseStage: "stage_1", currentConfidence: 0.73, modelVersion: "v1.2.0", latestImageUrl: "/placeholder-tree.jpg", latestScanDate: "2026-07-04", inspectionStatus: "false_positive", treatmentStatus: "none", riskScore: 44 }
];

export const droneScans: DroneScan[] = [
  { id: "scan-1", scanCode: "SCAN-2026-001", farmId: "farm-1", fieldId: "field-1", scanDate: "2026-07-07", modelVersion: "v1.2.0", status: "completed", totalTreesProcessed: 10420 },
  { id: "scan-2", scanCode: "SCAN-2026-002", farmId: "farm-2", fieldId: "field-3", scanDate: "2026-07-04", modelVersion: "v1.1.8", status: "reviewed", totalTreesProcessed: 11260 }
];

export const predictions: ModelPrediction[] = trees.map((tree, index) => ({
  id: `prediction-${index + 1}`,
  treeId: tree.id,
  scanId: index < 3 ? "scan-1" : "scan-2",
  prediction: tree.currentHealthStatus === "healthy" ? "healthy" : "ganoderma",
  healthStatus: tree.currentHealthStatus,
  diseaseStage: tree.currentDiseaseStage,
  confidence: tree.currentConfidence,
  modelVersion: tree.modelVersion
}));

export const inspections: Inspection[] = [
  { id: "inspection-1", treeId: "tree-1", farmId: "farm-1", fieldId: "field-1", assignedTo: "u-2", assignedBy: "u-3", status: "pending", priority: "critical", dueDate: "2026-07-09" },
  { id: "inspection-2", treeId: "tree-2", farmId: "farm-1", fieldId: "field-1", assignedTo: "u-2", assignedBy: "u-3", status: "in_progress", priority: "high", dueDate: "2026-07-10" },
  { id: "inspection-3", treeId: "tree-5", farmId: "farm-2", fieldId: "field-3", assignedTo: "u-2", assignedBy: "u-1", status: "false_positive", priority: "medium", dueDate: "2026-07-08", inspectionResult: "false_positive", inspectorNotes: "Dry leaf shadow near crown caused model confusion." }
];

export const falsePositiveReports: FalsePositiveReport[] = [
  { id: "fp-1", treeId: "tree-5", farmId: "farm-2", fieldId: "field-3", modelVersion: "v1.2.0", aiStage: "stage_1", aiConfidence: 0.73, reasonTag: "Shadow", status: "in_review", devNotes: "Include in next shadow augmentation batch.", createdAt: "2026-07-07" }
];

export const treeHistory: TreeHistoryEvent[] = [
  { id: "h-1", treeId: "tree-1", eventType: "drone_scan", eventTitle: "Drone scan uploaded", eventDescription: "Scan SCAN-2026-001 processed by model v1.2.0.", createdAt: "2026-07-07" },
  { id: "h-2", treeId: "tree-1", eventType: "ai_prediction", eventTitle: "Ganoderma Stage 2 detected", eventDescription: "AI confidence 87%. Inspection recommended.", createdAt: "2026-07-07" },
  { id: "h-3", treeId: "tree-1", eventType: "inspection_assigned", eventTitle: "Inspection assigned", eventDescription: "Assigned to Ramesh Kumar.", createdAt: "2026-07-08" },
  { id: "h-4", treeId: "tree-5", eventType: "false_positive", eventTitle: "False positive reported", eventDescription: "Inspector marked the prediction as false positive due to shadow.", createdAt: "2026-07-07" }
];
