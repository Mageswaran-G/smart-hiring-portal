const Groq = require('groq-sdk');
const logger = require('../utils/logger');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

function buildSystemPrompt(role, context) {
  const base = `You are HireBot, a smart assistant for HirePortal, a job hiring platform.
Help users with job-related questions, career advice, and platform guidance.
Keep responses short, helpful, and professional. No emojis. Plain text only.
If asked something unrelated to jobs or careers, politely redirect.`;

  if (role === 'candidate') {
    return `${base}

You are talking to a job seeker.
Their profile:
- Name: ${context.name || 'User'}
- Skills: ${Array.isArray(context.skills) ? context.skills.join(', ') : 'Not listed'}
- Total applications: ${context.totalApplications || 0}
- Shortlisted: ${context.shortlisted || 0}
- Hired: ${context.hired || 0}

Help them with: job search tips, resume advice, interview preparation, career guidance.`;
  }

  if (role === 'company') {
    return `${base}

You are talking to a recruiter.
Their context:
- Company: ${context.companyName || 'Company'}
- Total jobs posted: ${context.totalJobs || 0}
- Total applications received: ${context.totalApps || 0}
- Shortlisted: ${context.shortlisted || 0}
- Hired: ${context.hired || 0}

Help them with: hiring tips, job description writing, candidate evaluation, recruitment best practices.`;
  }

  if (role === 'admin') {
    return `${base}

You are talking to a platform administrator.
Platform stats:
- Total users: ${context.totalUsers || 0}
- Total companies: ${context.totalCompanies || 0}
- Total jobs: ${context.totalJobs || 0}
- Total applications: ${context.totalApplications || 0}

Help them with: platform management, moderation guidance, system questions.`;
  }

  return base;
}

async function getChatResponse(message, role, context, history = []) {
  try {
    const systemPrompt = buildSystemPrompt(role, context);

    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.map(h => ({
        role: h.role === 'bot' ? 'assistant' : 'user',
        content: h.text,
      })),
      { role: 'user', content: message },
    ];

    const completion = await groq.chat.completions.create({
      model:       'llama-3.3-70b-versatile',
      messages,
      max_tokens:  500,
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content || 'I could not generate a response.';
    return { success: true, reply };
  } catch (error) {
    logger.error(`Groq error: ${error.message}`);
    return { success: false, reply: 'Sorry, I am unable to respond right now. Please try again.' };
  }
}

module.exports = { getChatResponse };
