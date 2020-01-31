export const equals = (set1, set2) => {
  if (set1.size !== set2.size) return false;

  for (let el of set1) {
    if (!set2.has(el)) return false;
  }

  return true;
};
