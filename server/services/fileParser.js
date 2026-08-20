const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

/**
 * Extract plain text from a PDF buffer.
 */
const parsePDF = async (buffer) => {
  const data = await pdfParse(buffer);
  return data.text.trim();
};

/**
 * Extract plain text from a DOCX buffer.
 */
const parseDOCX = async (buffer) => {
  const result = await mammoth.extractRawText({ buffer });
  if (result.messages && result.messages.length > 0) {
    console.log('DOCX parse warnings:', result.messages);
  }
  return result.value.trim();
};

/**
 * Parse a resume file (PDF or DOCX) from a buffer.
 * @param {Buffer} buffer - The file buffer from multer memoryStorage
 * @param {string} mimetype - The file MIME type
 */
const parseFile = async (buffer, mimetype) => {
  if (mimetype === 'application/pdf') {
    return await parsePDF(buffer);
  } else if (
    mimetype ===
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    return await parseDOCX(buffer);
  }
  throw new Error('Unsupported file type. Please upload a PDF or DOCX file.');
};

module.exports = { parseFile };
