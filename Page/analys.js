import { loadGirth } from "./calculate_minimum_distance.js";

const displayCalulationTable = (data) => {
  const iterator = ["CF", "PSFR", "SSR", "PSBR", "CB", "PSBL", "SSL", "PSFL"];

  const table = document.getElementById("analysis_table");
  let count = 0;
  data.forEach((item) => {
    count += 1;
    let decimal = 0;
    iterator.forEach((e) => {
      decimal += 1;
      const row = document.createElement("tr");

      const POM = document.createElement("td");
      POM.textContent = `${count}.${decimal}`;
      row.appendChild(POM);

      const LEVEL = document.createElement("td");
      LEVEL.textContent = item.label;
      row.appendChild(LEVEL);

      const LANDMARK = document.createElement("td");
      LANDMARK.textContent = e;
      row.appendChild(LANDMARK);

      const unit = document.createElement("span");
      unit.textContent = "mm";
      const c1 = document.createElement("td");
      c1.id = `${item.label}_${e}_rmv`;
      const inputOne = document.createElement("input");
      inputOne.type = "number";
      inputOne.id = `${item.label}_${e}_rmvIn`;

      inputOne.onchange = function (event) {
        calculateDifference(
          `${item.label}_${e}_rmvIn`,
          `${item.label}_${e}_tolvIn`,
          item[e],
          `${item.label}_${e}_diffv`,
          `${item.label}_${e}_result`
        );
      };

      c1.appendChild(inputOne);
      c1.append(unit);
      row.appendChild(c1);

      const unitOne = document.createElement("span");
      unitOne.textContent = "mm";
      const c2 = document.createElement("td");
      c2.id = `${item.label}_${e}_tol`;
      const inputTwo = document.createElement("input");
      inputTwo.type = "number";
      inputTwo.id = `${item.label}_${e}_tolvIn`;
      inputTwo.onchange = function (event) {
        calculateDifference(
          `${item.label}_${e}_rmvIn`,
          `${item.label}_${e}_tolvIn`,
          item[e],
          `${item.label}_${e}_diffv`,
          `${item.label}_${e}_result`
        );
      };

      c2.appendChild(inputTwo);
      c2.append(unitOne);
      row.appendChild(c2);

      const c3 = document.createElement("td");
      c3.id = `${item.label}_${e}_acv`;
      c3.textContent = parseFloat(item[e].toFixed(2));

      row.appendChild(c3);

      const c4 = document.createElement("td");
      c4.id = `${item.label}_${e}_diffv`;
      c4.textContent = 0;

      row.appendChild(c4);

      const c5 = document.createElement("td");
      c5.id = `${item.label}_${e}_result`;

      row.appendChild(c5);

      // Insert the row after the header row
      table.appendChild(row);
    });
  });
};

try {
  const girthData = await loadGirth();
  console.log(girthData);
  displayCalulationTable(girthData);
} catch (error) {
  console.error("Error loading girth data:", error);
}
