const config = require("./config.js");

// Validate object contents based on given scheme
// Returns boolean
const validateObject = (object, scheme) => {
  // Validate if all required fields are provided
  if (Object.entries(object).length <= Object.entries(scheme).length) {
    console.error(
      `Object does not contain all required fields according to scheme`
    );
    return false;
  }

  Object.keys(scheme).forEach(key => {
    // Check if key exists in object
    if (Object.keys(object).indexOf(key) < 0) {
      console.error(
        `${key} is required by the scheme, but not found in the object`
      );
      return false;
    }

    // Retrieve value from object
    const value = object[key];

    // typeof Array is object, so check object isn't Array
    if (scheme[key] === "object" && Array.isArray(value)) {
      console.error(`${key} is of type array, should be ${scheme[key]}`);
      return false;
    }

    // Check if value is as expected from scheme
    if (typeof value !== scheme[key]) {
      // typeof Array is object, so check that on first fail
      if (!(scheme[key] === "array" && Array.isArray(value))) {
        // An inconsistency was definitely found according to scheme
        console.error(
          `${key} is of type ${typeof value}, should be ${scheme[key]}`
        );
        return false;
      }
    }
  });

  return true;
};

// Validate property existance in config
// Returns console.error on error, otherwise silent
const validateConfig = (...validateProperty) => {
  for (const fullProperty of validateProperty) {
    let lastProperty = config;

    // Split on dot to allow nested properties
    for (const singleProperty of fullProperty.split(".")) {
      lastProperty = lastProperty[singleProperty];

      if (!lastProperty) {
        console.error(`Missing property \`${fullProperty}\` in config`);
        return false;
      }
    }
  }

  return true;
};

// Convert string to sanitized integer
const stringToInt = string => {
  string = string.toString();
  return parseInt(string.replace(/\D/g, "")); //replace is faster then match+join https://jsben.ch/YPVJe
};

let i18n;
if (validateConfig("locale")) {
  const locale = require("./locale.js");
  // Return translation from string if found and not null, otherwise return original string
  i18n = (string, variables) => {
    // Get dictionary for locale, otherwise use first dictonary
    let dictionary = locale[config.locale];
    if (!dictionary) dictionary = locale[Object.keys(locale)[0]];

    // Get translation, otherwise use original string
    let translatedString = dictionary[string];
    if (!translatedString) translatedString = string;

    // If variables are provided, replace them with their value
    if (variables) {
      for (const variable of Object.entries(variables)) {
        translatedString = translatedString.replace(
          `{${variable[0]}}`,
          variable[1]
        );
      }
    }

    return translatedString;
  };
}

module.exports = Object.assign(
  {
    validateObject,
    validateConfig,
    stringToInt
  },
  validateConfig("locale") ? { i18n } : undefined
); // Add i18n when enabled in config
