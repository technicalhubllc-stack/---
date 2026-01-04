
export type UserRole = 'STARTUP' | 'PARTNER' | 'MENTOR' | 'ADMIN';
export type ProjectTrack = 'Idea' | 'Prototype' | 'Product' | 'MVP' | 'Growth' | 'Investment Ready';
export type TaskStatus = 'LOCKED' | 'ASSIGNED' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';

export type TicketType = 'INQUIRY' | 'COMPLAINT' | 'SUPPORT';
export type TicketStatus = 'PENDING' | 'IN_PROGRESS' | 'RESOLVED';

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
  kpiHistory?: KPIRecord[];
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
}

export const INITIAL_ROADMAP: LevelData[] = [
  { 
    id: 1, 
    title: 'التحقق الاستراتيجي', 
    description: 'تحديد الجدوى من حل المشكلة والتحقق من فرضيات العميل.', 
    icon: '🎯', 
    imageUrl: 'https://images.unsplash.com/photo-1454165833767-13143891bb39?auto=format&fit=crop&q=80&w=600', 
    isLocked: false, 
    isCompleted: false, 
    customColor: 'أزرق',
    complexity: 'Medium',
    estimatedTime: '٤ دورات',
    pillars: [
      { title: 'تحليل الفجوات', description: 'تحديد نقاط الضعف في الحلول الحالية.', icon: '🔍' },
      { title: 'هيكلة القيمة', description: 'صياغة العرض القيمي الجوهري.', icon: '💎' }
    ],
    quiz: [
      { question: "ما هو الهدف من اكتشاف العميل؟", options: ["البيع المباشر", "التحقق من الألم", "جمع التبرعات"], correctIndex: 1 }
    ]
  },
  { 
    id: 2, 
    title: 'هيكلة نموذج العمل', 
    description: 'تصميم محرك الإيرادات والقيمة لضمان استدامة الكيان.', 
    icon: '📐', 
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=600', 
    isLocked: false, 
    isCompleted: false, 
    customColor: 'أخضر',
    complexity: 'High',
    estimatedTime: '٦ دورات',
    pillars: [
      { title: 'مخطط الـ BMC', description: 'رسم الهيكل التشغيلي والمالي.', icon: '📐' },
      { title: 'مصادر الدخل', description: 'تحديد قنوات التدفقات النقدية.', icon: '💰' }
    ]
  },
  { 
    id: 3, 
    title: 'هندسة المنتج (MVP)', 
    description: 'بناء النسخة الوظيفية الأولى القابلة للاختبار الميداني.', 
    icon: '⚡', 
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600', 
    isLocked: false, 
    isCompleted: false, 
    customColor: 'بنفسجي',
    complexity: 'Elite',
    estimatedTime: '٨ دورات',
    pillars: [
      { title: 'ترتيب الأولويات', description: 'اختيار الميزات الجوهرية فقط.', icon: '🎯' },
      { title: 'تجربة المستخدم', description: 'تصميم رحلة عميل سلسة.', icon: '📱' }
    ]
  },
  { 
    id: 4, 
    title: 'تحليل الجدوى والنمو', 
    description: 'دراسة حجم السوق ووضع خطط الاستحواذ والتوسع الإقليمي.', 
    icon: '🌍', 
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827?auto=format&fit=crop&q=80&w=600', 
    isLocked: false, 
    isCompleted: false, 
    customColor: 'برتقالي',
    complexity: 'Medium',
    estimatedTime: '٥ دورات',
    pillars: [
      { title: 'تحليل المنافسين', description: 'رسم خريطة التنافس والتميز.', icon: '🕵️' },
      { title: 'استراتيجية النمو', description: 'خارطة طريق للتوسع الأفقي.', icon: '🚀' }
    ],
    quiz: [
      { question: "ماذا يمثل الـ TAM؟", options: ["إجمالي السوق المتاح", "السوق المستهدف فعلياً", "عدد الموظفين"], correctIndex: 0 }
    ]
  },
  { 
    id: 5, 
    title: 'النمذجة المالية', 
    description: 'التوقعات المالية الدقيقة ونقطة التعادل وجاهزية التدفقات.', 
    icon: '💹', 
    imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=600', 
    isLocked: false, 
    isCompleted: false, 
    customColor: 'ذهبي',
    complexity: 'High',
    estimatedTime: '٦ دورات',
    pillars: [
      { title: 'قائمة الدخل', description: 'توقع الأرباح لـ ٣ سنوات.', icon: '📊' },
      { title: 'نقطة التعادل', description: 'متى سيغطي المشروع تكاليفه؟', icon: '⚖️' }
    ],
    quiz: [
      { question: "ما هو معدل الحرق (Burn Rate)؟", options: ["سرعة إنفاق السيولة شهرياً", "معدل زيادة العملاء", "تكلفة المنتج"], correctIndex: 0 }
    ]
  },
  { 
    id: 6, 
    title: 'جاهزية الاستثمار', 
    description: 'إعداد العرض التقديمي النهائي والتحضير للجان الاستثمار VC.', 
    icon: '🏆', 
    imageUrl: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80&w=600', 
    isLocked: false, 
    isCompleted: false, 
    customColor: 'سحابي',
    complexity: 'Elite',
    estimatedTime: '٧ دورات',
    pillars: [
      { title: 'العرض التقديمي', description: 'تصميم Pitch Deck احترافي.', icon: '📽️' },
      { title: 'إدارة المفاوضات', description: 'فهم الـ Term Sheet.', icon: '📄' }
    ],
    quiz: [
      { question: "ما هو الـ Term Sheet؟", options: ["عقد توظيف", "مذكرة شروط الاستثمار الأساسية", "فاتورة ضريبية"], correctIndex: 1 }
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
  { id: 'b1', name: 'وسام التحقق', levelId: 1, icon: '🎯', description: 'تم اجتياز مرحلة التحقق الاستراتيجي', color: 'from-blue-500 to-indigo-500' },
  { id: 'b2', name: 'وسام نموذج العمل', levelId: 2, icon: '📐', description: 'تم اجتياز مرحلة هيكلة نموذج العمل', color: 'from-emerald-500 to-teal-500' },
  { id: 'b3', name: 'وسام التميز التقني', levelId: 3, icon: '⚡', description: 'تم بناء النسخة التجريبية للمنتج', color: 'from-indigo-500 to-purple-500' },
  { id: 'b4', name: 'وسام النمو السريع', levelId: 4, icon: '🌍', description: 'تم التحقق من قابلية التوسع', color: 'from-amber-500 to-orange-500' },
  { id: 'b5', name: 'وسام الملاءة المالية', levelId: 5, icon: '💹', description: 'تم إتمام النمذجة المالية بنجاح', color: 'from-rose-500 to-pink-500' },
  { id: 'b6', name: 'وسام النخبة الاستثمارية', levelId: 6, icon: '🏆', description: 'المشروع جاهز كلياً للاستثمار', color: 'from-slate-600 to-slate-800' }
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

export interface ProgramRating {
  stars: number;
  feedback: string;
  favoriteFeature: string;
  submittedAt: string;
}

export type ProjectStageType = 'Idea' | 'Prototype' | 'Product';
export type TechLevelType = 'Low' | 'Medium' | 'High';

export interface ApplicantProfile {
  codeName: string;
  projectStage: ProjectStageType;
  sector: string;
  goal: string;
  techLevel: TechLevelType;
}

export interface PersonalityQuestion {
  id: number;
  situation: string;
  options: { text: string; style: string }[];
}

export interface AnalyticalQuestion {
  text: string;
  options: string[];
  correctIndex: number;
  difficulty: string;
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
  score: number;
  isQualified: boolean;
  metrics: RadarMetrics;
  leadershipStyle: string;
  badges: Badge[];
  projectEval?: ProjectEvaluationResult;
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

export type AgentCategory = 'Vision' | 'Market' | 'User' | 'Opportunity';

export interface AIAgent {
  id: string;
  name: string;
  category: AgentCategory;
  description: string;
}

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

export const AVAILABLE_AGENTS: AIAgent[] = [
  { id: 'v1', name: 'محلل الرؤية', category: 'Vision', description: 'يصيغ الرؤية الاستراتيجية للمشروع.' },
  { id: 'm1', name: 'خبير السوق', category: 'Market', description: 'يحلل اتجاهات السوق وحجم الفرص.' },
  { id: 'u1', name: 'مصمم الفئات', category: 'User', description: 'يحدد شرائح المستخدمين المستهدفة.' },
  { id: 'o1', name: 'كاشف الفرص', category: 'Opportunity', description: 'يستكشف الفجوات البيضاء في المنافسة.' },
];

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

export interface ActivityLogRecord {
  id: string;
  event: string;
  type: string;
  date: string;
  score?: string;
  color: string;
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
  demoUrl?: string;
  currentResources?: string[];
  tractionEvidence?: string[];
}

export interface NominationResult {
  totalScore: number;
  category: 'DIRECT_ADMISSION' | 'INTERVIEW' | 'PRE_INCUBATION' | 'REJECTION';
  redFlags: string[];
  aiAnalysis: string;
}

export interface MentorProfile {
  id: string;
  name: string;
  role: string;
  company: string;
  specialty: 'Tech' | 'Finance' | 'Growth' | 'Legal' | 'Strategy';
  bio: string;
  experience: number;
  avatar: string;
  rating: number;
  tags: string[];
}

export interface TemplateField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'number';
  placeholder: string;
  instruction: string;
}

export interface Template {
  id: string;
  title: string;
  description: string;
  icon: string;
  isMandatory: boolean;
  role: UserRole[];
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
    id: 't1',
    title: 'مصفوفة الـ SWOT',
    description: 'تحليل نقاط القوة والضعف والفرص والتهديدات للمشروع.',
    icon: '📊',
    isMandatory: true,
    role: ['STARTUP'],
    toolTipPurpose: 'فهم العوامل الداخلية والخارجية التي تؤثر على استمرارية مشروعك.',
    toolTipLogic: 'محرك Gemini يحلل الترابط بين الفرص ونقاط القوة لتعظيم الأثر.',
    fields: [
      { id: 'strengths', label: 'نقاط القوة', type: 'textarea', placeholder: 'مثال: فريق تقني خبير', instruction: 'اذكر المزايا التنافسية الداخلية.' },
      { id: 'weaknesses', label: 'نقاط الضعف', type: 'textarea', placeholder: 'مثال: نقص التمويل الحالي', instruction: 'اذكر الثغرات التي تحتاج معالجة.' }
    ]
  },
  {
    id: 't2',
    title: 'مخطط نموذج العمل (BMC)',
    description: 'الهيكل الكامل لكيفية خلق القيمة وتحقيق الإيرادات.',
    icon: '📐',
    isMandatory: true,
    role: ['STARTUP'],
    toolTipPurpose: 'رسم خريطة طريق لكيفية عمل الشركة وتحويل القيمة إلى أرباح.',
    toolTipLogic: 'يتم فحص التوافق بين "شرائح العملاء" و"القيمة المقترحة" لضمان الملاءمة.',
    fields: [
      { id: 'vp', label: 'القيمة المقترحة', type: 'textarea', placeholder: 'ما الذي يجعل حلك فريداً؟', instruction: 'ركز على الفوائد لا الميزات.' },
      { id: 'segments', label: 'شرائح العملاء', type: 'textarea', placeholder: 'من هم عملاؤك بدقة؟', instruction: 'حدد الفئات الديموغرافية والسلوكية.' },
      { id: 'revenue', label: 'مصادر الإيرادات', type: 'textarea', placeholder: 'كيف ستجني المال؟', instruction: 'حدد نماذج التسعير (اشتراك، عمولة، إلخ).' }
    ]
  },
  {
    id: 't3',
    title: 'هيكل العرض الاستثماري',
    description: 'تجهيز الشرائح الأساسية لإقناع المستثمرين بالتمويل.',
    icon: '💎',
    isMandatory: false,
    role: ['STARTUP'],
    toolTipPurpose: 'بناء قصة مقنعة ومختصرة تجذب انتباه رؤوس الأموال الجريئة.',
    toolTipLogic: 'يتم تقييم قوة "المشكلة" وجاذبية "حجم السوق" وفق معايير الـ VC.',
    fields: [
      { id: 'problem_slide', label: 'شريحة المشكلة', type: 'textarea', placeholder: 'وصف الألم السوقي...', instruction: 'اجعلها عاطفية ومدعومة بأرقام.' },
      { id: 'solution_slide', label: 'شريحة الحل', type: 'textarea', placeholder: 'كيف ينهي منتجك المعاناة؟', instruction: 'بساطة العرض هي السر.' },
      { id: 'ask', label: 'شريحة الطلب (The Ask)', type: 'textarea', placeholder: 'كم تحتاج من تمويل؟', instruction: 'حدد المبلغ وكيفية صرفه.' }
    ]
  },
  {
    id: 't4',
    title: 'التوقعات المالية التقديرية',
    description: 'دراسة مبدئية للإيرادات والمصاريف المتوقعة لـ ١٢ شهر.',
    icon: '💹',
    isMandatory: true,
    role: ['STARTUP'],
    toolTipPurpose: 'التنبؤ بالاحتياجات المالية ونقطة التعادل (Break-even).',
    toolTipLogic: 'خوارزمية التحليل المالي تتأكد من منطقية هوامش الربح وتكاليف الاستحواذ.',
    fields: [
      { id: 'cac', label: 'تكلفة الاستحواذ (CAC)', type: 'number', placeholder: 'كم يكلف جذب عميل واحد؟', instruction: 'تقدير ميزانية التسويق مقسومة على العملاء.' },
      { id: 'burn', label: 'معدل الحرق الشهري', type: 'number', placeholder: 'إجمالي المصاريف الشهرية الثابتة', instruction: 'رواتب، إيجار، تقنية...' }
    ]
  }
];

export interface PartnershipRequest {
  id: string;
  startupId: string;
  startupName: string;
  partnerUid: string;
  message: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
}
