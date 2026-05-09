import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, Tooltip,
  BarChart, Bar, Cell
} from "recharts";
import { 
  TrendingUp, 
  Map as MapIcon, 
  BarChart2, 
  Radar as RadarIcon, 
  Download, 
  Calendar,
  AlertCircle,
  ShieldCheck,
  Target,
  Router,
  Activity
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { cn } from "../lib/utils";
import { subscribeToAlerts, subscribeToSystemStatus } from "../services/dataService";
import { Alert, SystemStatus } from "../types";

const radarData = [
  { subject: '打架斗殴', A: 96, fullMark: 100 },
  { subject: '违规越界', A: 99, fullMark: 100 },
  { subject: '感官偏离', A: 85, fullMark: 100 },
  { subject: '异常聚集', A: 88, fullMark: 100 },
  { subject: '夜间起身', A: 92, fullMark: 100 },
];

const trendData = [
  { name: '周一', alerts: 40 },
  { name: '周二', alerts: 45 },
  { name: '周三', alerts: 35 },
  { name: '周四', alerts: 60 },
  { name: '周五', alerts: 85 },
  { name: '周六', alerts: 70 },
  { name: '周日', alerts: 95 },
];

const regionalData = [
  { name: 'A监区', value: 142, color: '#0051ae' },
  { name: 'B监区', value: 342, color: '#cf222e' },
  { name: 'C监区', value: 98, color: '#0051ae' },
  { name: 'D监区', value: 215, color: '#0051ae' },
  { name: '全外围', value: 45, color: '#bf8700' },
];

export default function Analysis() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [status, setStatus] = useState<SystemStatus | null>(null);

  useEffect(() => {
    const unsubAlerts = subscribeToAlerts(setAlerts);
    const unsubStatus = subscribeToSystemStatus(setStatus);
    return () => {
      unsubAlerts();
      unsubStatus();
    };
  }, []);

  const totalAlerts = alerts.length;
  const accuracy = 98.2 + (Math.random() * 0.1);

  return (
    <div className="space-y-xl max-w-[1600px] mx-auto pb-xl">
      <header className="flex justify-between items-end">
        <div>
           <h2 className="text-title-lg font-black tracking-tight">分析看板与报表</h2>
           <p className="text-on-surface-variant text-[14px] opacity-70">监区安全数据综合分析视图（v.3.2）</p>
        </div>
        <div className="flex gap-sm">
           <button className="bg-white border border-outline-variant px-lg py-sm rounded-lg font-bold text-[13px] flex items-center gap-2">
             <Calendar size={18} /> 近7天数据
           </button>
           <button className="bg-primary text-on-primary px-lg py-sm rounded-lg font-bold text-[13px] flex items-center gap-2 shadow-sm">
             <Download size={18} /> 导出分析报告
           </button>
        </div>
      </header>

      {/* Summary Row */}
      <div className="grid grid-cols-4 gap-xl">
         {[
           { label: "本周告警总数", value: (totalAlerts + 1200).toLocaleString(), change: "+12.4%", trend: "up", icon: AlertCircle, color: "text-danger-red", bg: "bg-error-container/20" },
           { label: "AI 拦截准确率", value: `${accuracy.toFixed(1)}%`, change: "+0.8%", trend: "up", icon: ShieldCheck, color: "text-success-green", bg: "bg-success-green/10" },
           { label: "平均识别时延", value: "12ms", change: "-2ms", trend: "down", icon: Target, color: "text-info-cyan", bg: "bg-info-cyan/10" },
           { label: "设备实时负载", value: status ? `${status.cpuUsage}%` : "99.8%", change: "正常运行", trend: "none", icon: Router, color: "text-outline", bg: "bg-surface-container-highest" },
         ].map((s, i) => (
           <div key={i} className="bg-white p-lg border border-outline-variant rounded-xl shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
             <div className="flex justify-between items-start mb-md">
                <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">{s.label}</span>
                <div className={cn("p-sm rounded-lg transition-transform group-hover:scale-110", s.bg)}>
                  <s.icon className={s.color} size={20} />
                </div>
             </div>
             <div className="flex items-baseline gap-2">
                <span className="text-[26px] font-bold font-mono tracking-tighter">{s.value}</span>
                <span className={cn("text-[10px] font-black", s.trend === "up" ? "text-error" : s.trend === "down" ? "text-success-green" : "text-outline")}>
                  {s.change}
                </span>
             </div>
             <div className={cn("absolute bottom-0 left-0 right-0 h-1", s.bg)} />
           </div>
         ))}
      </div>

      <div className="grid grid-cols-3 gap-xl">
        {/* Heatmap Section */}
        <section className="col-span-2 bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm flex flex-col h-[500px]">
          <header className="px-lg py-md border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
            <h3 className="font-bold flex items-center gap-2"><MapIcon size={18} className="text-outline" /> 监区异常活动热力图</h3>
            <span className="text-[10px] font-bold text-success-green uppercase bg-success-green/10 px-sm py-unit rounded ring-1 ring-success-green/20">Real-time Feed</span>
          </header>
          <div className="flex-1 relative bg-surface-container-low p-md">
            <div 
              className="w-full h-full rounded-lg border border-outline-variant/30 chart-grid relative overflow-hidden flex items-center justify-center bg-white"
              style={{
                backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDmksrikOgXpzf8vQM16KLkGSWdxdv1C083ZLJhU4IM1RKdIzEqjY2RNQsOKmV27MldTl8LvYS3f3uJMupsvprs9jJAPupdnMzMe7h7o_V9PYeCE4V6VSIzv2ra4XG4Byn2NRqcpl522D8dFJSJHFtmgBkJCzbaiaduegIdr3uPWQkltb3jBfQFyNePPRfXdS_-P4hzLX0PHI4JYAX1g1T9jwZhEsySy7vqFDUPVO4QxpARlWIdsaZXkND2s1sPeh1gYmjVAxMHol_2')`,
                backgroundSize: 'cover'
              }}
            >
               {/* Simplified Heatmap Blobs Simulation */}
               <motion.div animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.2, 1] }} transition={{ duration: 3, repeat: Infinity }} className="absolute w-64 h-64 bg-error/20 blur-[60px] rounded-full left-[20%] top-[30%]" />
               <motion.div animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.3, 1] }} transition={{ duration: 4, repeat: Infinity }} className="absolute w-80 h-80 bg-warning-orange/20 blur-[80px] rounded-full right-[10%] top-[20%]" />
               
               {/* Legend */}
               <div className="absolute bottom-md right-md bg-white/90 backdrop-blur-md border border-outline-variant p-sm rounded-lg shadow-xl">
                 <p className="text-[10px] font-bold text-on-surface-variant uppercase mb-xs">活动密度</p>
                 <div className="w-[120px] h-2 bg-gradient-to-r from-success-green via-warning-orange to-danger-red rounded-full mb-1" />
                 <div className="flex justify-between text-[9px] font-bold font-mono opacity-50 uppercase"><span>Low</span><span>High</span></div>
               </div>
            </div>
          </div>
        </section>

        {/* 7 Day Trend */}
        <section className="col-span-1 bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm flex flex-col h-[500px]">
          <header className="px-lg py-md border-b border-outline-variant bg-surface-container-low">
            <h3 className="font-bold flex items-center gap-2"><BarChart2 size={18} className="text-outline" /> 七日告警趋势</h3>
          </header>
          <div className="flex-1 p-lg chart-grid">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorAlert" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0051ae" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#0051ae" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#727785' }} />
                <Tooltip />
                <Area type="monotone" dataKey="alerts" stroke="#0051ae" strokeWidth={3} fillOpacity={1} fill="url(#colorAlert)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <div className="grid grid-cols-2 gap-xl">
        {/* Radar Performance */}
        <section className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm flex flex-col">
          <header className="px-lg py-md border-b border-outline-variant bg-surface-container-low">
            <h3 className="font-bold flex items-center gap-2"><RadarIcon size={18} className="text-outline" /> AI 识别效能 (精确率/召回率)</h3>
          </header>
          <div className="p-xl grid grid-cols-5 gap-8 items-center h-[300px]">
            <div className="col-span-3 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e1e2ec" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fontWeight: 700, fill: '#191c22' }} />
                  <Radar name="Precision" dataKey="A" stroke="#0051ae" fill="#0051ae" fillOpacity={0.15} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="col-span-2 space-y-lg border-l border-outline-variant/30 pl-lg">
               <div>
                  <p className="text-[11px] font-bold text-outline uppercase mb-xs">总体精确率</p>
                  <p className="text-[22px] font-mono font-bold text-primary">94.8% <span className="text-[10px] text-success-green">稳定</span></p>
               </div>
               <div>
                  <p className="text-[11px] font-bold text-outline uppercase mb-xs">样本召回率</p>
                  <p className="text-[22px] font-mono font-bold text-detect-purple">92.1% <span className="text-[10px] text-success-green">稳定</span></p>
               </div>
               <div className="pt-md border-t border-outline-variant/20 opacity-50">
                  <p className="text-[9px] font-bold flex items-center gap-1 uppercase"><Activity size={10} /> Model: YOLOv8-Prison-v3.2</p>
               </div>
            </div>
          </div>
        </section>

        {/* Regional Bar Distribution */}
        <section className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm flex flex-col">
          <header className="px-lg py-md border-b border-outline-variant bg-surface-container-low">
            <h3 className="font-bold flex items-center gap-2"><TrendingUp size={18} className="text-outline" /> 各监区告警风险分布</h3>
          </header>
          <div className="p-xl flex-1 flex flex-col justify-center">
            {regionalData.map(item => (
              <div key={item.name} className="flex items-center gap-md mb-md last:mb-0">
                <span className="w-16 text-[11px] font-bold text-right text-on-surface-variant">{item.name}</span>
                <div className="flex-1 h-3 bg-surface-container-highest rounded-full overflow-hidden">
                   <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.value / 342) * 100}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: item.color }} 
                   />
                </div>
                <span className="w-12 text-[12px] font-mono font-black text-on-surface">{item.value}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
