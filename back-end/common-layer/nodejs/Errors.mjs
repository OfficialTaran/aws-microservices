class InvalidQuantityError extends Error {
  constructor(message) {
    super(message);
    this.name = 'InvalidQuantityError';
  }
}

class BadProductIDError extends Error {
  constructor(message) {
    super(message);
    this.name = 'BadProductIDError';
  }
}

export { BadProductIDError, InvalidQuantityError }