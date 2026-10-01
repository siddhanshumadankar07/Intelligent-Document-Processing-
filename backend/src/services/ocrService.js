const pdfParse = require('pdf-parse');
const { createWorker } = require('tesseract.js');

/**
 * Extracts text from an in-memory buffer (PDF or Image)
 * Immediately discards the buffer after extraction to adhere to zero-retention rules.
 */
const extractTextFromBuffer = async (buffer, mimeType, originalName) => {
  let extractedText = '';
  let pageCount = 1;
  let ocrUsed = false;

  try {
    if (mimeType === 'application/pdf') {
      try {
        const pdfData = await pdfParse(buffer);
        extractedText = pdfData.text ? pdfData.text.trim() : '';
        pageCount = pdfData.numpages || 1;

        // If PDF contains very little text (e.g. scanned image PDF), fallback to OCR
        if (!extractedText || extractedText.length < 50) {
          console.log(`[OCR] Scanned PDF detected (${originalName}), attempting OCR fallback.`);
          const ocrResult = await performTesseractOCR(buffer);
          if (ocrResult) {
            extractedText = ocrResult;
            ocrUsed = true;
          }
        }
      } catch (pdfErr) {
        console.warn(`[OCR] pdf-parse error on ${originalName}: ${pdfErr.message}. Trying OCR...`);
        const ocrResult = await performTesseractOCR(buffer);
        if (ocrResult) {
          extractedText = ocrResult;
          ocrUsed = true;
        }
      }
    } else if (mimeType.startsWith('image/')) {
      // Direct image OCR via Tesseract
      extractedText = await performTesseractOCR(buffer);
      ocrUsed = true;
      pageCount = 1;
    } else if (mimeType === 'text/plain') {
      extractedText = buffer.toString('utf8').trim();
      pageCount = 1;
    }

    // Safety fallback for empty/corrupted/unparseable files
    if (!extractedText || extractedText.trim().length === 0) {
      extractedText = `[Document Content: ${originalName}]\n(No machine-readable text was detected in this file. It may be a blank or low-resolution image.)`;
    }

    return {
      text: extractedText,
      pageCount,
      ocrUsed,
      charCount: extractedText.length,
    };
  } catch (error) {
    console.error(`[OCR Error] Failed processing ${originalName}: ${error.message}`);
    return {
      text: `[Document Content: ${originalName}]\n(Error extracting text: ${error.message})`,
      pageCount: 1,
      ocrUsed: false,
      charCount: 0,
    };
  }
};

/**
 * Runs Tesseract OCR on a buffer
 */
const performTesseractOCR = async (imageBuffer) => {
  let worker = null;
  try {
    worker = await createWorker('eng');
    const { data } = await worker.recognize(imageBuffer);
    await worker.terminate();
    return data?.text ? data.text.trim() : '';
  } catch (err) {
    console.warn(`[OCR] Tesseract OCR failed: ${err.message}`);
    if (worker) {
      try { await worker.terminate(); } catch (_) {}
    }
    return '';
  }
};

module.exports = {
  extractTextFromBuffer,
};
