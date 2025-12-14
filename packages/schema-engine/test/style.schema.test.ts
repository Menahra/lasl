import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  type MockInstance,
  vi,
} from "vitest";
import { validateSchema } from "../src/validator.ts";
import {
  marginPaddingShorthandValueRegExp,
  spacingValueRegExp,
  styleSchemaMock,
} from "./__mocks__/style.schema.mock.ts";
import {
  generateRandomStringNotMatchingPattern,
  getRandomInteger,
} from "./util.ts";

describe("style json schema", () => {
  let consoleErrorSpy: MockInstance;

  beforeEach(() => {
    consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
  });

  afterEach(() => {
    consoleErrorSpy.mockReset();
  });
  describe("color", () => {
    it("properly validates color", () => {
      const testData = [
        {
          color: "#121212",
          valid: true,
        },
        // allows upper case letters in hex
        {
          color: "#ABCDEF",
          valid: true,
        },
        // allows lower case letters in hex
        {
          color: "#abcdef",
          valid: true,
        },
        {
          color: `#${getRandomInteger(10, 99)}${getRandomInteger(10, 99)}${getRandomInteger(10, 99)}`,
          valid: true,
        },
        // needs to have # at beginning
        {
          color: "171717",
          valid: false,
        },
        {
          color: "171717#",
          valid: false,
        },
        // needs to be 6 characters long after #
        {
          color: "#12171",
          valid: false,
        },
        {
          color: "#1217",
          valid: false,
        },
        {
          color: "#121",
          valid: false,
        },
        {
          color: "#12",
          valid: false,
        },
        {
          color: "#1",
          valid: false,
        },
        {
          color: "#",
          valid: false,
        },
        {
          color: "rgb(17,17,17)",
          valid: true,
        },
        {
          color: `rgb(${getRandomInteger(1, 255)}, ${getRandomInteger(1, 255)}, ${getRandomInteger(1, 255)})`,
          valid: true,
        },
        // does not allow rgba format when starting with rgb
        {
          color: `rgb(${getRandomInteger(1, 255)}, ${getRandomInteger(1, 255)}, ${getRandomInteger(1, 255)}, ${Math.random()})`,
          valid: false,
        },
        // does not allow hex values
        {
          color: "rgb(ab, cd, ef)",
          valid: false,
        },
        // needs proper format
        {
          color: "rgb(17,17,17",
          valid: false,
        },
        {
          color: "rgb(17,17,)",
          valid: false,
        },
        {
          color: "rgb(17,17)",
          valid: false,
        },
        {
          color: "rgb(17)",
          valid: false,
        },
        {
          color: "rgba(17,17,17, 1)",
          valid: true,
        },
        {
          color: `rgba(${getRandomInteger(1, 255)}, ${getRandomInteger(1, 255)}, ${getRandomInteger(1, 255)}, ${Math.random()})`,
          valid: true,
        },
        {
          color: `rgba(${getRandomInteger(1, 255)}, ${getRandomInteger(1, 255)}, ${getRandomInteger(1, 255)}, .75)`,
          valid: true,
        },
        // does not allow hex values
        {
          color: "rgba(ab, cd, ef, 0.75)",
          valid: false,
        },
        {
          color: "rgba(17, 17, 17, 0.75",
          valid: false,
        },
        // does not allow rgb format when using rgba in beginning
        {
          color: "rgba(17,17,17)",
          valid: false,
        },
        {
          color: "rgba(17,17,17",
          valid: false,
        },
        {
          color: "rgba(17,17,)",
          valid: false,
        },
        {
          color: "rgba(17,17)",
          valid: false,
        },
        {
          color: "rgba(17)",
          valid: false,
        },
      ];
      for (const { color, valid } of testData) {
        expect(
          validateSchema(
            {
              color,
            },
            "http://example.com/style.schema.json",
          ),
        ).toEqual(valid);
      }
    });

    it("does not allow other strings than hex, rgb and rgba", () => {
      const hexRegExp = /^#[0-9a-fA-F]{6}$/;
      const rgbRegExp = /^rgb\(\d{1,3},\s?\d{1,3},\s?\d{1,3}\)$/;
      const rgbaRegExp =
        /^rgba\(\d{1,3},\s?\d{1,3},\s?\d{1,3},\s?(0|1|0?\.\d+)\)$/;
      // biome-ignore lint/suspicious/useIterableCallbackReturn: not in case of test
      Array.from({ length: 20 }, () => {
        const randomLength = getRandomInteger(1, 20);
        const randomString = generateRandomStringNotMatchingPattern(
          randomLength,
          [hexRegExp, rgbRegExp, rgbaRegExp],
        );
        expect(
          validateSchema(
            {
              color: randomString,
            },
            "http://example.com/style.schema.json",
          ),
        ).toBeFalsy();
      });
    });
  });

  describe("font-size", () => {
    it("properly validates font-size", () => {
      const testData = [
        {
          fontSize: "1px",
          valid: true,
        },
        {
          fontSize: "2.2rem",
          valid: true,
        },
        {
          fontSize: "0.1717mm",
          valid: true,
        },
        {
          fontSize: "1.215pt",
          valid: true,
        },
        {
          fontSize: "4.3vw",
          valid: true,
        },
        {
          fontSize: "5.4vh",
          valid: true,
        },
        {
          fontSize: `${Math.random()}%`,
          valid: true,
        },
        // multiple period not allowed
        {
          fontSize: "6.2.2rem",
          valid: false,
        },
        {
          fontSize: "1..2vh",
          valid: false,
        },
        // only period without number not allowed
        {
          fontSize: ".vh",
          valid: false,
        },
        {
          fontSize: "small",
          valid: true,
        },
        {
          fontSize: "medium",
          valid: true,
        },
        {
          fontSize: "large",
          valid: true,
        },
        {
          fontSize: "x-large",
          valid: true,
        },
        {
          fontSize: "xx-large",
          valid: true,
        },
        {
          fontSize: "larger",
          valid: true,
        },
        {
          fontSize: "smaller",
          valid: true,
        },
        {
          fontSize: "mediumer",
          valid: false,
        },
        {
          fontSize: "smal",
          valid: false,
        },
        {
          fontSize: "largo",
          valid: false,
        },
      ];

      for (const { fontSize, valid } of testData) {
        expect(
          validateSchema(
            {
              "font-size": fontSize,
            },
            "http://example.com/style.schema.json",
          ),
        ).toEqual(valid);
      }
    });

    it("does not allow other strings than a spacing value or small, medium, large, ...", () => {
      const specialStringsRegExp =
        /^small|medium|large|x-large|xx-large|larger|smaller$/;

      // biome-ignore lint/suspicious/useIterableCallbackReturn: not in case of test
      Array.from({ length: 20 }, () => {
        const randomLength = getRandomInteger(1, 20);
        const randomString = generateRandomStringNotMatchingPattern(
          randomLength,
          [spacingValueRegExp, specialStringsRegExp],
        );
        expect(
          validateSchema(
            {
              "font-size": randomString,
            },
            "http://example.com/style.schema.json",
          ),
        ).toBeFalsy();
      });
    });
  });

  describe("font-style", () => {
    it("only allows normal and italic", () => {
      const testData = [
        {
          fontStyle: "normal",
          valid: true,
        },
        {
          fontStyle: "italic",
          valid: true,
        },
        ...Array.from({ length: 20 }, () => {
          const randomLength = getRandomInteger(1, 20);
          const randomString = generateRandomStringNotMatchingPattern(
            randomLength,
            [/^normal|italic$/],
          );

          return {
            fontStyle: randomString,
            valid: false,
          };
        }),
      ];

      for (const { fontStyle, valid } of testData) {
        expect(
          validateSchema(
            {
              "font-style": fontStyle,
            },
            "http://example.com/style.schema.json",
          ),
        ).toEqual(valid);
      }
    });
  });

  describe("font-weight", () => {
    it("properly validates font-weight", () => {
      const allowedNumericWeights = [
        100, 200, 300, 400, 500, 600, 700, 800, 900,
      ];
      const allowedFontWeightValuesRegEx =
        /^normal|bold|bolder|lighter|[1-9]00$/;
      const testData = [
        ...allowedNumericWeights.map((weight) => ({
          fontWeight: weight.toString(),
          valid: true,
        })),
        {
          fontWeight: "normal",
          valid: true,
        },
        {
          fontWeight: "moreNormal",
          valid: false,
        },
        {
          fontWeight: "normaler",
          valid: false,
        },
        {
          fontWeight: "light",
          valid: false,
        },
        {
          fontWeight: "bold",
          valid: true,
        },
        {
          fontWeight: "lighter",
          valid: true,
        },
        {
          fontWeight: "moreLight",
          valid: false,
        },
        {
          fontWeight: "lightest",
          valid: false,
        },
        {
          fontWeight: "boldest",
          valid: false,
        },
        {
          fontWeight: "bolder",
          valid: true,
        },
        ...Array.from({ length: 20 }, () => {
          const randomLength = getRandomInteger(1, 20);
          const randomString = generateRandomStringNotMatchingPattern(
            randomLength,
            [allowedFontWeightValuesRegEx],
          );

          return {
            fontWeight: randomString,
            valid: false,
          };
        }),
      ];

      for (const { fontWeight, valid } of testData) {
        expect(
          validateSchema(
            {
              "font-weight": fontWeight,
            },
            "http://example.com/style.schema.json",
          ),
        ).toEqual(valid);
      }
    });
  });

  describe("margin and padding", () => {
    it("properly validates shorthand margin, padding as well as separate properties for them", () => {
      const propertiesToTest = [
        "margin",
        "margin-bottom",
        "margin-left",
        "margin-right",
        "margin-top",
        "padding",
        "padding-bottom",
        "padding-left",
        "padding-right",
        "padding-top",
      ];

      const testData = [
        { value: "10px", valid: () => true },
        { value: "5%", valid: () => true },
        { value: "10.10.17px", valid: () => false },
        { value: "#FFFFFF", valid: () => false },
        {
          value: "20px 5em",
          valid: (propertyName: string) =>
            propertyName === "margin" || propertyName === "padding",
        },
        {
          value: "20px 5em",
          valid: (propertyName: string) =>
            propertyName === "margin" || propertyName === "padding",
        },
        {
          value: "17vw 17.17vh 0.17mm",
          valid: (propertyName: string) =>
            propertyName === "margin" || propertyName === "padding",
        },
        {
          value: "0.17mm 9050in 1pt 4pc",
          valid: (propertyName: string) =>
            propertyName === "margin" || propertyName === "padding",
        },
        { value: "-5%", valid: () => false },
        ...Array.from({ length: 20 }, () => {
          const randomLength = getRandomInteger(1, 20);
          const randomString = generateRandomStringNotMatchingPattern(
            randomLength,
            [marginPaddingShorthandValueRegExp, spacingValueRegExp],
          );

          return {
            value: randomString,
            valid: () => false,
          };
        }),
      ];

      for (const propertyToTest of propertiesToTest) {
        for (const { value, valid } of testData) {
          const isValid = valid(propertyToTest);
          expect(
            validateSchema(
              {
                [propertyToTest]: value,
              },
              "http://example.com/style.schema.json",
            ),
          ).toEqual(isValid);
        }
      }
    });
  });

  it("properly validates schema with multiple properties", () => {
    expect(
      validateSchema(styleSchemaMock, "http://example.com/style.schema.json"),
    ).toBeTruthy();
  });

  it("does not allow any additional properties", () => {
    const testProperties = Array.from({ length: 20 }, () => {
      const randomLength = getRandomInteger(1, 20);
      const randomString = generateRandomStringNotMatchingPattern(
        randomLength,
        [marginPaddingShorthandValueRegExp, spacingValueRegExp],
      );
      return randomString;
    });

    for (const testProperty of testProperties) {
      expect(
        validateSchema(
          {
            [testProperty]: Math.random(),
          },
          "http://example.com/style.schema.json",
        ),
      ).toBeFalsy();

      expect(consoleErrorSpy).toHaveBeenCalledWith([
        expect.objectContaining({
          keyword: "additionalProperties",
          message: "must NOT have additional properties",
        }),
      ]);
    }
  });
});
