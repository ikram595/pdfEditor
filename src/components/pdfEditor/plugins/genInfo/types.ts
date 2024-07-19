import type { ALIGNMENT, VERTICAL_ALIGNMENT } from "../defaultText/types";
import type { Schema } from "@pdfme/common";

export type Spacing = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

export interface CellStyle {
  fontName?: string;
  alignment: ALIGNMENT;
  verticalAlignment: VERTICAL_ALIGNMENT;
  fontSize: number;
  lineHeight: number;
  characterSpacing: number;
  fontColor: string;
  backgroundColor: string;
}

export type GenSchema = Schema & CellStyle;
