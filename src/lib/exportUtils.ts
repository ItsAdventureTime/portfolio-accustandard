'use client';

// 1. Export JSON array to QuickBooks/ERP-compliant CSV file
export function exportToCSV(filename: string, rows: object[]) {
  if (!rows || !rows.length) return;
  const separator = ',';
  const keys = Object.keys(rows[0]);
  const csvContent =
    keys.join(separator) +
    '\n' +
    rows
      .map((row: any) => {
        return keys
          .map((k) => {
            let cell = row[k] === null || row[k] === undefined ? '' : row[k];
            cell = cell instanceof Date ? cell.toLocaleString() : cell.toString();
            cell = cell.replace(/"/g, '""');
            if (cell.search(/("|,|\n)/g) >= 0) {
              cell = `"${cell}"`;
            }
            return cell;
          })
          .join(separator);
      })
      .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

// 2. Export JSON array or table element to Excel Spreadsheet (.xls / .xlsx)
export function exportToExcel(filename: string, sheetName: string, rows: object[]) {
  if (!rows || !rows.length) return;
  const keys = Object.keys(rows[0]);

  let tableHtml = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">`;
  tableHtml += `<head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>${sheetName}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta charset="utf-8"/></head>`;
  tableHtml += `<body><table border="1"><thead><tr style="background-color:#1e3a8a;color:#ffffff;font-weight:bold;">`;

  keys.forEach((k) => {
    tableHtml += `<th style="padding:8px;">${k.toUpperCase()}</th>`;
  });
  tableHtml += `</tr></thead><tbody>`;

  rows.forEach((row: any) => {
    tableHtml += `<tr>`;
    keys.forEach((k) => {
      const val = row[k] === null || row[k] === undefined ? '' : row[k];
      tableHtml += `<td style="padding:6px;">${val}</td>`;
    });
    tableHtml += `</tr>`;
  });

  tableHtml += `</tbody></table></body></html>`;

  const blob = new Blob([tableHtml], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename.endsWith('.xls') || filename.endsWith('.xlsx') ? filename : `${filename}.xls`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

// 3. Document Print Trigger isolating target element via clean DOM print execution
export function printDocumentElement(elementId: string) {
  const element = document.getElementById(elementId);
  if (!element) {
    window.print();
    return;
  }

  // Clear previous print targets
  document.querySelectorAll('.active-print-target').forEach((el) => {
    el.classList.remove('active-print-target');
  });

  // Attach print target class directly to DOM node
  element.classList.add('active-print-target');

  // Trigger browser native print dialog on primary document (retains all app CSS)
  setTimeout(() => {
    window.print();
  }, 100);
}
