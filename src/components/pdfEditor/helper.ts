import {
  Template,
  Font,
  checkTemplate,
  getInputFromTemplate,
} from "@pdfme/common";
import { Form, Viewer, Designer } from "@pdfme/ui";
import { generate } from "@pdfme/generator";
import {
  text,
  readOnlyText,
  barcodes,
  image,
  readOnlyImage,
  svg,
  readOnlySvg,
  line,
  tableBeta,
  rectangle,
  ellipse,
} from "@pdfme/schemas";
import { generalInfoBlock } from "./plugins/generalInfo";
import { volunteerBlock } from "./plugins/volunteeringPlugin";
const fontObjList = [
  {
    fallback: true,
    label: "NotoSerifJP-Regular",
    url: "/fonts/NotoSerifJP-Regular.otf",
  },
  {
    fallback: false,
    label: "NotoSansJP-Regular",
    url: "/fonts/NotoSansJP-Regular.otf",
  },
];

export const getFontsData = async () => {
  const fontDataList = await Promise.all(
    fontObjList.map(async (font) => ({
      ...font,
      data: await fetch(font.url).then((res) => res.arrayBuffer()),
    }))
  );

  return fontDataList.reduce(
    (acc, font) => ({ ...acc, [font.label]: font }),
    {} as Font
  );
};

export const readFile = (
  file: File | null,
  type: "text" | "dataURL" | "arrayBuffer"
) => {
  return new Promise<string | ArrayBuffer>((r) => {
    const fileReader = new FileReader();
    fileReader.addEventListener("load", (e) => {
      if (e && e.target && e.target.result && file !== null) {
        r(e.target.result);
      }
    });
    if (file !== null) {
      if (type === "text") {
        fileReader.readAsText(file);
      } else if (type === "dataURL") {
        fileReader.readAsDataURL(file);
      } else if (type === "arrayBuffer") {
        fileReader.readAsArrayBuffer(file);
      }
    }
  });
};

export const cloneDeep = (obj: unknown) => JSON.parse(JSON.stringify(obj));

const getTemplateFromJsonFile = (file: File) => {
  return readFile(file, "text").then((jsonStr) => {
    const template: Template = JSON.parse(jsonStr as string);
    checkTemplate(template);
    return template;
  });
};

export const downloadJsonFile = (json: unknown, title: string) => {
  if (typeof window !== "undefined") {
    const blob = new Blob([JSON.stringify(json)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${title}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }
};

export const handleLoadTemplate = (
  e: React.ChangeEvent<HTMLInputElement>,
  currentRef: Designer | Form | Viewer | null
) => {
  if (e.target && e.target.files) {
    getTemplateFromJsonFile(e.target.files[0])
      .then((t) => {
        if (!currentRef) return;
        currentRef.updateTemplate(t);
      })
      .catch((e) => {
        alert(`Invalid template file.
--------------------------
${e}`);
      });
  }
};

export const getPlugins = () => {
  return {
    Text: text,
    ReadOnlyText: readOnlyText,
    GeneralInfo: generalInfoBlock,
    Table: tableBeta,
    Line: line,
    Rectangle: rectangle,
    Ellipse: ellipse,
    Image: image,
    QR: barcodes.qrcode,
    volunteerBlock: volunteerBlock,
  };
};

export const generatePDF = async (
  currentRef: Designer | Form | Viewer | null
) => {
  if (!currentRef) return;
  const template = currentRef.getTemplate();
  const inputs =
    typeof (currentRef as Viewer | Form).getInputs === "function"
      ? (currentRef as Viewer | Form).getInputs()
      : getInputFromTemplate(template);
  const font = await getFontsData();

  const pdf = await generate({
    template,
    inputs,
    options: { font, title: "pdfme" },
    plugins: getPlugins(),
  });

  const blob = new Blob([pdf.buffer], { type: "application/pdf" });
  window.open(URL.createObjectURL(blob));
};

export const isJsonString = (str: string) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

const getCertificateTemplate = (): Template => ({
  schemas: [
    {
      name: {
        type: "text",
        content: "Pet Name",
        position: {
          x: 25.06,
          y: 24.35,
        },
        width: 77.77,
        height: 18.7,
        rotate: 0,
        opacity: 1,
        fontSize: 36,
        fontColor: "#14b351",
        fontName: "NotoSerifJP-Regular",
      },
      photo: {
        type: "image",
        content:
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAM8AAAFDCAMAAACqWqp6AAAABGdBTUEAALGPC/xhBQA",
        position: {
          x: 24.99,
          y: 65.61,
        },
        width: 60.66,
        height: 93.78,
        rotate: 0,
        opacity: 1,
      },
      age: {
        type: "text",
        content: "4 years",
        position: {
          x: 35.5,
          y: 178.46,
        },
        width: 43.38,
        height: 6.12,
        rotate: 0,
        opacity: 1,
        fontSize: 12,
        fontName: "NotoSerifJP-Regular",
      },
      sex: {
        type: "text",
        content: "Male",
        position: {
          x: 35,
          y: 185.23,
        },
        width: 43.38,
        height: 6.12,
        rotate: 0,
        opacity: 1,
        fontSize: 12,
        fontName: "NotoSerifJP-Regular",
      },
      weight: {
        type: "text",
        content: "33 pounds",
        position: {
          x: 41.05,
          y: 192.26,
        },
        width: 43.38,
        height: 6.12,
        rotate: 0,
        opacity: 1,
        fontSize: 12,
        fontName: "NotoSerifJP-Regular",
      },
      breed: {
        type: "text",
        content: "Mutt",
        position: {
          x: 39,
          y: 199.09,
        },
        width: 43.38,
        height: 6.12,
        rotate: 0,
        opacity: 1,
        fontSize: 12,
        fontName: "NotoSerifJP-Regular",
      },
      owner: {
        type: "qrcode",
        content: "https://pdfme.com/",
        position: {
          x: 115.09,
          y: 204.43,
        },
        width: 26.53,
        height: 26.53,
        rotate: 0,
        opacity: 1,
      },
      signature: {
        type: "signature",
        content:
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPoAAACWCAMAAADABGUuAAAAM1BMVEVHcEwAAAAAAAA",
        position: {
          x: 115.22,
          y: 235.43,
        },
        width: 62.5,
        height: 37.5,
      },
    },
  ],
  basePdf:
    "data:application/pdf;base64,JVBERi0xLjQKJeLjz9MKNiAwIG9iago8PAovY2EgMQovQk0gL05vcm1hbAo+P",
});

const getInvoiceTemplate = (): Template => ({
  schemas: [
    {
      logo: {
        type: "readOnlySvg",
        position: {
          x: 20,
          y: 20,
        },
        content:
          '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke',
        width: 23.86,
        height: 23.86,
        readOnly: true,
      },
      head: {
        type: "readOnlyText",
        position: {
          x: 120.13,
          y: 20,
        },
        content: "INVOICE",
        width: 69.87,
        height: 22.68,
        rotate: 0,
        alignment: "left",
        verticalAlignment: "middle",
        fontSize: 40,
        lineHeight: 1,
        characterSpacing: 0,
        fontColor: "#000000",
        backgroundColor: "",
        opacity: 1,
        readOnly: true,
        fontName: "NotoSerifJP-Regular",
      },
      billedToLabel: {
        type: "readOnlyText",
        position: {
          x: 20,
          y: 57.88,
        },
        content: "Billed to:",
        width: 84.69,
        height: 9.42,
        rotate: 0,
        alignment: "left",
        verticalAlignment: "top",
        fontSize: 13,
        lineHeight: 1,
        characterSpacing: 0,
        fontColor: "#000000",
        backgroundColor: "",
        opacity: 1,
        readOnly: true,
        fontName: "NotoSerifJP-Regular",
      },
      billedToInput: {
        type: "text",
        content:
          "\nImani Olowe \n+123-456-7890 \n63 Ivy Road, Hawkville, GA, USA 31036",
        position: {
          x: 20,
          y: 67.94,
        },
        width: 84.95,
        height: 34.07,
        rotate: 0,
        alignment: "left",
        verticalAlignment: "top",
        fontSize: 13,
        lineHeight: 1,
        characterSpacing: 0,
        fontColor: "#000000",
        backgroundColor: "",
        opacity: 1,
        dynamicFontSize: {
          min: 3,
          max: 13,
          fit: "vertical",
        },
        fontName: "NotoSerifJP-Regular",
      },
      info: {
        type: "text",
        content: "Invoice No. 12345\n16 June 2025",
        position: {
          x: 119.87,
          y: 67.88,
        },
        width: 70.13,
        height: 20.31,
        rotate: 0,
        alignment: "right",
        verticalAlignment: "top",
        fontSize: 13,
        lineHeight: 1,
        characterSpacing: 0,
        fontColor: "#000000",
        backgroundColor: "",
        opacity: 1,
        dynamicFontSize: {
          min: 3,
          max: 13,
          fit: "vertical",
        },
        fontName: "NotoSerifJP-Regular",
      },
      orders: {
        type: "table",
        position: {
          x: 20,
          y: 110.81,
        },
        width: 170,
        height: 45.75920000000001,
        content:
          '[["Eggshell Camisole Top","1","$123","$123"],["Cuban Collar Shirt","2","$127","$254"]]',
        showHead: true,
        head: ["Item", "Quantity", "Unit Price", "Total"],
        headWidthPercentages: [
          49.538325694806396, 17.962830593295262, 19.26354959425127,
          13.23529411764708,
        ],
        fontName: "NotoSerifJP-Regular",
        tableStyles: {
          borderColor: "#000000",
          borderWidth: 0,
        },
        headStyles: {
          fontName: "NotoSerifJP-Regular",
          fontSize: 13,
          characterSpacing: 0,
          alignment: "center",
          verticalAlignment: "middle",
          lineHeight: 1,
          fontColor: "#000000",
          borderColor: "#000000",
          backgroundColor: "",
          borderWidth: {
            top: 0.1,
            right: 0,
            bottom: 0,
            left: 0,
          },
          padding: {
            top: 5,
            right: 5,
            bottom: 5,
            left: 5,
          },
        },
        bodyStyles: {
          fontName: "NotoSerifJP-Regular",
          fontSize: 13,
          characterSpacing: 0,
          alignment: "center",
          verticalAlignment: "middle",
          lineHeight: 1,
          fontColor: "#000000",
          borderColor: "#000000",
          backgroundColor: "",
          alternateBackgroundColor: "",
          borderWidth: {
            top: 0.1,
            right: 0,
            bottom: 0.1,
            left: 0,
          },
          padding: {
            top: 6,
            right: 5,
            bottom: 5,
            left: 5,
          },
        },
        columnStyles: {
          alignment: { 0: "left", 3: "right" },
        },
      },
      subtotalLabel: {
        type: "readOnlyText",
        position: {
          x: 138.01,
          y: 156.89,
        },
        content: "Subtotal",
        width: 25.42,
        height: 8.09,
        rotate: 0,
        alignment: "center",
        verticalAlignment: "top",
        fontSize: 13,
        lineHeight: 1,
        characterSpacing: 0,
        fontColor: "#000000",
        backgroundColor: "",
        opacity: 1,
        readOnly: true,
        fontName: "NotoSerifJP-Regular",
      },
      taxLabel: {
        type: "readOnlyText",
        position: {
          x: 138.01,
          y: 164.98,
        },
        content: "Tax (0%)",
        width: 25.42,
        height: 8.89,
        rotate: 0,
        alignment: "center",
        verticalAlignment: "top",
        fontSize: 13,
        lineHeight: 1,
        characterSpacing: 0,
        fontColor: "#000000",
        backgroundColor: "",
        opacity: 1,
        readOnly: true,
        fontName: "NotoSerifJP-Regular",
      },
      line: {
        type: "line",
        position: {
          x: 137.09,
          y: 174.35,
        },
        width: 52.91,
        height: 0.1,
        rotate: 0,
        opacity: 1,
        readOnly: true,
        color: "#000000",
      },
      subtotalInput: {
        type: "text",
        content: "$500",
        position: {
          x: 163.79,
          y: 157.1,
        },
        width: 26.21,
        height: 7.56,
        rotate: 0,
        alignment: "center",
        verticalAlignment: "top",
        fontSize: 13,
        lineHeight: 1,
        characterSpacing: 0,
        fontColor: "#000000",
        backgroundColor: "",
        opacity: 1,
        fontName: "NotoSerifJP-Regular",
      },
      taxInput: {
        type: "text",
        content: "$0",
        position: {
          x: 163.79,
          y: 164.98,
        },
        width: 26.21,
        height: 8.89,
        rotate: 0,
        alignment: "center",
        verticalAlignment: "top",
        fontSize: 13,
        lineHeight: 1,
        characterSpacing: 0,
        fontColor: "#000000",
        backgroundColor: "",
        opacity: 1,
        fontName: "NotoSerifJP-Regular",
      },
      totalLabel: {
        type: "readOnlyText",
        position: {
          x: 136.94,
          y: 174.64,
        },
        content: "Total",
        width: 27.01,
        height: 11,
        rotate: 0,
        alignment: "center",
        verticalAlignment: "top",
        fontSize: 20,
        lineHeight: 1,
        characterSpacing: 0,
        fontColor: "#000000",
        fontName: "NotoSerifJP-Regular",
        backgroundColor: "",
        opacity: 1,
        readOnly: true,
      },
      totalInput: {
        type: "text",
        content: "$500",
        position: {
          x: 164.05,
          y: 174.64,
        },
        width: 25.95,
        height: 11,
        rotate: 0,
        alignment: "center",
        verticalAlignment: "top",
        fontSize: 20,
        lineHeight: 1,
        characterSpacing: 0,
        fontColor: "#000000",
        backgroundColor: "",
        opacity: 1,
        fontName: "NotoSerifJP-Regular",
      },
      thankyou: {
        type: "readOnlyText",
        position: {
          x: 20,
          y: 191.58,
        },
        content: "Thank you!",
        width: 52.67,
        height: 20,
        rotate: 0,
        alignment: "left",
        verticalAlignment: "top",
        fontSize: 20,
        lineHeight: 1,
        characterSpacing: 0,
        fontColor: "#000000",
        fontName: "NotoSerifJP-Regular",
        backgroundColor: "",
        opacity: 1,
        readOnly: true,
      },
      paymentInfoLabel: {
        type: "readOnlyText",
        position: {
          x: 20,
          y: 232.67,
        },
        content: "Payment Information",
        width: 84.69,
        height: 9.42,
        rotate: 0,
        alignment: "left",
        verticalAlignment: "top",
        fontSize: 13,
        lineHeight: 1,
        characterSpacing: 0,
        fontColor: "#000000",
        backgroundColor: "",
        opacity: 1,
        readOnly: true,
        fontName: "NotoSerifJP-Regular",
      },
      paymentInfoInput: {
        type: "text",
        content:
          "Briard Bank\nAccount Name: Samira Hadid\nAccount No.: 123-456-7890\nPay by: 5 July 2025",
        position: {
          x: 20,
          y: 242.83,
        },
        width: 84.95,
        height: 34.07,
        rotate: 0,
        alignment: "left",
        verticalAlignment: "top",
        fontSize: 13,
        lineHeight: 1,
        characterSpacing: 0,
        fontColor: "#000000",
        backgroundColor: "",
        opacity: 1,
        dynamicFontSize: {
          min: 3,
          max: 13,
          fit: "vertical",
        },
        fontName: "NotoSerifJP-Regular",
      },
      shopName: {
        type: "readOnlyText",
        position: {
          x: 119.33,
          y: 248.39,
        },
        content: "Samira Hadid",
        width: 70.67,
        height: 8.36,
        rotate: 0,
        alignment: "right",
        verticalAlignment: "top",
        fontSize: 18,
        lineHeight: 1,
        characterSpacing: 0,
        fontColor: "#000000",
        backgroundColor: "",
        opacity: 1,
        readOnly: true,
        fontName: "NotoSerifJP-Regular",
      },
      shopAddress: {
        type: "readOnlyText",
        position: {
          x: 107.69,
          y: 256.9,
        },
        content: "123 Anywhere St., Any City, ST 12345",
        width: 82.31,
        height: 20,
        rotate: 0,
        alignment: "right",
        verticalAlignment: "top",
        fontSize: 13,
        lineHeight: 1,
        characterSpacing: 0,
        fontColor: "#000000",
        backgroundColor: "",
        opacity: 1,
        readOnly: true,
        fontName: "NotoSerifJP-Regular",
      },
    },
  ],
  basePdf: {
    width: 210,
    height: 297,
    padding: [20, 20, 20, 20],
  },
});

const getBlankTemplate = () =>
  ({
    schemas: [{}],
    basePdf: { width: 210, height: 297, padding: [0, 0, 0, 0] },
  } as Template);
export const getTemplatePresets = (): {
  key: string;
  label: string;
  template: () => Template;
}[] => [
  { key: "invoice", label: "Invoice", template: getInvoiceTemplate },
  {
    key: "certificate",
    label: "Certificate",
    template: getCertificateTemplate,
  },
  { key: "blank", label: "Blank", template: getBlankTemplate },
  { key: "custom", label: "Custom", template: getBlankTemplate },
];

export const getTemplateByPreset = (templatePreset: string): Template => {
  const templatePresets = getTemplatePresets();
  const preset = templatePresets.find(
    (preset) => preset.key === templatePreset
  );
  return preset ? preset.template() : templatePresets[0].template();
};
