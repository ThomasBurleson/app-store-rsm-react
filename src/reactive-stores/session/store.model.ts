import { StoreApi } from "zustand";

export type Params = Record<string, unknown>;

// ****************************************
// AppStore Interfaces
// ****************************************

export interface SessionState {
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

export interface SessionAPI {
  add: (params: Record<string, any>) => void;
  remove: (keys: string[]) => void;
  clearAll: () => void;
}

export type SessionViewModel = SessionAPI & SessionState;

type ExtractState<S> = S extends { getState: () => infer T } ? T : never;

export type SliceSelector<T, U> = (state: ExtractState<T>) => U;
export type UseSessionStoreTuple<T> = [T, SessionAPI];

export const IDENTITY_SELECTOR = <T>() =>
  ((state: SessionViewModel): SessionViewModel => state) as unknown as SliceSelector<StoreApi<SessionViewModel>, T>;
