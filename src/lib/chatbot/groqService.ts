import { CHATBOT_SYSTEM_PROMPT, cleanResponseText, AKASH_PROFILE } from './knowledge';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Ultra-fast low latency models available on Groq LPU
const PRIMARY_MODEL = 'qwen/qwen3.8-27b';
const FALLBACK_MODEL = 'openai/gpt-oss-120b';

function getApiKey(): string {
  const envKey = import.meta.env.VITE_GROQ_API_KEY;
  if (envKey && typeof envKey === 'string' && envKey.trim().length > 0) {
    return envKey.trim();
  }
  throw new Error('VITE_GROQ_API_KEY is not set. Please add it to your .env file.');
}

/**
 * Sends a conversation to Groq API and returns a smoothly formatted, cleaned response.
 */
export async function sendChatMessageToGroq(
  messages: { role: 'user' | 'assistant'; content: string }[]
): Promise<string> {
  const apiKey = getApiKey();

  // Keep last 8 messages for tight context & instant response time
  const contextMessages = messages.slice(-8).map(m => ({
    role: m.role,
    content: m.content
  }));

  const requestPayload = {
    messages: [
      { role: 'system', content: CHATBOT_SYSTEM_PROMPT },
      ...contextMessages
    ],
    temperature: 0.6,
    max_tokens: 500,
    top_p: 0.95
  };

  // Try primary model first, fallback to secondary model on failure
  const modelsToTry = [PRIMARY_MODEL, FALLBACK_MODEL];

  for (const model of modelsToTry) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...requestPayload,
          model
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`Groq model ${model} returned error ${response.status}:`, errorText);
        continue; // Try fallback model
      }

      const data = await response.json();
      const rawContent = data.choices?.[0]?.message?.content;

      if (rawContent && typeof rawContent === 'string') {
        return cleanResponseText(rawContent);
      }
    } catch (err: unknown) {
      console.warn(`Groq request with model ${model} failed:`, err);
      // Continue to fallback model
    }
  }

  // Graceful smart fallback if network/API is completely unreachable
  return getSmartLocalFallback(messages[messages.length - 1]?.content || '');
}

/**
 * Intelligent local fallback ensuring the user always receives high-quality information
 * formatted strictly with NO * or # characters.
 */
function getSmartLocalFallback(query: string): string {
  const q = query.toLowerCase();

  if (q.includes('skill') || q.includes('tech') || q.includes('stack')) {
    return cleanResponseText(
      `Akash is proficient across the full software engineering stack:\n\n` +
      `• Frontend: React, Next.js, TypeScript, JavaScript, Tailwind CSS, Three.js, and Redux\n` +
      `• Backend: Node.js, Express, Python, REST APIs, GraphQL, and Prisma\n` +
      `• Databases: PostgreSQL, MongoDB, MySQL, and Supabase\n` +
      `• Cloud and DevOps: AWS, Azure Container Apps, Docker, Git, and Linux\n\n` +
      `Would you like to know more about his projects using these technologies?`
    );
  }

  if (q.includes('project') || q.includes('work') || q.includes('portfolio')) {
    return cleanResponseText(
      `Here are some of Akash's standout projects:\n\n` +
      `1. Disease Prediction System: An AI-driven diagnostic platform built with Python, TensorFlow, and React that offers early health insights.\n\n` +
      `2. E-Commerce Platform (Elesene): A full-scale online store with live revenue metrics, inventory control, and Stripe checkout.\n\n` +
      `3. Tradevault: A secure cryptocurrency trading journal with end-to-end encrypted messaging and AI content moderation.\n\n` +
      `4. Homelux Real Estate: Modern property discovery platform with interactive maps and virtual tours.\n\n` +
      `You can scroll down to the Projects section to inspect each project and its live demo.`
    );
  }

  if (q.includes('resume') || q.includes('cv') || q.includes('experience')) {
    return cleanResponseText(
      `Akash Dora is currently pursuing his Master of Computer Applications (MCA) at Srusti Academy of Management and Technology and holds a B.Sc. in Computer Science with honors from OUAT.\n\n` +
      `He has interned as a Software Engineer at AssetMagnets in Bhubaneswar, building scalable backend services and AI-driven features deployed to Azure.\n\n` +
      `You can download his official PDF resume using the Download Resume button in the navigation or on the homepage.`
    );
  }

  if (q.includes('contact') || q.includes('hire') || q.includes('email') || q.includes('reach')) {
    return cleanResponseText(
      `You can connect with Akash directly:\n\n` +
      `• Email: ${AKASH_PROFILE.email}\n` +
      `• LinkedIn: ${AKASH_PROFILE.linkedin}\n` +
      `• GitHub: ${AKASH_PROFILE.github}\n\n` +
      `He is actively available for full-time roles, internships, and exciting collaborations.`
    );
  }

  return cleanResponseText(
    `Hello! I am Akash Dora's official AI assistant. Akash is a Full-Stack Software Engineer and AI developer based in Bhubaneswar, India. ` +
    `Feel free to ask me anything about his technical skills, background, projects like Tradevault and the Disease Prediction System, or how to get in touch with him!`
  );
}
