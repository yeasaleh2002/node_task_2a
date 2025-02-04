document.getElementById("calculate-coins-btn").addEventListener("click", function() {
    const amount = document.getElementById("coin-input").value;

    // Send the amount to the backend API to calculate the coins
    fetch("http://localhost:3000/api/coin/calculate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ amount: amount })
    })
      .then(response => response.json())
      .then(data => {
        let resultText = "";
        for (const [denomination, count] of Object.entries(data)) {
          resultText += `${count} x ${denomination}\n`;
        }
        document.getElementById("coin-result").textContent = resultText;
      })
      .catch(error => {
        document.getElementById("coin-result").textContent = "Error calculating coins.";
        console.error("Error:", error);
      });
  });