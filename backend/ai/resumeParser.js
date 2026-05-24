// Parse resume text from PDF or DOCX files

const extractSkills = require('./skillExtractor');

async function parseResume(buffer, mimetype) {
  let text = '';

  try {
    if (mimetype === 'application/pdf') {
      const pdf = require('pdf-parse');
      const data = await pdf(buffer);
      text = data.text;
    } else if (
      mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      mimetype === 'application/msword'
    ) {
      const mammoth = require('mammoth');
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    } else {
      // Plain text fallback
      text = buffer.toString('utf-8');
    }
  } catch (err) {
    console.error('Resume parse error:', err.message);
    text = '';
  }

  const skills = extractSkills(text);

  return { text, skills };
}

module.exports = parseResume;
