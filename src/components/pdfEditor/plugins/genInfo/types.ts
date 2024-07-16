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
  /*borderColor: string;
   borderWidth: BoxDimensions;
  padding: BoxDimensions; */
}

interface GeneralInfo {
  name: FieldProperties;
  age: FieldProperties;
  content: ContentInput;
}
interface ContentInput {
  body: string[][];
  head: string[][];
  columns: number[];
}
interface FieldProperties {
  value: string;
  fontName?: string;
  fontSize: number;
  fontColor: string;
}
export type GenSchema = Schema & CellStyle & GeneralInfo;
/* export type CellSchema = Schema & CellStyle; */
