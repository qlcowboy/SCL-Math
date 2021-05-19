import { BigNumber } from "@ethersproject/bignumber";
import { expect } from "chai";
import fp from "evm-fp";
import forEach from "mocha-each";

import { E, MAX_UD60x18, MAX_WHOLE_UD60x18, PI } from "../../../../helpers/constants";
import { exp2 } from "../../../../helpers/math";
import { bn } from "../../../../helpers/numbers";

export default function shouldBehaveLikeExp2(): void {
  context("when x is zero", function () {
    it("returns 1", async function () {
      const x: BigNumber = bn("0");
      const result: BigNumber = await this.contracts.prbMathUd60x18.doExp2(x);
      expect(fp("1")).to.equal(result);
    });
  });

  context("when x is positive", function () {
    context("when x is greater than or equal to 128", function () {
      const testSets = [fp("128"), fp(MAX_WHOLE_UD60x18), fp(MAX_UD60x18)];

      forEach(testSets).it("takes %e and reverts", async function (x: BigNumber) {
        await expect(this.contracts.prbMathUd60x18.doExp2(x)).to.be.reverted;
      });
    });

    context("when x is less than 128", function () {
      const testSets = [
        ["1e-18"],
        ["1e-15"],
        ["1"],
        ["2"],
        [E],
        ["3"],
        [PI],
        ["4"],
        ["11.89215"],
        ["16"],
        ["20.82"],
        ["33.333333"],
        ["64"],
        ["71.002"],
        ["88.7494"],
        ["95"],
        ["127"],
        ["127.999999999999999999"],
      ];

      forEach(testSets).it("takes %e and returns the correct value", async function (x: string) {
        const result: BigNumber = await this.contracts.prbMathUd60x18.doExp2(fp(x));
        const expected: BigNumber = fp(exp2(x));
        expect(expected).to.be.near(result);
      });
    });
  });
}
