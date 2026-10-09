export class OrderController {
  constructor(orderUseCase) {
    this.orderUseCase = orderUseCase;
  }

  create(data) {
    return this.orderUseCase.execute(data);
  }
}
