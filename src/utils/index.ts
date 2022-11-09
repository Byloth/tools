import JsonStorage from "./json-storage";

export const jsonLocalStorage = new JsonStorage(window.localStorage);
export const jsonSessionStorage = new JsonStorage(window.sessionStorage);
