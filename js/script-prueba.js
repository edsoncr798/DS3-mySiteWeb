document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav-list');

    menuToggle.addEventListener('click', function() {
        navList.classList.toggle('active');
    });

    // Cerrar el menú al hacer clic en un enlace
    const navLinks = document.querySelectorAll('.nav-list a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navList.classList.remove('active');
        });
    });

    // Cerrar el menú al hacer clic fuera de él
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navList.contains(event.target);
        const isClickOnToggle = menuToggle.contains(event.target);
        
        if (!isClickInsideNav && !isClickOnToggle && navList.classList.contains('active')) {
            navList.classList.remove('active');
        }
    });
    
    // Manejar el formulario de búsqueda
    const searchForm = document.querySelector('.search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const searchInput = this.querySelector('.search-input');
            const searchTerm = searchInput.value.trim().toLowerCase();
            
            if (searchTerm) {
                // Mostrar modal de carga
                showLoadingModal();
                
                // Simular tiempo de carga (500ms)
                setTimeout(() => {
                    // Buscar en el array de productos
                    const results = products.filter(product => 
                        product.title.toLowerCase().includes(searchTerm) || 
                        product.description.toLowerCase().includes(searchTerm)
                    );
                    
                    // Mostrar resultados
                    if (results.length > 0) {
                        showSearchResultsModal(results, searchTerm);
                    } else {
                        hideLoadingModal();
                        alert('No se encontraron productos que coincidan con: ' + searchTerm);
                    }
                }, 500);
            }
        });
    }
    
    // Función para mostrar el modal de carga
    function showLoadingModal() {
        // Crear modal de carga si no existe
        let loadingModal = document.querySelector('.search-loading-modal');
        
        if (!loadingModal) {
            loadingModal = document.createElement('div');
            loadingModal.className = 'search-loading-modal';
            loadingModal.innerHTML = `
                <div class="loading-spinner"></div>
                <p>Buscando productos...</p>
            `;
            document.body.appendChild(loadingModal);
        }
        
        // Mostrar el modal
        loadingModal.style.display = 'flex';
        
        // Posicionar el modal debajo del buscador
        const searchContainer = document.querySelector('.search-container');
        const rect = searchContainer.getBoundingClientRect();
        
        loadingModal.style.top = `${rect.bottom + window.scrollY}px`;
        loadingModal.style.left = `${rect.left}px`;
        loadingModal.style.width = `${rect.width}px`;
    }
    
    // Función para ocultar el modal de carga
    function hideLoadingModal() {
        const loadingModal = document.querySelector('.search-loading-modal');
        if (loadingModal) {
            loadingModal.style.display = 'none';
        }
    }
    
    // Función para mostrar resultados de búsqueda en un modal
    function showSearchResultsModal(results, searchTerm) {
        // Ocultar modal de carga
        hideLoadingModal();
        
        // Crear modal de resultados si no existe
        let resultsModal = document.querySelector('.search-results-modal');
        
        if (!resultsModal) {
            resultsModal = document.createElement('div');
            resultsModal.className = 'search-results-modal';
            document.body.appendChild(resultsModal);
            
            // Agregar evento para cerrar el modal al hacer clic fuera de él
            document.addEventListener('click', function(event) {
                if (resultsModal.style.display === 'block' && 
                    !resultsModal.contains(event.target) && 
                    !document.querySelector('.search-form').contains(event.target)) {
                    resultsModal.style.display = 'none';
                }
            });
        }
        
        // Limpiar resultados anteriores
        resultsModal.innerHTML = '';
        
        // Crear encabezado de resultados
        const resultsHeader = document.createElement('div');
        resultsHeader.className = 'results-header';
        resultsHeader.innerHTML = `
            <h3>Resultados para "${searchTerm}" (${results.length})</h3>
            <button class="close-modal">×</button>
        `;
        resultsModal.appendChild(resultsHeader);
        
        // Agregar evento para cerrar el modal con el botón
        resultsHeader.querySelector('.close-modal').addEventListener('click', () => {
            resultsModal.style.display = 'none';
        });
        
        // Crear lista de resultados
        const resultsList = document.createElement('div');
        resultsList.className = 'results-list';
        
        results.forEach(product => {
            const resultItem = document.createElement('div');
            resultItem.className = 'result-item';
            
            resultItem.innerHTML = `
                <img src="${product.images[0]}" alt="${product.title}" class="result-img">
                <h4>${product.title}</h4>
            `;
            
            // Agregar evento de clic para cambiar al producto
            resultItem.addEventListener('click', () => {
                resultsModal.style.display = 'none';
                changeMainProduct(product);
                // Desplazar la página hacia arriba para mostrar el producto principal
                window.scrollTo({
                    top: document.querySelector('.product-container').offsetTop - 100,
                    behavior: 'smooth'
                });
            });
            
            resultsList.appendChild(resultItem);
        });
        
        resultsModal.appendChild(resultsList);
        
        // Posicionar y mostrar el modal
        const searchContainer = document.querySelector('.search-container');
        const rect = searchContainer.getBoundingClientRect();
        
        resultsModal.style.top = `${rect.bottom + window.scrollY}px`;
        resultsModal.style.left = `${rect.left}px`;
        resultsModal.style.width = `${rect.width}px`;
        resultsModal.style.display = 'block';
    }
    
    // Función para mostrar resultados de búsqueda
    function showSearchResults(results, searchTerm) {
        // Crear un contenedor para los resultados si no existe
        let resultsContainer = document.querySelector('.search-results');
        
        if (!resultsContainer) {
            resultsContainer = document.createElement('div');
            resultsContainer.className = 'search-results';
            document.querySelector('.product-container').after(resultsContainer);
        }
        
        // Limpiar resultados anteriores
        resultsContainer.innerHTML = '';
        
        // Crear encabezado de resultados
        const resultsHeader = document.createElement('h2');
        resultsHeader.textContent = `Resultados para "${searchTerm}" (${results.length})`;
        resultsContainer.appendChild(resultsHeader);
        
        // Crear lista de resultados
        const resultsList = document.createElement('div');
        resultsList.className = 'results-list';
        
        results.forEach(product => {
            const resultItem = document.createElement('div');
            resultItem.className = 'result-item';
            
            resultItem.innerHTML = `
                <img src="${product.images[0]}" alt="${product.title}" class="result-img">
                <div class="result-info">
                    <h3>${product.title}</h3>
                    <p>${product.description.substring(0, 100)}...</p>
                </div>
            `;
            
            // Agregar evento de clic para cambiar al producto
            resultItem.addEventListener('click', () => {
                changeMainProduct(product);
                // Desplazar la página hacia arriba para mostrar el producto principal
                window.scrollTo({
                    top: document.querySelector('.product-container').offsetTop - 100,
                    behavior: 'smooth'
                });
            });
            
            resultsList.appendChild(resultItem);
        });
        
        resultsContainer.appendChild(resultsList);
        
        // Desplazar a los resultados
        resultsContainer.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Guardar el producto principal original para poder volver a él si es necesario
    const originalProduct = {
        title: document.querySelector('.product-title').textContent,
        description: document.querySelector('.product-description').innerHTML,
        images: Array.from(document.querySelectorAll('.product-image img')).map(img => img.src),
        price: document.querySelector('.price-value') ? document.querySelector('.price-value').textContent.replace('S/. ', '') : '650.00'
    };
    
    // Almacenar todos los productos (el principal y los relacionados)
    const products = [
        {
            id: 'original',
            title: originalProduct.title,
            description: originalProduct.description,
            images: originalProduct.images,
            price: originalProduct.price
        }
    ];
    
    // Agregar productos relacionados al array de productos
    document.querySelectorAll('.related-product').forEach(productEl => {
        const product = {
            id: productEl.dataset.id,
            title: productEl.dataset.title,
            description: productEl.dataset.description,
            images: JSON.parse(productEl.dataset.images),
            price: productEl.dataset.price || '0.00'
        };
        products.push(product);
        
        // Agregar evento de clic a todo el contenedor del producto relacionado
        productEl.addEventListener('click', function() {
            changeMainProduct(product);
        });
        
        // También agregar evento al botón específicamente
        const productLink = productEl.querySelector('.product-link');
        if (productLink) {
            productLink.addEventListener('click', function(e) {
                e.preventDefault(); // Prevenir navegación
                changeMainProduct(product);
                
                // Desplazar la página hacia arriba para mostrar el producto principal
                window.scrollTo({
                    top: document.querySelector('.product-container').offsetTop - 100,
                    behavior: 'smooth'
                });
            });
        }
    });
    
    // Función para cambiar el producto principal
    function changeMainProduct(product) {
        const productTitle = document.querySelector('.product-title');
        const productDescription = document.querySelector('.product-description');
        const productImageContainer = document.querySelector('.product-image');
        let productPrice = document.querySelector('.product-price');
        
        // Aplicar animación de transición
        document.querySelector('.product-container').classList.add('product-fade');
        
        // Cambiar título
        productTitle.textContent = product.title;
        
        // Cambiar precio
        if (!productPrice) {
            productPrice = document.createElement('div');
            productPrice.className = 'product-price';
            productTitle.after(productPrice);
        }
        
        productPrice.innerHTML = `
            <span class="price-label">Precio referencial:</span>
            <span class="price-value">S/. ${product.price}</span>
        `;
        
        // Cambiar descripción
        productDescription.innerHTML = `
            <h2>Descripción:</h2>
            <p>${product.description}</p>
        `;
        
        // Cambiar imágenes
        productImageContainer.innerHTML = '';
        product.images.forEach(imgSrc => {
            const img = document.createElement('img');
            img.src = imgSrc;
            img.alt = product.title;
            img.className = 'product-img';
            productImageContainer.appendChild(img);
        });
        
        // Quitar la clase de animación después de completar la transición
        setTimeout(() => {
            document.querySelector('.product-container').classList.remove('product-fade');
        }, 500);
    }
    
    // Manejar el modal de pedido
    const orderBtn = document.getElementById('order-btn');
    const orderModal = document.getElementById('order-modal');
    const closeModal = document.querySelector('.close-modal');
    const cancelOrder = document.getElementById('cancel-order');
    const orderForm = document.getElementById('order-form');
    
    if (orderBtn && orderModal) {
        // Abrir modal al hacer clic en el botón de pedido
        orderBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Obtener el producto actual
            const currentTitle = document.querySelector('.product-title').textContent;
            const currentPrice = document.querySelector('.price-value').textContent;
            
            // Rellenar los campos del producto en el formulario
            document.getElementById('product-details').value = currentTitle;
            document.getElementById('price').value = currentPrice;
            
            // Mostrar el modal
            orderModal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Evitar scroll en el fondo
        });
        
        // Cerrar modal con el botón X
        if (closeModal) {
            closeModal.addEventListener('click', function() {
                orderModal.style.display = 'none';
                document.body.style.overflow = 'auto'; // Restaurar scroll
            });
        }
        
        // Cerrar modal con el botón Cancelar
        if (cancelOrder) {
            cancelOrder.addEventListener('click', function() {
                orderModal.style.display = 'none';
                document.body.style.overflow = 'auto'; // Restaurar scroll
            });
        }
        
        // Cerrar modal al hacer clic fuera del contenido
        window.addEventListener('click', function(event) {
            if (event.target === orderModal) {
                orderModal.style.display = 'none';
                document.body.style.overflow = 'auto'; // Restaurar scroll
            }
        });
        
        // Manejar envío del formulario
        if (orderForm) {
            orderForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Validar formulario
                if (this.checkValidity()) {
                    // Recopilar datos del formulario
                    const formData = new FormData(this);
                    const orderData = {};
                    
                    for (const [key, value] of formData.entries()) {
                        orderData[key] = value;
                    }
                    
                    // Aquí se enviarían los datos a un servidor
                    console.log('Datos del pedido:', orderData);
                    
                    // Mostrar mensaje de éxito
                    alert('¡Gracias por su pedido! Nos pondremos en contacto con usted pronto.');
                    
                    // Cerrar modal y resetear formulario
                    orderModal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                    this.reset();
                } else {
                    // El navegador mostrará los mensajes de validación
                }
            });
        }
    }
});