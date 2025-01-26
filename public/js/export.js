
async function exportXml() {
    const response = await fetch('/export-xml');
    const xmlData = await response.text();
    const blob = new Blob([xmlData], { type: 'application/xml' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'analytics.xml';
    link.click();
  }
  