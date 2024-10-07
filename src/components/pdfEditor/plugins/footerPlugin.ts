import {
  Plugin,
  Schema,
  DEFAULT_FONT_NAME,
  PDFRenderProps,
  UIRenderProps,
  getFallbackFontName,
} from "@pdfme/common";
import { PDFDocument, rgb } from "pdf-lib";
import { pdfRender as textPdfRender } from "./defaultText/pdfRender.js";

interface FooterSchema extends Schema {
  companyAddress: FieldProperties;
  companyEmail: FieldProperties;
  companyPhone: FieldProperties;
}

interface FieldProperties {
  value: string;
  fontName: string;
  fontSize: number;
  fontColor: string;
  opacity: number;
  rotation: number;
}

const hexToRgb = (hex: string) => {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r / 255, g / 255, b / 255];
};

export const footerBlock: Plugin<FooterSchema> = {
  ui: async (arg) => {
    const { schema, value, onChange, rootElement, mode } = arg;

    const container = document.createElement("div");
    container.style.fontFamily = "Arial";
    container.style.borderTop = "2px solid #000";
    container.style.paddingTop = "5px";
    container.style.display = "flex";
    container.style.marginTop = "270";

    container.style.justifyContent = "space-between"; // Evenly space fields

    // Function to create editable fields
    const createEditableField = (
      field: FieldProperties,
      onChange: (newField: FieldProperties) => void,
      style: Partial<CSSStyleDeclaration> = {}
    ) => {
      const fieldElement = document.createElement("div");
      fieldElement.textContent = field.value;
      fieldElement.contentEditable = mode !== "viewer" ? "true" : "false";
      fieldElement.style.border = "1px solid #ddd";
      fieldElement.style.padding = "3px";
      fieldElement.style.fontSize = `${field.fontSize || 22}px`;
      fieldElement.style.color = field.fontColor || "black";
      fieldElement.style.opacity =
        field.opacity !== undefined ? field.opacity.toString() : "1";
      fieldElement.style.transform = `rotate(${field.rotation || 0}deg)`;
      Object.assign(fieldElement.style, style);

      if (mode !== "viewer") {
        fieldElement.addEventListener("input", () => {
          onChange({
            ...field,
            value: fieldElement.innerText,
          });
        });
      }

      return fieldElement;
    };

    // Add the fields in a single line layout
    const companyAddressField = createEditableField(
      schema.companyAddress,
      (newField) => {
        onChange && onChange({ ...schema, companyAddress: newField });
      },
      { marginRight: "10px" }
    );

    const companyEmailField = createEditableField(
      schema.companyEmail,
      (newField) => {
        onChange && onChange({ ...schema, companyEmail: newField });
      },
      { marginRight: "10px" }
    );

    const companyPhoneField = createEditableField(
      schema.companyPhone,
      (newField) => {
        onChange && onChange({ ...schema, companyPhone: newField });
      }
    );

    container.appendChild(companyAddressField);
    container.appendChild(companyEmailField);
    container.appendChild(companyPhoneField);

    rootElement.appendChild(container);
  },
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
  propPanel: {
    schema: {
      companyAddress: {
        type: "object",
        properties: {
          value: { type: "string", title: "Company Address" },
          fontName: { type: "string", title: "Font Name" },
          fontSize: { type: "number", title: "Font Size" },
          fontColor: { type: "string", title: "Font Color" },
          opacity: { type: "number", title: "Opacity" },
          rotation: { type: "number", title: "Rotation (degrees)" },
        },
      },
      companyEmail: {
        type: "object",
        properties: {
          value: { type: "string", title: "Company Email" },
          fontName: { type: "string", title: "Font Name" },
          fontSize: { type: "number", title: "Font Size" },
          fontColor: { type: "string", title: "Font Color" },
          opacity: { type: "number", title: "Opacity" },
          rotation: { type: "number", title: "Rotation (degrees)" },
        },
      },
      companyPhone: {
        type: "object",
        properties: {
          value: { type: "string", title: "Company Phone" },
          fontName: { type: "string", title: "Font Name" },
          fontSize: { type: "number", title: "Font Size" },
          fontColor: { type: "string", title: "Font Color" },
          opacity: { type: "number", title: "Opacity" },
          rotation: { type: "number", title: "Rotation (degrees)" },
        },
      },
    },

    defaultSchema: {
      type: "footer",
      companyAddress: {
        value: "Company Address",
        fontName: "Helvetica",
        fontSize: 22,
        fontColor: "#000000",
        opacity: 1,
        rotation: 0,
      },
      companyEmail: {
        value: "company@example.com",
        fontName: "Helvetica",
        fontSize: 22,
        fontColor: "#000000",
        opacity: 1,
        rotation: 0,
      },
      companyPhone: {
        value: "+1 234 567 890",
        fontName: "Helvetica",
        fontSize: 22,
        fontColor: "#000000",
        opacity: 1,
        rotation: 0,
      },

      position: { x: 0, y: 276.98 },
      icon: `<svg width="27px" height="27px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.7446 1.99581C18.9355 1.99581 19.9103 2.92097 19.9894 4.09176L19.9946 4.24581V19.7439C19.9946 20.9347 19.0695 21.9095 17.8987 21.9887L17.7446 21.9939H6.24475C5.05389 21.9939 4.07911 21.0687 3.99994 19.8979L3.99475 19.7439V4.24581C3.99475 3.05495 4.91991 2.08017 6.0907 2.001L6.24475 1.99581H17.7446ZM17.7446 3.49581H6.24475C5.86506 3.49581 5.55126 3.77797 5.5016 4.14404L5.49475 4.24581V19.7439C5.49475 20.1236 5.77691 20.4374 6.14298 20.487L6.24475 20.4939H17.7446C18.1243 20.4939 18.4381 20.2117 18.4878 19.8456L18.4946 19.7439V4.24581C18.4946 3.86612 18.2125 3.55232 17.8464 3.50266L17.7446 3.49581Z" fill="#212121"/>
      <path d="M7 15.75V17.25C7 18.2165 7.7835 19 8.75 19H15.25C16.2165 19 17 18.2165 17 17.25V15.75C17 14.7835 16.2165 14 15.25 14H8.75C7.7835 14 7 14.7835 7 15.75ZM8.75 15.5H15.25C15.3881 15.5 15.5 15.6119 15.5 15.75V17.25C15.5 17.3881 15.3881 17.5 15.25 17.5H8.75C8.61193 17.5 8.5 17.3881 8.5 17.25V15.75C8.5 15.6119 8.61193 15.5 8.75 15.5Z" fill="#212121"/>
      </svg>`,
      width: 210, // A4 width in mm
      height: 20,
    },
  },
};
