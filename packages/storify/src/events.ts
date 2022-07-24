import {Events, Listner} from './events.type';

export const events = <T>(): Events<T> => {
  let listners: Listner<T>[] = [];

  const isExist = (listner: Listner<T>) => {
    return listners.some((x) => x === listner);
  };

  const unlisten = (listner: Listner<T>) => {
    if (isExist(listner)) {
      listners = listners.filter((x) => x !== listner);
    }
  };

  const listen = (listner: Listner<T>) => {
    if (!isExist(listner)) {
      listners.push(listner);
    }

    return () => {
      unlisten(listner);
    };
  };

  const emit = (data: T) => {
    listners.forEach((x) => x(data));
  };

  return {
    unlisten,
    listen,
    emit,
  };
};
