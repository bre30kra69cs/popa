import {Listner} from './events.type';

export type Rec<V = unknown> = Record<string, V>;

export type Action = (...args: any[]) => void;

export type ActionsUtils<S extends Rec> = {
  get: () => S;
  set: (data: Partial<S>) => void;
  action: <F extends Action>(fn: F) => F;
};

export type StorifyTemplate<
  S extends Rec,
  A extends Rec<Action> | void = void,
  P extends Rec | void = void,
> = {
  name?: string;
  state: S;
  pass?: P;
  actions?: (utils: ActionsUtils<S>) => A;
};

export type Storify<
  S extends Rec,
  A extends Rec<Action> | void = void,
  P extends Rec | void = void,
> = {
  get: () => S;
  set: (data: Partial<S>) => void;
  name: () => string | undefined;
  listen: (listner: Listner<S>) => () => void;
  unlisten: (listner: Listner<S>) => void;
} & A &
  P;

export type ShouldUpdate<S extends Rec> = (state: S, data: Partial<S>) => boolean;

export type MergeState<S extends Rec> = (state: S, data: Partial<S>) => S;

export type StorifyConfig<S extends Rec> = {
  shouldUpdate?: ShouldUpdate<S>;
  mergeState?: MergeState<S>;
};
