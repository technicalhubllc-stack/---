
import { GoogleGenAI, Type } from "@google/genai";
import { 
  StartupRecord, 
  PartnerProfile, 
  MatchResult
} from "../types";

const callGemini = async (params: { prompt: string; systemInstruction?: string; json?: boolean; schema?: any; model?: string }) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const config: any = {
    temperature: 0.3, 
    topP: 0.95,
  };

  if (params.systemInstruction) {
    config.systemInstruction = params.systemInstruction;
  }

  if (params.json && params.schema) {
    config.responseMimeType = "application/json";
    config.responseSchema = params.schema;
  }

  const response = await ai.models.generateContent({
    model: params.model || "gemini-3-flash-preview",
    contents: params.prompt,
    config,
  });

  if (params.json) {
    try {
      return JSON.parse(response.text || "{}");
    } catch (e) {
      console.error("JSON parse failed", response.text);
      throw e;
    }
  }

  return response.text;
};

// تحليل السوق المتعمق
export const generateMarketAnalysisAI = async (data: { sector: string; location: string; target: string }) => {
  const prompt = `القطاع: ${data.sector}\nالمنطقة المستهدفة: ${data.location}\nالجمهور المستهدف: ${data.target}`;
  return callGemini({
    model: "gemini-3-pro-preview", // Complex reasoning
    prompt,
    systemInstruction: "أنت محلل استراتيجي في شركة McKinsey. قم بإجراء تحليل سوق متعمق يشمل: 1. حجم السوق (TAM/SAM/SOM). 2. تحليل المنافسين الرئيسيين. 3. الاتجاهات المستقبلية لعام 2025. 4. الحواجز التنظيمية. اكتب التقرير بأسلوب مهني رفيع وباللغة العربية."
  });
};

// التخطيط الاستراتيجي المرن
export const generateStrategicPlanAI = async (data: { name: string; valueProp: string; revenue: string }) => {
  const prompt = `اسم المشروع: ${data.name}\nعرض القيمة: ${data.valueProp}\nنموذج الإيرادات: ${data.revenue}`;
  return callGemini({
    model: "gemini-3-pro-preview",
    prompt,
    systemInstruction: "أنت خبير في منهجية Lean Startup. قم ببناء خطة عمل استراتيجية متكاملة تتضمن: 1. تحليل BMC. 2. استراتيجية الوصول للسوق (Go-to-market). 3. الهيكل التشغيلي المقترح. 4. مؤشرات الأداء الرئيسية (KPIs). استخدم لغة اقتصادية رصينة وتنسيق Markdown."
  });
};

// وظيفة الدعم السريع الذكي
export const getQuickSupportResponseAI = async (message: string) => {
  return callGemini({
    prompt: message,
    systemInstruction: `أنت المساعد الذكي الرسمي لمنصة "بيزنس ديفلوبرز" (مسرعة أعمال افتراضية). 
    أجب باختصار واحترافية عالية وبأسلوب فخم (Corporate Luxury). 
    معلوماتك الأساسية:
    - المنصة تقدم برنامج احتضان مجاني لمدة 8 أسابيع.
    - نستخدم Gemini 3 Pro لتحليل المشاريع.
    - نوفر نظام مطابقة ذكي للشركاء المؤسسين.
    - نساعد المستثمرين الأجانب في الحصول على رخص MISA والإقامة المميزة في السعودية.
    - نركز على المخرجات العملية (MVP) والجاهزية للاستثمار.
    إذا سُئلت عن شيء خارج نطاق ريادة الأعمال والمنصة، اعتذر بلباقة ووجّه السائل لاستكشاف خدماتنا.`
  });
};

export const runSmartMatchingAlgorithmAI = async (startup: StartupRecord, partners: PartnerProfile[]): Promise<MatchResult[]> => {
  const prompt = `
    Startup Profile:
    - Name: ${startup.name}
    - Sector: ${startup.industry}
    - Business Description: ${startup.description}

    Available Partners Database:
    ${JSON.stringify(partners.slice(0, 20).map(p => ({
      uid: p.uid,
      name: p.name,
      role: p.primaryRole,
      exp: p.experienceYears,
      skills: p.skills,
      style: p.workStyle,
      bio: p.bio
    })))}

    Objective: Match the startup with top 10 potential partners. Reasoning in Arabic.
  `;

  return callGemini({
    prompt,
    systemInstruction: "Rank partners based on synergy. Return precise JSON array of 10 match objects.",
    json: true,
    schema: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          name: { type: Type.STRING },
          role: { type: Type.STRING },
          avatar: { type: Type.STRING },
          partnerUid: { type: Type.STRING }, 
          scores: {
            type: Type.OBJECT,
            properties: {
              roleFit: { type: Type.NUMBER },
              experienceFit: { type: Type.NUMBER },
              industryFit: { type: Type.NUMBER },
              styleFit: { type: Type.NUMBER }
            },
            required: ["roleFit", "experienceFit", "industryFit", "styleFit"]
          },
          totalScore: { type: Type.NUMBER },
          reason: { type: Type.STRING },
          reasoning: { type: Type.ARRAY, items: { type: Type.STRING } }, 
          risk: { type: Type.STRING } 
        },
        required: ["id", "name", "role", "scores", "totalScore", "reason"]
      }
    }
  });
};

export const evaluateTemplateAI = async (templateTitle: string, formData: any) => {
  const prompt = `Template: ${templateTitle}\nData: ${JSON.stringify(formData)}`;
  return callGemini({
    prompt,
    systemInstruction: "Evaluate the deliverable. Return JSON with score, feedback, and approved boolean.",
    json: true,
    schema: {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.NUMBER },
        feedback: { type: Type.STRING },
        approved: { type: Type.BOOLEAN }
      }
    }
  });
};

export const discoverOpportunities = async (name: string, desc: string, industry: string) => {
  const prompt = `Name: ${name}\nDesc: ${desc}\nIndustry: ${industry}`;
  return callGemini({
    prompt,
    systemInstruction: "Analyze market opportunities. Return JSON with newMarkets array and blueOceanIdea string.",
    json: true,
    schema: {
      type: Type.OBJECT,
      properties: {
        newMarkets: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { region: { type: Type.STRING }, reasoning: { type: Type.STRING }, potentialROI: { type: Type.STRING } } } },
        blueOceanIdea: { type: Type.STRING }
      }
    }
  });
};

export const suggestIconsForLevels = async () => {
  return callGemini({
    prompt: "Suggest professional icons/colors for 6 levels.",
    json: true,
    schema: {
      type: Type.OBJECT,
      properties: {
        suggestions: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.NUMBER }, icon: { type: Type.STRING }, color: { type: Type.STRING } } } }
      }
    }
  });
};

export const reviewDeliverableAI = async (title: string, desc: string, context: string) => {
  const prompt = `Deliverable: ${title}\nContext: ${context}`;
  return callGemini({
    prompt,
    systemInstruction: "Review the deliverable and return a JSON score and feedback.",
    json: true,
    schema: {
      type: Type.OBJECT,
      properties: {
        readinessScore: { type: Type.NUMBER },
        criticalFeedback: { type: Type.STRING },
        suggestedNextSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
        isReadyForHumanMentor: { type: Type.BOOLEAN }
      }
    }
  });
};

export const generateAnalyticalQuestions = async (profile: any) => {
  const prompt = `Generate 5 analytical questions for: ${JSON.stringify(profile)}`;
  return callGemini({
    prompt,
    systemInstruction: "Generate assessment questions in JSON.",
    json: true,
    schema: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          text: { type: Type.STRING },
          options: { type: Type.ARRAY, items: { type: Type.STRING } },
          correctIndex: { type: Type.NUMBER },
          difficulty: { type: Type.STRING }
        }
      }
    }
  });
};

export const evaluateProjectIdea = async (text: string, profile: any) => {
  const prompt = `Evaluate Idea: ${text}`;
  return callGemini({
    prompt,
    systemInstruction: "Perform deep SWOT. Return detailed JSON.",
    json: true,
    schema: {
      type: Type.OBJECT,
      properties: {
        totalScore: { type: Type.NUMBER },
        classification: { type: Type.STRING },
        clarity: { type: Type.NUMBER },
        value: { type: Type.NUMBER },
        innovation: { type: Type.NUMBER },
        market: { type: Type.NUMBER },
        readiness: { type: Type.NUMBER },
        strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
        weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
        aiOpinion: { type: Type.STRING }
      }
    }
  });
};

export const evaluateNominationForm = async (data: any) => {
  const prompt = `Nomination: ${JSON.stringify(data)}`;
  return callGemini({
    prompt,
    systemInstruction: "Screen application. Return JSON with aiScore, redFlags, and aiAnalysis.",
    json: true,
    schema: {
      type: Type.OBJECT,
      properties: {
        aiScore: { type: Type.NUMBER },
        redFlags: { type: Type.ARRAY, items: { type: Type.STRING } },
        aiAnalysis: { type: Type.STRING }
      }
    }
  });
};

export const runProjectAgents = async (projectName: string, description: string, agents: string[]) => {
  const prompt = `Project: ${projectName}\nDesc: ${description}\nAgents: ${agents.join(', ')}`;
  return callGemini({
    prompt,
    systemInstruction: "Simulate agents. Return JSON.",
    json: true,
    schema: {
      type: Type.OBJECT,
      properties: {
        vision: { type: Type.STRING },
        market: { type: Type.STRING },
        users: { type: Type.STRING },
        hypotheses: { type: Type.ARRAY, items: { type: Type.STRING } }
      }
    }
  });
};

export const generatePitchDeck = async (projectName: string, description: string, context: any) => {
  const prompt = `Project: ${projectName}\nDesc: ${description}\nContext: ${JSON.stringify(context)}`;
  return callGemini({
    prompt,
    systemInstruction: "Generate 10-slide pitch deck script in JSON.",
    json: true,
    schema: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          content: { type: Type.STRING }
        }
      }
    }
  });
};

// تصميم هيكل العرض الاستثماري
export const generatePitchDeckOutline = async (form: { startupName: string; problem: string; solution: string }) => {
  const prompt = `Startup: ${form.startupName}\nProblem: ${form.problem}\nSolution: ${form.solution}`;
  return callGemini({
    prompt,
    systemInstruction: "أنت خبير في الاستثمار الجريء (VC). قم بتوليد هيكل استراتيجي لعرض تقديمي (Pitch Deck) مكون من 7 شرائح أساسية (المشكلة، الحل، السوق، نموذج العمل، الفريق، المنافسة، الطلب). استخدم لغة مقنعة وباللغة العربية وتنسيق Markdown."
  });
};

export const analyzeExportOpportunity = async (data: any) => {
  const prompt = `Export Data: ${JSON.stringify(data)}`;
  return callGemini({
    prompt,
    systemInstruction: "Analyze export potential. Return decision JSON.",
    json: true,
    schema: {
      type: Type.OBJECT,
      properties: {
        decision: { type: Type.STRING },
        analysis: { type: Type.OBJECT, properties: { demand: { type: Type.STRING }, regulations: { type: Type.STRING }, risks: { type: Type.STRING }, seasonality: { type: Type.STRING } } },
        recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
      }
    }
  });
};

export const simulateBrutalTruth = async (data: any) => {
  const prompt = `Business Idea: ${JSON.stringify(data)}`;
  return callGemini({
    prompt,
    systemInstruction: "Act as brutal VC. Return failure analysis JSON.",
    json: true,
    schema: {
      type: Type.OBJECT,
      properties: {
        brutalTruth: { type: Type.STRING },
        probability: { type: Type.NUMBER },
        financialLoss: { type: Type.STRING },
        operationalImpact: { type: Type.STRING },
        missingQuestions: { type: Type.ARRAY, items: { type: Type.STRING } },
        recoveryPlan: { type: Type.ARRAY, items: { type: Type.STRING } }
      }
    }
  });
};

export const getGovInsights = async () => {
  return callGemini({
    prompt: "Macro insights for gov.",
    json: true,
    schema: {
      type: Type.OBJECT,
      properties: {
        riskyMarkets: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, failRate: { type: Type.NUMBER } } } },
        readySectors: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, score: { type: Type.NUMBER } } } },
        commonFailReasons: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { reason: { type: Type.STRING }, percentage: { type: Type.NUMBER } } } },
        regulatoryGaps: { type: Type.ARRAY, items: { type: Type.STRING } }
      }
    }
  });
};

export const generateStartupIdea = async (form: { sector: string; interest: string }) => {
  const prompt = `Sector: ${form.sector}\nInterests: ${form.interest}`;
  return callGemini({ prompt, systemInstruction: "Generate 3 innovative ideas in Markdown." });
};

export const generateFounderCV = async (form: any) => {
  const prompt = `Founder Profile: ${JSON.stringify(form)}`;
  return callGemini({ prompt, systemInstruction: "Write professional CV summary in Markdown." });
};

export const generateProductSpecs = async (form: { projectName: string; description: string }) => {
  const prompt = `Project: ${form.projectName}\nDesc: ${form.description}`;
  return callGemini({ prompt, systemInstruction: "Define MVP specs in Markdown." });
};

export const createPathFinderChat = () => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  return ai.chats.create({
    model: "gemini-3-flash-preview",
    config: { systemInstruction: "Professional business advisor guide. Finally return JSON block with decision." }
  });
};
