document.addEventListener('DOMContentLoaded', () => {
const loadModelViewer = () => {
        return new Promise((resolve) => {
            if (customElements.get('model-viewer')) {
                resolve();
                return;
            }
            
            const meshoptScript = document.createElement('script');
            meshoptScript.src = 'https://unpkg.com/meshopt_decoder@1.4.1/meshopt_decoder.js';
            document.head.appendChild(meshoptScript);
            
            const script = document.createElement('script');
            script.type = 'module';
            script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js';
            script.onload = () => resolve();
            script.onerror = () => resolve();
            document.head.appendChild(script);
        });
    };
    
    loadModelViewer().then(() => {
        
        const lightbox = {
        overlay: null,
        container: null,
        image: null,
        modelViewer: null,
        closeBtn: null,
        prevBtn: null,
        nextBtn: null,
        view3DBtn: null,
        title: null,
        
        currentIndex: 0,
        items: [],
        is3DMode: false,
                
        init() {
            this.createElements();
            this.bindEvents();
            this.waitForModelViewer();
        },
        
        createElements() {
            this.overlay = document.createElement('div');
            this.overlay.className = 'lightbox-overlay';
            
            this.container = document.createElement('div');
            this.container.className = 'lightbox-container';
            
            this.closeBtn = document.createElement('button');
            this.closeBtn.className = 'lightbox-close';
            this.closeBtn.innerHTML = '×';
            this.closeBtn.setAttribute('aria-label', 'Fechar');
            
            this.prevBtn = document.createElement('button');
            this.prevBtn.className = 'lightbox-nav lightbox-prev';
            this.prevBtn.innerHTML = '‹';
            this.prevBtn.setAttribute('aria-label', 'Anterior');
            
            this.nextBtn = document.createElement('button');
            this.nextBtn.className = 'lightbox-nav lightbox-next';
            this.nextBtn.innerHTML = '›';
            this.nextBtn.setAttribute('aria-label', 'Próximo');
            
            this.view3DBtn = document.createElement('button');
            this.view3DBtn.className = 'lightbox-3d-btn';
            this.view3DBtn.innerHTML = '🎯 Ver 3D';
            this.view3DBtn.setAttribute('aria-label', 'Visualizar em 3D');
            
            this.image = document.createElement('img');
            this.image.className = 'lightbox-image';
            
            this.modelViewer = document.createElement('model-viewer');
            this.modelViewer.className = 'lightbox-model';
            this.modelViewer.setAttribute('camera-controls', '');
            this.modelViewer.setAttribute('auto-rotate', '');
            this.modelViewer.setAttribute('rotation-per-second', '30deg');
            this.modelViewer.setAttribute('exposure', '1');
            this.modelViewer.setAttribute('loading', 'eager');
            this.modelViewer.setAttribute('shadow-intensity', '1');
            this.modelViewer.setAttribute('ar', '');
            this.modelViewer.setAttribute('ar-modes', 'webxr scene-viewer quick-look');
            this.modelViewer.setAttribute('xr-environment', '');
            this.modelViewer.setAttribute('meshopt-decoder', 'https://unpkg.com/meshopt_decoder@1.4.1/meshopt_decoder.js');
            this.modelViewer.style.display = 'none';
            this.modelViewer.style.background = 'transparent';
            this.modelViewer.style.borderRadius = '10px';
            
            this.title = document.createElement('div');
            this.title.className = 'lightbox-title';
            
            this.container.appendChild(this.closeBtn);
            this.container.appendChild(this.prevBtn);
            this.container.appendChild(this.nextBtn);
            this.container.appendChild(this.view3DBtn);
            this.container.appendChild(this.image);
            this.container.appendChild(this.modelViewer);
            this.container.appendChild(this.title);
            this.overlay.appendChild(this.container);
            document.body.appendChild(this.overlay);
        },
        
        waitForModelViewer() {
            const check = () => {
                if (customElements.get('model-viewer')) {
                    return;
                } else {
                    setTimeout(check, 100);
                }
            };
            check();
        },
        
        bindEvents() {
            this.closeBtn.addEventListener('click', () => this.close());
            this.prevBtn.addEventListener('click', (e) => { e.stopPropagation(); this.prev(); });
            this.nextBtn.addEventListener('click', (e) => { e.stopPropagation(); this.next(); });
            this.view3DBtn.addEventListener('click', (e) => { e.stopPropagation(); this.toggle3D(); });
            
            this.overlay.addEventListener('click', (e) => {
                if (e.target === this.overlay) this.close();
            });
            
            document.addEventListener('keydown', (e) => {
                if (!this.overlay.classList.contains('active')) return;
                
                if (e.key === 'Escape') this.close();
                if (e.key === 'ArrowLeft') this.prev();
                if (e.key === 'ArrowRight') this.next();
            });
        },
        
        open(items, index = 0) {
            this.items = items;
            this.currentIndex = index;
            this.is3DMode = false;
            this.updateContent();
            this.overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        },
        
        close() {
            this.overlay.classList.remove('active');
            document.body.style.overflow = '';
            this.is3DMode = false;
            this.modelViewer.style.display = 'none';
            this.image.style.display = 'block';
        },
        
        updateContent() {
            const item = this.items[this.currentIndex];
            
            this.title.textContent = item.title;
            
            if (item.model3d) {
                this.view3DBtn.style.display = 'block';
            } else {
                this.view3DBtn.style.display = 'none';
            }
            
            if (this.is3DMode && item.model3d) {
                this.image.style.display = 'none';
                this.modelViewer.style.display = 'block';
                this.modelViewer.src = '';
                this.modelViewer.src = item.model3d;
                this.view3DBtn.innerHTML = '🖼️ Ver Imagem';
            } else {
                this.modelViewer.style.display = 'none';
                this.image.style.display = 'block';
                this.image.src = item.image;
                this.view3DBtn.innerHTML = '🎯 Ver 3D';
            }
            
            this.prevBtn.style.display = this.items.length > 1 ? 'block' : 'none';
            this.nextBtn.style.display = this.items.length > 1 ? 'block' : 'none';
        },
        
        toggle3D() {
            this.is3DMode = !this.is3DMode;
            this.updateContent();
        },
        
        prev() {
            this.currentIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
            this.is3DMode = false;
            this.updateContent();
        },
        
        next() {
            this.currentIndex = (this.currentIndex + 1) % this.items.length;
            this.is3DMode = false;
            this.updateContent();
        }
    };
    
    const carousel = {
        carsContainer: null,
        pistasContainer: null,
        
        carsItems: [],
        pistasItems: [],
        
        carsIndex: 0,
        pistasIndex: 0,
        
        carsInterval: null,
        pistasInterval: null,
        
        init() {
            this.carsContainer = document.querySelector('.cars-carousel');
            this.pistasContainer = document.querySelector('.pistas-carousel');
            
            this.setupCarsCarousel();
            this.setupPistasCarousel();
        },
        
        setupCarsCarousel() {
            const carItems = document.querySelectorAll('.car-item');
            
            carItems.forEach((item, index) => {
                const image = item.querySelector('.car-image').src;
                const title = item.querySelector('.car-title').textContent;
                const model3d = item.dataset.model3d || null;
                
                this.carsItems.push({ image, title, model3d });
                
                item.addEventListener('click', () => {
                    this.stopCarousel('cars');
                    lightbox.open(this.carsItems, index);
                });
            });
            
            this.startCarousel('cars');
            
            const carouselEl = this.carsContainer;
            carouselEl.addEventListener('mouseenter', () => this.stopCarousel('cars'));
            carouselEl.addEventListener('mouseleave', () => this.startCarousel('cars'));
        },
        
        setupPistasCarousel() {
            const pistaItems = document.querySelectorAll('.pista-item');
            
            pistaItems.forEach((item, index) => {
                const image = item.querySelector('.pista-image').src;
                const title = item.querySelector('.pista-title').textContent;
                
                this.pistasItems.push({ image, title, model3d: null });
                
                item.addEventListener('click', () => {
                    this.stopCarousel('pistas');
                    lightbox.open(this.pistasItems, index);
                });
            });
            
            this.startCarousel('pistas');
            
            const carouselEl = this.pistasContainer;
            carouselEl.addEventListener('mouseenter', () => this.stopCarousel('pistas'));
            carouselEl.addEventListener('mouseleave', () => this.startCarousel('pistas'));
        },
        
        startCarousel(type) {
            const container = type === 'cars' ? this.carsContainer : this.pistasContainer;
            const items = type === 'cars' ? this.carsItems : this.pistasItems;
            
            if (type === 'cars') {
                this.carsInterval = setInterval(() => {
                    this.carsIndex = (this.carsIndex + 1) % items.length;
                    this.updateCarousel(type);
                }, 4000);
            } else {
                this.pistasInterval = setInterval(() => {
                    this.pistasIndex = (this.pistasIndex + 1) % items.length;
                    this.updateCarousel(type);
                }, 4000);
            }
        },
        
        stopCarousel(type) {
            if (type === 'cars') {
                clearInterval(this.carsInterval);
            } else {
                clearInterval(this.pistasInterval);
            }
        },
        
        updateCarousel(type) {
            const container = type === 'cars' ? this.carsContainer : this.pistasContainer;
            const items = type === 'cars' ? this.carsItems : this.pistasItems;
            const index = type === 'cars' ? this.carsIndex : this.pistasIndex;
            
            const itemElements = container.querySelectorAll(type === 'cars' ? '.car-item' : '.pista-item');
            
            itemElements.forEach((el, i) => {
                el.classList.toggle('active', i === index);
            });
        }
    };
    
    lightbox.init();
    carousel.init();
    
    window.addEventListener('lightbox:open', (e) => {
        lightbox.open(e.detail.items, e.detail.index || 0);
    });
    
    window.lightbox = lightbox;
    window.carousel = carousel;
    });
});
