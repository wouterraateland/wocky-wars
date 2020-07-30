import { either } from "./functions";

const capitalize = (s) => `${s.substr(0, 1).toUpperCase()}${s.substr(1)}`;

const lowerCase = (s) => s.toLowerCase();

const toContext = (contexts) =>
  contexts.flatMap(([key, value]) => (value ? [key] : [])).join("_") ||
  undefined;

const cleanUrl = (s) => {
  try {
    return new URL(s).host.replace("www.", "");
  } catch (e) {
    return (s || "")
      .replace("http://", "")
      .replace("https://", "")
      .replace("www.", "");
  }
};

const concatSentence = (items, connective) =>
  capitalize(
    items.reduce(
      (acc, item, i) =>
        acc
          .concat(
            i === 0 ? "" : i === items.length - 1 ? ` ${connective} ` : ", "
          )
          .concat(item),
      ""
    )
  );

// eslint-disable-next-line no-useless-escape
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const isEmail = (s) => emailRegex.test(String(s).toLowerCase());

const copyTextFallback = (text) => {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  const success = either(
    () => document.execCommand("copy"),
    () => false
  );

  document.body.removeChild(textArea);
  return success;
};

const copyTextModern = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    return false;
  }
};

const copyTextToClipboard = async (text) =>
  navigator.clipboard ? await copyTextModern(text) : copyTextFallback(text);

export {
  capitalize,
  lowerCase,
  toContext,
  cleanUrl,
  isEmail,
  concatSentence,
  copyTextToClipboard,
};
