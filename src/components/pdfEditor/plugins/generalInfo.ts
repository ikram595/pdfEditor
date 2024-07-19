import {
  Plugin,
  Schema,
  DEFAULT_FONT_NAME,
  PDFRenderProps,
  UIRenderProps,
  getFallbackFontName,
} from "@pdfme/common";
import { uiRender as textUiRender } from "./defaultText/uiRender.js";
import { pdfRender as textPdfRender } from "./defaultText/pdfRender.js";
import type { GenSchema } from "./genInfo/types.js";
import {
  getCellPropPanelSchema,
  getDefaultCellStyles,
  getDefaultFieldsVals,
} from "./genInfo/helper.js";

const createTextDiv = (schema: GenSchema) => {
  const { width, height } = schema;
  const textDiv = document.createElement("div");

  textDiv.style.position = "absolute";
  textDiv.style.zIndex = "1";
  textDiv.style.width = `${width}mm`;
  textDiv.style.height = `${height}mm`;
  return textDiv;
};
export const generalInfoBlock: Plugin<GenSchema> = {
  pdf: async (arg: PDFRenderProps<GenSchema>) => {
    const { schema } = arg;
    const { position, width, height } = schema;
    // TEXT
    await textPdfRender({
      ...arg,
      schema: {
        ...schema,
        type: "text",
        backgroundColor: "",
        position: {
          x: position.x,
          y: position.y,
        },
        width: width,
        height: height,
      },
    });
  },
  ui: async (arg: UIRenderProps<GenSchema>) => {
    const { schema, rootElement } = arg;
    const { width, height, backgroundColor } = schema;
    rootElement.style.backgroundColor = backgroundColor;
    const textDiv = createTextDiv(schema);
    await textUiRender({
      ...arg,
      schema: { ...schema, backgroundColor: "" },
      rootElement: textDiv,
    });
    rootElement.appendChild(textDiv);
  },
  propPanel: {
    schema: ({ options, i18n }) => {
      const font = options.font || {
        [DEFAULT_FONT_NAME]: { data: "", fallback: true },
      };
      const fontNames = Object.keys(font);
      const fallbackFontName = getFallbackFontName(font);
      return getCellPropPanelSchema({ i18n, fontNames, fallbackFontName });
    },
    defaultSchema: {
      type: "text",
      icon: `<svg version="1.0" xmlns="http://www.w3.org/2000/svg"
      width="15.000000pt" height="15.000000pt" viewBox="0 0 512.000000 512.000000"
      preserveAspectRatio="xMidYMid meet">
     
     <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
     fill="#000000" stroke="none">
     <path d="M501 5105 c-177 -39 -347 -171 -429 -335 -77 -153 -72 4 -72 -2210 0
     -2214 -5 -2057 72 -2210 73 -145 203 -257 370 -318 l73 -27 2012 -3 c2250 -3
     2088 -8 2242 70 149 75 272 221 324 383 l22 70 0 2035 0 2035 -22 70 c-52 163
     -175 309 -323 383 -153 77 5 72 -2215 71 -1658 0 -2001 -3 -2054 -14z m4092
     -445 c21 -14 50 -43 65 -64 l27 -39 0 -1997 0 -1996 -25 -37 c-14 -21 -43 -50
     -64 -65 l-39 -27 -1997 0 -1997 0 -39 27 c-21 15 -50 44 -64 65 l-25 37 -3
     1975 c-2 1341 0 1988 7 2012 13 42 71 106 115 125 26 11 369 13 2017 11 l1985
     -2 37 -25z"/>
     <path d="M1145 4256 c-147 -36 -252 -145 -284 -294 -15 -72 -15 -811 0 -884
     32 -152 144 -264 297 -297 74 -16 2729 -16 2804 0 152 32 264 144 297 297 15
     72 15 812 0 884 -33 153 -145 265 -297 297 -79 16 -2748 14 -2817 -3z"/>
     </g>
     </svg>`,
      content: "Type Something...",
      position: { x: 0, y: 0 },
      width: 180,
      height: 50,
      ...getDefaultCellStyles(),
    },
  },
};
