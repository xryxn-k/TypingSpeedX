// Calculate WPM (Words Per Minute)
export function calculateWPM(charactersTyped, timeInSeconds) {
  if (timeInSeconds === 0) return 0;
  const words = charactersTyped / 5; // Average word length is 5 characters
  const minutes = timeInSeconds / 60;
  return Math.round(words / minutes);
}

// Calculate accuracy percentage
export function calculateAccuracy(totalChars, errors) {
  if (totalChars === 0) return 100;
  const correctChars = totalChars - errors;
  return Math.round((correctChars / totalChars) * 100);
}

// Calculate progress percentage
export function calculateProgress(currentIndex, totalLength) {
  return Math.min(Math.round((currentIndex / totalLength) * 100), 100);
}

// Compare typed text with original text
export function compareText(original, typed) {
  let errors = 0;
  let correctChars = 0;
  
  for (let i = 0; i < typed.length; i++) {
    if (i < original.length) {
      if (typed[i] === original[i]) {
        correctChars++;
      } else {
        errors++;
      }
    } else {
      errors++;
    }
  }
  
  return { errors, correctChars, totalTyped: typed.length };
}
