let vowels = ['a', 'e', 'i', 'o', 'u'];

let featuresToBeExtracted = {
  numberOfVowels: (names) => {
      let numberOfVowelsList = [],
          numberOfNames = 0;
      for (let index = 0; index < numberOfNames; index++) {
          let name = names[index],
              numberOfVowels = 0;
          for (const letter of name) {
              if (vowels.includes(letter)) 
                  numberOfVowels++;
          }
          numberOfVowelsList[index] = numberOfVowels;
      }
      return numberOfVowelsList;
  },
  lastVowel: (names) => {

  },
  firstVowel: (names) => {

  },
  length: (names) => {

  }
};