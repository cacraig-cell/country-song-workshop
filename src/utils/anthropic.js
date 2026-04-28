import Anthropic from '@anthropic-ai/sdk';
import { ANALYZER_SYSTEM_PROMPT, WRITER_SYSTEM_PROMPT } from './prompts.js';

const MODEL = 'claude-sonnet-4-20250514';

function getClient() {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('VITE_ANTHROPIC_API_KEY is not set in your .env file.');
  return new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
}

function parseJSON(raw) {
  // Strip any accidental markdown code fences the model might add
  const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  return JSON.parse(cleaned);
}

export async function analyzeSong({ title, artist }) {
  const client = getClient();
  const message = await client.messages.create({
    model: MODEL,
    max_tokens: 4000,
    system: [
      {
        type: 'text',
        text: ANALYZER_SYSTEM_PROMPT,
        cache_control: { type: 'ephemeral' },
      },
    ],
    messages: [
      {
        role: 'user',
        content: `Analyze the country song "${title}" by ${artist}. Provide a deep, specific, technically-grounded analysis across all dimensions. Be precise and insightful — not surface-level.`,
      },
    ],
  });

  const raw = message.content[0].text;
  return parseJSON(raw);
}

export async function writeSong({ title, concept, existingLines, referenceArtist }) {
  const client = getClient();

  const parts = [
    `Song Title: "${title}"`,
    `Concept: ${concept}`,
  ];
  if (existingLines?.trim()) {
    parts.push(`Lines or phrases I already have in mind:\n${existingLines}`);
  }
  if (referenceArtist?.trim()) {
    parts.push(`Style to lean closest to: ${referenceArtist}`);
  }
  parts.push(
    'Write me a complete song based on this concept. Make it authentic, emotionally honest, and true to the modern country style of the artists listed. Do not make it generic or clichéd — bring real craft to every line.'
  );

  const message = await client.messages.create({
    model: MODEL,
    max_tokens: 6000,
    system: [
      {
        type: 'text',
        text: WRITER_SYSTEM_PROMPT,
        cache_control: { type: 'ephemeral' },
      },
    ],
    messages: [
      {
        role: 'user',
        content: parts.join('\n\n'),
      },
    ],
  });

  const raw = message.content[0].text;
  return parseJSON(raw);
}
