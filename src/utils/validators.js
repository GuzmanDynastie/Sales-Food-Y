export class Validators {
  static isPositiveNumber(value) {
    return typeof value === "number" && value > 0;
  }

  static isValidDateString(value) {
    return !isNaN(Date.parse(value));
  }

  static isValidNumberID(value) {
    return !isNaN(value);
  }

  static isValidStatus(value) {
    return ["active", "inactive"].includes(value);
  }

  static isNonEmptyString(value) {
    return typeof value === "string" && value.trim().length > 0;
  }
}
