
function code() {

  const text = document.getElementById("inputText").value;
  const txLength = text.length;

  const txSpliced = [];
  const txReordered = [txLength];
  const characters = {};

  let pointer = 0;

  const Base64 = Object.freeze([
    "1/64", "1/32", "1/16", "1/8", "1/4", "1/2",
    "1", "2", "4", "8", "16", "32", "64",
  ]);


  for (let i = 0; i < txLength; i++) {

    if (characters[text[i]]) {

      characters[text[i]]++

    }

    else {

      characters[text[i]] = 1;

    }

    txSpliced.push(text[i])

  }


  for (const charac in characters) {

    txReordered.push(characters[charac])
    txReordered.push(charac)

  }


  for (const charac in characters) {

    const times = characters[charac];
    const distance = [];


    for (let i = 0; i < times; i++) {

      let temp = txSpliced.indexOf(charac);
      distance.push(temp - pointer)
      pointer = temp;
      delete txSpliced[temp]

    }

    txReordered.splice(txReordered.indexOf(charac) + 1, 0, distance)

  }


  const numEncry = txLength.toString(4).split("").reverse().join("");  // arrumar na parte de descodificar
  txReordered.shift()

  let encrypted = numEncry;


  for (let i = 0; i < txReordered.length; i++) {


    if (typeof txReordered[i] === "number") {


      encrypted += "*";
      const quantEncry = txReordered[i].toString(2).split("").reverse().join("");


      for (let j = 0; j < quantEncry.length; j++) {


        let temp = "";

        if (quantEncry[j] == 1) {
          temp += Base64[j];
        }

        if (encrypted.lastIndexOf("*") + 1 === encrypted.length) {
          encrypted += temp;
        }

        else if (encrypted.lastIndexOf("+") + 1 === encrypted.length) {
          encrypted += temp;
        }

        else {
          encrypted += "+" + temp;
        }


      }

    }


    else if (typeof txReordered[i] === "string") {

      const binary = txReordered[i].charCodeAt(0).toString(2).padStart(8, 0);
      const inverseBinary = binary.replace(/0/g, 2).replace(/1/g, 0).replace(/2/g, 1);
      const converted = parseInt(inverseBinary, 2);
      encrypted += "?" + converted;

    }


    else {

      const num = txReordered[i];


      for (let i = 0; i < num.length; i++) {

        let temp = num[i];

        if (temp > 0) {

          let barPositive = (temp / 10) | 0;
          let arrowPositive = temp % 10;
          encrypted += "/".repeat(barPositive) + "<".repeat(arrowPositive) + "!";

        }

        else if (temp < 0) {

          let barNegative = (temp / 10) | 0;
          let arrowNegative = temp % 10;
          encrypted += "\\".repeat(-barNegative) + ">".repeat(-arrowNegative) + "!";

        }

        else {

          encrypted += "!";

        }

      }

    }

  }

  document.getElementById("output").innerText = encrypted

};

