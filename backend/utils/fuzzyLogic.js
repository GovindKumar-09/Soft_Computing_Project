// Soft scoring logic for Weak-topic recommendation[cite: 3]
export function calculateFuzzyWeakness(correctAnswers, totalAnswers) {
    if (totalAnswers < 2) return 0; // At least 2 answers required[cite: 3]
    const accuracy = (correctAnswers / totalAnswers) * 100;
    
    // Fuzzy membership formula: \mu_{weak}(A)=min(1,max(0,(60-A)/20))[cite: 3]
    const membership = Math.min(1, Math.max(0, (60 - accuracy) / 20));
    return membership; 
}