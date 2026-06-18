// =============================================================
//  Uber Simulation — Google Sheets refresh script
//
//  Setup:
//  1. Extensions → Apps Script → paste this file
//  2. Change BASE_URL to your ngrok URL before the presentation
//     (run: ngrok http 8080  →  copy the https URL)
//  3. Save, then in the sheet: Insert → Drawing → add a button,
//     right-click it → Assign script → type: refreshSimulationData
// =============================================================

const BASE_URL = 'https://YOUR_NGROK_URL'; // ← change this
const SHEET_NAME = 'Wyniki';
const HEADERS = [
  'Tick', 'Waiting Passengers', 'Active Trips', 'Completed Trips',
  'Abandoned', 'Available Drivers', 'Busy Drivers', 'Total Earnings ($)', 'Avg Wait (sec)'
];

function refreshSimulationData() {
  const response = UrlFetchApp.fetch(BASE_URL + '/api/simulation/export/json', {
    headers: { 'ngrok-skip-browser-warning': 'true' }
  });
  const data = JSON.parse(response.getContentText());

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);

  sheet.clearContents();
  sheet.getCharts().forEach(c => sheet.removeChart(c));

  // Write headers
  const headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
  headerRange.setValues([HEADERS]);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#1A73E8');
  headerRange.setFontColor('#FFFFFF');

  if (data.length === 0) {
    SpreadsheetApp.getUi().alert('No simulation data yet. Run a simulation first.');
    return;
  }

  // Write data rows
  const rows = data.map(snap => [
    snap.tick,
    snap.waitingPassengers,
    snap.activeTrips,
    snap.completedTrips,
    snap.abandonedPassengers,
    snap.availableDrivers,
    snap.busyDrivers,
    snap.totalEarnings,
    snap.avgWaitTimeSec
  ]);
  sheet.getRange(2, 1, rows.length, HEADERS.length).setValues(rows);
  SpreadsheetApp.flush(); // commit data before chart reads it

  buildCharts(sheet, rows.length);

  SpreadsheetApp.getUi().alert(`Loaded ${data.length} ticks.`);
}

// ── Chart helpers ─────────────────────────────────────────────

function buildCharts(sheet, dataRows) {
  const n = dataRows + 1; // includes header row

  // Columns A–F only: A=Tick (domain), B=Waiting, C=Active Trips, D=Completed, E=Abandoned, F=Available Drivers
  // G (Busy Drivers) is excluded - it always equals Active Trips (one driver per trip)
  sheet.insertChart(
    sheet.newChart()
      .setChartType(Charts.ChartType.LINE)
      .addRange(sheet.getRange(1, 1, n, 6))
      .setNumHeaders(1)
      .setOption('title', 'Uber Simulation — System State Over Time')
      .setOption('hAxis.title', 'Tick')
      .setOption('vAxis.title', 'Count')
      .setOption('vAxis.minValue', 0)
      .setOption('colors', ['#7B1FA2', '#F57C00', '#2E7D32', '#C62828', '#1565C0'])
      .setOption('lineWidth', 2)
      .setOption('legend.position', 'bottom')
      .setOption('width', 1000)
      .setOption('height', 500)
      .setPosition(3, 11, 0, 0)
      .build()
  );
}
