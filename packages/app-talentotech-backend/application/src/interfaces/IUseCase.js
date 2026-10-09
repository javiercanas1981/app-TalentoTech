export class IUseCase {
  async execute() {
    throw new Error("execute() must be implemented by a use case");
  }
}
