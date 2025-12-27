export class Modal {
    constructor() {
        this.modalRoot = document.getElementById('modalRoot');
        this.currentModal = null;
    }
    
    open(content, options = {}) {
        const {
            title = '',
            onClose = null,
            size = 'md',
            showCloseButton = true
        } = options;
        
        const sizeClasses = {
            sm: 'max-w-md',
            md: 'max-w-lg',
            lg: 'max-w-2xl',
            xl: 'max-w-4xl',
            full: 'max-w-6xl'
        };
        
        const modalHTML = `
            <div class="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div class="modal-box bg-white rounded-lg shadow-xl ${sizeClasses[size]} w-full max-h-[90vh] overflow-y-auto">
                    ${title || showCloseButton ? `
                        <div class="modal-header flex justify-between items-center p-4 border-b">
                            <h3 class="text-lg font-semibold text-gray-800">${title}</h3>
                            ${showCloseButton ? `
                                <button class="modal-close text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
                            ` : ''}
                        </div>
                    ` : ''}
                    <div class="modal-content p-4">
                        ${content}
                    </div>
                </div>
            </div>
        `;
        
        this.modalRoot.innerHTML = modalHTML;
        this.currentModal = this.modalRoot.querySelector('.modal-overlay');
        
        const closeButton = this.modalRoot.querySelector('.modal-close');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                if (onClose) onClose();
                this.close();
            });
        }
        
        this.currentModal.addEventListener('click', (e) => {
            if (e.target === this.currentModal) {
                if (onClose) onClose();
                this.close();
            }
        });
        
        document.addEventListener('keydown', this.handleEscape);
        
        return this;
    }
    
    close() {
        if (this.currentModal) {
            this.currentModal.style.opacity = '0';
            setTimeout(() => {
                this.modalRoot.innerHTML = '';
                this.currentModal = null;
            }, 200);
        }
        document.removeEventListener('keydown', this.handleEscape);
    }
    
    handleEscape = (e) => {
        if (e.key === 'Escape') {
            this.close();
        }
    }
    
    setContent(content) {
        const modalContent = this.modalRoot.querySelector('.modal-content');
        if (modalContent) {
            modalContent.innerHTML = content;
        }
    }
}

export function openModal(content, options = {}) {
    const modal = new Modal();
    modal.open(content, options);
    return modal;
}

export function closeModal() {
    const modalRoot = document.getElementById('modalRoot');
    modalRoot.innerHTML = '';
}
