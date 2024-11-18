class Parent {
  // let name = ''
  constructor(fn,ln) {
    this.name = fn + ln
    this.arr = [1,2,3]
  }
  say() {
    console.log('hi');
  }
}
class Child extends Parent {
  constructor(fn, ln) {
    super(fn, ln)
    this.selfName = 'child'
  }
  say(){
    console.log('111');
    
  }
}
const child1 = new Child('lee', 'lei')
// const child2 = new Child('lee', 'lei')

console.log(child1.name);
console.log(child1.selfName);
child1.say()



const obj1 = {
  name: 'aaa'
}
Object.defineProperty(obj1, "age", {value: 12})
Object.defineProperty(obj1, 'name', {value: 'bbb'})
console.log(obj1);

const obj2 = {
  name: 'cc'
}
Reflect.set(obj2, 'age', 19)
console.log(Reflect.get(obj2, 'age'));
console.log(obj2);



