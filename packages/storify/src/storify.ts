import {Rec, Action, StorifyTemplate, Storify, StorifyConfig} from './storify.type';
import {Listner} from './events.type';
import {store} from './store';

const defaultShouldUpdate = <S extends Rec>(state: S, data: Partial<S>) => {
  return Object.keys(data).some((key) => state[key] !== data[key]);
};

const defaultMergeState = <S extends Rec>(state: S, data: Partial<S>) => {
  return {
    ...state,
    ...data,
  };
};

export const storify = <
  S extends Rec,
  A extends Rec<Action> | void = void,
  P extends Rec | void = void,
>(
  template: StorifyTemplate<S, A, P>,
  config?: StorifyConfig<S>,
): Storify<S, A, P> => {
  const state = store(template.state);
  const storeShouldUpdate = config?.shouldUpdate ?? defaultShouldUpdate;
  const storeMergeState = config?.mergeState ?? defaultMergeState;

  const get = () => {
    return state.get();
  };

  const set = (data: Partial<S>, setConfig?: StorifyConfig<S>) => {
    const setShouldUpdate = setConfig?.shouldUpdate ?? storeShouldUpdate;
    const setMergeState = setConfig?.mergeState ?? storeMergeState;
    const stateKeys = Object.keys(get());

    const preparedData = Object.entries(data)
      .filter(([, value]) => value !== undefined)
      .filter(([key]) => stateKeys.includes(key))
      .reduce((acc, [key, value]) => {
        return {
          ...acc,
          [key]: value,
        };
      }, {} as Partial<S>);

    if (setShouldUpdate(get(), preparedData)) {
      const nextState = setMergeState(get(), preparedData);
      state.set(nextState);
    }
  };

  const name = () => {
    return template.name;
  };

  const listen = (listner: Listner<S>) => {
    return state.listen(listner);
  };

  const unlisten = (listner: Listner<S>) => {
    state.unlisten(listner);
  };

  const action = <F extends Action>(fn: F): F => {
    return fn;
  };

  const actions = template.actions?.({
    get,
    set,
    action,
  });

  return {
    get,
    set,
    name,
    listen,
    unlisten,
    ...((actions ?? {}) as A),
    ...((template.pass ?? {}) as P),
  };
};
