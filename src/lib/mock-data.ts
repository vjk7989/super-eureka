import type { DiseaseStage, DroneScan, FalsePositiveReport, Farm, Field, HealthStatus, Inspection, InspectionStatus, ModelPrediction, Profile, Tree, TreeHistoryEvent } from "./types";

export const profiles: Profile[] = [
  { id: "u-1", fullName: "Asha Menon", email: "asha@example.com", phone: "+91 90000 00001", role: "super_admin", status: "active", assignedFarmIds: ["farm-ap-1", "farm-tg-1", "farm-tn-1", "farm-ga-1", "farm-mh-1", "farm-mz-1"], assignedFieldIds: ["field-ap-b12", "field-ap-c08", "field-tg-n07", "field-tn-s03", "field-ga-w02", "field-mh-e05", "field-mz-h01"], lastActiveAt: "Today" },
  { id: "u-2", fullName: "Ramesh Kumar", email: "ramesh@example.com", phone: "+91 90000 00002", role: "field_inspector", status: "active", assignedFarmIds: ["farm-ap-1"], assignedFieldIds: ["field-ap-b12"], lastActiveAt: "Today" },
  { id: "u-3", fullName: "Nadia Singh", email: "nadia@example.com", phone: "+91 90000 00003", role: "farm_manager", status: "active", assignedFarmIds: ["farm-ap-1", "farm-tg-1"], assignedFieldIds: ["field-ap-b12", "field-ap-c08", "field-tg-n07"], lastActiveAt: "Yesterday" },
  { id: "u-4", fullName: "Dev Patel", email: "dev@example.com", phone: "+91 90000 00004", role: "ai_dev", status: "active", assignedFarmIds: ["farm-ap-1", "farm-tg-1", "farm-tn-1", "farm-ga-1", "farm-mh-1", "farm-mz-1"], assignedFieldIds: ["field-ap-b12", "field-ap-c08", "field-tg-n07", "field-tn-s03", "field-ga-w02", "field-mh-e05", "field-mz-h01"], lastActiveAt: "2 hours ago" },
  { id: "u-5", fullName: "Meera Rao", email: "meera@example.com", phone: "+91 90000 00005", role: "viewer", status: "active", assignedFarmIds: ["farm-tn-1", "farm-ga-1"], assignedFieldIds: ["field-tn-s03", "field-ga-w02"], lastActiveAt: "This week" },
  { id: "u-6", fullName: "Kiran Pawar", email: "kiran@example.com", phone: "+91 90000 00006", role: "farm_manager", status: "active", assignedFarmIds: ["farm-mh-1", "farm-mz-1"], assignedFieldIds: ["field-mh-e05", "field-mz-h01"], lastActiveAt: "Today" }
];

export const farms: Farm[] = [
  farm("farm-ap-1", "Andhra Coastal Oil Palm Cluster", "GAVL-AP-01", "West Godavari Samadhan cluster", "West Godavari", "Andhra Pradesh", 81.08, 16.58, 24800, 312000, 78, "u-3"),
  farm("farm-tg-1", "Telangana North Oil Palm Cluster", "GAVL-TG-01", "Khammam grower service cluster", "Khammam", "Telangana", 80.15, 17.26, 13250, 164000, 69, "u-3"),
  farm("farm-tn-1", "Tamil Nadu Delta Oil Palm Cluster", "GAVL-TN-01", "Cuddalore field support cluster", "Cuddalore", "Tamil Nadu", 79.76, 11.75, 9800, 122500, 42, "u-5"),
  farm("farm-ga-1", "Goa Western Belt Oil Palm Cluster", "GAVL-GA-01", "Ponda service cluster", "North Goa", "Goa", 74.02, 15.40, 4200, 52000, 36, "u-5"),
  farm("farm-mh-1", "Maharashtra Konkan Oil Palm Cluster", "GAVL-MH-01", "Sindhudurg coastal cluster", "Sindhudurg", "Maharashtra", 73.70, 16.02, 7600, 94800, 58, "u-6"),
  farm("farm-mz-1", "Mizoram Hill Oil Palm Cluster", "GAVL-MZ-01", "Kolasib hill cluster", "Kolasib", "Mizoram", 92.68, 24.22, 11200, 136500, 63, "u-6")
];

export const fields: Field[] = [
  field("field-ap-b12", "farm-ap-1", "Block B12", "B12", 81.065, 16.57, 850, 10420, 88, "u-2"),
  field("field-ap-c08", "farm-ap-1", "Block C08", "C08", 81.105, 16.595, 620, 7890, 72, "u-2"),
  field("field-tg-n07", "farm-tg-1", "Block N07", "N07", 80.145, 17.255, 710, 8600, 76, "u-2"),
  field("field-tn-s03", "farm-tn-1", "Block S03", "S03", 79.755, 11.745, 540, 6700, 45, "u-5"),
  field("field-ga-w02", "farm-ga-1", "Block W02", "W02", 74.015, 15.395, 310, 3800, 34, "u-5"),
  field("field-mh-e05", "farm-mh-1", "Block E05", "E05", 73.695, 16.015, 480, 5900, 61, "u-6"),
  field("field-mz-h01", "farm-mz-1", "Block H01", "H01", 92.675, 24.215, 640, 7600, 67, "u-6")
];

const treeSeeds: Array<[string, string, number, number, HealthStatus, DiseaseStage, number, InspectionStatus, number, string]> = [
  ["field-ap-b12", "000342", 16.5668, 81.0612, "affected", "stage_3", 0.94, "pending", 98, "2026-07-06"],
  ["field-ap-b12", "000343", 16.5709, 81.0674, "affected", "stage_2", 0.87, "in_progress", 91, "2026-07-07"],
  ["field-ap-b12", "000344", 16.5746, 81.0718, "suspected", "early_stage", 0.68, "pending", 58, "2026-07-07"],
  ["field-ap-c08", "001024", 16.5962, 81.1032, "affected", "stage_2", 0.82, "confirmed_positive", 84, "2026-07-05"],
  ["field-tg-n07", "000118", 17.2528, 80.1416, "affected", "stage_2", 0.79, "pending", 82, "2026-07-04"],
  ["field-tg-n07", "000119", 17.2591, 80.1497, "suspected", "stage_1", 0.72, "needs_reinspection", 64, "2026-07-03"],
  ["field-tn-s03", "000077", 11.7465, 79.7522, "healthy", "none", 0.96, "completed", 12, "2026-07-02"],
  ["field-tn-s03", "000081", 11.7492, 79.7586, "suspected", "early_stage", 0.61, "pending", 39, "2026-07-02"],
  ["field-ga-w02", "000033", 15.3962, 74.0128, "healthy", "none", 0.95, "completed", 10, "2026-07-01"],
  ["field-ga-w02", "000037", 15.3924, 74.0188, "suspected", "stage_1", 0.73, "false_positive", 44, "2026-07-01"],
  ["field-mh-e05", "000209", 16.017, 73.693, "affected", "stage_1", 0.75, "pending", 62, "2026-07-06"],
  ["field-mh-e05", "000213", 16.012, 73.7, "affected", "stage_2", 0.85, "pending", 80, "2026-07-06"],
  ["field-mz-h01", "000501", 24.213, 92.671, "affected", "stage_3", 0.9, "in_progress", 95, "2026-07-05"],
  ["field-mz-h01", "000504", 24.219, 92.681, "healthy", "none", 0.93, "completed", 15, "2026-07-05"]
];

export const trees: Tree[] = treeSeeds.map(([fieldId, number, latitude, longitude, health, stage, confidence, inspectionStatus, riskScore, scanDate]) => {
  const block = fields.find((item) => item.id === fieldId)!;
  const farmRecord = farms.find((item) => item.id === block.farmId)!;
  const treeCode = `${farmRecord.code}-${block.code}-${number}`;
  const id = treeCode;
  const history = makeHistory(id, treeCode, stage, confidence, scanDate, health);
  return {
    id,
    treeCode,
    farmId: block.farmId,
    fieldId,
    latitude,
    longitude,
    currentHealthStatus: health,
    currentDiseaseStage: stage,
    currentConfidence: confidence,
    modelVersion: "v1.2.0",
    latestImageUrl: imageFor(stage),
    latestScanDate: scanDate,
    inspectionStatus,
    treatmentStatus: health === "affected" ? "recommended" : "none",
    riskScore,
    imageUrls: [imageFor(stage), imageFor("none")],
    history,
    lastAffectedAt: health === "healthy" ? undefined : scanDate,
    geoQuality: "valid"
  };
});

export const droneScans: DroneScan[] = fields.map((block, index) => ({
  id: `scan-${index + 1}`,
  scanCode: `SCAN-2026-${String(index + 1).padStart(3, "0")}`,
  farmId: block.farmId,
  fieldId: block.id,
  scanDate: `2026-07-0${(index % 7) + 1}`,
  modelVersion: "v1.2.0",
  status: index % 3 === 0 ? "reviewed" : "completed",
  totalTreesProcessed: block.totalTrees
}));

export const predictions: ModelPrediction[] = trees.map((tree, index) => ({
  id: `prediction-${index + 1}`,
  treeId: tree.id,
  scanId: `scan-${(index % fields.length) + 1}`,
  prediction: tree.currentHealthStatus === "healthy" ? "healthy" : "ganoderma",
  healthStatus: tree.currentHealthStatus,
  diseaseStage: tree.currentDiseaseStage,
  confidence: tree.currentConfidence,
  modelVersion: tree.modelVersion
}));

export const inspections: Inspection[] = trees.filter((tree) => tree.currentHealthStatus !== "healthy").map((tree, index) => ({
  id: `inspection-${index + 1}`,
  treeId: tree.id,
  farmId: tree.farmId,
  fieldId: tree.fieldId,
  assignedTo: fields.find((fieldItem) => fieldItem.id === tree.fieldId)?.inChargeId ?? "u-2",
  assignedBy: farms.find((farmItem) => farmItem.id === tree.farmId)?.inChargeId ?? "u-3",
  status: tree.inspectionStatus,
  priority: tree.currentDiseaseStage === "stage_3" ? "critical" : tree.currentDiseaseStage === "stage_2" ? "high" : "medium",
  dueDate: "2026-07-10",
  inspectionResult: tree.inspectionStatus === "false_positive" ? "false_positive" : undefined,
  inspectorNotes: tree.inspectionStatus === "false_positive" ? "Dry leaf shadow near crown caused model confusion." : undefined
}));

export const falsePositiveReports: FalsePositiveReport[] = [
  { id: "fp-1", treeId: "GAVL-GA-01-W02-000037", farmId: "farm-ga-1", fieldId: "field-ga-w02", modelVersion: "v1.2.0", aiStage: "stage_1", aiConfidence: 0.73, reasonTag: "Shadow", status: "in_review", devNotes: "Include in next shadow augmentation batch.", createdAt: "2026-07-07" }
];

export const treeHistory: TreeHistoryEvent[] = trees.flatMap((tree) => tree.history);

function farm(id: string, name: string, code: string, location: string, district: string, state: string, lng: number, lat: number, totalAcres: number, totalTrees: number, riskScore: number, inChargeId: string): Farm {
  return { id, name, code, location, district, state, country: "India", totalAcres, totalTrees, riskScore, status: "active", boundary: box(lng, lat, 0.12), inChargeId, center: [lng, lat] };
}

function field(id: string, farmId: string, name: string, code: string, lng: number, lat: number, areaAcres: number, totalTrees: number, riskScore: number, inChargeId: string): Field {
  return { id, farmId, name, code, areaAcres, totalTrees, riskScore, status: "active", boundary: box(lng, lat, 0.035), inChargeId, center: [lng, lat] };
}

function box(lng: number, lat: number, delta: number): [number, number][] {
  return [[lng - delta, lat - delta], [lng + delta, lat - delta], [lng + delta, lat + delta], [lng - delta, lat + delta]];
}

function imageFor(stage: DiseaseStage) {
  if (stage === "stage_3") return "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=640&q=80";
  if (stage === "stage_2" || stage === "stage_1") return "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=640&q=80";
  return "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=640&q=80";
}

function makeHistory(treeId: string, treeCode: string, stage: DiseaseStage, confidence: number, scanDate: string, health: HealthStatus): TreeHistoryEvent[] {
  const stageText = stage.replaceAll("_", " ");
  const events: TreeHistoryEvent[] = [
    { id: `${treeId}-h1`, treeId, eventType: "drone_scan", eventTitle: "Drone scan uploaded", eventDescription: `${treeCode} processed in Godrej operational demo scan.`, createdAt: scanDate },
    { id: `${treeId}-h2`, treeId, eventType: "ai_prediction", eventTitle: health === "healthy" ? "Tree classified healthy" : `Ganoderma ${stageText} detected`, eventDescription: `AI confidence ${Math.round(confidence * 100)}%.`, createdAt: scanDate }
  ];
  if (health !== "healthy") {
    events.push({ id: `${treeId}-h3`, treeId, eventType: "inspection_assigned", eventTitle: "Inspection assigned", eventDescription: "Field in-charge notified for ground verification.", createdAt: "2026-07-08" });
  }
  return events;
}
