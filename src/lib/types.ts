export type Role = "super_admin" | "admin" | "farm_manager" | "field_inspector" | "ai_dev" | "viewer";

export type HealthStatus = "healthy" | "suspected" | "affected" | "removed" | "dead";
export type DiseaseStage = "none" | "early_stage" | "stage_1" | "stage_2" | "stage_3";
export type InspectionStatus = "pending" | "in_progress" | "completed" | "false_positive" | "confirmed_positive" | "needs_reinspection";

export interface Profile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: Role;
  status: "active" | "inactive";
  assignedFarmIds: string[];
  assignedFieldIds: string[];
  lastActiveAt: string;
}

export interface Farm {
  id: string;
  name: string;
  code: string;
  location: string;
  district: string;
  state: string;
  country: string;
  totalAcres: number;
  totalTrees: number;
  riskScore: number;
  status: "active" | "inactive";
  boundary: [number, number][];
}

export interface Field {
  id: string;
  farmId: string;
  name: string;
  code: string;
  areaAcres: number;
  totalTrees: number;
  riskScore: number;
  status: "active" | "inactive";
  boundary: [number, number][];
}

export interface Tree {
  id: string;
  treeCode: string;
  farmId: string;
  fieldId: string;
  latitude: number;
  longitude: number;
  currentHealthStatus: HealthStatus;
  currentDiseaseStage: DiseaseStage;
  currentConfidence: number;
  modelVersion: string;
  latestImageUrl: string;
  latestScanDate: string;
  inspectionStatus: InspectionStatus;
  treatmentStatus: "none" | "recommended" | "in_progress" | "completed";
  riskScore: number;
}

export interface DroneScan {
  id: string;
  scanCode: string;
  farmId: string;
  fieldId: string;
  scanDate: string;
  modelVersion: string;
  status: "uploaded" | "processing" | "completed" | "failed" | "reviewed";
  totalTreesProcessed: number;
}

export interface ModelPrediction {
  id: string;
  treeId: string;
  scanId: string;
  prediction: string;
  healthStatus: HealthStatus;
  diseaseStage: DiseaseStage;
  confidence: number;
  modelVersion: string;
}

export interface Inspection {
  id: string;
  treeId: string;
  farmId: string;
  fieldId: string;
  assignedTo: string;
  assignedBy: string;
  status: InspectionStatus;
  priority: "low" | "medium" | "high" | "critical";
  dueDate: string;
  inspectionResult?: "confirmed_positive" | "false_positive" | "stage_corrected" | "tree_removed" | "unable_to_locate" | "needs_reinspection";
  correctedStage?: DiseaseStage;
  inspectorNotes?: string;
}

export interface FalsePositiveReport {
  id: string;
  treeId: string;
  farmId: string;
  fieldId: string;
  modelVersion: string;
  aiStage: DiseaseStage;
  aiConfidence: number;
  reasonTag: string;
  status: "new" | "in_review" | "reviewed" | "added_to_training_data" | "ignored";
  devNotes: string;
  createdAt: string;
}

export interface TreeHistoryEvent {
  id: string;
  treeId: string;
  eventType: string;
  eventTitle: string;
  eventDescription: string;
  createdAt: string;
}
