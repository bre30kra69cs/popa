import {Store} from './store.type';
import {Listner} from './events.type';
import {events} from './events';

export const store = <T>(init: T): Store<T> => {
  let state = init;
  const listners = events<T>();

  const get = () => {
    return state;
  };

  const set = (nextState: T) => {
    const prevState = state;
    state = nextState;

    if (prevState !== state) {
      emit();
    }
  };

  const listen = (listner: Listner<T>) => {
    return listners.listen(listner);
  };

  const unlisten = (listner: Listner<T>) => {
    listners.unlisten(listner);
  };

  const emit = () => {
    listners.emit(get());
  };

  return {
    get,
    set,
    listen,
    unlisten,
    emit,
  };
};
