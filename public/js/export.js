async function fetchAnalyticsCount() {
  try {
    const response = await fetch(
      "http://localhost:3000/api/analytics/count"
    );
    const data = await response.json();
    document.getElementById(
      "total-analytics"
    ).textContent = `${data.count || 0}`;
  } catch (error) {
    document.getElementById("total-analytics").textContent =
      "Error loading analytics count";
    console.error("Error fetching analytics count:", error);
  }
}

async function exportAnalyticsToXML() {
  try {
    const response = await fetch(
      "http://localhost:3000/api/analytics/export"
    );
    const xmlData = await response.text();

    const blob = new Blob([xmlData], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "analytics.xml";
    a.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error exporting analytics:", error);
    alert("Failed to export analytics");
  }
}

async function importAnalyticsFromXML(file) {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(
      "http://localhost:3000/api/analytics/import",
      {
        method: "POST",
        body: formData,
      }
    );

    if (response.ok) {
      alert("Analytics imported successfully!");
      fetchAnalyticsCount();
    } else {
      const errorData = await response.json();
      alert(`Import failed: ${errorData.message}`);
    }
  } catch (error) {
    console.error("Error importing analytics:", error);
    alert("Failed to import analytics");
  }
}

document
  .getElementById("export-btn")
  .addEventListener("click", exportAnalyticsToXML);

document.getElementById("import-btn").addEventListener("click", () => {
  document.getElementById("import-file").click();
});

document.getElementById("import-file").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    importAnalyticsFromXML(file);
  }
});

fetchAnalyticsCount();