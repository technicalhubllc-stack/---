
export type UserRole = 'STARTUP' | 'PARTNER' | 'MENTOR' | 'ADMIN';
export type ProjectTrack = 'Idea' | 'Prototype' | 'Product' | 'MVP' | 'Growth' | 'Investment Ready';
export type TaskStatus = 'LOCKED' | 'ASSIGNED' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export type TicketType = 'INQUIRY' | 'COMPLAINT' | 'SUPPORT';
export type TicketStatus = 'PENDING' | 'IN_PROGRESS' | 'RESOLVED';

/* Fix for missing types */
export type ProjectStageType = 'Idea' | 'Prototype' | 'Product';
export type TechLevelType = 'Low' | 'Medium' | 'High';

export interface ApplicantProfile {
  codeName: string;
  projectStage: ProjectStageType;
  sector: string;
  goal: string;
  techLevel: TechLevelType;
}

export interface AnalyticalQuestion {
  text: string;
  options: string[];
  correctIndex: number;
  difficulty: string;
}

export interface ProjectEvaluationResult {
  totalScore: number;
  classification: 'Green' | 'Yellow' | 'Red';
  clarity: number;
  value: number;
  innovation: number;
  market: number;
  readiness: number;
  strengths: string[];
  weaknesses: string[];
  aiOpinion: string;
}

export interface NominationData {
  companyName: string;
  founderName: string;
  location: string;
  pitchDeckUrl: string;
  hasCommercialRegister: 'YES' | 'NO' | 'IN_PROGRESS';
  hasTechnicalPartner: boolean;
  problemStatement: string;
  targetCustomerType: string[];
  marketSize: 'SMALL' | 'MEDIUM' | 'LARGE' | 'UNKNOWN';
  whyNow: string;
  productStage: 'IDEA' | 'PROTOTYPE' | 'MVP' | 'TRACTION';
  topFeatures: string;
  executionPlan: 'NONE' | 'GENERAL' | 'WEEKLY';
  userCount: string;
  revenueModel: 'NOT_SET' | 'SUBSCRIPTION' | 'COMMISSION' | 'ANNUAL' | 'PAY_PER_USE';
  customerAcquisitionPath: string;
  incubationReason: string;
  weeklyHours: 'LESS_5' | '5-10' | '10-20' | '20+';
  agreesToWeeklySession: boolean;
  agreesToKPIs: boolean;
  isCommitted10Hours: boolean;
  currentResources: string[];
  tractionEvidence: string[];
  demoUrl?: string;
}

export interface NominationResult {
  totalScore: number;
  category: 'DIRECT_ADMISSION' | 'INTERVIEW' | 'PRE_INCUBATION' | 'REJECTION';
  redFlags: string[];
  aiAnalysis: string;
}

export type AgentCategory = 'Vision' | 'Market' | 'User' | 'Opportunity';

export interface AIAgent {
  id: string;
  name: string;
  category: AgentCategory;
  description: string;
}

export const AVAILABLE_AGENTS: AIAgent[] = [
  { id: 'v1', name: 'Strategic Architect', category: 'Vision', description: 'Defines long-term mission and core values.' },
  { id: 'm1', name: 'Market Analyst', category: 'Market', description: 'Analyzes competitors and market trends.' },
  { id: 'u1', name: 'User Researcher', category: 'User', description: 'Builds detailed user personas and empathy maps.' },
  { id: 'o1', name: 'Growth Hacker', category: 'Opportunity', description: 'Identifies untapped growth channels.' },
];

export interface ProjectBuildData {
  projectName: string;
  description: string;
  quality: 'Quick' | 'Balanced' | 'Enhanced' | 'Professional' | 'Max';
  selectedAgents: string[];
  results?: {
    vision?: string;
    marketAnalysis?: string;
    userPersonas?: string;
    hypotheses?: string[];
    pitchDeck?: { title: string; content: string }[];
  };
}

export interface FailureSimulation {
  brutalTruth: string;
  probability: number;
  financialLoss: string;
  operationalImpact: string;
  missingQuestions: string[];
  recoveryPlan: string[];
}

export interface GovStats {
  riskyMarkets: { name: string; failRate: number }[];
  readySectors: { name: string; score: number }[];
  commonFailReasons: { reason: string; percentage: number }[];
  regulatoryGaps: string[];
}

export interface TemplateField {
  id: string;
  label: string;
  type: 'text' | 'textarea';
  placeholder: string;
  instruction: string;
}

export interface Template {
  id: string;
  title: string;
  description: string;
  icon: string;
  role: UserRole[];
  isMandatory: boolean;
  fields: TemplateField[];
  toolTipPurpose?: string;
  toolTipLogic?: string;
}

export interface TemplateSubmission {
  templateId: string;
  data: Record<string, string>;
  aiScore: number;
  aiFeedback: string;
  status: 'DRAFT' | 'APPROVED' | 'REVISION_REQUIRED';
  updatedAt: string;
}

export const TEMPLATES_LIBRARY: Template[] = [
  {
    id: 'bmc',
    title: 'Business Model Canvas',
    description: 'Detailed structure for your business logic.',
    icon: '🏗️',
    role: ['STARTUP'],
    isMandatory: true,
    fields: [
      { id: 'vp', label: 'Value Proposition', type: 'textarea', placeholder: 'What value do you deliver?', instruction: 'Be specific.' }
    ],
    toolTipPurpose: 'Define the core logic of how your business creates and captures value.',
    toolTipLogic: 'Checks for consistency between customer segments and value props.'
  },
  {
    id: 'lean',
    title: 'Lean Canvas',
    description: 'A 1-page business plan optimized for startups.',
    icon: '📉',
    role: ['STARTUP'],
    isMandatory: true,
    fields: [
      { id: 'problem', label: 'Problem', type: 'textarea', placeholder: 'Top 3 problems you solve', instruction: 'List the actual pains.' },
      { id: 'solution', label: 'Solution', type: 'textarea', placeholder: 'Top 3 features', instruction: 'Focus on the MVP.' }
    ],
    toolTipPurpose: 'Rapidly map out the key hypotheses of your business.',
    toolTipLogic: 'Analyzes the problem-solution fit.'
  },
  {
    id: 'swot',
    title: 'SWOT Analysis',
    description: 'Strategic internal and external audit.',
    icon: '📊',
    role: ['STARTUP', 'ADMIN'],
    isMandatory: false,
    fields: [
      { id: 'strengths', label: 'Strengths', type: 'textarea', placeholder: 'Internal advantages', instruction: 'What makes you win?' },
      { id: 'threats', label: 'Threats', type: 'textarea', placeholder: 'External risks', instruction: 'Competitors, market shifts.' }
    ],
    toolTipPurpose: 'Identify competitive advantages and critical vulnerabilities.',
    toolTipLogic: 'Benchmarks internal power vs external pressure.'
  }
];

export interface ProgramRating {
  stars: number;
  feedback: string;
  favoriteFeature: string;
  submittedAt: string;
}

export interface PersonalityQuestion {
  id: number;
  situation: string;
  options: { text: string; style: string }[];
}

export interface RadarMetrics {
  readiness: number;
  analysis: number;
  tech: number;
  personality: number;
  strategy: number;
  ethics: number;
}

export interface FinalResult {
  isQualified: boolean;
  score: number;
  leadershipStyle: string;
  metrics: RadarMetrics;
  badges: Badge[];
  projectEval?: ProjectEvaluationResult;
}

export interface ActivityLogRecord {
  id: string;
  userId: string;
  event: string;
  type: string;
  date: string;
  score?: string;
  color?: string;
}

export interface MentorProfile {
  id: string;
  name: string;
  role: string;
  company: string;
  specialty: string;
  bio: string;
  experience: number;
  avatar: string;
  rating: number;
  tags: string[];
}

export interface SupportTicket {
  id: string;
  uid: string;
  projectId: string;
  type: TicketType;
  subject: string;
  message: string;
  status: TicketStatus;
  createdAt: string;
  reply?: string;
}

export interface KPIRecord {
  date: string;
  growth: number;
  techReadiness: number;
  marketEngagement: number;
  revenue?: number;
  burnRate?: number;
}

export interface Badge {
  id: string;
  name: string;
  levelId: number;
  icon: string;
  description: string;
  color: string;
}

export interface Partner {
  name: string;
  role: string;
}

export interface UserRecord {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  phone: string;
  city?: string;
  earnedBadges: string[];
  founderBio?: string;
  skills: string[];
  linkedin?: string;
  createdAt: string;
}

export interface StartupRecord {
  projectId: string;
  ownerId: string;
  ownerName?: string;
  name: string;
  description: string;
  industry: string;
  status: 'PENDING' | 'APPROVED' | 'STALLED' | 'GRADUATED';
  currentTrack: ProjectTrack;
  metrics: {
    readiness: number;
    tech: number;
    market: number;
  };
  kpiHistory: KPIRecord[];
  riskLevel: RiskLevel;
  aiOpinion: string;
  aiClassification?: 'Green' | 'Yellow' | 'Red';
  currentLevel?: number;
  startupBio?: string;
  website?: string;
  linkedin?: string;
  partners: Partner[];
  logo?: string;
  lastActivity: string;
}

export interface TaskRecord {
  id: string;
  uid: string;
  projectId: string;
  levelId: number;
  title: string;
  description: string;
  status: TaskStatus;
  submission?: {
    fileData: string;
    fileName: string;
    submittedAt: string;
  };
  aiReview?: {
    score: number;
    feedback: string;
    suggestedNextSteps: string[];
  };
}

export interface ServiceRequest {
  id: string;
  uid: string;
  projectId: string;
  serviceId: string;
  packageId: string;
  details: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  createdAt: string;
}

export interface LevelPillar {
  title: string;
  description: string;
  icon: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

export interface Resource {
  title: string;
  type: 'PDF' | 'VIDEO' | 'DOC' | 'LINK';
  url: string;
}

export interface LevelData {
  id: number;
  title: string;
  description: string;
  icon: string;
  imageUrl: string;
  isLocked: boolean;
  isCompleted: boolean;
  customColor?: string;
  complexity?: 'Low' | 'Medium' | 'High' | 'Elite';
  estimatedTime?: string;
  pillars?: LevelPillar[];
  quiz?: QuizQuestion[];
  resources?: Resource[];
}

export const INITIAL_ROADMAP: LevelData[] = [
  { 
    id: 1, 
    title: 'التحقق الاستراتيجي', 
    description: 'تحديد الجدوى من حل المشكلة والتحقق من فرضيات العميل عبر رادار السوق.', 
    icon: '🛰️', 
    imageUrl: 'https://images.unsplash.com/photo-1454165833767-13143891bb39?auto=format&fit=crop&q=80&w=600', 
    isLocked: false, 
    isCompleted: false, 
    customColor: 'blue',
    complexity: 'Medium',
    estimatedTime: '٤ ساعات',
    pillars: [
      { title: 'تحليل الفجوات', description: 'تحديد نقاط الضعف في الحلول الحالية.', icon: '🔍' },
      { title: 'هيكلة القيمة', description: 'صياغة العرض القيمي الجوهري.', icon: '💎' }
    ],
    quiz: [
      { question: "ما هو الهدف من اكتشاف العميل؟", options: ["البيع المباشر", "التحقق من الألم", "جمع التبرعات"], correctIndex: 1 }
    ],
    resources: [
      { title: 'دليل اكتشاف العميل', type: 'PDF', url: '#' },
      { title: 'فيديو: صياغة المشكلة', type: 'VIDEO', url: '#' }
    ]
  },
  { 
    id: 2, 
    title: 'هيكلة نموذج العمل', 
    description: 'تصميم محرك الإيرادات والقيمة لضمان استدامة الكيان المؤسسي.', 
    icon: '📐', 
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=600', 
    isLocked: false, 
    isCompleted: false, 
    customColor: 'indigo',
    complexity: 'High',
    estimatedTime: '٦ ساعات',
    pillars: [
      { title: 'مخطط الـ BMC', description: 'رسم الهيكل التشغيلي والمالي.', icon: '🏗️' },
      { title: 'مصادر الدخل', description: 'تحديد قنوات التدفقات النقدية.', icon: '💰' }
    ],
    quiz: [
      { question: "ما هي القيمة المقترحة (Value Prop)؟", options: ["قائمة ميزات المنتج", "الفائدة الجوهرية للعميل", "سعر المنتج"], correctIndex: 1 }
    ],
    resources: [
      { title: 'قالب نموذج العمل التجاري', type: 'DOC', url: '#' },
      { title: 'ورشة عمل: قنوات الإيرادات', type: 'VIDEO', url: '#' }
    ]
  },
  { 
    id: 3, 
    title: 'هندسة المنتج (MVP)', 
    description: 'بناء النواة التقنية الأولى القابلة للاختبار الميداني السريع.', 
    icon: '⚙️', 
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600', 
    isLocked: false, 
    isCompleted: false, 
    customColor: 'emerald',
    complexity: 'Elite',
    estimatedTime: '٨ ساعات',
    pillars: [
      { title: 'ترتيب الأولويات', description: 'اختيار الميزات الجوهرية فقط.', icon: '🎯' },
      { title: 'تجربة المستخدم', description: 'تصميم رحلة عميل سلسة.', icon: '📱' }
    ],
    quiz: [
      { question: "ما هو الـ MVP؟", options: ["النسخة الأرخص", "أصغر منتج قابل للتجربة وحل المشكلة", "النسخة النهائية الكاملة"], correctIndex: 1 }
    ],
    resources: [
      { title: 'دليل ترتيب ميزات المنتج', type: 'PDF', url: '#' },
      { title: 'أدوات بناء النماذج السريعة', type: 'LINK', url: '#' }
    ]
  },
  { 
    id: 4, 
    title: 'تحليل الجدوى والنمو', 
    description: 'دراسة التوسع ووضع خطط الاستحواذ عبر قنوات البث الرقمي والنمو الفيروسي.', 
    icon: '📈', 
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827?auto=format&fit=crop&q=80&w=600', 
    isLocked: false, 
    isCompleted: false, 
    customColor: 'amber',
    complexity: 'Medium',
    estimatedTime: '٥ ساعات',
    pillars: [
      { title: 'اقتصاديات الوحدة', description: 'حساب الـ CAC والـ LTV لكل عميل.', icon: '📊' },
      { title: 'قنوات الاستحواذ', description: 'تحديد أفضل طرق الوصول للجمهور.', icon: '📡' },
      { title: 'النمو الفيروسي', description: 'تصميم محركات الانتشار التلقائي.', icon: '🧬' }
    ],
    quiz: [
      { question: "ماذا يمثل الـ TAM؟", options: ["إجمالي السوق المتاح", "السوق المستهدف فعلياً", "عدد الموظفين"], correctIndex: 0 },
      { question: "ما هي النسبة الصحية المثالية بين LTV و CAC؟", options: ["1:1", "3:1", "1:3"], correctIndex: 1 }
    ],
    resources: [
      { title: 'حاسبة اقتصاديات الوحدة', type: 'LINK', url: '#' },
      { title: 'استراتيجيات النمو الرقمي', type: 'PDF', url: '#' }
    ]
  },
  { 
    id: 5, 
    title: 'النمذجة المالية', 
    description: 'تأمين القيمة المالية الدقيقة وجاهزية التدفقات النقدية الاستراتيجية لمدة ٣ سنوات.', 
    icon: '📊', 
    imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=600', 
    isLocked: false, 
    isCompleted: false, 
    customColor: 'orange',
    complexity: 'High',
    estimatedTime: '٦ ساعات',
    pillars: [
      { title: 'قائمة الدخل التقديرية', description: 'توقع الأرباح والخسائر لـ ٣ سنوات.', icon: '📊' },
      { title: 'إدارة السيولة (Cash Flow)', description: 'مراقبة الداخل والخارج من النقد.', icon: '💧' },
      { title: 'نقطة التعادل (Break-even)', description: 'متى سيبدأ المشروع في تغطية تكاليفه؟', icon: '⚖️' }
    ],
    quiz: [
      { question: "ما هو معدل الحرق (Burn Rate)؟", options: ["سرعة إنفاق السيولة شهرياً", "معدل زيادة العملاء", "تكلفة المنتج"], correctIndex: 0 },
      { question: "متى يصل المشروع لنقطة التعادل؟", options: ["عند الحصول على استثمار", "عندما تساوي الإيرادات إجمالي التكاليف", "عند إطلاق النسخة الأولى"], correctIndex: 1 }
    ],
    resources: [
      { title: 'نموذج التوقعات المالية (Excel)', type: 'DOC', url: '#' },
      { title: 'فيديو: إدارة التدفق النقدي', type: 'VIDEO', url: '#' }
    ]
  },
  { 
    id: 6, 
    title: 'جاهزية الاستثمار', 
    description: 'صياغة العرض المؤسسي النهائي والتحضير للجان الاستثمار VC وهيكلة الحصص.', 
    icon: '💎', 
    imageUrl: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80&w=600', 
    isLocked: false, 
    isCompleted: false, 
    customColor: 'rose',
    complexity: 'Elite',
    estimatedTime: '٧ ساعات',
    pillars: [
      { title: 'العرض الاستثماري (Pitch)', description: 'تصميم Pitch Deck احترافي ومقنع.', icon: '📽️' },
      { title: 'هيكلة الحصص (Cap Table)', description: 'توزيع الملكية وتخطيط جولات التمويل.', icon: '📉' },
      { title: 'الفحص النافي للجهالة', description: 'تجهيز المستندات القانونية والمالية للتدقيق.', icon: '🛡️' }
    ],
    quiz: [
      { question: "ما هو الـ Term Sheet؟", options: ["عقد توظيف", "مذكرة شروط الاستثمار الأساسية", "فاتورة ضريبية"], correctIndex: 1 },
      { question: "ما هو الـ Valuation؟", options: ["عدد الأسهم", "تقييم القيمة المالية للشركة", "ميزانية التسويق"], correctIndex: 1 }
    ],
    resources: [
      { title: 'قالب عرض استثماري (Pitch Deck)', type: 'DOC', url: '#' },
      { title: 'دليل هيكلة الحصص', type: 'PDF', url: '#' }
    ]
  }
];

export enum FiltrationStage { 
  LANDING = 'LANDING', 
  WELCOME = 'WELCOME', 
  DASHBOARD = 'DASHBOARD',
  AI_MENTOR_CONCEPT = 'AI_MENTOR_CONCEPT',
  ROADMAP = 'ROADMAP',
  TOOLS = 'TOOLS',
  LOGIN = 'LOGIN',
  ACHIEVEMENTS = 'ACHIEVEMENTS',
  MENTORSHIP = 'MENTORSHIP',
  INCUBATION_PROGRAM = 'INCUBATION_PROGRAM',
  MEMBERSHIPS = 'MEMBERSHIPS',
  PARTNER_CONCEPT = 'PARTNER_CONCEPT',
  FOREIGN_INVESTMENT = 'FOREIGN_INVESTMENT',
  STAFF_PORTAL = 'STAFF_PORTAL',
  INCUBATION_APPLY = 'INCUBATION_APPLY',
  CONTACT = 'CONTACT',
  IMPACT = 'IMPACT'
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city?: string;
  role?: UserRole;
  startupName?: string;
  startupDescription?: string;
  industry?: string;
  agreedToTerms?: boolean;
  agreedToContract?: boolean;
  founderBio?: string;
  skills?: string[];
  linkedin?: string;
  website?: string;
  partners?: Partner[];
  logo?: string;
  startupBio?: string;
  stage?: 'Idea' | 'MVP' | 'Growth' | 'InvestReady';
  missingRoles?: string[];
  existingRoles?: string[];
  supportNeeded?: string[];
  mentorExpertise?: string[];
  mentorSectors?: string[];
  name?: string;
}

export const SECTORS = [
  { value: 'Technology', label: 'التقنية' },
  { value: 'Fintech', label: 'التقنية المالية' },
  { value: 'Health', label: 'الصحة' },
  { value: 'E-commerce', label: 'التجارة الإلكترونية' },
  { value: 'Education', label: 'التعليم' },
  { value: 'Industrial', label: 'الصناعة' }
];

export const ACADEMY_BADGES: Badge[] = [
  { id: 'b1', name: 'وسام التحقق', levelId: 1, icon: '📡', description: 'تم اجتياز مرحلة التحقق الاستراتيجي', color: 'from-blue-500 to-indigo-500' },
  { id: 'b2', name: 'وسام نموذج العمل', levelId: 2, icon: '📐', description: 'تم اجتياز مرحلة هيكلة نموذج العمل', color: 'from-emerald-500 to-teal-500' },
  { id: 'b3', name: 'وسام التميز التقني', levelId: 3, icon: '🧪', description: 'تم بناء النسخة التجريبية للمنتج', color: 'from-indigo-500 to-purple-500' },
  { id: 'b4', name: 'وسام النمو السريع', levelId: 4, icon: '🚀', description: 'تم التحقق من قابلية التوسع', color: 'from-amber-500 to-orange-500' },
  { id: 'b5', name: 'وسام الملاءة المالية', levelId: 5, icon: '💰', description: 'تم إتمام النمذجة المالية بنجاح', color: 'from-rose-500 to-pink-500' },
  { id: 'b6', name: 'وسام النخبة الاستثمارية', levelId: 6, icon: '🏛️', description: 'المشروع جاهز كلياً للاستثمار', color: 'from-slate-600 to-slate-800' }
];

export const TASKS_CONFIG = [
  { id: 1, title: 'دراسة السوق', description: 'تحليل المنافسين وحجم السوق.' },
  { id: 2, title: 'نموذج العمل', description: 'تحديد هيكل التكاليف والإيرادات.' },
  { id: 3, title: 'النموذج التقني', description: 'بناء الميزات الجوهرية للمنتج.' },
  { id: 4, title: 'خطة النمو', description: 'تحديد قنوات الاستحواذ والنمو.' },
  { id: 5, title: 'التوقعات المالية', description: 'إعداد قوائم التدفقات النقدية.' },
  { id: 6, title: 'العرض الاستثماري', description: 'تجهيز ملف العرض النهائي.' }
];

export interface PartnerProfile {
  uid: string;
  name: string;
  email: string;
  primaryRole: 'CTO' | 'COO' | 'CMO' | 'CPO' | 'Finance';
  experienceYears: number;
  bio: string;
  linkedin: string;
  skills: string[];
  availabilityHours: number;
  commitmentType: 'Full-time' | 'Part-time' | 'Equity-only';
  city: string;
  isRemote: boolean;
  workStyle: 'Fast' | 'Structured' | 'Balanced';
  goals: 'Exit' | 'Long-term' | 'Social Impact';
  isVerified: boolean;
  profileCompletion: number;
}

export interface MatchResult {
  id: string;
  partnerUid: string;
  name: string;
  role: string;
  avatar?: string;
  scores: {
    roleFit: number;
    experienceFit: number;
    industryFit: number;
    styleFit: number;
  };
  totalScore: number;
  reason: string;
  reasoning: string[];
  risk: string;
}

export const DIGITAL_SHIELDS = [
  { id: 's1', name: 'Shield Strategy', icon: '🛡️', color: 'from-blue-500 to-indigo-500' },
  { id: 's2', name: 'Shield Tech', icon: '🛡️', color: 'from-emerald-500 to-teal-500' },
  { id: 's3', name: 'Shield Market', icon: '🛡️', color: 'from-amber-500 to-orange-500' },
];

export interface ServicePackage {
  id: string;
  name: string;
  price: string;
  features: string[];
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  packages: ServicePackage[];
}

export const SERVICES_CATALOG: ServiceItem[] = [
  {
    id: 's1',
    title: 'تصميم الهوية البصرية',
    description: 'بناء علامة تجارية احترافية تناسب طموحاتك.',
    icon: '🎨',
    packages: [
      { id: 'p1', name: 'الأساسية', price: '١٥٠٠ ريال', features: ['شعار', 'ألوان'] },
      { id: 'p2', name: 'المتكاملة', price: '٣٥٠٠ ريال', features: ['دليل هوية', 'قرطاسية'] }
    ]
  },
  {
    id: 's2',
    title: 'تطوير المنتج الأولي (MVP)',
    description: 'بناء النسخة الأولى من منتجك بأعلى المعايير.',
    icon: '💻',
    packages: [
      { id: 'p3', name: 'التقنية', price: '٨٠٠٠ ريال', features: ['تطوير ويب', 'قاعدة بيانات'] },
      { id: 'p4', name: 'الشاملة', price: '١٥٠٠٠ ريال', features: ['تطبيقات جوال', 'لوحة تحكم'] }
    ]
  }
];

export interface OpportunityAnalysis {
  newMarkets: { region: string; reasoning: string; potentialROI: string }[];
  blueOceanIdea: string;
}

export interface PartnershipRequest {
  id: string;
  startupId: string;
  startupName: string;
  partnerUid: string;
  message: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
}
