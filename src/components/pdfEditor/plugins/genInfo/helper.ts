import { text } from "@pdfme/schemas";
import {
  DEFAULT_ALIGNMENT,
  DEFAULT_FONT_SIZE,
  DEFAULT_LINE_HEIGHT,
  DEFAULT_CHARACTER_SPACING,
  DEFAULT_FONT_COLOR,
  ALIGN_RIGHT,
  ALIGN_CENTER,
  ALIGN_LEFT,
  VERTICAL_ALIGN_TOP,
  VERTICAL_ALIGN_MIDDLE,
  VERTICAL_ALIGN_BOTTOM,
} from "../defaultText/constants";
import { HEX_COLOR_PATTERN } from "../../constants";

export const getDefaultCellStyles = () => ({
  fontName: undefined,
  alignment: DEFAULT_ALIGNMENT,
  verticalAlignment: VERTICAL_ALIGN_MIDDLE,
  fontSize: DEFAULT_FONT_SIZE,
  lineHeight: DEFAULT_LINE_HEIGHT,
  characterSpacing: DEFAULT_CHARACTER_SPACING,
  fontColor: DEFAULT_FONT_COLOR,
  backgroundColor: "",
});
export const getDefaultFieldsVals = () => ({
  organization: {
    value: "Organization Name",
    fontName: "Helvetica",
    fontSize: 20,
    fontColor: "#000000",
    opacity: 1,
    rotation: 0,
  },
  taskDescription: {
    value: "Task Description",
    fontName: "Helvetica",
    fontSize: 20,
    fontColor: "#000000",
    opacity: 1,
    rotation: 0,
  },
});
export const getCellPropPanelSchema = (arg: {
  i18n: (key: string) => string;
  fallbackFontName: string;
  fontNames: string[];
  isBody?: boolean;
}) => {
  const { i18n, fallbackFontName, fontNames, isBody } = arg;

  return {
    fontName: {
      title: i18n("schemas.text.fontName"),
      type: "string",
      widget: "select",
      default: fallbackFontName,
      props: {
        options: fontNames.map((name) => ({ label: name, value: name })),
      },
      span: 12,
    },
    fontSize: {
      title: i18n("schemas.text.size"),
      type: "number",
      widget: "inputNumber",
      props: { min: 0 },
      span: 6,
    },
    characterSpacing: {
      title: i18n("schemas.text.spacing"),
      type: "number",
      widget: "inputNumber",
      props: { min: 0 },
      span: 6,
    },
    alignment: {
      title: i18n("schemas.text.textAlign"),
      type: "string",
      widget: "select",
      props: {
        options: [
          { label: i18n("schemas.left"), value: ALIGN_LEFT },
          { label: i18n("schemas.center"), value: ALIGN_CENTER },
          { label: i18n("schemas.right"), value: ALIGN_RIGHT },
        ],
      },
      span: 8,
    },
    verticalAlignment: {
      title: i18n("schemas.text.verticalAlign"),
      type: "string",
      widget: "select",
      props: {
        options: [
          { label: i18n("schemas.top"), value: VERTICAL_ALIGN_TOP },
          { label: i18n("schemas.middle"), value: VERTICAL_ALIGN_MIDDLE },
          { label: i18n("schemas.bottom"), value: VERTICAL_ALIGN_BOTTOM },
        ],
      },
      span: 8,
    },

    fontColor: {
      title: i18n("schemas.textColor"),
      type: "string",
      widget: "color",
      rules: [{ pattern: HEX_COLOR_PATTERN, message: i18n("hexColorPrompt") }],
    },

    backgroundColor: {
      title: i18n("schemas.backgroundColor"),
      type: "string",
      widget: "color",
      rules: [{ pattern: HEX_COLOR_PATTERN, message: i18n("hexColorPrompt") }],
    },
    ...(isBody
      ? {
          alternateBackgroundColor: {
            title: i18n("schemas.table.alternateBackgroundColor"),
            type: "string",
            widget: "color",
            rules: [
              { pattern: HEX_COLOR_PATTERN, message: i18n("hexColorPrompt") },
            ],
          },
        }
      : {}),
    /* "-": { type: "void", widget: "Divider" },
    name: {
      title: "name",
      type: "textArea",
      widget: "lineTitle",
      span: 24,
    },
    age: {
      title: "age",
      type: "number",
      widget: "inputNumber",
      props: { step: 1, min: 0 },
      span: 24,
    }, */
  };
};
