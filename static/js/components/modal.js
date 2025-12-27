/**
 * Modal component for Schedulix
 */

export const openModal = (title, content, options = {}) => {
    const modalRoot = document.getElementById('modalRoot');
    
    const modalMarkup = `
        <div class="fixed inset-0 z-40 overflow-y-auto" id="modalContainer">
            <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" id="modalOverlay"></div>
                
                <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                
                <div class="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full" 
                     role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                    
                    <div class="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
                        <div class="sm:flex sm:items-start">
                            <div class="w-full mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                <h3 class="text-lg font-medium leading-6 text-gray-900" id="modal-headline">
                                    ${title}
                                </h3>
                                <div class="mt-4">
                                    ${content}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="px-4 py-3 bg-gray-50 sm:px-6 sm:flex sm:flex-row-reverse gap-2">
                        ${options.showConfirm ? `
                            <button type="button" id="modalConfirmBtn" class="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm">
                                ${options.confirmText || 'Confirm'}
                            </button>
                        ` : ''}
                        <button type="button" id="modalCloseBtn" class="inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                            ${options.cancelText || 'Close'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    modalRoot.innerHTML = modalMarkup;
    
    const closeModal = () => {
        modalRoot.innerHTML = '';
        document.removeEventListener('keydown', handleEscape);
    };
    
    const handleEscape = (e) => {
        if (e.key === 'Escape') closeModal();
    };
    
    document.addEventListener('keydown', handleEscape);
    document.getElementById('modalOverlay').onclick = closeModal;
    document.getElementById('modalCloseBtn').onclick = closeModal;
    
    if (options.showConfirm) {
        document.getElementById('modalConfirmBtn').onclick = () => {
            if (options.onConfirm) {
                options.onConfirm(closeModal);
            } else {
                closeModal();
            }
        };
    }

    if (options.onRender) {
        options.onRender(closeModal);
    }
};

export const showConfirm = (title, message, onConfirm) => {
    openModal(title, `<p class="text-gray-600">${message}</p>`, {
        showConfirm: true,
        confirmText: 'Delete',
        onConfirm: (close) => {
            onConfirm();
            close();
        }
    });
};
