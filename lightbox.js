document.addEventListener('DOMContentLoaded', () => {
    const loadModelViewer = () => {
        return new Promise((resolve) => {
            if (customElements.get('model-viewer')) {
                resolve();
                return;
            }
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

            init() {
                this.createElements();
                this.bindEvents();
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

            openImage(imageSrc, title, model3d = null) {
                this.title.textContent = title;
                this.image.src = imageSrc;
                this.image.style.display = 'block';
                this.modelViewer.style.display = 'none';

                if (model3d) {
                    this.view3DBtn.style.display = 'block';
                    this.view3DBtn.textContent = '🎯 Ver 3D';
                    this.view3DBtn.onclick = () => {
                        this.open3D(model3d, title);
                    };
                } else {
                    this.view3DBtn.style.display = 'none';
                }

                this.prevBtn.style.display = 'none';
                this.nextBtn.style.display = 'none';
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

            open3D(modelSrc, title) {
                this.title.textContent = title;
                this.image.style.display = 'none';
                this.modelViewer.style.display = 'block';
                this.modelViewer.src = modelSrc;
                this.view3DBtn.style.display = 'none';
                this.prevBtn.style.display = 'block';
                this.nextBtn.style.display = 'block';
                this.overlay.classList.add('active');
                document.body.style.overflow = 'hidden';
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
            carsCards: [],

            init() {
                this.setupCarsCards();
                this.setupPistasCards();
            },

            setupCarsCards() {
                const cards = document.querySelectorAll('.car-card');

                cards.forEach((card) => {
                    const image = card.querySelector('.car-image');
                    const title = card.querySelector('.car-title').textContent;
                    const model3d = card.dataset.model3d || null;

                    this.carsCards.push({ image, title, model3d });

                    image.addEventListener('click', () => {
                        lightbox.openImage(image.src, title, model3d);
                    });

                    const view3dBtn = card.querySelector('.view-3d-btn');
                    if (view3dBtn && model3d) {
                        view3dBtn.addEventListener('click', (e) => {
                            e.stopPropagation();
                            lightbox.open3D(model3d, title);
                        });
                    }
                });
            },

            setupPistasCards() {
                const cards = document.querySelectorAll('.pista-card');

                cards.forEach((card) => {
                    const image = card.querySelector('.pista-image');
                    const title = card.querySelector('.pista-title').textContent;

                    image.addEventListener('click', () => {
                        lightbox.openImage(image.src, title);
                    });
                });
            }
        };

        lightbox.init();
        carousel.init();

        window.lightbox = lightbox;
        window.carousel = carousel;
    });
});
