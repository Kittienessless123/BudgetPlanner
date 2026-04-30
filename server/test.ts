// test.ts
console.log('1. Старт');

async function test() {
  console.log('2. В функции');
  return '3. Результат';
}

console.log('4. До вызова');
void test().then(console.log);
console.log('5. После вызова');