class SafeLocalStorage {
    user_rc;

    getItem(item) {
        return this[item];
    }
    setItem(item, value) {
        return (this[item] = value);
    }
    removeItem(item) {
        return this[item] = null;
    }
}


let storage;
try {
    if (localStorage) {
        storage = new SafeLocalStorage();
    }
} catch {
    storage = new SafeLocalStorage();
}
export default storage;
