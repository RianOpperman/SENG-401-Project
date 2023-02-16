class A {
    a;
    constructor(x){
        this.a = x;
    }
}

let B = {
    b: 5,
    test1: function () {
        return this.b;
    },
    test2: (self) => {
        return self.b;
    }
}

console.log(B.b);
console.log(B.test1());
console.log(B.test2(B));