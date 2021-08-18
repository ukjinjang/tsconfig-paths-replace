import execa from 'execa';
import fs from 'fs';

jest.setTimeout(10000);

describe('tsconfig-paths-replace', () => {
  it('should runrunrun', async () => {
    expect.assertions(6);

    await execa('ts-node', [
      'src',
      '--project',
      './test/tsconfig.test.json',
      '--src',
      './test/samples',
      '--out',
      './test/samples',
      '--emit',
      './dist-test',
    ]);

    const tpFax = fs
      .readFileSync('./dist-test/awesome/print/fax/index.js')
      .toString();

    expect(tpFax).toContain("import { beep } from '../beep';");
    expect(tpFax).toContain("import { sum } from '../../math/sum';");
    expect(tpFax).toContain("import { subtract } from '../../math/subtract';");
    expect(tpFax).toContain("import { magic } from '../../../magic';");

    const tpMagic = fs.readFileSync('./dist-test/magic/index.js').toString();

    expect(tpMagic).toContain("import { sum } from '../awesome/math/sum';");
    expect(tpMagic).toContain(
      "import { subtract } from '../awesome/math/subtract';"
    );
  });
});
