
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

  document.getElementById("outputText").innerText = encrypted

};







function decode() {

  const text = document.getElementById("inputCode").value;
  const txLength = text.length;

  let originalReverse = (text.slice(0, text.indexOf("*"))).split("").reverse().join("");
  let originalTxLength = parseInt(originalReverse, 4);
  const original = Array(originalTxLength).fill("-!-");

  let position = 0;
  let times = 0;
  let character = null;


  for (let i = 0; i < txLength; i++) {


    
    if (text[i] == "*") {

      let timesList = null;

      for (let j = i; j < txLength && timesList == null; j++) {

        if (text[j] == "?") {

          timesList = text.slice(i + 1, j);
          i = j - 1;
          timesList = parseFraction(timesList);

        }

      }

      for (let k = 0; k < timesList.length; k++) { times += timesList[k] * 64; }

    }


    else if (text[i] == "?") {

      let charac = null;
      let controler = true;

      for (let j = i; j < txLength; j++) {

        if (controler && text[j] == "!" || text[j] == "<" || text[j] == ">" || text[j] == "/" || text[j] == "\\") {
          charac = text.slice(i + 1, j);
          controler = false;
          i = j - 1;
        }

        if (!controler) {

          j = txLength

        }

      }

      const binary = parseInt(charac).toString(2).padStart(8, 0);
      const originalBinary = binary.replace(/0/g, 2).replace(/1/g, 0).replace(/2/g, 1);
      const converted = parseInt(originalBinary, 2);
      character = String.fromCharCode(converted);

    }


    else if (text[i] == "!") {

      original[position] = character
      times -= 1;

    }

    else if (text[i] == "<") { position += 1; }

    else if (text[i] == ">") { position -= 1; }

    else if (text[i] == "/") { position += 10; }

    else if (text[i] == "\\") { position -= 10; }

  }

  const originalString = original.join("");

  document.getElementById("outputCode").innerText = originalString;

}




function parseFraction(example) {

  const fractions = example.split("+");

  for (let i = 0; i < fractions.length; i++) {

    parts = fractions[i].split("/");

    if (parts.length == 2) {

      const numerator = parts[0];
      const denominator = parts[1]

      fractions[i] = numerator / denominator;

    }

    else { console.warn("ERRO, Avise o criador!"); }

  }

  return fractions

}