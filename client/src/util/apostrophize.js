export default name => {
  return name.endsWith('s') ? `${name}'` : `${name}'s`;
};
