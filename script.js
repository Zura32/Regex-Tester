// header ელემენტი
const headerElement = document.getElementById("header");

// burger მენიუსა და ნავიგაციის ელემენტები
const burgerMenuIcon = document.getElementById("burger-menu-icon");
const headerNav = document.getElementById("header-links");
const dropdownNav = document.getElementById("burger-menu-links");

// რეგულარული გამოსახულების ელემენტი
const userRegex  = document.getElementById("user-regex");

// შესატანი და გამოსატანი ველები 
const inputArea = document.getElementById("input-field");
const outputArea = document.getElementById("output-field");

// ღილაკები
const clearBtn = document.getElementById("clear-btn")

// მიმდინარე წლის ელემენტი
const currYearElement = document.getElementById("curr-year");

// შეტყობინების ელემენტი
const msg = document.getElementById("msg");

// რეგულარული გამოსახულებით ძებნის ოფციები
const allOccurrenceTick = document.getElementById("all-occurrence-tick");
const caseInsensitiveTick = document.getElementById("case-insensitive-tick");

// მიმდინარე წლის დინამიურად მინიჭება
const currTime = new Date();
currYearElement.textContent = currTime.getFullYear();

// რეგულარული გამოსახულების ელემენტები, მონაცემები
const regexDefinitions = "./regexes.json";
const regCheatsheet = document.getElementById("regexes");


window.addEventListener("scroll", () => {
  headerElement.style.position = "fixed";
})

async function parseRegexDefinitions() {
  try {
    const fetching = await fetch(regexDefinitions);
    const data = await fetching.json();

    data.forEach(element => {
      const regRow = document.createElement("div"); 
      const regex = document.createElement("span");
      const regexDef = document.createElement("p");
      
      regRow.classList.add("regex-row");
      regex.classList.add("regex");
      regexDef.classList.add("regex-def");

      regex.textContent = element.regex;
      regexDef.textContent = element.definition;

      regRow.appendChild(regex);
      regRow.appendChild(regexDef);
      

      regCheatsheet.appendChild(regRow);
    })


  } catch (error) {
    throwMessage(msg, error, "fail");
    console.error(error);
  }
}

parseRegexDefinitions();


function showHiddenElement(element) {
  if (element.hidden) element.hidden = false;
}

function hideElement(element) {
    if (!element.hidden) element.hidden = true;
}

function throwMessage(msgElement, msgContent, msgType) {
  showHiddenElement(msgElement);
  msgElement.textContent = msgContent;

  if (msgType == "success") msgElement.style.backgroundColor = "green";
  if (msgType == "fail") msgElement.style.backgroundColor = "red";

}

function isValidRegex(pattern) {
  try {
    new RegExp(pattern);
    hideElement(msg); 
    return true;
  } catch (error) {
    throwMessage(msg, "რეგულარული გამოსახულება სინტაქსურად არასწორია!", "fail");
    return false;
  }
}

function getObjectValuesLineByLine(obj) {
    
    let res = "";
    const keys = Object.keys(obj);
  
    keys.forEach(key => {
      res += obj[key] + "\n";
    });
    
    return res;
}

function findInTheText(text, pattern, startIndex) {
  
  const patternLen = pattern.length;
  let ind = 0;
  let start = 0;
  let end = 0;

  for (let i = startIndex; i < text.length; i++) {
    
    ind = i;
    start = i;

    let subStr = "";
    
    for (let j = 0; j < patternLen; j++) {
      
      if (ind == text.length && subStr.length < patternLen) return [];
      
      subStr += text[ind];
      ind++;
  
    }
    
    end = ind;

    if (pattern == subStr) return [start, end];
  
  }
  
  return [];

}

function replaceWithRange(str, start, end, newStr) {  
  return str.slice(0, start) + newStr + str.slice(end);
}

function highlight(originalData, FilteredData) {
    let splittedData = FilteredData.trim().split("\n");
    let startIndex = 0;

    for (let i = 0; i < splittedData.length; i++) {
      const range = findInTheText(originalData, splittedData[i], startIndex);
      if (range.length == 0) continue;

      const filteredSegmentStart = range[0];
      const filteredSegmentEnd = range[1];
      
      const highlightedElement = `<span class="highlight">${splittedData[i]}</span> `;
      originalData =  replaceWithRange(originalData, filteredSegmentStart, filteredSegmentEnd, highlightedElement);

      startIndex = filteredSegmentStart + highlightedElement.length;
    }

    outputArea.innerHTML = originalData;
    outputArea.hidden = false;
}

function runRegex(text, pattern) {

    outputArea.textContent = "";
    let regXpr = "";
    let option = "";
    let res = "";
    
    if (allOccurrenceTick.checked) option += "g";
    if (caseInsensitiveTick.checked) option += "i";

    regXpr = new RegExp(pattern, option);
    obj = text.match(regXpr);

    if (obj == null) {
      throwMessage(msg, "არაფერი მოიძებნა!", "fail");
      return res;
    }

    if (obj.length == 1) res = obj[Object.keys(obj)[0]];
     
    if (obj.length > 1) res = getObjectValuesLineByLine(obj);
    
        
    highlight(text, res);

    throwMessage(msg, "სულ მოიძებნა " + obj.length + " პატერნი!", "success");
}

// ივენთი მაშინ, როცა მომხმარებელს შეჰყავს რეგულარული გამოსახულება
userRegex.addEventListener("input", () => {
    const pattern = userRegex.value;
    const text = inputArea.value;

    if (pattern != "") {
        outputArea.hidden = true;

        if (text == "") {
            throwMessage(msg, "შესატანი ველი ცარიელია!", "fail");
            return;
        }

        if (text.length > 100000) {
          throwMessage(msg, "შეყვანილი ტექსტის სიგრძე მეტია 100000-ზე!", "fail");
          return;
        }

        if (isValidRegex(pattern)) runRegex(text, pattern);
    } else {
      hideElement(msg);
    }

});


// ველების გასუფთავება
clearBtn.addEventListener("click", () => {
    inputArea.value = "";
    outputArea.textContent = "";
    userRegex.value = "";
    outputArea.hidden = true;
    hideElement(msg);
})


burgerMenuIcon.addEventListener("click", () => {
  
  if (dropdownNav.style.display == "none") {
    dropdownNav.style.display = "block";
    const navChilds = headerNav.getElementsByTagName("a");
    
    for (let i = 0; i < navChilds.length; i++) {
      navChilds[i].classList.add("dropdown-link");
      dropdownNav.appendChild(navChilds[i]);
    }
  } else {
    dropdownNav.style.display = "none";
  }


})

