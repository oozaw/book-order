function reverse(string) {
    const number = string.substr(-1);
    const word = string.substr(0, string.length - 1);

    const arrWord = word.split("");

    let idxStart = 0;
    let idxEnd = arrWord.length - 1;

    for (let i = 0; i < arrWord.length; i++) {
        if (idxStart === idxEnd || idxStart === arrWord.length / 2) break;

        let temp = arrWord[idxStart];
        arrWord[idxStart] = arrWord[idxEnd];
        arrWord[idxEnd] = temp;

        idxStart++;
        idxEnd--;
    }

   return arrWord.join("") + number;
}

console.log("Reverse word: ", reverse("NEGIE1"));

function getLongestWord(sentence) {
    let words = sentence.split(" ");

    let max = 0;
    let maxWord = "";

    for (let i = 0; i < words.length; i++) {
        if (words[i].length > max) {
            max = words[i].length;
            maxWord = words[i];
        }
    }

    return `${maxWord}: ${max} character`;
}

console.log("Get longest word: ", getLongestWord("Saya sangat senang mengerjakan soal algoritma tanpa memperdulikan semuanya"));

function countAppearance(input, query) {
    let result = [];

    for (let i = 0; i < query.length; i++) {
        let count = 0;

        for (let j = 0; j < input.length; j++) {
            if (query[i] === input[j]) count++;
        }

        result.push(count);
    }

    return result;
}

console.log("Count word appearance: ", countAppearance(['xc', 'dz', 'bbb', 'dz'], ['bbb', 'ac', 'dz']));

function subDiagMatrix(matrix) {
   const dimension = matrix.length - 1;

   let firstDiag = 0;
   let secondDiag = 0;

   for (let i = 0; i <= dimension; i++) {
      firstDiag += matrix[i][i];
      secondDiag += matrix[i][dimension - i];
   }

   return firstDiag - secondDiag;
}

console.log("Subtraction total diagonal of matrix: ", subDiagMatrix([[1, 2, 0], [4, 5, 6], [7, 8, 9]]));
















