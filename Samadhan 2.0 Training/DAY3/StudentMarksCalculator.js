//Day3

// Student Marks Calculator 
const prompt = require('prompt-sync')(); 
let studentName = prompt("Enter the student's name:");
let numSubjects = parseInt(prompt("How many subjects?"));
let totalMarks = 0;
let subjects = [];
for (let i = 0; i < numSubjects; i++) {
  let subjectName = prompt(Enter the name of subject ${i + 1}:);
  let marks = parseFloat(prompt(Enter marks for ${subjectName} (out of 100):));
  subjects.push({ subject: subjectName, marks: marks });
  totalMarks += marks;
}
let average = totalMarks / numSubjects;
let percentage = (totalMarks / (numSubjects * 100)) * 100;
let result = Student Name: ${studentName}\n\nSubject-wise Marks:\n;
for (let item of subjects) {
  result += ${item.subject}: ${item.marks}\n;
}
result += \nTotal Marks: ${totalMarks};
result += \nAverage Marks: ${average.toFixed(2)};
result += \nPercentage: ${percentage.toFixed(2)}%;
console.log(result);
