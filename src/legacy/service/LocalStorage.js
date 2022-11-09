export default class LocalStorageService {
  constructor(key) {
    this.checkEnvironment();

    this._key = key;
  }
  get() {
    return JSON.parse(localStorage.getItem(this._key)) || [];
  }
  set(value) {
    localStorage.setItem(this._key, JSON.stringify(value));
  }
  checkEnvironment() {
    !localStorage && console.warn("This browser doesn't support localStorage");
  }
}
