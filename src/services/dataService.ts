import { 
  collection, 
  getDocs, 
  addDoc, 
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  limit, 
  writeBatch, 
  doc, 
  serverTimestamp,
  updateDoc,
  setDoc,
  deleteDoc
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { Camera, Alert, AuditLog, CameraStatus, AlertLevel, AlertType, SystemStatus } from "../types";

const CAMERAS_COLLECTION = "cameras";
const ALERTS_COLLECTION = "alerts";
const AUDIT_LOGS_COLLECTION = "auditLogs";
const SYSTEM_STATUS_COLLECTION = "systemStatus";

export async function seedInitialData() {
  const camerasSnap = await getDocs(collection(db, CAMERAS_COLLECTION));
  if (camerasSnap.empty) {
    console.log("Seeding initial cameras...");
    const initialCameras: Camera[] = [
      { id: "CAM_01", name: "院走廊 A区", sn: "SN-77281-A", status: CameraStatus.ONLINE, streamUrl: "", lastOnline: new Date().toISOString(), personCount: 0, location: "走廊 A区" },
      { id: "CAM_02", name: "生产区 7号楼", sn: "SN-77281-B", status: CameraStatus.ONLINE, streamUrl: "", lastOnline: new Date().toISOString(), personCount: 2, location: "生产区" },
      { id: "CAM_03", name: "北侧大操场", sn: "SN-77281-C", status: CameraStatus.ONLINE, streamUrl: "", lastOnline: new Date().toISOString(), personCount: 12, location: "操场" },
      { id: "CAM_04", name: "食堂大厅", sn: "SN-77281-D", status: CameraStatus.SIGNAL_LOST, streamUrl: "", lastOnline: new Date().toISOString(), personCount: 0, location: "食堂" },
      { id: "CAM_05", name: "医疗中心", sn: "SN-77281-E", status: CameraStatus.ONLINE, streamUrl: "", lastOnline: new Date().toISOString(), personCount: 0, location: "医疗区" },
      { id: "CAM_06", name: "监区主出入口", sn: "SN-77281-F", status: CameraStatus.ONLINE, streamUrl: "", lastOnline: new Date().toISOString(), personCount: 1, location: "出入口" },
    ];

    const batch = writeBatch(db);
    initialCameras.forEach(cam => {
      const ref = doc(collection(db, CAMERAS_COLLECTION), cam.id);
      batch.set(ref, cam);
    });
    await batch.commit();
  }

  const alertsSnap = await getDocs(collection(db, ALERTS_COLLECTION));
  if (alertsSnap.empty) {
    console.log("Seeding initial alerts...");
    const initialAlerts: Alert[] = [
      { 
        id: "A1", 
        cameraId: "CAM_02", 
        cameraName: "生产区 7号楼", 
        type: AlertType.FIGHT, 
        level: AlertLevel.CRITICAL, 
        time: new Date().toISOString(), 
        snapshotUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBnztnVOJgYjODhnZYmft5gctwEPdq9-WKmvFcnNKzaxHn5UI33ykzp0edEqT8N6IJgoxkPTGZfXBBXkSpZJ872fuIlXAQEup8ahNtdehoX7xmmZMnPVgFTg9qebDwKNRK1HPOST704VY3a9k8nJJkpf0Ap212OYoUNJGyhIdoZt_MR6pd-K8BTsSs-qIp0d8tU4r40Vca9rdVvYJqPaTE79II696U0KD3vgDrlsEjYvjYw1ZXCv7jy5pR4Lwer1w6Qs6jPbzIXj-IY", 
        status: "pending", 
        confidence: 98.5 
      },
      { 
        id: "A2", 
        cameraId: "CAM_03", 
        cameraName: "北侧大操场", 
        type: AlertType.CROWD, 
        level: AlertLevel.WARNING, 
        time: new Date(Date.now() - 600000).toISOString(), 
        snapshotUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuD6x2MkHqoKEN8uepC6PpLhw6D0ZBezhsdE51BGp3WQGkMGO6R06JiMNOIc2al9lLqAUe7y04FkpWPPOeWOUOEZChACsNLdH-w6xQGib3AepeBY4LoBWpuufKN9TLixBW5azGAV23g1lCkIWELC0icBp0YkhEapasWmH9zvY_7w8w7CvCO0JoKPiaHRnxcgsCc6p4KWlO2fK1m067Yq6BXwN2J98KUU1mRS1ZpoU_YPMR6EXYWDv5IJZ0_NAFqy0gbktxa_6yE0T8-x", 
        status: "confirmed", 
        confidence: 92.1 
      },
      { 
        id: "A3", 
        cameraId: "CAM_05", 
        cameraName: "医疗中心", 
        type: AlertType.FALL, 
        level: AlertLevel.CRITICAL, 
        time: new Date(Date.now() - 3600000).toISOString(), 
        snapshotUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCDNyiJqUbLkNqVDEfg2o0zzGhcO23qui6tYVVowKS9vw-eakS8bRa10pQd9STk9UuujtVN1goSCYFyqsfa3iKVZCG-9sy10MARruyFOIz8DAqRBtW57SNeGi8UkioTQDqtVr2ws7gpgidcI5DEjaFs52AH2ulS2io5YA9S25HxPJRa1EOVc_2-AkGLNWKFklyQ60a2jLWBsLEe4nWFza783qCiADu9XwRFSKkUTYL1OT6jnJccqonoLlbUt02o1F-6x4HYYrqEV35J", 
        status: "pending", 
        confidence: 95.4 
      },
    ];

    const batch = writeBatch(db);
    initialAlerts.forEach(alert => {
      const ref = doc(collection(db, ALERTS_COLLECTION), alert.id);
      batch.set(ref, alert);
    });
    await batch.commit();
  }

  const logsSnap = await getDocs(collection(db, AUDIT_LOGS_COLLECTION));
  if (logsSnap.empty) {
    console.log("Seeding initial audit logs...");
    const initialLogs: AuditLog[] = [
      { id: "L1", timestamp: new Date().toISOString(), operatorId: "A1", operatorName: "Admin_Chen", category: "系统配置", action: "修改了 A 区人脸识别报警阈值", riskLevel: "high", status: true },
      { id: "L2", timestamp: new Date(Date.now() - 3600000).toISOString(), operatorId: "O5", operatorName: "Op_Zhang", category: "监控调阅", action: "调取并下载了 监舍B3 录像回放", riskLevel: "medium", status: true },
      { id: "L3", timestamp: new Date(Date.now() - 7200000).toISOString(), operatorId: "S2", operatorName: "System_Auto", category: "例行维护", action: "执行自动化数据库备份任务", riskLevel: "low", status: true },
    ];

    const batch = writeBatch(db);
    initialLogs.forEach(log => {
      const ref = doc(collection(db, AUDIT_LOGS_COLLECTION), log.id);
      batch.set(ref, log);
    });
    await batch.commit();
  }

  const statusSnap = await getDocs(collection(db, SYSTEM_STATUS_COLLECTION));
  if (statusSnap.empty) {
    console.log("Seeding initial system status...");
    await addDoc(collection(db, SYSTEM_STATUS_COLLECTION), {
      cpuUsage: 45,
      memoryUsage: 78,
      storageUsage: 32,
      gpuUsage: 92,
      version: "v2.4.1-stable",
      lastUpdate: new Date().toLocaleString(),
      services: [
        { name: "API Server Cluster", uptime: "42d 12h", status: "Running", health: "healthy" },
        { name: "YOLOv8 Identification Engine", uptime: "2d 4h", status: "Degraded", health: "warning" },
        { name: "Global Stream Gateway", uptime: "14d 6h", status: "Running", health: "healthy" },
        { name: "Neural Database Connector", uptime: "128d", status: "Running", health: "healthy" },
      ]
    });
  }
}

export function subscribeToAuditLogs(callback: (logs: AuditLog[]) => void) {
  const q = query(collection(db, AUDIT_LOGS_COLLECTION), orderBy("timestamp", "desc"), limit(50));
  return onSnapshot(q, (snap) => {
    const list = snap.docs.map(d => d.data() as AuditLog);
    callback(list);
  });
}

export function subscribeToSystemStatus(callback: (status: SystemStatus) => void) {
  const q = query(collection(db, SYSTEM_STATUS_COLLECTION), limit(1));
  return onSnapshot(q, (snap) => {
    if (!snap.empty) {
      callback(snap.docs[0].data() as SystemStatus);
    }
  });
}

export function subscribeToCameras(callback: (cameras: Camera[]) => void) {
  return onSnapshot(collection(db, CAMERAS_COLLECTION), (snap) => {
    const list = snap.docs.map(d => d.data() as Camera);
    callback(list);
  });
}

export function subscribeToAlerts(callback: (alerts: Alert[]) => void) {
  const q = query(collection(db, ALERTS_COLLECTION), orderBy("time", "desc"), limit(50));
  return onSnapshot(q, (snap) => {
    const list = snap.docs.map(d => d.data() as Alert);
    callback(list);
  });
}

export async function updateAlertStatus(alertId: string, status: "confirmed" | "ignored") {
  const docRef = doc(db, ALERTS_COLLECTION, alertId);
  try {
    await updateDoc(docRef, { status });
  } catch (error) {
    console.error("Error updating alert status:", error);
  }
}

export async function addCamera(camera: Camera) {
  try {
    await setDoc(doc(db, CAMERAS_COLLECTION, camera.id), camera);
  } catch (error) {
    console.error("Error adding camera:", error);
  }
}

export async function deleteCamera(cameraId: string) {
  try {
    await deleteDoc(doc(db, CAMERAS_COLLECTION, cameraId));
  } catch (error) {
    console.error("Error deleting camera:", error);
  }
}
