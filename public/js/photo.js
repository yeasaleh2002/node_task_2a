// Fetch and display the latest photo or show the default logo
async function fetchPhoto(previewElement) {
    try {
        const response = await fetch('http://localhost:3000/api/upload');
        const data = await response.json();
        if (data.imagePath) {
            previewElement.src = `http://localhost:3000${data.imagePath}`;
        } else {
            previewElement.src = 'https://www.lifewire.com/thmb/TRGYpWa4KzxUt1Fkgr3FqjOd6VQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/cloud-upload-a30f385a928e44e199a62210d578375a.jpg'; 
        }
    } catch (error) {
        console.error('Error fetching photo:', error);
    }
}

// Preview the selected photo
function previewPhoto(fileInput, previewElement, saveButton) {
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            previewElement.src = reader.result;
            saveButton.style.display = 'inline-block'; 
        };
        reader.readAsDataURL(file);
    }
}

// Upload the selected photo to the server
async function uploadPhoto(fileInput, saveButton) {
    try {
        const formData = new FormData();
        formData.append('imagePath', fileInput.files[0]);

        const response = await fetch('http://localhost:3000/api/upload', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();
        if (data.success) {
            alert('Photo uploaded successfully!');
            saveButton.style.display = 'none';
        } else {
            alert('Failed to upload photo');
        }
    } catch (error) {
        console.error('Error uploading photo:', error);
    }
}

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('file-input');
    const preview = document.getElementById('preview');
    const saveBtn = document.getElementById('save-btn');

    // Fetch and display the latest photo
    fetchPhoto(preview);

    // Preview selected photo
    fileInput.addEventListener('change', () => previewPhoto(fileInput, preview, saveBtn));

    // Upload photo
    saveBtn.addEventListener('click', () => uploadPhoto(fileInput, saveBtn));
});
