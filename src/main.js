import "./css/index.css";
import IMask from "imask";

const ccBgColor01 = document.querySelector(
  ".cc-bg svg > g g:nth-child(1) path"
);
const ccBgColor02 = document.querySelector(
  ".cc-bg svg > g g:nth-child(2) path"
);
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img");
const ccHolder = document.querySelector(".cc-holder .value");
const ccSecurity = document.querySelector(".cc-security .value");
const ccNumber = document.querySelector(".cc-number");
const ccExpiration = document.querySelector(".cc-expiration .value");

const form = document.querySelector("form");
const addButton = document.querySelector("#addCard");
const cardHolder = document.querySelector("#card-holder");
const securityCode = document.querySelector("#security-code");
const expirationDate = document.querySelector("#expiration-date");
const cardNumber = document.querySelector("#card-number");

const currentYear = String(new Date().getFullYear()).slice(2);
const maximumYearExpiration = String(new Date().getFullYear() + 10).slice(2);

function setCardType(type) {
  const colorsCard = {
    visa: ["#2D57F2", "#436D99"],
    mastercard: ["#DF6F29", "#C69347"],
    nubank: ["#D108A5", "#DD54F3"],
    default: ["black", "gray"],
  };

  ccBgColor01.setAttribute("fill", colorsCard[type][0]);
  ccBgColor02.setAttribute("fill", colorsCard[type][1]);
  ccLogo.setAttribute("src", `cc-${type}.svg`);
}
globalThis.setCardType = setCardType;

const securityCodeMasked = {
  mask: "0000",
};
const cvcMaske = IMask(securityCode, securityCodeMasked);

const expirationDateMasked = {
  mask: "MM{/}YY",
  blocks: {
    YY: {
      mask: IMask.MaskedRange,
      from: currentYear,
      to: maximumYearExpiration,
    },

    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },
  },
};
const expirationMaske = IMask(expirationDate, expirationDateMasked);

const cardNumberMaske = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardType: "visa",
    },

    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardType: "mastercard",
    },

    {
      mask: "0000 000000 00000",
      regex: /^3[4-7]\d{0,13}/,
      cardType: "nubank",
    },

    {
      mask: "0000 0000 0000 0000",
      cardType: "default",
    },
  ],
  dispatch: function (appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "");
    const foundMask = dynamicMasked.compiledMasks.find(function (item) {
      return number.match(item.regex);
    });

    return foundMask;
  },
};
const cardNumberMasked = IMask(cardNumber, cardNumberMaske);

form.addEventListener("submit", (event) => event.preventDefault());

addButton.addEventListener("click", () => alert("Cartão adicionado"));

cardHolder.addEventListener("input", () => {
  ccHolder.innerText =
    cardHolder.value.length === 0 ? "FULANO DA SILVA" : cardHolder.value;
});

function updateCvc(code) {
  ccSecurity.innerText = code.length === 0 ? "123" : code;
}

cvcMaske.on("accept", () => updateCvc(cvcMaske.value));

function updateNumberCard(number) {
  ccNumber.innerText = number.length === 0 ? "1234 5678 9012 3456" : number;
}

cardNumberMasked.on("accept", () => {
  const cardType = cardNumberMasked.masked.currentMask.cardType;
  setCardType(cardType);
  updateNumberCard(cardNumberMasked.value);
});

function updateExpirationDate(date) {
  ccExpiration.innerText = date.length === 0 ? "02/32" : date;
}

expirationMaske.on("accept", () => updateExpirationDate(expirationMaske.value));
