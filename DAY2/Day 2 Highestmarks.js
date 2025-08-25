let arr = [25, 60, 85, 95, 83, 81];
let max = -1;

for (let i = 0; i < arr.length; i++) {
  if (max < arr[i]) {
    max = arr[i];
  }
}

console.log(`Highest marks : ${max}`);
