import { loadGirth } from "./calculate_minimum_distance.js";

const displayDataInTable = (data) => {
  data.forEach((item) => {
    const row = document.querySelector(`#tr-${item.label.toLowerCase()}`);
    // console.log(item.label.toLowerCase());
    Object.values(item).forEach((value) => {
      const cell = document.createElement("td");
      cell.textContent =
        typeof value === "number"
          ? (Math.round(value * 100) / 100).toFixed(2)
          : value;
      row.appendChild(cell);
    });
  });
};
try {
  const girthData = await loadGirth();
  displayDataInTable(girthData);
} catch (error) {
  console.error("Error loading girth data:", error);
}
