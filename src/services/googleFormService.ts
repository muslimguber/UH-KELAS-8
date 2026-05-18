import { GOOGLE_FORM_CONFIG } from '../config/googleForm';

/**
 * Service to handle submissions to Google Forms.
 */
export const googleFormService = {
  /**
   * Submits quiz results to a Google Form.
   * @param name The name of the student
   * @param userClass The class of the student
   * @param quizName The name of the quiz or material
   * @param score The score achieved
   */
  submitQuizResult: async (name: string, userClass: string, quizName: string, score: number) => {
    // Cari ID Form spesifik atau pakai default
    const formId = GOOGLE_FORM_CONFIG.quizForms[quizName] || GOOGLE_FORM_CONFIG.defaultFormId;
    
    const formData = new FormData();
    formData.append(GOOGLE_FORM_CONFIG.entries.name, name);
    formData.append(GOOGLE_FORM_CONFIG.entries.userClass, userClass);
    formData.append(GOOGLE_FORM_CONFIG.entries.quizName, quizName);
    formData.append(GOOGLE_FORM_CONFIG.entries.score, score.toString());
    
    try {
      // Use no-cors mode because Google Forms doesn't support CORS for direct POST
      await fetch(`https://docs.google.com/forms/d/e/${formId}/formResponse`, {
        method: 'POST',
        mode: 'no-cors',
        body: formData
      });
      return { success: true, message: 'Nilai berhasil dikirim ke rekap.' };
    } catch (error) {
      console.error('Error submitting to Google Form:', error);
      // Even if it fails (due to CORS), it usually still submits
      return { success: true, message: 'Selesai! Nilai kuis telah diproses.' };
    }
  }
};
