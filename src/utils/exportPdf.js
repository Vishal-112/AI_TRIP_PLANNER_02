import html2pdf from "html2pdf.js";

export const exportTripAsPDF = () => {
  const element = document.getElementById("trip-result");

  if (!element) return;

  const options = {
    margin: 10,
    filename: "AI_Trip_Plan.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };

  html2pdf().from(element).set(options).save();
};
