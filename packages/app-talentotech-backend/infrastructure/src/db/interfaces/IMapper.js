export class IMapper {
  toDomain() {
    throw new Error("toDomain() must be implemented by a mapper");
  }

  toPersistence() {
    throw new Error("toPersistence() must be implemented by a mapper");
  }
}
