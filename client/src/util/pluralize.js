export default (word, count) => {
  // if(word.endsWith('s')) return word;

  if (count === 1) return word;

  return word + 's';
};
