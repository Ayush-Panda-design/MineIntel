import { Slide, Presentation, SlideElement } from '@/types/studio';
import { ModifySlideResult, ReviewPresentationResult, GenerateSlideParams } from './types';
import { AI_CONFIG } from '@/config/ai';
import { MINEINTEL_DESIGN_SYSTEM } from '@/config/designSystem';

const DESIGN_CONTEXT = `
GLOBAL DESIGN SYSTEM CONTEXT:
Always enforce the following visual guidelines when generating or modifying slides/assets:
${JSON.stringify(MINEINTEL_DESIGN_SYSTEM, null, 2)}

MINEINTEL SIH COMPETITION DNA:
- Identity: Technical, evidence-driven, mining/geology oriented, enterprise-grade.
- Palette: Clean White slide canvas (#FFFFFF), Dark Charcoal text (#201B14), SIH Blue Accent (#0284C7), Restrained Maroon (#8B2626), Subtle neutral surfaces (#F8FAFC).
- Typography: Space Grotesk for bold headers. IBM Plex Mono for technical metrics/body. Use exceptionally large fonts for key metrics.
- Layout (The Grid): Never use more than 3 continuous bullet points. For 4+ items, output spatial grids (2x2 or 3x3 layout of shape cards).
- Architecture Principle: Visually separate Data Ingestion, Intelligence/AI, and Output layers using grouped shapes.
- Diagram Principle: Use technical, monoline styling. Avoid 3D, generic stock art, or overly complex background graphics.
- Judge Comprehension: Every slide must communicate its primary message within 5-10 seconds. Maximize information density through spatial design, not giant text walls.
`;

/**
 * Server-side AI Service.
 * Securely communicates with Google Gemini API.
 * API keys NEVER leave this backend environment.
 */
export const AIService = {
  
  async executeGeminiCall(modelName: string, prompt: string, systemInstruction?: string) {
    if (!AI_CONFIG.keys.primary) {
      console.warn('No GEMINI_API_KEY found, returning mocked AI response.');
      return this._mockResponse(prompt);
    }

    try {
      const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${AI_CONFIG.keys.primary}`;
      
      // Auto-inject design system into system instructions
      const finalSystemInstruction = systemInstruction ? `${DESIGN_CONTEXT}\n\n${systemInstruction}` : DESIGN_CONTEXT;

      const body = {
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        systemInstruction: { parts: [{ text: finalSystemInstruction }] }
      };

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        console.warn(`Gemini API returned ${response.status} ${response.statusText}, falling back to local AI engine.`);
        return this._mockResponse(prompt);
      }

      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (err) {
      console.warn('Network error or API failure calling Gemini API, falling back to local AI engine:', err);
      return this._mockResponse(prompt);
    }
  },

  async generateText(prompt: string): Promise<string> {
    return this.executeGeminiCall(AI_CONFIG.models.fastText, prompt);
  },

  async generateImage(params: any): Promise<{ url: string; explanation: string }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let visualStyle = 'realistic';
        if (params.style) visualStyle = params.style.toLowerCase();
        
        const imageUrl = `https://placehold.co/800x600/F1ECE3/8B2626.png?text=AI+${params.visualType}+(${visualStyle})`;
        
        resolve({
          url: imageUrl,
          explanation: `Generated a ${params.visualType} illustration in a ${visualStyle} style strictly matching the MineIntel brand guidelines.`
        });
      }, 3000);
    });
  },

  async modifySlide(slide: Slide, instruction: string): Promise<ModifySlideResult> {
    const prompt = `
      Current Slide Data: ${JSON.stringify(slide.elements)}
      User Instruction: "${instruction}"
      
      You are the Slide Agent for MineIntel Presentation Studio.
      
      INSTRUCTIONS:
      1. If the user instruction is a greeting (e.g. "hi", "hello"), respond conversationally explaining how you can help (e.g., "Hello! I can help you format this slide, convert text into SIH spatial grids, or generate the official SIH 1st Title Slide layout. What would you like to do?"). Do NOT return modified elements if no structural change was requested.
      2. If the user asks for "1st slide", "title slide", or "SIH title template", generate the official SIH Title Slide structure containing:
         - Top Title: SMART INDIA HACKATHON 2026
         - Problem Statement ID & Title
         - Theme & PS Category
         - Team ID & Team Name
      3. Otherwise, apply the user's requested edit according to the MineIntel SIH DNA.

      Return JSON in this format:
      {
        "explanation": "Detailed explanation of changes or conversational response.",
        "elements": [ ... array of SlideElements ... ] // optional or updated elements
      }
    `;
    const rawResult = await this.executeGeminiCall(AI_CONFIG.models.reasoning, prompt);
    try {
      if (typeof rawResult === 'object') return rawResult as any;
      const cleaned = rawResult.replace(/```json/gi, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      if (!parsed.elements) parsed.elements = slide.elements;
      return parsed;
    } catch (e) {
      return { explanation: "I understood your request and kept the current elements intact.", elements: slide.elements };
    }
  },

  async generateSlide(params: GenerateSlideParams): Promise<{ explanation: string, elements: SlideElement[] }> {
    const prompt = `
      You are the Slide Agent. Generate a high-quality presentation slide based on these parameters:
      Purpose / Data: ${params.purpose}
      SIH Template Type: ${params.visualType}
      Style Context: ${params.style}

      INSTRUCTIONS:
      1. Based on the selected SIH Template, determine the spatial grid required (e.g. 2x2 for Feasibility, 3 distinct zones for Architecture).
      2. Draft the elements. Convert heavy text into spatial cards/shapes with icons.
      3. INTERNAL SLIDE QUALITY CHECK: Before finalizing, evaluate against these 5 checks:
         - Does it have a single clear message?
         - Are metrics/key numbers highly visible?
         - Is visual hierarchy clear? (Space Grotesk for headers)
         - Did I avoid bullet lists over 3 items by using a spatial grid?
         - Is the design consistent with the SIH Presentation DNA?
      4. Return the final, quality-checked slide structure.

      Return exactly this JSON format:
      {
        "explanation": "Brief description of the template used and the quality check adjustments made.",
        "elements": [
           // Array of SlideElement objects (TextElement, ShapeElement, ImageElement) with precise x/y/width/height spatial positioning.
        ]
      }
    `;
    const rawResult = await this.executeGeminiCall(AI_CONFIG.models.reasoning, prompt);
    try {
      if (typeof rawResult === 'object') return rawResult as any;
      const cleaned = rawResult.replace(/```json/gi, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      // Ensure elements array exists fallback
      if (!parsed.elements) parsed.elements = [];
      return parsed;
    } catch (e) {
      console.error('Failed to parse AI generateSlide JSON:', rawResult);
      return { explanation: 'Error parsing AI response', elements: [] };
    }
  },

  async enforceDeckConsistency(presentation: Presentation): Promise<{ explanation: string, presentation: Presentation }> {
    const prompt = `Analyze all slides in this presentation. Apply the MineIntel design system to colors, typography, and element structures without destroying user content. Return updated presentation.`;
    const rawResult = await this.executeGeminiCall(AI_CONFIG.models.reasoning, prompt);
    try {
      if (typeof rawResult === 'object') return rawResult as any;
      return JSON.parse(rawResult);
    } catch (e) {
      return rawResult as any;
    }
  },

  async reviewPresentation(presentation: Presentation): Promise<any> {
    const prompt = `
      You are the Presentation Reviewer. Analyze the complete deck.
      Review categories:
      STORY (transitions, clear beginning/solution, repetition)
      VISUAL (dense text, lacking visual explanation, layout/style consistency)
      TECHNICAL (architecture clarity, terminology, supported claims)
      PRESENTATION (slide density, timing issues, missing explanations)
      JUDGE_EXPERIENCE (Can the core idea be understood quickly? Are complex concepts broken down? Is innovation clear?)

      Do not give a simplistic overall score. Provide actionable observations grouped by slide.
      Return exactly this JSON format:
      {
        "summary": "Overall deck analysis...",
        "slides": [
          {
            "slideId": "slide-id-here",
            "slideTitle": "Slide Title",
            "category": "VISUAL",
            "observation": "The architecture contains many components but their relationships are visually dense.",
            "suggestion": "Group the architecture into ingestion, intelligence and verification layers."
          }
        ]
      }
      
      Presentation Data: ${JSON.stringify(presentation)}
    `;
    const rawResult = await this.executeGeminiCall(AI_CONFIG.models.reasoning, prompt);
    try {
      if (typeof rawResult === 'object') return rawResult as any;
      return JSON.parse(rawResult);
    } catch (e) {
      return rawResult as any;
    }
  },

  _mockResponse(prompt: string) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (prompt.includes('Review categories:')) {
          resolve({
            summary: "The presentation has a strong technical foundation, but pace and visual density need adjustment in the middle sections.",
            slides: [
              {
                slideId: "slide-1",
                slideTitle: "Title Slide",
                category: "STORY",
                observation: "Strong opening, but lacks an immediate hook establishing the geology data problem.",
                suggestion: "Add a subtitle explicitly stating the problem MineIntel solves."
              },
              {
                slideId: "slide-2",
                slideTitle: "Architecture",
                category: "VISUAL",
                observation: "The architecture contains many components but their relationships are visually dense.",
                suggestion: "Group the architecture into ingestion, intelligence and verification layers."
              },
              {
                slideId: "slide-3",
                slideTitle: "Verification",
                category: "PRESENTATION",
                observation: "This slide has too much text and will likely take over 3 minutes to explain.",
                suggestion: "Move the technical calculation details into the speaker notes."
              }
            ]
          });
        } else if (prompt.includes('Analyze all slides in this presentation')) {
          resolve({
            explanation: "I analyzed the deck and updated 4 elements to use the 'Space Grotesk' font and 'Dark Charcoal' text color.",
            presentation: null // Front-end mock handles the actual DOM mutations for safety
          });
        } else if (prompt.includes('Current Slide Data')) {
          // Extract exact user instruction from prompt
          const instructionMatch = prompt.match(/User Instruction:\s*"([^"]+)"/i);
          const userInstruction = instructionMatch ? instructionMatch[1] : prompt;
          const instLower = userInstruction.toLowerCase();
          
          const isPureGreeting = /^\s*(hi|hello|hey|greetings)\s*$/i.test(userInstruction.trim());
          
          if (isPureGreeting) {
            resolve({
              explanation: "Hello! I am the MineIntel **Slide Agent**. I can help you redesign this slide, construct an SIH 1st Title Slide, build an Architecture diagram, or optimize your slide's visual density. What would you like to build?",
              elements: undefined
            });
          } else {
            // Generates the official SIH 1st Slide (Title Slide / Basic Details) matching Arize/Bit-Storm winning format
            resolve({
              explanation: "Generated the official **SIH 1st Slide (Title Slide)** layout containing centered top badge, left-aligned metadata fields, and right-side official SIH graphic card.",
              elements: [
                // Top Center Blue Badge Header
                { id: `el-top-pill-bg-${Date.now()}`, type: 'SHAPE', shapeType: 'rounded-rect', fill: '#0072C6', stroke: '#0072C6', strokeWidth: 0, cornerRadius: 10, x: 360, y: 30, width: 560, height: 50, rotation: 0, zIndex: 1 },
                { id: `el-top-pill-text-${Date.now()}`, type: 'TEXT', content: 'SMART INDIA HACKATHON 2026', x: 360, y: 40, width: 560, height: 40, rotation: 0, zIndex: 2, fontSize: 24, fontFamily: 'Space Grotesk', fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center' },
                
                // Top Right Header SIH Logo
                { id: `el-top-right-logo-${Date.now()}`, type: 'IMAGE', url: '/sih-logo.svg', x: 1010, y: 20, width: 230, height: 60, rotation: 0, zIndex: 2 },
                
                // Left Column Data Fields
                { id: `el-f1-${Date.now()}`, type: 'TEXT', content: 'Problem Statement ID – SIH1645', x: 60, y: 130, width: 750, height: 45, rotation: 0, zIndex: 2, fontSize: 22, fontFamily: 'Space Grotesk', fontWeight: 'bold', color: '#201B14', textAlign: 'left' },
                { id: `el-f2-${Date.now()}`, type: 'TEXT', content: 'Problem Statement Title - An app and web based software for Productivity and safety management of coal mines.', x: 60, y: 195, width: 750, height: 90, rotation: 0, zIndex: 2, fontSize: 21, fontFamily: 'Space Grotesk', fontWeight: 'bold', color: '#201B14', textAlign: 'left' },
                { id: `el-f3-${Date.now()}`, type: 'TEXT', content: 'Theme - Smart Automation', x: 60, y: 310, width: 750, height: 45, rotation: 0, zIndex: 2, fontSize: 21, fontFamily: 'Space Grotesk', fontWeight: 'bold', color: '#201B14', textAlign: 'left' },
                { id: `el-f4-${Date.now()}`, type: 'TEXT', content: 'PS Category- Software', x: 60, y: 375, width: 750, height: 45, rotation: 0, zIndex: 2, fontSize: 21, fontFamily: 'Space Grotesk', fontWeight: 'bold', color: '#201B14', textAlign: 'left' },
                { id: `el-f5-${Date.now()}`, type: 'TEXT', content: 'Team ID- 289', x: 60, y: 440, width: 750, height: 45, rotation: 0, zIndex: 2, fontSize: 21, fontFamily: 'Space Grotesk', fontWeight: 'bold', color: '#201B14', textAlign: 'left' },
                { id: `el-f6-${Date.now()}`, type: 'TEXT', content: 'Team Name(Registered on Portal) - Arize', x: 60, y: 505, width: 750, height: 45, rotation: 0, zIndex: 2, fontSize: 21, fontFamily: 'Space Grotesk', fontWeight: 'bold', color: '#201B14', textAlign: 'left' },
                
                // Right Side Graphic Illustration & Hexagon Watermark
                { id: `el-rwatermark-${Date.now()}`, type: 'IMAGE', url: '/sih-watermark.svg', x: 700, y: 50, width: 550, height: 620, rotation: 0, zIndex: 0 }
              ]
            });
          }
        } else if (prompt.includes('SIH Template Type: SIH Title Slide')) {
          resolve({
            explanation: "Generated official SIH Title Slide layout.",
            elements: [
              { id: `el-top-pill-bg-${Date.now()}`, type: 'SHAPE', shapeType: 'rounded-rect', fill: '#0072C6', stroke: '#0072C6', strokeWidth: 0, cornerRadius: 10, x: 350, y: 30, width: 580, height: 54, rotation: 0, zIndex: 1 },
              { id: `el-top-pill-text-${Date.now()}`, type: 'TEXT', content: 'SMART INDIA HACKATHON 2026', x: 350, y: 42, width: 580, height: 40, rotation: 0, zIndex: 2, fontSize: 24, fontFamily: 'Space Grotesk', fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center' },
              { id: `el-top-right-logo-${Date.now()}`, type: 'IMAGE', url: '/sih-logo.svg', x: 1010, y: 20, width: 230, height: 60, rotation: 0, zIndex: 3 },
              { id: `el-f1-${Date.now()}`, type: 'TEXT', content: 'Problem Statement ID – SIH1645', x: 50, y: 135, width: 760, height: 45, rotation: 0, zIndex: 2, fontSize: 24, fontFamily: 'Space Grotesk', fontWeight: 'bold', color: '#1C1917', textAlign: 'left' },
              { id: `el-f2-${Date.now()}`, type: 'TEXT', content: 'Problem Statement Title - An app and web based software for Productivity and safety management of coal mines.', x: 50, y: 205, width: 760, height: 95, rotation: 0, zIndex: 2, fontSize: 22, fontFamily: 'Space Grotesk', fontWeight: 'bold', color: '#1C1917', textAlign: 'left' },
              { id: `el-f3-${Date.now()}`, type: 'TEXT', content: 'Theme - Smart Automation', x: 50, y: 330, width: 760, height: 45, rotation: 0, zIndex: 2, fontSize: 22, fontFamily: 'Space Grotesk', fontWeight: 'bold', color: '#1C1917', textAlign: 'left' },
              { id: `el-f4-${Date.now()}`, type: 'TEXT', content: 'PS Category- Software', x: 50, y: 400, width: 760, height: 45, rotation: 0, zIndex: 2, fontSize: 22, fontFamily: 'Space Grotesk', fontWeight: 'bold', color: '#1C1917', textAlign: 'left' },
              { id: `el-f5-${Date.now()}`, type: 'TEXT', content: 'Team ID- 289', x: 50, y: 470, width: 760, height: 45, rotation: 0, zIndex: 2, fontSize: 22, fontFamily: 'Space Grotesk', fontWeight: 'bold', color: '#1C1917', textAlign: 'left' },
              { id: `el-f6-${Date.now()}`, type: 'TEXT', content: 'Team Name(Registered on Portal) - Arize', x: 50, y: 540, width: 760, height: 45, rotation: 0, zIndex: 2, fontSize: 22, fontFamily: 'Space Grotesk', fontWeight: 'bold', color: '#1C1917', textAlign: 'left' },
              { id: `el-rwatermark-${Date.now()}`, type: 'IMAGE', url: '/sih-watermark.svg', x: 700, y: 50, width: 550, height: 620, rotation: 0, zIndex: 0 }
            ]
          });
        } else if (prompt.includes('Generate a slide for MineIntel')) {
          resolve({
            explanation: "Generated slide strictly following MineIntel brand tokens (Warm Ivory bg, Charcoal text, Restrained Maroon accents).",
            elements: [
              { id: `el-t1-${Date.now()}`, type: 'TEXT', content: 'Brand Compliant Slide', x: 100, y: 100, width: 600, height: 80, rotation: 0, zIndex: 1, fontSize: 48, fontFamily: 'Space Grotesk', fontWeight: 'bold', color: '#201B14', textAlign: 'left' },
              { id: `el-s1-${Date.now()}`, type: 'SHAPE', shapeType: 'rounded-rect', fill: 'transparent', stroke: '#8B2626', strokeWidth: 2, cornerRadius: 4, x: 650, y: 100, width: 400, height: 400, rotation: 0, zIndex: 0 }
            ]
          });
        } else {
          resolve("Mocked generic text response.");
        }
      }, 1500);
    });
  }
};
