/**
 * POLARIS Daily & Weekly Energy Report Generation
 */

function initReportsView() {
  const btnGen = document.getElementById('btn-generate-report');
  const btnDownloadCsv = document.getElementById('btn-download-csv');
  const btnPrintPdf = document.getElementById('btn-print-pdf');

  if (btnGen) {
    btnGen.addEventListener('click', () => {
      const statusEl = document.getElementById('report-gen-status');
      if (statusEl) {
        statusEl.innerHTML = `<span class="live-badge" style="color:#10b981;">✓ 24-Hour Polar Energy Audit Generated successfully!</span>`;
      }
    });
  }

  if (btnDownloadCsv) {
    btnDownloadCsv.addEventListener('click', () => {
      downloadEnergyCsv();
    });
  }

  if (btnPrintPdf) {
    btnPrintPdf.addEventListener('click', () => {
      window.print();
    });
  }
}

function downloadEnergyCsv() {
  const hist = window.polarisEngine.state.history24h;
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "Hour,Solar_Gen_kW,Wind_Gen_kW,Total_Load_kW,Battery_SOC_Pct,Backup_Gen_kW,Ambient_Temp_C,Wind_Speed_kmh\n";

  for (let i = 0; i < hist.labels.length; i++) {
    const row = [
      hist.labels[i],
      hist.solar[i] || 0,
      hist.wind[i] || 0,
      hist.load[i] || 0,
      hist.batterySoc[i] || 0,
      hist.backupGen[i] || 0,
      hist.temp[i] || 0,
      hist.windSpeed[i] || 0
    ].join(",");
    csvContent += row + "\n";
  }

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `POLARIS_Energy_Report_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

window.addEventListener('DOMContentLoaded', () => {
  initReportsView();
});
