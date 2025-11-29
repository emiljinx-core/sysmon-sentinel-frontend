"use client";

import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ShieldCheck, 
  ShieldAlert, 
  Activity, 
  Bot, 
  Terminal, 
  AlertTriangle, 
  CheckCircle2,
  Search,
  Cpu
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Note: This file keeps your original UI exactly the same.
 * Replaced mock data with live fetch from /api/logs/benign and /api/logs/malicious.
 * CSV columns expected: TimeCreated, Id, LevelDisplayName, Message
 *
 * Mapping:
 *  eventId     <- Id
 *  taskCategory<- LevelDisplayName
 *  timestamp   <- TimeCreated
 *  processName <- "Unknown" (as requested)
 *  message     <- Message
 */

/* Local LogEntry type used by UI */
type LogEntry = {
  id: string | number;
  eventId: string;
  taskCategory: string;
  timestamp: string;
  processName: string;
  message: string;
};

export default function Home() {
  const [activeTab, setActiveTab] = React.useState("benign");
  const [benignLogs, setBenignLogs] = React.useState<LogEntry[]>([]);
  const [maliciousLogs, setMaliciousLogs] = React.useState<LogEntry[]>([]);
  const [loadingLogs, setLoadingLogs] = React.useState<boolean>(true);

  React.useEffect(() => {
    // load both CSV-backed APIs and map to UI shape
    const load = async () => {
      setLoadingLogs(true);
      try {
        const [bRes, mRes] = await Promise.all([
          fetch("/api/logs/benign"),
          fetch("/api/logs/malicious"),
        ]);

        const [bJson, mJson] = await Promise.all([bRes.json(), mRes.json()]);

        const mapRecord = (r: any, idx: number): LogEntry => {
          // CSV parser returns keys matching headers; normalize safely
          const eventId = r["Id"] ?? r["id"] ?? r["EventID"] ?? `${idx + 1}`;
          const taskCategory = r["LevelDisplayName"] ?? r["Level"] ?? r["TaskCategory"] ?? "";
          const timestamp = r["TimeCreated"] ?? r["TimeGenerated"] ?? r["timestamp"] ?? "";
          const message = r["Message"] ?? r["message"] ?? JSON.stringify(r);
          return {
            id: eventId,
            eventId: String(eventId),
            taskCategory: String(taskCategory),
            timestamp: String(timestamp),
            processName: "Unknown", // per your instruction
            message: String(message),
          };
        };

        setBenignLogs(Array.isArray(bJson) ? bJson.map(mapRecord) : []);
        setMaliciousLogs(Array.isArray(mJson) ? mJson.map(mapRecord) : []);
      } catch (err) {
        console.error("Error loading logs:", err);
        setBenignLogs([]);
        setMaliciousLogs([]);
      } finally {
        setLoadingLogs(false);
      }
    };

    load();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 selection:text-primary overflow-hidden bg-grid-pattern relative">
      {/* Ambient Background Glow */}
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center">
        <div className={`w-[800px] h-[800px] rounded-full blur-[120px] opacity-10 transition-colors duration-1000 ${activeTab === 'benign' ? 'bg-emerald-500' : 'bg-red-600'}`} />
      </div>

      <div className="relative z-10 container mx-auto p-6 max-w-6xl h-screen flex flex-col">
        {/* Header */}
        <header className="mb-8 flex items-center justify-between border-b border-border/40 pb-6 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl border ${activeTab === 'benign' ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'} transition-colors duration-500`}>
              <ShieldCheck className={`w-8 h-8 ${activeTab === 'benign' ? 'text-emerald-400' : 'hidden'}`} />
              <ShieldAlert className={`w-8 h-8 ${activeTab === 'malicious' ? 'text-red-400' : 'hidden'}`} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight font-mono uppercase">
                Sysmon<span className={activeTab === 'benign' ? 'text-emerald-400' : 'text-red-500'}>Sentinel</span>
              </h1>
              <p className="text-muted-foreground text-sm flex items-center gap-2">
                <Activity className="w-3 h-3" /> System Monitor Log Analysis Unit
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-secondary/50 rounded-md border border-border/50 text-xs font-mono text-muted-foreground">
                <Cpu className="w-3 h-3" />
                <span>AI MODEL: LLaMA-3-8B-GROQ</span>
             </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-h-0">
          <Tabs defaultValue="benign" className="flex-1 flex flex-col h-full" onValueChange={setActiveTab}>
            <div className="flex items-center justify-between mb-4">
              <TabsList className="bg-secondary/30 border border-border/50 p-1">
                <TabsTrigger value="benign" className="data-[state=active]:bg-emerald-950 data-[state=active]:text-emerald-400 data-[state=active]:border-emerald-900/50 border border-transparent font-mono">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  BENIGN_LOGS
                </TabsTrigger>
                <TabsTrigger value="malicious" className="data-[state=active]:bg-red-950 data-[state=active]:text-red-400 data-[state=active]:border-red-900/50 border border-transparent font-mono">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  MALICIOUS_LOGS
                </TabsTrigger>
              </TabsList>
              
              <div className="text-xs font-mono text-muted-foreground animate-pulse">
                {activeTab === 'benign' ? 'STATUS: SYSTEM NORMAL' : 'STATUS: THREAT DETECTED'}
              </div>
            </div>

            <TabsContent value="benign" className="flex-1 min-h-0 mt-0">
              <LogList logs={benignLogs} type="benign" />
            </TabsContent>
            
            <TabsContent value="malicious" className="flex-1 min-h-0 mt-0">
              <LogList logs={maliciousLogs} type="malicious" />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}

function LogList({ logs, type }: { logs: LogEntry[], type: "benign" | "malicious" }) {
  return (
    <ScrollArea className="h-full pr-4">
      <div className="space-y-4 pb-10">
        {logs.map((log, idx) => (
          <LogItem key={`${type}-${idx}-${log.id}`} log={log} type={type} index={idx} />
        ))}
      </div>
    </ScrollArea>
  );
}

function LogItem({ log, type, index }: { log: LogEntry, type: "benign" | "malicious", index: number }) {
  const [expanded, setExpanded] = React.useState(false);
  const [aiResponse, setAiResponse] = React.useState<{ title: string, content: string, type: "success" | "warning" | "danger" | "info" } | null>(null);
  const [loading, setLoading] = React.useState(false);

  const handleAiAction = async (action: "why_benign" | "when_malicious" | "why_malicious" | "user_action") => {
    setLoading(true);
    setAiResponse(null);
    
    try {
      // call backend analyze endpoint
      const res = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, log }),
      });

      const data = await res.json();
      const responseText = (data && (data.result || data.result_text || data.output)) ? (data.result || data.result_text || data.output) : JSON.stringify(data);

      let responseType: "success" | "warning" | "danger" | "info" = "info";
      let title = "AI Analysis";

      if (action === "why_benign") { responseType = "success"; title = "Why is this Benign?"; }
      if (action === "when_malicious") { responseType = "warning"; title = "Potential Threat Vector"; }
      if (action === "why_malicious") { responseType = "danger"; title = "Malicious Indicator"; }
      if (action === "user_action") { responseType = "info"; title = "Recommended Action"; }

      setAiResponse({ title, content: responseText, type: responseType });
    } catch (err) {
      console.error("AI error:", err);
      setAiResponse({ title: "Error", content: "Failed to analyze log. Check API or network.", type: "danger" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className={`border-l-4 ${type === 'benign' ? 'border-l-emerald-500 hover:border-emerald-500/50' : 'border-l-red-500 hover:border-red-500/50'} bg-card/50 backdrop-blur border-y-border/40 border-r-border/40 transition-all duration-300 hover:shadow-lg group`}> 
        <CardHeader className="p-4 cursor-pointer" onClick={() => setExpanded(!expanded)}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded bg-secondary/50 font-mono text-xs font-bold ${type === 'benign' ? 'text-emerald-400' : 'text-red-400'}`}>
                {log.eventId}
              </div>
              <div>
                <CardTitle className="text-sm font-mono font-medium">{log.taskCategory}</CardTitle>
                <CardDescription className="text-xs font-mono mt-1 text-muted-foreground">
                  {log.timestamp} • {log.processName}
                </CardDescription>
              </div>
            </div>
            <div className="text-xs text-muted-foreground font-mono group-hover:text-foreground transition-colors">
              {expanded ? '[COLLAPSE]' : '[EXPAND]'}
            </div>
          </div>
        </CardHeader>
        
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <CardContent className="p-4 pt-0 border-t border-border/40 bg-black/20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                  {/* Log Content */}
                  <div className="space-y-3">
                    <h4 className="text-xs uppercase font-bold text-muted-foreground tracking-wider flex items-center gap-2">
                      <Terminal className="w-3 h-3" /> Raw Log Data
                    </h4>
                    <div className="bg-black/50 p-3 rounded border border-border/30 font-mono text-xs text-muted-foreground whitespace-pre-wrap overflow-x-auto max-h-[300px]">
                      {log.message}
                    </div>
                  </div>

                  {/* AI Interaction Area */}
                  <div className="space-y-3 flex flex-col">
                    <h4 className="text-xs uppercase font-bold text-muted-foreground tracking-wider flex items-center gap-2">
                      <Bot className="w-3 h-3" /> AI Analysis
                    </h4>
                    
                    <div className="flex gap-2 flex-wrap">
                      {type === "benign" ? (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleAiAction("why_benign")}
                            className="border-emerald-900/50 hover:bg-emerald-950/50 hover:text-emerald-400 text-xs"
                            disabled={loading}
                          >
                            <CheckCircle2 className="w-3 h-3 mr-2" />
                            Why Benign?
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleAiAction("when_malicious")}
                            className="border-amber-900/50 hover:bg-amber-950/50 hover:text-amber-400 text-xs"
                            disabled={loading}
                          >
                            <AlertTriangle className="w-3 h-3 mr-2" />
                            When Malicious?
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleAiAction("why_malicious")}
                            className="border-red-900/50 hover:bg-red-950/50 hover:text-red-400 text-xs"
                            disabled={loading}
                          >
                            <ShieldAlert className="w-3 h-3 mr-2" />
                            Why Malicious?
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleAiAction("user_action")}
                            className="border-blue-900/50 hover:bg-blue-950/50 hover:text-blue-400 text-xs"
                            disabled={loading}
                          >
                            <ShieldCheck className="w-3 h-3 mr-2" />
                            Action Plan
                          </Button>
                        </>
                      )}
                    </div>

                    {/* Response Output */}
                    <div className="flex-1 min-h-[150px] bg-secondary/20 rounded border border-border/50 p-4 relative">
                      {loading ? (
                         <div className="absolute inset-0 flex items-center justify-center flex-col gap-2 text-muted-foreground">
                           <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                           <span className="text-xs font-mono animate-pulse">ANALYZING LOG PATTERNS...</span>
                         </div>
                      ) : aiResponse ? (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="space-y-2"
                        >
                          <h5 className={`text-sm font-bold ${
                            aiResponse.type === 'success' ? 'text-emerald-400' :
                            aiResponse.type === 'danger' ? 'text-red-400' :
                            aiResponse.type === 'warning' ? 'text-amber-400' :
                            'text-blue-400'
                          }`}>
                            {aiResponse.title}
                          </h5>
                          <Separator className="bg-border/30" />
                          <div className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line font-mono">
                            {aiResponse.content}
                          </div>
                        </motion.div>
                      ) : (
                        <div className="h-full flex items-center justify-center text-muted-foreground/40 text-xs font-mono uppercase">
                          Awaiting Analyst Query...
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}
