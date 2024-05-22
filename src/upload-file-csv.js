import assert from "node:assert";
import { generate } from "csv-generate";
import { parse } from "csv-parse";

(async () => {
  const parser = generate({
    high_water_mark: 64 * 64,
    length: 10,
  }).pipe(parse());

  let count = 0;

  process.stdout.write("start\n");

  for await (const record of parser) {
    // Report current line
    process.stdout.write(`Task ${count}, Descrição da Task ${count++}\n`);

    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  process.stdout.write("...done\n");
  // Validation
  assert.strictEqual(count, 10);
})();
