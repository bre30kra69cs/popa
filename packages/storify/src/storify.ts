import {
  Rec,
  Action,
  Effect,
  EffectStatus,
  EffectUnit,
  Storify,
  StorifyTemplate,
  StorifyConfig,
} from './storify.type';
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

  const action = <F extends Action>(fn: F, propagate?: boolean): F => {
    const target = (...args: Parameters<F>) => {
      try {
        fn(...args);
      } catch (error) {
        if (propagate) {
          throw error;
        }
      }
    };

    return target as F;
  };

  const effect = <F extends Effect>(fn: F, propagate?: boolean): EffectUnit<F> => {
    const effectStatus = store<EffectStatus>('init');

    const target = async (...args: Parameters<F>) => {
      effectStatus.set('load');

      try {
        await fn(...args);
        effectStatus.set('done');
      } catch (error) {
        effectStatus.set('fail');

        if (propagate) {
          throw error;
        }
      }
    };

    const status = () => {
      return effectStatus.get();
    };

    const listen = (listner: Listner<EffectStatus>) => {
      return effectStatus.listen(listner);
    };

    const unlisten = (listner: Listner<EffectStatus>) => {
      effectStatus.unlisten(listner);
    };

    target['status'] = status;
    target['listen'] = listen;
    target['unlisten'] = unlisten;

    return target as EffectUnit<F>;
  };

  const methods = template.methods?.({
    get,
    set,
    action,
    effect,
  });

  return {
    get,
    set,
    name,
    listen,
    unlisten,
    ...((methods ?? {}) as A),
    ...((template.pass ?? {}) as P),
  };
};
