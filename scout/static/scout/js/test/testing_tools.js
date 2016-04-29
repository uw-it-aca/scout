var fakeSessionStorage = function fakeSessionStorage(initval){
    if (initval !== undefined) {
        this.sessionVars = initval;
    } else {
        this.sessionVars = {};
    }
};

fakeSessionStorage.prototype.getItem = function(item) {
    return this.sessionVars[item];
}

fakeSessionStorage.prototype.setItem = function(item, value) {
    this.sessionVars[item] = value;
}

exports.fakeSessionStorage = fakeSessionStorage
