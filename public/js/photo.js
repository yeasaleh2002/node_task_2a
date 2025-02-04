const fileInput = document.getElementById("file-input");
const preview = document.getElementById("preview");
const saveBtn = document.getElementById("save-btn");

// Fetch and display the latest image
function fetchLatestImage() {
  fetch("http://localhost:3000/api/upload")
    .then((response) => response.json())
    .then((data) => {
      if (data.imagePath) {
        preview.src = `http://localhost:3000${data.imagePath}`;
      } else {
        preview.src =
          "https://www.lifewire.com/thmb/TRGYpWa4KzxUt1Fkgr3FqjOd6VQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/cloud-upload-a30f385a928e44e199a62210d578375a.jpg";
      }
    })
    .catch((err) => console.error("Error fetching image:", err));
}

fetchLatestImage();

// Show file preview and enable the upload button
fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      preview.src = reader.result;
      saveBtn.style.display = "inline-block";
    };
    reader.readAsDataURL(file);
  }
});

// Upload the photo
saveBtn.addEventListener("click", () => {
  const formData = new FormData();
  formData.append("photo", fileInput.files[0]);

  fetch("http://localhost:3000/api/upload", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        alert("Photo uploaded successfully!");
        saveBtn.style.display = "none";
        fetchLatestImage();
      } else {
        alert("Error uploading photo.");
      }
    })
    .catch((err) => console.error("Error uploading photo:", err));
});
