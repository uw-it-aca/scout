var fakeSessionStorage = function fakeSessionStorage(initval){
    if (initval !== undefined) {
        this.sessionVars = initval;
    } else {
        this.sessionVars = {};
    }
};

fakeSessionStorage.prototype.getItem = function(item) {
    var result = this.sessionVars[item];
    if (result === undefined) {
        return null;
    } else {
        return result;
    }
}

fakeSessionStorage.prototype.setItem = function(item, value) {
    this.sessionVars[item] = value;
}

exports.fakeSessionStorage = fakeSessionStorage
