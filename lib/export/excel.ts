import * as XLSX from "xlsx";

export function generateExcel<T extends Record<string, any>>(
  data: T[],
  columns: { key: keyof T; label: string }[],
  sheetName: string = "Sheet1"
): XLSX.WorkBook {
  // Prepare data for Excel
  const excelData = data.map((item) => {
    const row: Record<string, any> = {};
    columns.forEach((col) => {
      row[col.label] = item[col.key] ?? "";
    });
    return row;
  });

  // Create workbook and worksheet
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(excelData);

  // Set column widths
  const colWidths = columns.map((col) => ({
    wch: Math.max(col.label.length, 15),
  }));
  ws["!cols"] = colWidths;

  XLSX.utils.book_append_sheet(wb, ws, sheetName);

  return wb;
}

export function downloadExcel(workbook: XLSX.WorkBook, filename: string) {
  XLSX.writeFile(workbook, filename);
}

