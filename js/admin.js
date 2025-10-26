import { auth } from './auth.js';

async function loadUsersData() {
    try {
        const localUsers = localStorage.getItem('admin_users');
        if (localUsers) {
            return JSON.parse(localUsers).users;
        }
        
        return [
            { id: 1, login: 'admin', password: '123456', name: 'Администратор', role: 'admin' },
            { id: 2, login: 'user', password: 'password', name: 'Пользователь', role: 'user' }
        ];
    } catch (error) {
        console.error('Ошибка загрузки пользователей:', error);
        return [];
    }
}

async function loadProductsData() {
    try {
        const localProducts = localStorage.getItem('admin_products');
        if (localProducts) {
            return JSON.parse(localProducts).products;
        }
        
        return [
            {
                id: 1,
                name: 'Bridgestone Turanza T005',
                description: 'Летние шины премиум-класса с отличными сцепными свойствами и низким уровнем шума.',
                price: 8490,
                image: 'https://avatars.mds.yandex.net/i?id=7378bf4ec032d68978da0f2415cc4c245eb40b45-4768532-images-thumbs&n=13'
            },
            {
                id: 2,
                name: 'Nokian Hakkapeliitta R3',
                description: 'Зимняя шина для суровых условий',
                price: 9990,
                image: 'https://avatars.mds.yandex.net/i?id=bcb12d1db346f5721591ab1494f9c49897231981-7755895-images-thumbs&n=13'
            }
        ];
    } catch (error) {
        console.error('Ошибка загрузки товаров:', error);
        return [];
    }
}

async function saveUsersData(users) {
    localStorage.setItem('admin_users', JSON.stringify({ users }));
}

async function saveProductsData(products) {
    localStorage.setItem('admin_products', JSON.stringify({ products }));
}

function convertMailRuCloudLink(originalUrl) {
    if (originalUrl.includes('cloud.mail.ru/public/')) {
        const match = originalUrl.match(/cloud\.mail\.ru\/public\/(\w+)\/(\w+)/);
        if (match && match[1] && match[2]) {
            const folder = match[1];
            const fileCode = match[2];
            
            const possibleUrls = [
                `https://cloclo22.datacloudmail.ru/weblink/view/${folder.charAt(0)}${folder.charAt(1)}/${fileCode}/filename`,
                `https://cloclo22.cdnmail.ru/weblink/view/${folder.charAt(0)}${folder.charAt(1)}/${fileCode}/filename`,
                `https://cloclo22.cdnmail.ru/weblink/thumb/xw1/${fileCode}/filename`,
                `https://cloclo22.datacloudmail.ru/weblink/thumb/xw1/${fileCode}/filename`,
                `https://cloclo22.cdnmail.ru/weblink/preview/xw1/${fileCode}/filename`,
                `https://cloclo22.datacloudmail.ru/weblink/preview/xw1/${fileCode}/filename`
            ];
            
            return possibleUrls[0];
        }
    }
    
    return originalUrl;
}

function testImageLoad(url) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = function() {
            resolve(true);
        };
        img.onerror = function() {
            resolve(false);
        };
        img.src = url;
        
        setTimeout(() => {
            if (!img.complete) {
                resolve(false);
            }
        }, 5000);
    });
}

async function confirmCloudImage() {
    const cloudUrl = document.getElementById('cloudImageUrl').value.trim();
    
    if (!cloudUrl) {
        alert('Введите ссылку на изображение');
        return;
    }
    
    try {
        const confirmBtn = document.querySelector('.btn-confirm-cloud');
        const originalText = confirmBtn.textContent;
        confirmBtn.textContent = '🔄 Проверка...';
        confirmBtn.disabled = true;
        
        const workingUrl = convertMailRuCloudLink(cloudUrl);
        
        const isValid = await testImageLoad(workingUrl);
        
        if (isValid) {
            document.getElementById('productImage').value = workingUrl;
            updateImagePreview(workingUrl);
            hideCloudSection();
            alert('✅ Изображение успешно загружено из облака!');
        } else {
            const alternativeUrls = generateAlternativeUrls(cloudUrl);
            let foundValid = false;
            
            for (let i = 0; i < alternativeUrls.length; i++) {
                const altUrl = alternativeUrls[i];
                const altValid = await testImageLoad(altUrl);
                if (altValid) {
                    document.getElementById('productImage').value = altUrl;
                    updateImagePreview(altUrl);
                    hideCloudSection();
                    alert('✅ Изображение загружено (альтернативный формат)!');
                    foundValid = true;
                    break;
                }
            }
            
            if (!foundValid) {
                const errorMessage = `❌ Не удалось загрузить изображение по ссылке.\n\nПопробуйте:\n\n1. Загрузить с компьютера (рекомендуется)\n2. Получить прямую ссылку через "Копировать адрес изображения"\n3. Использовать другой хостинг изображений`;
                
                alert(errorMessage);
                
                if (confirm('Хотите попробовать загрузить изображение с компьютера?')) {
                    openLocalUpload();
                }
            }
        }
        
    } catch (error) {
        console.error('Ошибка при загрузке изображения:', error);
        alert('❌ Произошла ошибка при загрузке изображения');
    } finally {
        const confirmBtn = document.querySelector('.btn-confirm-cloud');
        if (confirmBtn) {
            confirmBtn.textContent = '✅ Использовать это изображение';
            confirmBtn.disabled = false;
        }
    }
}

function generateAlternativeUrls(originalUrl) {
    const match = originalUrl.match(/cloud\.mail\.ru\/public\/(\w+)\/(\w+)/);
    if (!match) return [];
    
    const folder = match[1];
    const fileCode = match[2];
    
    return [
        `https://cloclo22.cdnmail.ru/weblink/thumb/xw1/${fileCode}/filename`,
        `https://cloclo22.datacloudmail.ru/weblink/thumb/xw1/${fileCode}/filename`,
        `https://cloclo22.cdnmail.ru/weblink/view/xw1/${fileCode}/filename`,
        `https://cloclo22.datacloudmail.ru/weblink/view/xw1/${fileCode}/filename`,
        `https://cloclo22.cdnmail.ru/weblink/preview/xw1/${fileCode}/filename`,
        `https://cloclo22.datacloudmail.ru/weblink/preview/xw1/${fileCode}/filename`,
        `https://cloclo22.cdnmail.ru/weblink/view/${folder.charAt(0)}${folder.charAt(1)}/${fileCode}/filename`,
        `https://cloclo22.datacloudmail.ru/weblink/view/${folder.charAt(0)}${folder.charAt(1)}/${fileCode}/filename`
    ];
}

function openCloudUpload() {
    const cloudSection = document.getElementById('cloudUploadSection');
    const localSection = document.getElementById('localUploadSection');
    
    cloudSection.style.display = 'block';
    localSection.style.display = 'none';
}

function hideCloudSection() {
    document.getElementById('cloudUploadSection').style.display = 'none';
    document.getElementById('cloudImageUrl').value = '';
}

function updateImagePreview(imageUrl) {
    const preview = document.getElementById('imagePreview');
    if (imageUrl) {
        preview.innerHTML = `<img src="${imageUrl}" alt="Превью" onerror="this.style.display='none'">`;
    } else {
        preview.innerHTML = '<p>Здесь будет превью изображения</p>';
    }
}

function openImageLibrary() {
    alert('Библиотека изображений будет доступна в следующем обновлении');
}

function openLocalUpload() {
    const localSection = document.getElementById('localUploadSection');
    const cloudSection = document.getElementById('cloudUploadSection');
    
    localSection.style.display = 'block';
    cloudSection.style.display = 'none';
    
    initDragAndDrop();
}

function initDragAndDrop() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    
    if (!uploadArea || !fileInput) return;
    
    fileInput.addEventListener('change', function(e) {
        if (e.target.files[0]) {
            handleFileSelect(e.target.files[0]);
        }
    });
    
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    });
    
    uploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
    });
    
    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleFileSelect(file);
        } else {
            alert('Пожалуйста, выберите файл изображения (JPG, PNG, GIF)');
        }
    });
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
        
        saveImageToLocalStorage(file.name, imageDataUrl);
        
        document.getElementById('productImage').value = imageDataUrl;
        updateImagePreview(imageDataUrl);
        
        alert('✅ Изображение успешно загружено с компьютера!');
    };
    
    reader.onerror = function() {
        alert('❌ Ошибка при чтении файла');
    };
    
    reader.readAsDataURL(file);
}

function showUploadPreview(fileName, imageUrl) {
    const uploadArea = document.getElementById('uploadArea');
    const uploadPreview = document.getElementById('uploadPreview');
    const previewImage = document.getElementById('previewImage');
    const fileNameSpan = document.getElementById('fileName');
    
    if (!uploadArea || !uploadPreview || !previewImage || !fileNameSpan) return;
    
    previewImage.src = imageUrl;
    fileNameSpan.textContent = fileName;
    
    const uploadPlaceholder = uploadArea.querySelector('.upload-placeholder');
    if (uploadPlaceholder) {
        uploadPlaceholder.style.display = 'none';
    }
    uploadPreview.style.display = 'block';
}

function removeUploadedImage() {
    const uploadArea = document.getElementById('uploadArea');
    const uploadPreview = document.getElementById('uploadPreview');
    
    if (!uploadArea || !uploadPreview) return;
    
    uploadPreview.style.display = 'none';
    const uploadPlaceholder = uploadArea.querySelector('.upload-placeholder');
    if (uploadPlaceholder) {
        uploadPlaceholder.style.display = 'block';
    }
    
    document.getElementById('productImage').value = '';
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
        fileInput.value = '';
    }
    updateImagePreview('');
}

function saveImageToLocalStorage(fileName, imageData) {
    try {
        const storedImages = JSON.parse(localStorage.getItem('product_images') || '{}');
        storedImages[fileName] = imageData;
        localStorage.setItem('product_images', JSON.stringify(storedImages));
    } catch (error) {
        console.error('Ошибка сохранения изображения:', error);
    }
}

function simulateServerUpload(imageData) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(`/uploads/${Date.now()}.jpg`);
        }, 1000);
    });
}

export const admin = {
    async loadUsers() {
        const users = await loadUsersData();
        const tbody = document.querySelector('#usersTable tbody');
        if (tbody) {
            tbody.innerHTML = users.map(user => `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.login}</td>
                    <td>${user.name}</td>
                    <td><span class="role-badge ${user.role === 'admin' ? 'role-admin' : 'role-user'}">${user.role}</span></td>
                    <td>
                        <button class="btn btn-edit" onclick="editUser(${user.id})">✏️</button>
                        <button class="btn btn-delete" onclick="deleteUser(${user.id})">🗑️</button>
                    </td>
                </tr>
            `).join('');
        }
    },

    async loadProducts() {
        const products = await loadProductsData();
        const tbody = document.querySelector('#productsTable tbody');
        if (tbody) {
            tbody.innerHTML = products.map(product => `
                <tr>
                    <td>${product.id}</td>
                    <td>${product.name}</td>
                    <td>${product.price} ₽</td>
                    <td>
                        <button class="btn btn-edit" onclick="editProduct(${product.id})">✏️</button>
                        <button class="btn btn-delete" onclick="deleteProduct(${product.id})">🗑️</button>
                    </td>
                </tr>
            `).join('');
        }
    },

    async createUser(userData) {
        try {
            const users = await loadUsersData();
            const newUser = {
                id: Date.now(),
                login: userData.login,
                password: userData.password,
                name: userData.name,
                role: userData.role
            };
            users.push(newUser);
            await saveUsersData(users);
            await this.loadUsers();
            alert('Пользователь успешно создан!');
        } catch (error) {
            console.error('Ошибка создания пользователя:', error);
            alert('Ошибка при создании пользователя');
        }
    },

    async updateUser(userData) {
        try {
            const users = await loadUsersData();
            const userIndex = users.findIndex(user => user.id == userData.id);
            if (userIndex !== -1) {
                users[userIndex] = {
                    ...users[userIndex],
                    login: userData.login,
                    name: userData.name,
                    role: userData.role
                };
                if (userData.password) {
                    users[userIndex].password = userData.password;
                }
                await saveUsersData(users);
                await this.loadUsers();
                alert('Пользователь успешно обновлен!');
            }
        } catch (error) {
            console.error('Ошибка обновления пользователя:', error);
            alert('Ошибка при обновлении пользователя');
        }
    },

    async deleteUser(userId) {
        if (confirm('Вы уверены, что хотите удалить этого пользователя?')) {
            try {
                const users = await loadUsersData();
                const filteredUsers = users.filter(user => user.id != userId);
                await saveUsersData(filteredUsers);
                await this.loadUsers();
                alert('Пользователь успешно удален!');
            } catch (error) {
                console.error('Ошибка удаления пользователя:', error);
                alert('Ошибка при удалении пользователя');
            }
        }
    },

    async editUser(userId) {
        const users = await loadUsersData();
        const user = users.find(user => user.id == userId);
        if (user) {
            openUserModal(user);
        }
    },

    async createProduct(productData) {
        try {
            const products = await loadProductsData();
            const newProduct = {
                id: Date.now(),
                name: productData.name,
                description: productData.description,
                price: productData.price,
                image: productData.image
            };
            products.push(newProduct);
            await saveProductsData(products);
            await this.loadProducts();
            alert('Товар успешно создан!');
        } catch (error) {
            console.error('Ошибка создания товара:', error);
            alert('Ошибка при создании товара');
        }
    },

    async updateProduct(productData) {
        try {
            const products = await loadProductsData();
            const productIndex = products.findIndex(product => product.id == productData.id);
            if (productIndex !== -1) {
                products[productIndex] = {
                    ...products[productIndex],
                    name: productData.name,
                    description: productData.description,
                    price: productData.price,
                    image: productData.image
                };
                await saveProductsData(products);
                await this.loadProducts();
                alert('Товар успешно обновлен!');
            }
        } catch (error) {
            console.error('Ошибка обновления товара:', error);
            alert('Ошибка при обновлении товара');
        }
    },

    async deleteProduct(productId) {
        if (confirm('Вы уверены, что хотите удалить этот товар?')) {
            try {
                const products = await loadProductsData();
                const filteredProducts = products.filter(product => product.id != productId);
                await saveProductsData(filteredProducts);
                await this.loadProducts();
                alert('Товар успешно удален!');
            } catch (error) {
                console.error('Ошибка удаления товара:', error);
                alert('Ошибка при удалении товара');
            }
        }
    },

    async editProduct(productId) {
        const products = await loadProductsData();
        const product = products.find(product => product.id == productId);
        if (product) {
            openProductModal(product);
        }
    },

    openCloudUpload,
    confirmCloudImage,
    hideCloudSection,
    updateImagePreview,
    openLocalUpload,
    openImageLibrary,
    removeUploadedImage,
    handleFileSelect,
    convertMailRuCloudLink,
    testImageLoad
};

window.openCloudUpload = openCloudUpload;
window.confirmCloudImage = confirmCloudImage;
window.hideCloudSection = hideCloudSection;
window.updateImagePreview = updateImagePreview;
window.openLocalUpload = openLocalUpload;
window.openImageLibrary = openImageLibrary;
window.removeUploadedImage = removeUploadedImage;
window.handleFileSelect = handleFileSelect;
window.convertMailRuCloudLink = convertMailRuCloudLink;
window.testImageLoad = testImageLoad;

document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            if (e.target.files[0]) {
                handleFileSelect(e.target.files[0]);
            }
        });
    }
});