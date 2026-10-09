export class Stock {
  constructor(quantity = 0) {
    if (!Number.isInteger(quantity) || quantity < 0) {
      throw new Error("El stock debe ser un entero mayor o igual a cero");
    }

    this.quantity = quantity;
    Object.freeze(this);
  }

  get available() {
    return this.quantity > 0;
  }

  hasAvailable(quantity) {
    return (
      Number.isInteger(quantity) && quantity > 0 && this.quantity >= quantity
    );
  }

  decrease(quantity) {
    if (!this.hasAvailable(quantity)) {
      throw new Error("Stock insuficiente");
    }

    return new Stock(this.quantity - quantity);
  }

  increase(quantity) {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new Error("La cantidad a incrementar debe ser positiva");
    }

    return new Stock(this.quantity + quantity);
  }
}
