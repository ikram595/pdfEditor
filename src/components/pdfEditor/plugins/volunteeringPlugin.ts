import { Plugin, Schema } from "@pdfme/common";
import { PDFDocument, rgb } from "pdf-lib";
import { uiRender as textUiRender } from "./defaultText/uiRender.js";
import { pdfRender as textPdfRender } from "./defaultText/pdfRender.js";
import {
  getCellPropPanelSchema,
  getDefaultCellStyles,
  getDefaultFieldsVals,
} from "./genInfo/helper.js";
interface VolunteerSchema extends Schema {
  volunteers: Volunteer[];
}

interface Volunteer {
  organization: FieldProperties;
  taskDescription: FieldProperties;
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

export const volunteerBlock: Plugin<VolunteerSchema> = {
  ui: async (arg) => {
    const { schema, value, onChange, rootElement, mode } = arg;

    const container = document.createElement("div");
    container.style.fontFamily = "Arial";

    // Block title
    const titleElement = document.createElement("div");
    titleElement.textContent = "Volunteer Experience"; // Customize the title as needed
    titleElement.style.fontWeight = "bold";
    titleElement.style.fontSize = "18px";
    titleElement.style.marginBottom = "5px";
    container.appendChild(titleElement);

    schema.volunteers.forEach((volunteer, volunteerIndex) => {
      const volunteerContainer = document.createElement("div");
      volunteerContainer.style.borderBottom = "1px solid #ccc";
      volunteerContainer.style.paddingBottom = "5px";
      volunteerContainer.style.marginBottom = "5px";

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

      // Add the fields in a block layout
      const organizationField = createEditableField(
        volunteer.organization,
        (newField) => {
          const updatedVolunteers = schema.volunteers.map((vol, index) =>
            index === volunteerIndex ? { ...vol, organization: newField } : vol
          );
          onChange && onChange({ key: "volunteers", value: updatedVolunteers });
        },
        { fontWeight: "bold", marginBottom: "3px" }
      );

      const taskDescriptionField = createEditableField(
        volunteer.taskDescription,
        (newField) => {
          const updatedVolunteers = schema.volunteers.map((vol, index) =>
            index === volunteerIndex
              ? { ...vol, taskDescription: newField }
              : vol
          );
          onChange && onChange({ key: "volunteers", value: updatedVolunteers });
        },
        { marginBottom: "3px" }
      );

      volunteerContainer.appendChild(organizationField);
      volunteerContainer.appendChild(taskDescriptionField);

      container.appendChild(volunteerContainer);
    });

    // Add button to add new volunteer experience
    if (mode !== "viewer") {
      const addButton = document.createElement("button");
      addButton.textContent = "Add Volunteer Experience";
      addButton.addEventListener("click", () => {
        const firstVolunteer = schema.volunteers[0];
        const newVolunteer: Volunteer = {
          organization: {
            ...firstVolunteer.organization,
            value: "Organization Name",
          },
          taskDescription: {
            ...firstVolunteer.taskDescription,
            value: "Task Description",
          },
        };
        const updatedVolunteers = [...schema.volunteers, newVolunteer];
        onChange && onChange({ key: "volunteers", value: updatedVolunteers });
      });
      container.appendChild(addButton);
    }

    rootElement.appendChild(container);
  },
  pdf: async (arg) => {
    const { schema } = arg;
    const { position, width, height } = schema;
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
        volunteers: [
          {
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
          },
        ],
      },
    });
  },
  propPanel: {
    schema: {
      volunteers: {
        type: "array",
        title: "Volunteers",
        items: {
          type: "object",
          properties: {
            organization: {
              type: "object",
              properties: {
                value: { type: "string", title: "Organization" },
                fontName: { type: "string", title: "Font Name" },
                fontSize: { type: "number", title: "Font Size" },
                fontColor: { type: "string", title: "Font Color" },
                opacity: { type: "number", title: "Opacity" },
                rotation: { type: "number", title: "Rotation (degrees)" },
              },
            },
            taskDescription: {
              type: "object",
              properties: {
                value: { type: "string", title: "Task Description" },
                fontName: { type: "string", title: "Font Name" },
                fontSize: { type: "number", title: "Font Size" },
                fontColor: { type: "string", title: "Font Color" },
                opacity: { type: "number", title: "Opacity" },
                rotation: { type: "number", title: "Rotation (degrees)" },
              },
            },
          },
        },
      },
    },
    defaultSchema: {
      type: "volunteer",
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
      position: { x: 0, y: 0 },
      width: 200, // A4 width in mm
      height: 40, // A4 height in mm

      volunteers: [
        {
          organization: {
            value: "Organization Name",
            fontName: "Helvetica",
            fontSize: 22,
            fontColor: "#000000",
            opacity: 1,
            rotation: 0,
          },
          taskDescription: {
            value: "Task Description",
            fontName: "Helvetica",
            fontSize: 22,
            fontColor: "#000000",
            opacity: 1,
            rotation: 0,
          },
        },
      ],
      ...getDefaultCellStyles(),
    },
  },
};
