import { Observable } from 'rxjs';

export const localStorageSet = <T>(name: string, value: T): Observable<T> => {
  return new Observable(subscribe => {
    localStorage.setItem(name, JSON.stringify(value));

    subscribe.next(value);
  });
};

export const localStorageGet = <T>(name: string): Observable<T> => {
  return new Observable(subscribe => {
    const user = JSON.parse(localStorage.getItem(name) as string);

    if (user) {
      subscribe.next(user);
      subscribe.complete();
    } else {
      subscribe.error('No user');
      subscribe.complete();
    }
  });
};

export const localStorageRemove = (name: string): Observable<boolean> => {
  return new Observable(subscribe => {
    localStorage.removeItem(name);

    subscribe.next(true);
    subscribe.complete();
  });
};
