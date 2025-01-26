async function logAnalytics(widgetName) {
  const browserType = navigator.userAgent;
  await fetch("/analytic", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      widget_name: widgetName,
      browser_type: browserType,
    }),
  });
}

async function getAnalyticsCount() {
  const response = await fetch("/analytic/count");
  const data = await response.json();
  document.getElementById(
    "analytic-count"
  ).innerHTML = `Widget Click Count: ${data.count}`;
}
