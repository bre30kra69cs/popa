import {Listner} from './events.type';

export type Store<T> = {
  get: () => T;
  set: (nextState: T) => void;
  listen: (listner: Listner<T>) => () => void;
  unlisten: (listner: Listner<T>) => void;
  emit: () => void;
};
