const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize with your GEMINI_API_KEY in env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Step 1: Ask the model to extract text / detect whether file is medical.
 * It returns: { isMedical: boolean, extractedText: string }
 *
 * Step 2: If isMedical, ask the model to produce a STRICT JSON summary
 * with no hallucinations. If not medical, return the isMedical=false response.
 */
async function sendFileForAnalysis(fileUrl, options = {}) {
  try {
    // 1) Validate File Type (Only PDF and images like JPG, PNG, etc. allowed)
    const fileType = getFileType(fileUrl);
    if (!isValidFileType(fileType)) {
      return {
        isMedical: false,
        extractedText: "",
        message: "Invalid file type. Please upload a valid medical document or image."
      };
    }

    // 2) Extraction / Medical Detection Prompt
    const extractionPrompt = `
You will be given a URL pointing to a single file (PDF or image).
Task: Extract any readable text from the file and determine if the file is a medical report/document.

REQUIREMENTS (very important):
- Respond ONLY with valid JSON — nothing else.
- JSON shape must be: {"isMedical": true|false, "extractedText": "<raw extracted text (plain)>"}
- Do NOT invent or guess text that is not visible in the document.
- If you cannot extract readable text, set "extractedText" to "" and "isMedical" to false.
- Decide "isMedical": true only if the extracted text contains clear medical/report keywords or structure (words like: patient, report, diagnosis, hemoglobin, glucose, blood, x-ray, MRI, test, result, RBC, WBC, cholesterol, mg/dL, etc.)

File URL: ${fileUrl}
Context: ${JSON.stringify(options.userContext || {})}
`;

    const extractModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const extractResult = await extractModel.generateContent(extractionPrompt);
    const extractText = extractResult?.response?.text() || "";

    // Clean possible ```json blocks
    const cleanExtractText = extractText
      .replace(/^```json\s*/i, "")
      .replace(/```$/i, "")
      .trim();

    let extraction;
    try {
      extraction = JSON.parse(cleanExtractText);
    } catch (e) {
      // Fallback: if parsing fails, treat as non-medical.
      extraction = { isMedical: false, extractedText: cleanExtractText || "" };
    }

    // If not medical -> return immediately
    if (!extraction.isMedical) {
      return {
        isMedical: false,
        extractedText: extraction.extractedText || "",
        message: "This file does not appear to be a medical report. Please upload a valid medical document."
      };
    }

    // 3) If Medical, generate a Strict Summary (no hallucination)
    const summaryPrompt = `
You are a medical-report assistant. You were given this extracted text from the medical report:

"""${extraction.extractedText}"""

TASK:
- Produce a JSON ONLY response with the exact shape:
{
  "summaryEnglish": "<3-6 sentence summary of the report, only using facts visible in the extracted text>",
  "summaryUrdu": "<short Roman Urdu translation of the summary, use simple words>",
  "doctorQuestions": ["Question 1", "Question 2", ...],
  "foodTips": ["Tip 1", ...],
  "homeRemedies": ["Remedy 1", ...]
}

VERY STRICT RULES (MUST follow):
1) Do NOT invent patient names, ages, hospitals, doctors or dates if they are not present in the extracted text.
2) If a value is not present in the extracted text, write "Not mentioned in report" for that specific value — do NOT guess.
3) Only include items that clearly appear or are reasonable evidence in the extracted text.
4) Return valid JSON only. No markdown, no commentary, no code fences.
5) Keep all arrays; use empty arrays if nothing applicable.

Context: ${JSON.stringify(options.userContext || {})}
`;

    const summaryResult = await extractModel.generateContent(summaryPrompt);
    const summaryText = summaryResult?.response?.text() || "";

    const cleanSummaryText = summaryText
      .replace(/^```json\s*/i, "")
      .replace(/```$/i, "")
      .trim();

    let parsedSummary;
    try {
      parsedSummary = JSON.parse(cleanSummaryText);
    } catch (e) {
      // Fallback: return limited safe object
      parsedSummary = {
        summaryEnglish: cleanSummaryText.slice(0, 1000) || "No English summary generated.",
        summaryUrdu: "Roman Urdu summary not available.",
        doctorQuestions: [],
        foodTips: [],
        homeRemedies: [],
      };
    }

    // Ensure arrays exist
    parsedSummary.doctorQuestions = Array.isArray(parsedSummary.doctorQuestions) ? parsedSummary.doctorQuestions : [];
    parsedSummary.foodTips = Array.isArray(parsedSummary.foodTips) ? parsedSummary.foodTips : [];
    parsedSummary.homeRemedies = Array.isArray(parsedSummary.homeRemedies) ? parsedSummary.homeRemedies : [];

    return {
      isMedical: true,
      extractedText: extraction.extractedText || "",
      summaryEnglish: parsedSummary.summaryEnglish || "No English summary generated.",
      summaryUrdu: parsedSummary.summaryUrdu || "",
      doctorQuestions: parsedSummary.doctorQuestions,
      foodTips: parsedSummary.foodTips,
      homeRemedies: parsedSummary.homeRemedies,
    };
  } catch (err) {
    console.error("Gemini Service error:", err);
    throw new Error("Gemini Service failed: " + (err.message || err));
  }
}

/**
 * Helper function to check if the file type is valid (PDF or images).
 */
function isValidFileType(fileType) {
  // Valid file types: PDF, JPEG, PNG, JPG
  const validFileTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
  return validFileTypes.includes(fileType);
}

/**
 * Helper function to get the file type (you can enhance this to check file extensions or headers).
 */
function getFileType(fileUrl) {
  // Example logic: Extract file extension or get from HTTP headers (you can implement this as per your need)
  const fileExtension = fileUrl.split('.').pop().toLowerCase();
  
  // Check for common valid medical file types like PDF and image formats (JPEG, PNG)
  const validExtensions = ['pdf', 'jpeg', 'png', 'jpg'];

  if (validExtensions.includes(fileExtension)) {
    return `application/${fileExtension}`;
  } else {
    return 'application/unknown';  // Invalid file type
  }
}

module.exports = { sendFileForAnalysis };
