
function openLocalUpload() {
    document.getElementById('localUploadSection').style.display = 'block';
    document.getElementById('cloudUploadSection').style.display = 'none';
    initDragAndDrop();
}

function openCloudUpload() {
    document.getElementById('cloudUploadSection').style.display = 'block';
    document.getElementById('localUploadSection').style.display = 'none';
}

function handleFileSelect(file) {
    if (!file || !file.type.startsWith('image/')) {
        alert('Пожалуйста, выберите файл изображения (JPG, PNG, GIF)');
        return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
        alert('Файл слишком большой! Максимальный размер: 5MB');
        return;
    }
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const imageDataUrl = e.target.result;
        
        showUploadPreview(file.name, imageDataUrl);
        document.getElementById('productImage').value = imageDataUrl;
        updateImagePreview(imageDataUrl);
        updateUrlDisplay();
        
        alert('✅ Изображение успешно загружено с компьютера!');
    };
    
    reader.readAsDataURL(file);
}

function confirmCloudImage() {
    const cloudUrl = document.getElementById('cloudImageUrl').value.trim();
    
    if (!cloudUrl) {
        alert('Введите ссылку на изображение');
        return;
    }

    document.getElementById('productImage').value = cloudUrl;
    updateImagePreview(cloudUrl);
    hideCloudSection();
    updateUrlDisplay();
    alert('✅ Ссылка на изображение добавлена!');
}


function hideCloudSection() {
    document.getElementById('cloudUploadSection').style.display = 'none';
    document.getElementById('cloudImageUrl').value = '';
}

function updateImagePreview(imageUrl) {
    const preview = document.getElementById('imagePreview');
    if (imageUrl) {
        const img = new Image();
        img.onload = function() {
            preview.innerHTML = `<img src="${imageUrl}" alt="Превью" style="max-width: 100%; max-height: 200px; border-radius: 4px;">`;
        };
        img.onerror = function() {
            preview.innerHTML = `
                <p style="color: #dc3545;">❌ Не удалось загрузить изображение</p>
                <p><small>Проверьте ссылку или попробуйте другой способ загрузки</small></p>
            `;
        };
        img.src = imageUrl;
    } else {
        preview.innerHTML = '<p>Здесь будет превью изображения</p>';
    }
}

function updateUrlDisplay() {
    const currentUrl = document.getElementById('productImage').value;
    const urlDisplay = document.getElementById('currentUrlText');
    
    if (currentUrl) {
        urlDisplay.textContent = currentUrl.length > 50 ? 
            currentUrl.substring(0, 50) + '...' : currentUrl;
    } else {
        urlDisplay.textContent = 'не указан';
    }
}