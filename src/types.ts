export enum UserRole {
  SUPER_ADMIN = "超级管理员",
  PRISON_ADMIN = "监狱管理员",
  ON_DUTY_OFFICER = "值班干警",
}

export enum CameraStatus {
  ONLINE = "online",
  OFFLINE = "offline",
  SIGNAL_LOST = "signal_lost",
}

export interface Camera {
  id: string;
  name: string;
  sn: string;
  status: CameraStatus;
  streamUrl: string;
  lastOnline: string;
  personCount: number;
  location: string;
}

export enum AlertLevel {
  CRITICAL = "high",
  WARNING = "medium",
  INFO = "low",
}

export enum AlertType {
  FIGHT = "打架斗殴",
  FALL = "人员倒地",
  CROWD = "异常聚集",
  ABSENCE = "脱岗告警",
  INTRUSION = "非法闯入",
}

export interface Alert {
  id: string;
  cameraId: string;
  cameraName: string;
  type: AlertType;
  level: AlertLevel;
  time: string;
  snapshotUrl: string;
  status: "pending" | "confirmed" | "ignored";
  confidence: number;
  duration?: string;
  message?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  operatorId: string;
  operatorName: string;
  category: string;
  action: string;
  riskLevel: "high" | "medium" | "low";
  status: boolean;
}

export interface SystemStatus {
  cpuUsage: number;
  memoryUsage: number;
  storageUsage: number;
  gpuUsage: number;
  version: string;
  lastUpdate: string;
  services: {
    name: string;
    uptime: string;
    status: string;
    health: 'healthy' | 'warning' | 'error';
  }[];
}

export interface UserAccount {
  uid: string;
  username: string;
  displayName: string;
  role: UserRole;
  createdAt: string;
  lastLogin: string;
}

export interface UserCredentials {
  uid: string;
  username: string;
  password: string; // In a real app, this would be hashed
}
