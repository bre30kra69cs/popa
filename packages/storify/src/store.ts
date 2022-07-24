import {Store} from './store.type';
import {Listner} from './events.type';
import {events} from './events';

export const store = <T>(init: T): Store<T> => {
  let state = init;
  const storeEvents = events<T>();

  const get = () => {
    return state;
  };

  const set = (nextState: T) => {
    state = nextState;
    storeEvents.emit(state);
  };

  const listen = (listner: Listner<T>) => {
    return storeEvents.listen(listner);
  };

  const unlisten = (listner: Listner<T>) => {
    storeEvents.unlisten(listner);
  };

  const emit = () => {
    storeEvents.emit(get());
  };

  return {
    get,
    set,
    listen,
    unlisten,
    emit,
  };
};
