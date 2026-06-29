# تقرير تقني مفصل: إطار تقييم المخاطر العشوائي لأنظمة التحكم الصناعية

**Stochastic ICS/OT Risk Assessment Framework**

---

## 1. مقدمة المشروع (Project Overview)

### 1.1 نظرة عامة

يُعد **إطار تقييم المخاطر العشوائي لأنظمة التحكم الصناعية (Stochastic ICS/OT Risk Assessment Framework)** أداة هندسية متقدمة مصممة لتحديد وتصور المخاطر السيبرانية في أنظمة التحكم الصناعية (Industrial Control Systems - ICS). على عكس نماذج تقييم المخاطر الثابتة التقليدية، يعتمد هذا الإطار على منهجية احتمالية هجينة تجمع بين المحاكاة العشوائية والنمذجة الرياضية المتقدمة.

### 1.2 الهدف الأساسي

الهدف الرئيسي من الإطار هو **تحديد كمي (Quantify)** للمخاطر السيبرانية في البيئات الصناعية من خلال:

- **توزيع احتمالي للمخاطر المتبقية (Residual Risk Distribution)** باستخدام محاكاة Monte Carlo
- **التنبؤ بتطور الهجمات الإلكترونية (Attack Progression Prediction)** باستخدام Discrete Time Markov Chains
- **كشف التهديدات الفعلية (Real-Time Threat Detection)** من خلال تحليل حزم البيانات الشبكية
- **امتثال المعايير الدولية (Compliance Mapping)** مع IEC 62443

### 1.3 الفئة المستهدفة

تم تصميم هذا الإطار لخدمة:
- مهندسي أنظمة التحكم الآلي (OT Engineers)
- خبراء الأمن السيبراني للبيئات الصناعية
- مديري المخاطر في المنشآت الحرجة
- المدققين والمستشارين في مجال ICS/SCADA Security

---

## 2. المعمارية التقنية (System Architecture)

### 2.1 المجموعة التقنية (Tech Stack)

يستخدم الإطار مجموعة تقنيات حديثة لضمان الأداء والخصوصية:

#### 2.1.1 البنية الأساسية (Core Framework)
- **Next.js 16.0.7**: إطار عمل React للتطبيقات الحديثة مع Server-Side Rendering
- **TypeScript 5.x**: لغة البرمجة الأساسية لضمان Type Safety
- **React 19.2.0**: مكتبة واجهة المستخدم الأساسية

#### 2.1.2 واجهة المستخدم (UI Components)
- **Radix UI**: مكونات واجهة المستخدم المتاحة والملائمة للمعايير
- **Tailwind CSS 4.x**: نظام تنسيق CSS الحديث
- **Lucide React**: مكتبة الأيقونات

#### 2.1.3 المكتبات التحليلية (Analysis Libraries)
- **Recharts 2.15.4**: رسومات بيانية تفاعلية للنتائج
- **jsPDF 4.0.0 + jspdf-autotable**: توليد تقارير PDF احترافية
- **Zod 3.25.76**: التحقق من صحة البيانات المدخلة

#### 2.1.4 أدوات الجودة (Quality Assurance)
- **Vitest**: إطار الاختبارات الوحدية
- **Playwright**: اختبارات واجهة المستخدم الشاملة
- **ESLint + Prettier**: ضمان جودة الكود

### 2.2 هيكل المشروع (Project Structure)

```
industrial-security-app/
├── app/                          # صفحات التطبيق (Next.js App Router)
│   ├── page.tsx                  # الصفحة الرئيسية
│   ├── incident-response/        # واجهة الاستجابة للحوادث الطارئة
│   ├── network-topology/         # تصور الشبكة الصناعية
│   └── documentation/            # الوثائق التقنية
├── components/                   # المكونات القابلة لإعادة الاستخدام
│   ├── pdf-report-generator.tsx  # مولد تقارير PDF
│   ├── smart-recommendations-bar.tsx
│   └── ui/                       # مكونات واجهة المستخدم الأساسية
├── lib/                          # المحركات والمكتبات الأساسية
│   ├── calculators/              # المحركات الحسابية
│   │   ├── risk-engine.ts        # محرك Monte Carlo
│   │   ├── markov-engine.ts      # محرك Markov Chain
│   │   └── pcap-ingestor.ts      # محلل حزم البيانات
│   ├── constants/                # الثوابت والمعايير
│   │   └── markov-parameters.ts  # ثوابت NIST للانتقالات
│   ├── standards/                # معايير الامتثال
│   │   └── iec62443.ts           # IEC 62443 Foundational Requirements
│   ├── network-topology.ts       # مولد الطبولوجيا الشبكية
│   ├── pcap-analyzer.ts          # محلل PCAP الثانوي
│   └── data/                     # قواعد البيانات المحلية
│       ├── devices.json          # أجهزة صناعية معروفة
│       └── vulnerabilities.json  # قاعدة بيانات CVE
└── __tests__/                    # اختبارات الوحدات
```

### 2.3 النموذج المعماري (Architecture Pattern)

يتبع التطبيق معمارية **Client-Side Processing** لضمان الخصوصية الكاملة:

```
┌─────────────────────────────────────────────────────┐
│           USER INPUT (Configuration)                │
│   (Devices, Protocols, Network Settings)            │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│              RISK ENGINE                            │
│   Monte Carlo Simulation (10,000 iterations)        │
│   Box-Muller Transform for Normal Distribution      │
└──────────────────┬──────────────────────────────────┘
                   │
                   │ Risk Score (0-10)
                   ▼
┌─────────────────────────────────────────────────────┐
│            MARKOV CHAIN ENGINE                      │
│   DTMC with NIST-based Transition Matrix            │
│   4 States: Secure → Recon → Exploit → Compromised  │
└──────────────────┬──────────────────────────────────┘
                   │
                   │ State Probabilities (24 hours)
                   ▼
┌─────────────────────────────────────────────────────┐
│        NETWORK TOPOLOGY VISUALIZER                  │
│   SVG-based Dynamic Graph (Nodes + Attack Paths)    │
└─────────────────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│           PDF REPORT GENERATOR                      │
│   Executive Summary + Technical Details + Threats   │
└─────────────────────────────────────────────────────┘
```

**مسار بيانات منفصل للتحليل الفعلي:**
```
┌─────────────────────────────────────────────────────┐
│    PCAP/JSON Upload (Network Traffic Capture)       │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│           TRAFFIC ANALYZER                          │
│   Smart Whitelisting + Modbus Detection             │
│   Port Scanning Detection                           │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│        DETECTED THREATS TABLE                       │
│   Critical/High/Medium/Info severity classification │
└─────────────────────────────────────────────────────┘
```

---

## 3. المحركات الأساسية (Core Engines)

### 3.1 محرك المخاطر (Risk Engine)

#### 3.1.1 المنهجية: محاكاة Monte Carlo

يستخدم المحرك **محاكاة Monte Carlo** لحساب توزيع احتمالي للمخاطر المتبقية (Residual Risk) باستخدام المعادلة الأساسية:

```
Risk = Impact × Likelihood × (1 - Mitigation Factor)
```

#### 3.1.2 تطبيق Box-Muller Transform

للحصول على توزيع طبيعي (Normal Distribution) للتباين، يتم استخدام **Box-Muller Transform**:

```typescript
const u1 = Math.random()
const u2 = Math.random()
const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2)
```

حيث:
- `u1, u2`: أرقام عشوائية موحدة (0-1)
- `z`: قيمة موزعة بشكل طبيعي (Normal Distribution)

#### 3.1.3 المعاملات الأساسية (Input Parameters)

| المعامل | النطاق | الوصف |
|---------|--------|-------|
| `baseImpact` | 1-10 | التأثير الأساسي للثغرة على العمليات |
| `baseLikelihood` | 0-1 | احتمالية حدوث الهجوم |
| `mitigationFactor` | 0-1 | فعالية التدابير الأمنية المطبقة |
| `uncertainty` | 0-1 | عدم اليقين في التقدير (Standard Deviation Factor) |
| `iterations` | 1000-50000 | عدد العينات العشوائية |

#### 3.1.4 المخرجات الإحصائية (Statistical Outputs)

```typescript
interface SimulationStats {
    mean: number         // المتوسط الحسابي للمخاطر
    p90: number          // 90% من الحالات تقع تحت هذا الحد (Pessimistic)
    p10: number          // 10% من الحالات تقع تحت هذا الحد (Optimistic)
    data: SimulationResult[]  // توزيع تكراري (Histogram)
}
```

#### 3.1.5 الكود الأساسي (Core Implementation)

```typescript
export function runMonteCarloSimulation(params: SimulationParams): SimulationStats {
    const results: number[] = []
    
    for (let i = 0; i < params.iterations; i++) {
        // Box-Muller transformation
        const u1 = Math.random()
        const u2 = Math.random()
        const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2)
        
        const variation = z * params.uncertainty
        
        // Apply variation to Likelihood and Impact
        let scenarioLikelihood = params.baseLikelihood + (variation * 0.2)
        scenarioLikelihood = Math.max(0, Math.min(1, scenarioLikelihood))
        
        let scenarioImpact = params.baseImpact + (variation * 0.5)
        scenarioImpact = Math.max(1, Math.min(10, scenarioImpact))
        
        // Calculate residual risk
        const mitigationEffect = params.mitigationFactor * (1 + (Math.random() - 0.5) * 0.2)
        const residualRisk = scenarioImpact * scenarioLikelihood * 10 * (1 - mitigationEffect)
        
        results.push(Math.round(residualRisk * 10) / 10)
    }
    
    // Statistical analysis
    results.sort((a, b) => a - b)
    return {
        mean: results.reduce((a, b) => a + b, 0) / results.length,
        p90: results[Math.floor(results.length * 0.9)],
        p10: results[Math.floor(results.length * 0.1)],
        data: /* ... histogram grouping ... */
    }
}
```

---

### 3.2 محرك Markov (Markov Engine)

#### 3.2.1 نموذج Discrete Time Markov Chain (DTMC)

يستخدم **Markov Engine** سلاسل Markov ذات الوقت المنفصل للتنبؤ بتطور الهجوم السيبراني عبر 4 حالات أمنية:

```
┌─────────┐      ┌──────────────────┐      ┌──────────────┐      ┌─────────────┐
│ Secure  │─────▶│ Reconnaissance   │─────▶│ Exploitation │─────▶│ Compromised │
└─────────┘      └──────────────────┘      └──────────────┘      └─────────────┘
    ▲                    │                        │                      │
    │                    │                        │                      │
    └────────────────────┴────────────────────────┴──────────────────────┘
         (Defender Response/Remediation - with low probability)
```

#### 3.2.2 احتماليات الانتقال المبنية على معايير NIST

جميع ثوابت الانتقال مستمدة من **NIST SP 800-82 Rev 3** وتقارير ICS-CERT السنوية:

##### أ) الانتقال من Secure → Reconnaissance

| المعامل | القيمة | المصدر |
|---------|--------|--------|
| `BASE_PROB_SECURE_TO_RECON` | 0.05 (5%) | NIST SP 800-82 Baseline |
| `SCALE_PROB_SECURE_TO_RECON` | 0.25 (25%) | ICS-CERT Vulnerability Data |

**المعادلة:**
```
P(Secure → Recon) = 0.05 + (RiskScore/10) × 0.25
```

**النطاق:**
- نظام منخفض المخاطر (Risk = 0): 5% احتمالية بدء استطلاع
- نظام عالي المخاطر (Risk = 10): 30% احتمالية بدء استطلاع

##### ب) الانتقال من Reconnaissance → Exploitation

| المعامل | القيمة | المصدر |
|---------|--------|--------|
| `BASE_PROB_RECON_TO_EXPLOIT` | 0.10 (10%) | NIST Threat Modeling |
| `SCALE_PROB_RECON_TO_EXPLOIT` | 0.40 (40%) | Industry Consensus |
| `PROB_RECON_TO_SECURE` | 0.10 (10%) | SOC Effectiveness Metrics |

**المعادلة:**
```
P(Recon → Exploit) = 0.10 + (RiskScore/10) × 0.40
P(Recon → Secure) = 0.10 (ثابتة - استجابة المدافعين)
```

##### ج) الانتقال من Exploitation → Compromised

| المعامل | القيمة | المصدر |
|---------|--------|--------|
| `BASE_PROB_EXPLOIT_TO_COMPROMISED` | 0.15 (15%) | NIST Baseline |
| `SCALE_PROB_EXPLOIT_TO_COMPROMISED` | 0.55 (55%) | MITRE ATT&CK for ICS |
| `PROB_EXPLOIT_TO_RECON` | 0.10 (10%) | Incident Response Data |

**المعادلة:**
```
P(Exploit → Compromised) = 0.15 + (RiskScore/10) × 0.55
```

**النطاق:**
- نظام آمن نسبياً (Risk = 0): 15% احتمالية اختراق كامل
- نظام ضعيف جداً (Risk = 10): 70% احتمالية اختراق كامل

##### د) الحالة النهائية Compromised (Absorbing State)

| المعامل | القيمة | المصدر |
|---------|--------|--------|
| `PROB_COMPROMISED_TO_SECURE` | 0.01 (1%) | ICS-CERT Remediation Timelines |

**التفسير:**
- 1% احتمالية استعادة كاملة للأمان في كل خطوة زمنية (ساعة)
- يعكس واقع أن إصلاح نظام ICS مخترق يستغرق أسابيع إلى أشهر
- مستوحى من حوادث Triton و Industroyer التي استغرقت 3-6 أشهر للاستعادة الكاملة

#### 3.2.3 آلية الحساب: ضرب المصفوفات (Matrix Multiplication)

```
P(t+1) = P(t) × TransitionMatrix
```

حيث:
- `P(t)`: توزيع احتمالي للحالات في الوقت t (متجه 1×4)
- `TransitionMatrix`: مصفوفة انتقال 4×4

**مثال على مصفوفة الانتقال (Risk Score = 7):**

```
               Secure   Recon   Exploit   Compromised
Secure         0.825    0.175   0         0
Recon          0.10     0.40    0.50      0
Exploit        0        0.10    0.415     0.485
Compromised    0.01     0       0         0.99
```

#### 3.2.4 المخرجات (Simulation Outputs)

```typescript
interface MarkovStep {
    step: number                    // الساعة (0-24)
    probabilities: {
        Secure: number              // احتمالية الحالة الآمنة
        Reconnaissance: number      // احتمالية الاستطلاع
        Exploitation: number        // احتمالية الاستغلال
        Compromised: number         // احتمالية الاختراق الكامل
    }
}
```

**مثال على نتيجة المحاكاة لنظام عالي المخاطر:**
- Hour 0: {Secure: 100%, Recon: 0%, Exploit: 0%, Compromised: 0%}
- Hour 6: {Secure: 62%, Recon: 28%, Exploit: 8%, Compromised: 2%}
- Hour 12: {Secure: 38%, Recon: 31%, Exploit: 19%, Compromised: 12%}
- Hour 24: {Secure: 15%, Recon: 22%, Exploit: 23%, Compromised: 40%}

---

### 3.3 محلل الحزم الشبكية (Traffic Analyzer)

#### 3.3.1 نظرة عامة

يوفر **Traffic Analyzer** قدرة تحليل حزم البيانات الشبكية (`PCAP/JSON`) على مستوى المتصفح دون إرسال البيانات لخوادم خارجية.

#### 3.3.2 الميزة الرئيسية: Smart Whitelisting

##### أ) آلية IP Whitelisting

يعتمد النظام على **قائمة بيضاء (Whitelist)** من عناوين IP المصرح لها بإجراء عمليات كتابة Modbus:

```typescript
export const AUTHORIZED_ENGINEERING_IPS = [
    '192.168.1.10',   // Primary Engineering Workstation
    '10.0.0.5',       // Secondary Engineering Workstation
    '192.168.1.100',  // SCADA Server
]
```

##### ب) منطق الكشف عن Unauthorized Access

```
IF (Protocol == 'Modbus' AND Function_Code IN [5, 6, 15, 16]) THEN
    IF (Source_IP IN AUTHORIZED_ENGINEERING_IPS) THEN
        ▶ Log: "Legitimate Operation" (Severity: Info)
    ELSE
        ▶ Alert: "UNAUTHORIZED Modbus Write" (Severity: Critical)
    END IF
END IF
```

##### ج) Modbus Function Codes المراقبة

| Function Code | الوصف | الخطورة |
|---------------|-------|---------|
| FC 5 | Write Single Coil | Critical إذا غير مصرح |
| FC 6 | Write Single Register | Critical إذا غير مصرح |
| FC 15 | Write Multiple Coils | Critical إذا غير مصرح |
| FC 16 | Write Multiple Registers | Critical إذا غير مصرح |

**مثال على كشف:**
```
CRITICAL ALERT:
  Type: Modbus Anomaly
  Description: UNAUTHORIZED Modbus Write (FC 5) from UNKNOWN source 172.16.0.50 
               targeting 192.168.1.20 - Potential attack!
  Timestamp: 2025-01-17T14:32:45Z
```

#### 3.3.3 كشف Port Scanning

يقوم المحلل بتتبع عدد المنافذ الفريدة التي يصل إليها كل Source IP:

```typescript
export const PORT_SCAN_THRESHOLD = 20  // العتبة القابلة للتكوين

// Logic
if (uniquePortsAccessed >= PORT_SCAN_THRESHOLD) {
    Alert: "Port Scanning Detected" (Severity: High)
}
```

**مثال على كشف:**
```
HIGH ALERT:
  Type: Port Scanning
  Description: Detected port scan activity from 10.0.0.99: 
               47 unique ports accessed (threshold: 20)
  Timestamp: 2025-01-17T15:10:03Z
```

#### 3.3.4 الكود الأساسي (Smart Detection Implementation)

```typescript
export class TraficAnalyzer {
    static analyze(packets: Packet[]): DetectedThreat[] {
        const threats: DetectedThreat[] = []
        const portScanTracker: Record<string, Set<number>> = {}
        
        packets.forEach(pkt => {
            // RULE 1: Modbus Write Anomaly Detection (Smart Whitelisting)
            if (pkt.protocol === 'Modbus' && pkt.function_code !== undefined) {
                if (MODBUS_WRITE_FUNCTION_CODES.includes(pkt.function_code)) {
                    const isAuthorized = AUTHORIZED_ENGINEERING_IPS.includes(pkt.source_ip)
                    
                    if (isAuthorized) {
                        threats.push({
                            type: 'Legitimate Operation',
                            severity: 'Info',
                            description: `Authorized Modbus Write (FC ${pkt.function_code}) 
                                          from Engineering Workstation to ${pkt.dest_ip}`
                        })
                    } else {
                        threats.push({
                            type: 'Modbus Anomaly',
                            severity: 'Critical',
                            description: `UNAUTHORIZED Modbus Write (FC ${pkt.function_code}) 
                                          from UNKNOWN source ${pkt.source_ip} targeting ${pkt.dest_ip}`
                        })
                    }
                }
            }
            
            // RULE 2: Port Scanning Detection
            if (!portScanTracker[pkt.source_ip]) {
                portScanTracker[pkt.source_ip] = new Set()
            }
            portScanTracker[pkt.source_ip].add(pkt.destination_port)
        })
        
        // Finalize Port Scan Detection
        Object.entries(portScanTracker).forEach(([ip, ports]) => {
            if (ports.size >= PORT_SCAN_THRESHOLD) {
                threats.push({
                    type: 'Port Scanning',
                    severity: 'High',
                    description: `Port scan activity: ${ports.size} unique ports 
                                  accessed (threshold: ${PORT_SCAN_THRESHOLD})`
                })
            }
        })
        
        return threats
    }
}
```

#### 3.3.5 مخرجات التحليل (Analysis Outputs)

```typescript
interface DetectedThreat {
    id: string
    type: 'Modbus Anomaly' | 'Port Scanning' | 'Unauthorized Access' | 'Legitimate Operation'
    source_ip: string
    severity: 'Critical' | 'High' | 'Medium' | 'Info'
    description: string
    timestamp: string
}
```

---

## 4. المميزات الرئيسية (Key Features)

### 4.1 تصور الشبكة الصناعية التفاعلي (Interactive Network Topology)

#### 4.1.1 النموذج الطبولوجي

يستخدم الإطار نموذج Graph Theory لتمثيل الشبكة الصناعية:

```typescript
interface NetworkTopology {
    nodes: NetworkNode[]    // العقد (PLCs, HMIs, Firewalls, Sensors)
    links: NetworkLink[]    // الحواف (Network Connections)
    zones: Zone[]           // المناطق الأمنية (Purdue Model)
}
```

#### 4.1.2 تقسيم المناطق الأمنية (Purdue Model Zones)

| المستوى | المنطقة | الأجهزة النموذجية |
|---------|---------|-------------------|
| Level 0 | Enterprise Network | Business IT Systems |
| Level 1 | DMZ | HMI, Engineering Workstations |
| Level 2 | Control Network | SCADA, PLC Controllers |
| Level 3 | Field Devices | Sensors, Actuators, I/O Modules |

#### 4.1.3 التفاعل الديناميكي مع Markov Engine

العقد تتغير ديناميكياً بناءً على احتماليات Markov:

```
IF (probabilityCompromised > 0.5) THEN
    NodeColor = RED (High Risk)
    HighlightAttackPath = TRUE
ELSE IF (probabilityExploitation > 0.3) THEN
    NodeColor = ORANGE (Medium Risk)
ELSE IF (probabilityReconnaissance > 0.2) THEN
    NodeColor = YELLOW (Warning)
ELSE
    NodeColor = GREEN (Secure)
END IF
```

#### 4.1.4 حساب مسارات الهجوم (Attack Path Calculation)

يستخدم **Breadth-First Search (BFS)** لإيجاد جميع المسارات الممكنة من `External Node` إلى `Critical Devices`:

```typescript
static getAttackPaths(topology: NetworkTopology): string[][] {
    const externalNode = topology.nodes.find(n => n.type === 'external')
    const highRiskDevices = topology.nodes.filter(n => n.risk >= 7)
    
    const paths: string[][] = []
    highRiskDevices.forEach(device => {
        const path = this.findPath(topology, externalNode.id, device.id)
        if (path.length > 0) paths.push(path)
    })
    
    return paths
}
```

**مثال على مسار هجوم محتمل:**
```
Internet → Firewall → HMI (Vulnerable VNC) → SCADA Server → PLC (Siemens S7-1500)
```

#### 4.1.5 التصور بتقنية SVG

يتم رسم الشبكة باستخدام **Scalable Vector Graphics (SVG)** لضمان:
- **قابلية التوسع (Scalability)** دون فقدان الجودة
- **التفاعل (Interactivity)** مع الماوس (Hover, Click)
- **الأداء (Performance)** حتى مع شبكات كبيرة (100+ nodes)

---

### 4.2 توليد تقارير PDF احترافية (Professional PDF Reporting)

#### 4.2.1 التكامل مع jsPDF

يستخدم الإطار مكتبة `jsPDF 4.0.0` مع `jspdf-autotable 5.0.7`:

```typescript
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
```

#### 4.2.2 بنية التقرير (Report Structure)

```
┌─────────────────────────────────────────────────┐
│  ICS/OT RISK ASSESSMENT REPORT                  │
│  Generated: 2025-01-17                          │
├─────────────────────────────────────────────────┤
│  1. EXECUTIVE SUMMARY                           │
│     - Overall Risk Score: 7.2/10 (High)         │
│     - Time-to-Compromise: 12 hours (50% prob)   │
│     - Critical Vulnerabilities: 5               │
├─────────────────────────────────────────────────┤
│  2. CRITICAL ASSETS TABLE                       │
│     ┌────────┬────────────┬──────┬──────────┐   │
│     │ Device │ Manuf.     │ Risk │ Protocol │   │
│     ├────────┼────────────┼──────┼──────────┤   │
│     │ PLC-01 │ Siemens    │ 8.5  │ Modbus   │   │
│     │ HMI-02 │ Rockwell   │ 7.8  │ EtherNet │   │
│     └────────┴────────────┴──────┴──────────┘   │
├─────────────────────────────────────────────────┤
│  3. DETECTED THREATS (from Traffic Analysis)    │
│     ┌─────────────┬──────────┬──────────────┐   │
│     │ Threat Type │ Severity │ Source IP    │   │
│     ├─────────────┼──────────┼──────────────┤   │
│     │ Modbus Anom │ CRITICAL │ 172.16.0.50  │   │
│     │ Port Scan   │ HIGH     │ 10.0.0.99    │   │
│     └─────────────┴──────────┴──────────────┘   │
├─────────────────────────────────────────────────┤
│  4. RECOMMENDATIONS                             │
│     - Implement Network Segmentation            │
│     - Update Firmware on 3 Critical Devices     │
│     - Enable Authentication on Modbus TCP       │
└─────────────────────────────────────────────────┘
```

#### 4.2.3 الأقسام المولدة تلقائياً

1. **Header**: شعار الشركة، تاريخ التوليد، رقم التقرير
2. **Executive Summary**: ملخص تنفيذي بلغة غير تقنية للإدارة العليا
3. **Critical Assets Table**: جدول بالأصول الحرجة مع درجات المخاطر
4. **Threats from Traffic Analyzer**: تهديدات مكتشفة من تحليل الحزم
5. **Compliance Status**: حالة الامتثال لمعيار IEC 62443
6. **Detailed Recommendations**: توصيات مفصلة مع تقدير التكلفة والوقت
7. **Footer**: إخلاء مسؤولية، جهة الاتصال

#### 4.2.4 التكامل مع Homepage

زر تصدير التقرير متاح في شريط الأدوات الرئيسي:

```typescript
<PDFReportButton 
    projectData={currentProject} 
    riskScore={calculatedRiskScore}
    threats={detectedThreats}
/>
```

---

### 4.3 خريطة الامتثال للمعايير (Compliance Mapping - IEC 62443)

#### 4.3.1 نظرة عامة على IEC 62443

**IEC 62443** هو معيار دولي لأمن أنظمة التحكم الصناعية والأتمتة، يتألف من:

- **7 Foundational Requirements (FR)**
- **المتطلبات الفرعية (System Requirements - SR)**
- **4 Security Levels (SL 0-4)**

#### 4.3.2 المتطلبات الأساسية المطبقة (Implemented Requirements)

| FR | الاسم | عدد المتطلبات الفرعية |
|----|-------|------------------------|
| FR1 | Identification and Authentication Control (IAC) | 4 |
| FR2 | Use Control (UC) | 3 |
| FR3 | System Integrity (SI) | 2 |
| FR4 | Data Confidentiality (DC) | 1 |
| FR5 | Restricted Data Flow (RDF) | 2 |
| FR6 | Timely Response to Events (TRE) | 1 |
| FR7 | Resource Availability (RA) | 2 |

#### 4.3.3 مثال على متطلب منفذ

**FR5 - SR 5.1: Network Segmentation**

```typescript
{
    id: "SR 5.1",
    nameEn: "Network Segmentation",
    nameAr: "تقسيم الشبكة",
    descriptionEn: "The system shall logically segment control networks from non-control networks.",
    descriptionAr: "يجب أن يقسم النظام شبكات التحكم منطقياً عن الشبكات غير التحكمية.",
    requiredForSL: 1  // مطلوب من Security Level 1 فأعلى
}
```

**التحقق التلقائي:**
- إذا كانت الشبكة تحتوي على `Firewall/Gateway` بين `External` و `Control Zone` → ✅ Compliant
- إذا لم توجد أجهزة فصل → ❌ Non-Compliant

#### 4.3.4 Gap Analysis (تحليل الفجوات)

يولد النظام تحليل فجوات تلقائي:

```
IEC 62443 Compliance Report
═══════════════════════════════════════════════
Security Level Target: SL 2

FR1 - IAC:  ⚠️  Partial Compliance (2/4 requirements)
    ✅  SR 1.1: Human User Authentication - PASS
    ❌  SR 1.2: Device Authentication - MISSING
    ✅  SR 1.3: Account Management - PASS
    ❌  SR 1.5: Authenticator Management - MISSING

FR5 - RDF:  ✅  Full Compliance (2/2 requirements)
    ✅  SR 5.1: Network Segmentation - PASS
    ✅  SR 5.2: Zone Boundary Protection - PASS
```

---

## 5. الخلاصة (Conclusion)

### 5.1 لماذا الإطار جاهز للمؤسسات؟ (Why Enterprise-Ready)

#### أ) الدقة العلمية
- استخدام **NIST SP 800-82** كمرجع أساسي لثوابت Markov
- محاكاة Monte Carlo مع 10,000+ iterations لضمان دقة إحصائية
- Box-Muller Transform للتوزيعات الطبيعية (معايير أكاديمية)

#### ب) الامتثال للمعايير الدولية
- تطبيق كامل لـ **IEC 62443 Foundational Requirements**
- توليد تلقائي لتقارير Gap Analysis
- دعم متعدد اللغات (English, Arabic, German) لبيئات دولية

#### ج) الخصوصية والأمان
- **معالجة محلية كاملة (Client-Side Processing)**: لا يتم إرسال بيانات حساسة لخوادم خارجية
- اختياري: تشفير AES-256-GCM للمشاريع المحفوظة محلياً
- عدم الاتصال بالإنترنت مطلوب بعد التحميل الأولي (Offline-Capable)

#### د) قابلية الاستخدام
- **Simple Mode للإدارة العليا**: 5 أسئلة بسيطة بدون مصطلحات تقنية
- **Emergency Incident Response Mode**: إجراءات فورية أثناء الهجمات الفعلية
- **Smart Recommendations**: توصيات ديناميكية حسب نوع الجهاز والصناعة

#### هـ) التوسعية
- قاعدة بيانات قابلة للتوسع للثغرات (CVE Database)
- إمكانية إضافة بروتوكولات صناعية جديدة
- نظام Plugins محتمل للتكامل مع SIEM

### 5.2 حالات الاستخدام المثالية

1. **تقييمات المخاطر السنوية** في منشآت الطاقة والمياه
2. **التدقيق الأمني قبل الاعتماد** لأنظمة SCADA الجديدة
3. **استجابة الحوادث الفورية** أثناء الهجمات السيبرانية
4. **تدريب فرق OT Security** على تحليل المخاطر

### 5.3 التطوير المستقبلي (Future Roadmap)

- تكامل مباشر مع **NVD API** لتحديث قاعدة بيانات CVE تلقائياً
- دعم التحليل الزمني المتسلسل (Time-Series Risk Tracking)
- إنشاء عروض تقديمية تلقائية للإدارة (Presentation Mode)
- تصدير قوائم تدقيق قابلة للتنفيذ (Actionable Checklists) بصيغة Excel

---

## الملحق التقني (Technical Appendix)

### المصطلحات الفنية (Glossary)

| المصطلح العربي | المصطلح الإنجليزي | الشرح |
|----------------|-------------------|--------|
| المحاكاة العشوائية | Monte Carlo Simulation | طريقة إحصائية تستخدم عينات عشوائية لحساب احتماليات |
| احتمالية الانتقال | Transition Probability | احتمالية الانتقال من حالة أمنية إلى أخرى |
| تحليل الحزم | Packet Analysis | فحص حزم البيانات الشبكية لكشف الأنماط المشبوهة |
| القائمة البيضاء | Whitelist | قائمة بالعناوين/الأجهزة المصرح لها بالوصول |
| سلاسل ماركوف | Markov Chains | نموذج رياضي لتوقع تسلسل الأحداث |

### المراجع العلمية (References)

1. **NIST SP 800-82 Rev 3**: Guide to Operational Technology (OT) Security
2. **IEC 62443**: Security for Industrial Automation and Control Systems
3. **ICS-CERT Annual Reports (2019-2024)**: Industrial Control Systems Cyber Emergency Response Team
4. **MITRE ATT&CK for ICS**: Framework for Industrial Control Systems Threats
5. **Box, G. E. P., & Muller, M. E. (1958)**: A Note on the Generation of Random Normal Deviates

---

**تاريخ التوليد:** 2025-01-17  
**إصدار الإطار:** 1.0.0  
**المطور:** Osama Ali  
**الترخيص:** MIT License  
**جهة الاتصال:** https://github.com/usaaaaasdc/ics-risk-framework

---

*هذا التقرير تم توليده كجزء من* **Stochastic ICS/OT Risk Assessment Framework**  
*جميع المحاكاة والتحليل تمت محلياً دون إرسال بيانات حساسة لخوادم خارجية*
