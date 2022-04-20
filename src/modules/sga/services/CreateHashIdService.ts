// eslint-disable-next-line
const Hashids = require('hashids/cjs');

class CreateHashIdService {
  execute(id: number, initLength: number): string {
    const hashids = new Hashids(
      'deus abençoe a america',
      initLength,
      'abcdefghijklmnopqrstuvwxyz1234567890',
    );

    return hashids.encode(id);
  }
}

export default CreateHashIdService;
