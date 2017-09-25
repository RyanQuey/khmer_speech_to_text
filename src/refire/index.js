
const ReFire = store => next => action => {
  try {
    const value = next(action)
    return value;
  } catch (err) {
    throw err
  }
}

export default ReFire;
