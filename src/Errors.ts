export const ID_LENGHT_REQUIRED = "idLenghtRequired";
export const INDEX_RANGE_REACHED = "indexRangeReached";

class BufferIdError extends Error {
  code: string;

  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

export default BufferIdError;
