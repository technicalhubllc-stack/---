
import { GoogleGenAI, Type } from "@google/genai";
import { 
  StartupRecord, 
  PartnerProfile, 
  MatchResult
} from "../types";

const callGemini = async (params: { prompt: string; systemInstruction?: string; json?: boolean; schema?: any; model?: string }) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const config: any = {
    temperature: 0.4, 
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

// إنشاء خطة عمل احترافية متكاملة
export const generateFullBusinessPlanAI = async (data: { 
  name: string; 
  problem: string; 
  solution: string; 
  audience: string;
  revenue: string;
}) => {
  const prompt = `
    بيانات المشروع:
    - الاسم: ${data.name}
    - المشكلة: ${data.problem}
    - الحل المقترح: ${data.solution}
    - الجمهور المستهدف: ${data.audience}
    - نموذج الربح: ${data.revenue}
  `;

  return callGemini({
    model: "gemini-3-pro-preview",
    prompt,
    systemInstruction: `أنت كبير مستشاري استراتيجية في شركة استشارات عالمية (MBB). 
    بناءً على المعطيات، قم بتوليد خطة عمل استراتيجية (Business Plan) تتكون من:
    1. ملخص تنفيذي (Executive Summary): صياغة قوية تلخص جوهر الفرصة.
    2. تحليل السوق (Market Analysis): تفصيل لحجم السوق المتوقع (TAM/SAM/SOM) وتحليل المنافسين.
    3. استراتيجية النمو (Growth Strategy): قنوات الاستحواذ والتوسع.
    4. التوقعات المالية (Financial Projections): تقديرات منطقية للدخل والتكاليف لـ 3 سنوات بأسلوب جدولي.
    استخدم تنسيق Markdown احترافي، لغة عربية اقتصادية رصينة، ونبرة واثقة ومحفزة للمستثمرين.`
  });
};

// الوظائف السابقة
export const generateMarketAnalysisAI = async (data: { sector: string; location: string; target: string }) => {
  const prompt = `القطاع: ${data.sector}\nالمنطقة: ${data.location}\nالجمهور: ${data.target}`;
  return callGemini({
    model: "gemini-3-pro-preview",
    prompt,
    systemInstruction: "أنت محلل سوق استراتيجي. قم بإجراء تحليل معمق للمنافسين والاتجاهات لعام 2025 باللغة العربية."
  });
};

export const generateStrategicPlanAI = async (data: { name: string; valueProp: string; revenue: string }) => {
  const prompt = `المشروع: ${data.name}\nالقيمة: ${data.valueProp}\nالربح: ${data.revenue}`;
  return callGemini({
    model: "gemini-3-pro-preview",
    prompt,
    systemInstruction: "أنت خبير Lean Startup. قم ببناء مخطط نموذج عمل استراتيجي متكامل باللغة العربية."
  });
};

export const getQuickSupportResponseAI = async (message: string) => {
  return callGemini({
    prompt: message,
    systemInstruction: "أنت المساعد الذكي لمسرعة أعمال 'بيزنس ديفلوبرز'. أجب باختصار واحترافية وبأسلوب فخم باللغة العربية."
  });
};

export const runSmartMatchingAlgorithmAI = async (startup: StartupRecord, partners: PartnerProfile[]): Promise<MatchResult[]> => {
  const prompt = `Startup: ${startup.name}. Industry: ${startup.industry}. Desc: ${startup.description}. Available Partners: ${JSON.stringify(partners.slice(0, 20))}`;
  return callGemini({
    prompt,
    systemInstruction: "Match startups with top 10 potential partners. Return JSON array.",
    json: true,
    schema: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          name: { type: Type.STRING },
          role: { type: Type.STRING },
          totalScore: { type: Type.NUMBER },
          reason: { type: Type.STRING },
          scores: { type: Type.OBJECT, properties: { roleFit: { type: Type.NUMBER }, experienceFit: { type: Type.NUMBER }, industryFit: { type: Type.NUMBER }, styleFit: { type: Type.NUMBER } } }
        }
      }
    }
  });
};

export const reviewDeliverableAI = async (title: string, desc: string, context: string) => {
  const prompt = `Deliverable: ${title}\nContext: ${context}`;
  return callGemini({
    prompt,
    systemInstruction: "Review deliverable and return JSON score and feedback.",
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

export const evaluateTemplateAI = async (templateTitle: string, formData: any) => {
  const prompt = `Template: ${templateTitle}\nData: ${JSON.stringify(formData)}`;
  return callGemini({
    prompt,
    systemInstruction: "Evaluate deliverable JSON score and feedback.",
    json: true,
    schema: {
      type: Type.OBJECT,
      properties: { score: { type: Type.NUMBER }, feedback: { type: Type.STRING }, approved: { type: Type.BOOLEAN } }
    }
  });
};

export const discoverOpportunities = async (name: string, desc: string, industry: string) => {
  const prompt = `Startup: ${name}, Industry: ${industry}`;
  return callGemini({
    prompt,
    systemInstruction: "Analyze opportunities JSON.",
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
    prompt: "Suggest icons/colors JSON for 6 levels.",
    json: true,
    schema: {
      type: Type.OBJECT,
      properties: {
        suggestions: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.NUMBER }, icon: { type: Type.STRING }, color: { type: Type.STRING } } } }
      }
    }
  });
};

export const generateAnalyticalQuestions = async (profile: any) => {
  const prompt = `Questions for: ${JSON.stringify(profile)}`;
  return callGemini({
    prompt,
    systemInstruction: "Generate 5 questions JSON.",
    json: true,
    schema: {
      type: Type.ARRAY,
      items: { type: Type.OBJECT, properties: { text: { type: Type.STRING }, options: { type: Type.ARRAY, items: { type: Type.STRING } }, correctIndex: { type: Type.NUMBER }, difficulty: { type: Type.STRING } } }
    }
  });
};

export const evaluateProjectIdea = async (text: string, profile: any) => {
  const prompt = `Evaluate Idea: ${text}`;
  return callGemini({
    prompt,
    systemInstruction: "Deep SWOT JSON.",
    json: true,
    schema: {
      type: Type.OBJECT,
      properties: {
        totalScore: { type: Type.NUMBER }, classification: { type: Type.STRING }, clarity: { type: Type.NUMBER }, value: { type: Type.NUMBER }, innovation: { type: Type.NUMBER }, market: { type: Type.NUMBER }, readiness: { type: Type.NUMBER }, strengths: { type: Type.ARRAY, items: { type: Type.STRING } }, weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } }, aiOpinion: { type: Type.STRING }
      }
    }
  });
};

export const evaluateNominationForm = async (data: any) => {
  const prompt = `Nomination: ${JSON.stringify(data)}`;
  return callGemini({
    prompt,
    systemInstruction: "Application screen JSON.",
    json: true,
    schema: {
      type: Type.OBJECT,
      properties: { aiScore: { type: Type.NUMBER }, redFlags: { type: Type.ARRAY, items: { type: Type.STRING } }, aiAnalysis: { type: Type.STRING } }
    }
  });
};

export const runProjectAgents = async (projectName: string, description: string, agents: string[]) => {
  const prompt = `Project: ${projectName}`;
  return callGemini({
    prompt,
    systemInstruction: "Agent simulation JSON.",
    json: true,
    schema: {
      type: Type.OBJECT,
      properties: { vision: { type: Type.STRING }, market: { type: Type.STRING }, users: { type: Type.STRING }, hypotheses: { type: Type.ARRAY, items: { type: Type.STRING } } }
    }
  });
};

export const generatePitchDeck = async (projectName: string, description: string, context: any) => {
  const prompt = `Deck for: ${projectName}`;
  return callGemini({
    prompt,
    systemInstruction: "10-slide deck JSON.",
    json: true,
    schema: {
      type: Type.ARRAY,
      items: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, content: { type: Type.STRING } } }
    }
  });
};

export const generatePitchDeckOutline = async (form: { startupName: string; problem: string; solution: string }) => {
  const prompt = `Startup: ${form.startupName}`;
  return callGemini({
    prompt,
    systemInstruction: "Generate 7-slide pitch deck outline in Markdown Arabic."
  });
};

export const analyzeExportOpportunity = async (data: any) => {
  const prompt = `Export Data: ${JSON.stringify(data)}`;
  return callGemini({
    prompt,
    systemInstruction: "Export potential JSON.",
    json: true,
    schema: {
      type: Type.OBJECT,
      properties: { decision: { type: Type.STRING }, analysis: { type: Type.OBJECT, properties: { demand: { type: Type.STRING }, regulations: { type: Type.STRING }, risks: { type: Type.STRING }, seasonality: { type: Type.STRING } } }, recommendations: { type: Type.ARRAY, items: { type: Type.STRING } } }
    }
  });
};

export const simulateBrutalTruth = async (data: any) => {
  const prompt = `Idea: ${JSON.stringify(data)}`;
  return callGemini({
    prompt,
    systemInstruction: "Brutal failure analysis JSON.",
    json: true,
    schema: {
      type: Type.OBJECT,
      properties: { brutalTruth: { type: Type.STRING }, probability: { type: Type.NUMBER }, financialLoss: { type: Type.STRING }, operationalImpact: { type: Type.STRING }, missingQuestions: { type: Type.ARRAY, items: { type: Type.STRING } }, recoveryPlan: { type: Type.ARRAY, items: { type: Type.STRING } } }
    }
  });
};

export const getGovInsights = async () => {
  return callGemini({
    prompt: "Macro insights for gov JSON.",
    json: true,
    schema: {
      type: Type.OBJECT,
      properties: { riskyMarkets: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, failRate: { type: Type.NUMBER } } } }, readySectors: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, score: { type: Type.NUMBER } } } }, commonFailReasons: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { reason: { type: Type.STRING }, percentage: { type: Type.NUMBER } } } }, regulatoryGaps: { type: Type.ARRAY, items: { type: Type.STRING } } }
    }
  });
};

export const generateStartupIdea = async (form: { sector: string; interest: string }) => {
  const prompt = `Sector: ${form.sector}`;
  return callGemini({ prompt, systemInstruction: "Generate 3 innovative ideas Markdown Arabic." });
};

export const generateFounderCV = async (form: any) => {
  const prompt = `CV: ${JSON.stringify(form)}`;
  return callGemini({ prompt, systemInstruction: "Write professional CV Markdown Arabic." });
};

export const generateProductSpecs = async (form: { projectName: string; description: string }) => {
  const prompt = `Specs for: ${form.projectName}`;
  return callGemini({ prompt, systemInstruction: "Define MVP specs Markdown Arabic." });
};

export const createPathFinderChat = () => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  return ai.chats.create({
    model: "gemini-3-flash-preview",
    config: { systemInstruction: "Professional advisor. Finally return JSON block." }
  });
};
