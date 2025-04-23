// import { useState } from "react";
// import "./FileUpload.css";

// const FileUpload = () => {
//   const [fileName, setFileName] = useState("");
//   const [error, setError] = useState("");

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const validTypes = [
//         "application/vnd.ms-excel",
//         "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//       ];

//       if (validTypes.includes(file.type)) {
//         setFileName(file.name);
//         setError("");
//       } else {
//         setFileName("");
//         setError("Please upload Excel files only");
//       }
//     }
//   };

//   return (
//     <div className="upload-container">
//       <h2>Upload Excel File</h2>
//       <input
//         type="file"
//         accept=".xls,.xlsx"
//         id="fileInput"
//         onChange={handleFileChange}
//       />
//       <label htmlFor="fileInput" className="upload-button">
//         Choose File
//       </label>
//       {fileName && <p className="file-name">Selected File: {fileName}</p>}
//       {error && <p className="error-message">{error}</p>}
//     </div>
//   );
// };

// export default FileUpload;

import React, { useState } from "react";
import "./FileUpload.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line, Pie, Doughnut, Radar, PolarArea } from "react-chartjs-2";
import * as XLSX from "xlsx";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

const chartTypes = ["Bar", "Line", "Pie", "Doughnut", "Radar", "PolarArea"];

const FileUpload = () => {
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [chartType, setChartType] = useState("");
  const [chartData, setChartData] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = [
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ];

      if (validTypes.includes(file.type)) {
        setFileName(file.name);
        setError("");
        readExcel(file);
      } else {
        setFileName("");
        setChartData(null);
        setChartType("");
        setError("Please upload a valid Excel file (.xls or .xlsx)");
      }
    }
  };

  const readExcel = (file) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (jsonData.length > 1) {
        const labels = jsonData.slice(1).map((row) => row[0]);
        const values = jsonData.slice(1).map((row) => row[1]);

        setChartData({
          labels,
          datasets: [
            {
              label: jsonData[0][1],
              data: values,
              backgroundColor: "rgba(75, 192, 192, 0.6)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        });
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const renderChart = () => {
    if (!chartData || !chartType) return null;

    const chartProps = { data: chartData };
    switch (chartType) {
      case "Bar":
        return <Bar {...chartProps} />;
      case "Line":
        return <Line {...chartProps} />;
      case "Pie":
        return <Pie {...chartProps} />;
      case "Doughnut":
        return <Doughnut {...chartProps} />;
      case "Radar":
        return <Radar {...chartProps} />;
      case "PolarArea":
        return <PolarArea {...chartProps} />;
      default:
        return null;
    }
  };

  return (
    <div className="main-container">
      <div className="upload-container">
        <h2>Upload Excel File</h2>
        <input
          type="file"
          accept=".xls,.xlsx"
          id="fileInput"
          onChange={handleFileChange}
        />
        <label htmlFor="fileInput" className="upload-button">
          Choose File
        </label>
        {fileName && <p className="file-name">Selected File: {fileName}</p>}
        {error && <p className="error-message">{error}</p>}
      </div>
      <div className="chart-options">
        <select
          disabled={!chartData}
          value={chartType}
          onChange={(e) => setChartType(e.target.value)}
        >
          <option value="">Select Chart Type</option>
          {chartTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
      <div className="chart-display">{renderChart()}</div>
    </div>
  );
};

export default FileUpload;
