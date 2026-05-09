import { useState, useEffect } from "react";
import { 
  BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell
} from "recharts";
import { 
  Activity, 
  ShieldAlert, 
  Search, 
  Download, 
  CheckCircle2,
} from "lucide-react";
import { cn } from "../lib/utils";
import { subscribeToAuditLogs } from "../services/dataService";
import { AuditLog } from "../types";

const trendData = [
  { name: '05-01', value: 45 },
  { name: '05-03', value: 65 },
  { name: '05-05', value: 40 },
  { name: '05-07', value: 90 },
  { name: '05-09', value: 35 },
  { name: '05-11', value: 70 },
  { name: '05-13', value: 55 },
  { name: '05-15', value: 85 },
  { name: '05-17', value: 48 },
  { name: '05-19', value: 62 },
  { name: '05-21', value: 78 },
  { name: '05-23', value: 42 },
];

export default function Audit() {
  const [logs, setLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    const unsub = subscribeToAuditLogs(setLogs);
    return () => unsub();
  }, []);

  const highRiskCount = logs.filter(l => l.riskLevel === 'high').length;

  return (
    <div className="space-y-lg flex flex-col h-full overflow-hidden">
      {/* Metrics */}
      <section className="grid grid-cols-3 gap-xl shrink-0">
        {[
          { label: "本期操作总量", value: (logs.length + 128492).toLocaleString(), change: "+12.4% 较上月", icon: Activity, color: "text-primary", bg: "bg-primary/10" },
          { label: "高危预警次数", value: (highRiskCount + 14).toString(), change: "-3.2% 较上月", icon: ShieldAlert, color: "text-danger-red", bg: "bg-error-container/40" },
          { label: "系统自动化率", value: "94.8%", change: "核心稳定", icon: CheckCircle2, color: "text-success-green", bg: "bg-success-green/10", bar: 94.8 },
        ].map(s => (
          <div key={s.label} className="bg-white p-lg border border-outline-variant rounded-xl shadow-sm hover:shadow-md transition-all">
             <div className="flex justify-between items-start mb-md">
                <div>
                   <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest mb-unit">{s.label}</p>
                   <h3 className={cn("text-[26px] font-bold font-mono tracking-tighter", s.color)}>{s.value}</h3>
                </div>
                <div className={cn("p-sm rounded-lg", s.bg)}>
                   <s.icon className={s.color} size={20} />
                </div>
             </div>
             <div className="flex items-center gap-xs text-[10px] font-bold opacity-60">
                {s.change}
             </div>
             {s.bar && (
               <div className="mt-md w-full h-1 bg-surface-container rounded-full overflow-hidden">
                  <div className="bg-success-green h-full" style={{ width: `${s.bar}%` }} />
               </div>
             )}
          </div>
        ))}
      </section>

      <div className="grid grid-cols-12 gap-lg shrink-0">
         {/* Active Trends Chart */}
         <section className="col-span-8 bg-white border border-outline-variant rounded-xl p-lg shadow-sm flex flex-col h-[300px]">
            <header className="flex justify-between items-center mb-xl">
               <h3 className="font-bold flex items-center gap-2">管理人员活跃趋势 <span className="text-[11px] opacity-40">(近30日)</span></h3>
               <div className="flex bg-surface-container-high rounded-full p-1 h-8">
                  <button className="px-lg rounded-full text-[10px] font-bold bg-primary text-on-primary">按日</button>
                  <button className="px-lg rounded-full text-[10px] font-bold text-on-surface-variant hover:bg-white/50">按周</button>
               </div>
            </header>
            <div className="flex-1 chart-grid rounded-lg pt-4 px-lg relative">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trendData}>
                     <XAxis dataKey="name" hide />
                     <Tooltip 
                        contentStyle={{ backgroundColor: '#080c14', border: 'none', borderRadius: '8px', boxShadow: '0 8px 32px rgba(0,0,0,0.4)', color: '#fff' }}
                        cursor={{ fill: 'rgba(0,81,174,0.05)' }}
                     />
                     <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {trendData.map((_entry, index) => (
                           <Cell key={`cell-${index}`} fill={index === 10 ? '#0051ae' : '#adc6ff'} />
                        ))}
                     </Bar>
                  </BarChart>
               </ResponsiveContainer>
               <div className="flex justify-between text-[10px] font-bold text-outline px-lg mt-md">
                   <span>05-01</span><span>05-07</span><span>05-14</span><span>05-21</span><span>05-30</span>
               </div>
            </div>
         </section>

         {/* Weekly Reports */}
         <section className="col-span-4 bg-white border border-outline-variant rounded-xl p-lg shadow-sm flex flex-col h-[300px]">
            <h3 className="font-bold mb-lg">每周异常行为周报</h3>
            <div className="flex-1 overflow-y-auto space-y-md custom-scrollbar pr-1">
               {[
                 { title: "非法登录尝试", risk: "high", color: "border-danger-red", detail: "过去7天内，监测到3个不同IP地址尝试暴力破解，已触发自动IP锁定机制。" },
                 { title: "敏感数据导出", risk: "medium", color: "border-warning-orange", detail: "值班员024在非核心工作时段导出了超过500条访客记录，建议进行合规核查。" },
                 { title: "系统离线警报", risk: "low", color: "border-info-cyan", detail: "西区5号摄像头于周三凌晨供电波动短时离线（30秒），目前已恢复。" },
               ].map(r => (
                 <div key={r.title} className={cn("p-md rounded-xl bg-surface-container-low border-l-4", r.color)}>
                    <div className="flex justify-between items-center mb-xs">
                       <span className="font-bold text-[13px]">{r.title}</span>
                       <span className={cn("text-[9px] font-black uppercase px-sm py-unit rounded", r.risk === "high" ? "bg-error text-white" : r.risk === "medium" ? "bg-warning-orange text-white" : "bg-info-cyan text-white")}>{r.risk}</span>
                    </div>
                    <p className="text-[11px] leading-relaxed opacity-70">{r.detail}</p>
                 </div>
               ))}
            </div>
         </section>
      </div>

      {/* Main Table */}
      <section className="flex-1 bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden flex flex-col min-h-0">
         <header className="px-lg py-md border-b border-outline-variant bg-surface-container-lowest flex justify-between items-center shrink-0">
            <h3 className="font-bold">详细操作审计日志</h3>
            <div className="flex gap-md">
               <div className="relative group">
                  <Search className="absolute left-sm top-1/2 -translate-y-1/2 text-outline" size={16} />
                  <input type="text" placeholder="搜索日志..." className="bg-surface-container-high border border-outline-variant rounded-full h-8 pl-xl pr-md text-[11px] w-48 focus:w-64 transition-all" />
               </div>
               <button className="bg-primary text-on-primary px-lg h-8 rounded-lg font-bold text-[11px] flex items-center gap-2"><Download size={16} /> 导出数据</button>
            </div>
         </header>
         <div className="overflow-auto flex-1">
            <table className="w-full text-left border-collapse">
               <thead className="bg-surface-container-low sticky top-0 z-10 text-[10px] uppercase font-bold text-outline tracking-widest border-b border-outline-variant">
                  <tr>
                    <th className="px-lg py-md">时间戳</th>
                    <th className="px-lg py-md">操作员 ID</th>
                    <th className="px-lg py-md">类别</th>
                    <th className="px-lg py-md">详细说明</th>
                    <th className="px-lg py-md">风险级别</th>
                    <th className="px-lg py-md text-right">状态</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-outline-variant/30 text-[12.5px]">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-surface-container-low transition-colors group">
                      <td className="px-lg py-md font-mono text-on-surface-variant">{new Date(log.timestamp).toLocaleString()}</td>
                      <td className="px-lg py-md flex items-center gap-sm">
                        <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-black", log.operatorId.startsWith('A') ? "bg-primary/20 text-primary" : "bg-outline/20 text-outline")}>{log.operatorId}</div>
                        <span className="font-bold">{log.operatorName}</span>
                      </td>
                      <td className="px-lg py-md">
                        <span className="px-lg py-unit bg-surface-container-highest rounded-full text-[10px] font-bold text-outline uppercase">{log.category}</span>
                      </td>
                      <td className="px-lg py-md opacity-80">{log.action}</td>
                      <td className="px-lg py-md uppercase">
                         <span className={cn("text-[10px] font-black flex items-center gap-1", log.riskLevel === 'high' ? 'text-error' : log.riskLevel === 'medium' ? 'text-warning-orange' : 'text-info-cyan')}>
                           <div className={cn("w-1.5 h-1.5 rounded-full", log.riskLevel === 'high' ? "bg-error animate-pulse" : log.riskLevel === 'medium' ? "bg-warning-orange" : "bg-info-cyan")} />
                           {log.riskLevel}
                         </span>
                      </td>
                      <td className="px-lg py-md text-right">
                         <span className="text-success-green"><CheckCircle2 size={18} /></span>
                      </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </section>
    </div>
  );
}
