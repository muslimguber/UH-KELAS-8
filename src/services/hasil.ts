import { UserProgress, Material } from '../types';

export const hasilService = {
  getSummary: (progress: UserProgress, allMaterials: Material[]) => {
    const totalMaterials = allMaterials.length;
    const completedCount = progress.completedMaterials.length;
    const progressPercent = totalMaterials > 0 ? Math.round((completedCount / totalMaterials) * 100) : 0;
    
    const averageScore = progress.quizHistory.length > 0 
      ? Math.round(progress.quizHistory.reduce((acc, curr) => acc + curr.score, 0) / progress.quizHistory.length)
      : 0;

    return {
      totalMaterials,
      completedCount,
      progressPercent,
      averageScore,
      totalQuizzes: progress.quizHistory.length
    };
  },

  getMaterialResults: (progress: UserProgress, allMaterials: Material[]) => {
    return allMaterials.map(material => {
      const highScore = progress.highScores[material.id] || 0;
      const isCompleted = progress.completedMaterials.includes(material.id);
      const attempts = progress.quizHistory.filter(h => h.materialId === material.id);
      
      return {
        ...material,
        highScore,
        isCompleted,
        attemptsCount: attempts.length,
        lastAttempt: attempts.length > 0 ? attempts[attempts.length - 1] : null
      };
    });
  }
};
