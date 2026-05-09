import React, { useState, useEffect } from "react";
import { 
  User, 
  Shield, 
  Trash2, 
  Plus, 
  Key, 
  RefreshCcw,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  UserPlus
} from "lucide-react";
import { db } from "../lib/firebase";
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  deleteDoc, 
  serverTimestamp,
  query,
  where
} from "firebase/firestore";
import { UserAccount, UserRole } from "../types";
import { cn } from "../lib/utils";
import { motion } from "motion/react";

export default function AccountManagement() {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState<UserRole>(UserRole.ON_DUTY_OFFICER);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "users"), (snapshot) => {
      const list = snapshot.docs.map(doc => doc.data() as UserAccount);
      setUsers(list);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!newUsername || !newPassword) return;

    try {
      const uid = `USER_${Math.random().toString(36).substr(2, 9)}`;
      
      // 1. Create Profile
      await setDoc(doc(db, "users", uid), {
        uid,
        username: newUsername,
        displayName: newUsername,
        role: newRole,
        createdAt: new Date().toISOString(),
        lastLogin: ""
      });

      // 2. Create Credentials
      await setDoc(doc(db, "credentials", newUsername), {
        uid,
        username: newUsername,
        password: newPassword
      });

      setShowAddModal(false);
      setNewUsername("");
      setNewPassword("");
    } catch (err: any) {
      setError(err.message || "创建失败");
    }
  };

  const handleDeleteUser = async (user: UserAccount) => {
    if (user.username === "xx") {
      alert("无法删除超级管理员账号");
      return;
    }

    if (confirm(`确定要删除用户 ${user.username} 吗？此操作不可撤销。`)) {
      try {
        await deleteDoc(doc(db, "users", user.uid));
        await deleteDoc(doc(db, "credentials", user.username));
      } catch (err) {
        console.error("Delete user error", err);
      }
    }
  };

  return (
    <div className="space-y-lg animate-in fade-in duration-500">
      <header className="flex justify-between items-center bg-white p-lg rounded-xl border border-outline-variant shadow-sm">
        <div className="flex items-center gap-md text-detect-purple">
          <ShieldCheck size={24} />
          <h2 className="text-title-lg font-bold">账号安全管理中心</h2>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-primary text-on-primary px-lg py-sm rounded-lg font-bold text-[13px] flex items-center gap-sm hover:opacity-90 transition-all shadow-md active:scale-95"
        >
          <UserPlus size={18} /> 新建登录账号
        </button>
      </header>

      <section className="bg-white rounded-xl border border-outline-variant shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-surface-container-low/50 border-b border-outline-variant font-bold text-on-surface-variant text-[11px] uppercase tracking-widest">
            <tr>
              <th className="py-md px-lg">账号名称</th>
              <th className="py-md">角色权限</th>
              <th className="py-md">创建日期</th>
              <th className="py-md">最后登录</th>
              <th className="py-md text-right px-lg">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {loading ? (
              <tr>
                <td colSpan={5} className="py-20 text-center">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                </td>
              </tr>
            ) : users.map((user) => (
              <tr key={user.uid} className="hover:bg-surface-container-low transition-colors group">
                <td className="py-md px-lg">
                  <div className="flex items-center gap-md">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <User size={18} />
                    </div>
                    <div>
                      <div className="font-bold text-on-surface">{user.username}</div>
                      <div className="text-[10px] text-outline">ID: {user.uid}</div>
                    </div>
                  </div>
                </td>
                <td className="py-md">
                  <div className={cn(
                    "px-sm py-unit rounded-full inline-flex items-center gap-xs text-[11px] font-bold",
                    user.role === UserRole.SUPER_ADMIN ? "bg-error/10 text-error" : "bg-primary/10 text-primary"
                  )}>
                    <Shield size={12} />
                    {user.role}
                  </div>
                </td>
                <td className="py-md text-[11px] text-outline font-mono">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}
                </td>
                <td className="py-md text-[11px] text-outline font-mono">
                  {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "从未登录"}
                </td>
                <td className="py-md text-right px-lg space-x-1">
                  <button className="p-sm text-outline hover:text-primary hover:bg-primary/10 rounded-lg transition-all" title="重置密码">
                    <Key size={16} />
                  </button>
                  <button 
                    onClick={() => handleDeleteUser(user)}
                    className={cn(
                      "p-sm rounded-lg transition-all",
                      user.username === "xx" ? "text-outline/20 cursor-not-allowed" : "text-outline hover:text-error hover:bg-error/10"
                    )}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-md">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-white w-full max-w-[440px] rounded-2xl shadow-2xl overflow-hidden border border-outline-variant"
          >
            <div className="bg-primary p-lg text-on-primary flex items-center gap-md">
              <UserPlus size={24} />
              <div>
                <h3 className="font-bold text-lg leading-none">创建新账号</h3>
                <p className="text-[11px] opacity-70 mt-1">为监控中心人员分配访问权限</p>
              </div>
            </div>

            <form onSubmit={handleCreateAccount} className="p-xl space-y-lg">
              {error && (
                <div className="p-sm bg-error/10 text-error text-[12px] flex items-center gap-2 rounded border border-error/20">
                  <AlertCircle size={14} />
                  {error}
                </div>
              )}

              <div className="space-y-md">
                <div className="flex flex-col gap-xs">
                  <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest pl-1">登录账号 (用户名)</label>
                  <input 
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="w-full h-11 bg-surface-container rounded-lg px-md text-[13px] border border-transparent focus:border-primary focus:bg-white transition-all outline-none"
                    placeholder="例如: officer01"
                    required
                  />
                </div>

                <div className="flex flex-col gap-xs">
                  <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest pl-1">初始登录密码</label>
                  <input 
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full h-11 bg-surface-container rounded-lg px-md text-[13px] border border-transparent focus:border-primary focus:bg-white transition-all outline-none"
                    placeholder="设置一个安全的密码"
                    required
                  />
                </div>

                <div className="flex flex-col gap-xs">
                  <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest pl-1">权限角色分配</label>
                  <div className="grid grid-cols-2 gap-sm">
                    {Object.values(UserRole).filter(r => r !== UserRole.SUPER_ADMIN).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setNewRole(r)}
                        className={cn(
                          "py-sm rounded-lg text-[11px] font-bold border transition-all flex flex-col items-center gap-1",
                          newRole === r ? "bg-primary/5 border-primary text-primary" : "border-outline-variant text-outline hover:border-primary/50"
                        )}
                      >
                        <Shield size={14} />
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-md pt-lg">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 text-[13px] font-bold text-on-surface-variant hover:bg-surface-container rounded-xl transition-all"
                >
                  取消
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 text-[13px] font-bold bg-primary text-on-primary rounded-xl shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all"
                >
                  确认创建账号
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
