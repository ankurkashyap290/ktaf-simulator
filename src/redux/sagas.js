import { all } from 'redux-saga/effects';
import simulatorSagas from './simulator/saga';

export default function* rootSaga() {
  yield all([simulatorSagas()]);
}
