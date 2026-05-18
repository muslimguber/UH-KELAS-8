/**
 * Configuration for Google Form integration.
 * To get the entry IDs:
 * 1. Open your Google Form
 * 2. Click "Get pre-filled link" from the three-dot menu
 * 3. Fill in some sample data and click "Get link"
 * 4. Copy the link and look for "entry.XXXXXX=" parameters
 */
export const GOOGLE_FORM_CONFIG = {
  // ID Google Form Utama
  defaultFormId: '1FAIpQLScc7KNajPLDbiiCBIdUfSttjcQ3xekNbfcF1c3_yAM1pOzEQg', 
  
  // Mapping kuis ke ID Google Form (Tambahkan ID baru di sini sesuai nama modul)
  quizForms: {
    'UH BAB 5 UNSUR': '1FAIpQLScc7KNajPLDbiiCBIdUfSttjcQ3xekNbfcF1c3_yAM1pOzEQg',
    'Kuis Akhir Perkenalan': '1FAIpQLScc7KNajPLDbiiCBIdUfSttjcQ3xekNbfcF1c3_yAM1pOzEQg',
  } as Record<string, string>,

  // Ganti angka di bawah ini setelah Anda melakukan langkah "Get Pre-filled Link"
  entries: {
    name: 'entry.1872184799',      
    userClass: 'entry.1116477844', 
    score: 'entry.1312246172',     
    quizName: 'entry.1945254106',  
  }
};
