export type Params = Record<string, unknown>;

// ****************************************
// AppStore Interfaces
// ****************************************

export interface AppAPI {
  add: (params: Record<string, any>) => void;
  remove: (keys: string[]) => void;
  clearAll: () => void;
}

export interface AppParams {
  i18n: string;
  uuid: string;
  phase: number | null;
  subjectName: string;
  proxy: {
    fullName: string;
    uuid: string;
  };
  isToddler: boolean;
  surveyDone?: boolean;
}

export interface AppState extends AppAPI {
  params: AppParams;
}

type ExtractState<S> = S extends { getState: () => infer T } ? T : never;

export type SliceSelector<T, U> = (state: ExtractState<T>) => U;
export type UseAppStoreTuple<T> = [T, AppAPI];

export const SELECTOR_IDENTITY = (state: AppState) => state.params;
