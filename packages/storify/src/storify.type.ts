import {Listner} from './events.type';

export type Rec<V = unknown> = Record<string, V>;

export type Action = (...args: any[]) => void;

export type Effect = (...args: any[]) => Promise<void>;

export type MethodsUtils<S extends Rec> = {
  get: () => S;
  set: (data: Partial<S>) => void;
  action: <F extends Action>(fn: F) => F;
  effect: <F extends Effect>(fn: F) => F;
};

export type StorifyTemplate<
  S extends Rec,
  M extends Rec<Action | Effect> | void = void,
  P extends Rec | void = void,
> = {
  name?: string;
  state: S;
  pass?: P;
  methods?: (utils: MethodsUtils<S>) => M;
};

export type Storify<
  S extends Rec,
  M extends Rec<Action | Effect> | void = void,
  P extends Rec | void = void,
> = {
  get: () => S;
  set: (data: Partial<S>) => void;
  name: () => string | undefined;
  listen: (listner: Listner<S>) => () => void;
  unlisten: (listner: Listner<S>) => void;
} & M &
  P;

export type ShouldUpdate<S extends Rec> = (state: S, data: Partial<S>) => boolean;

export type MergeState<S extends Rec> = (state: S, data: Partial<S>) => S;

export type StorifyConfig<S extends Rec> = {
  shouldUpdate?: ShouldUpdate<S>;
  mergeState?: MergeState<S>;
};
