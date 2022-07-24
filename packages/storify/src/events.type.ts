export type Listner<T> = (state: T) => void;

export type Events<T> = {
  listen: (listner: Listner<T>) => () => void;
  unlisten: (listner: Listner<T>) => void;
  emit: (data: T) => void;
};
