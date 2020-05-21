export const combineReducers = (...reducers) => (prevState, value) =>
  reducers.reduce((newState, reducer) => reducer(newState, value), prevState);
