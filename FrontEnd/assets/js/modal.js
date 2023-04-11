const modal = document.querySelector('#modal')

document.addEventListener('click', (e) => {
    if(e.target.closest('#open-modal-btn')) {
        modal.showModal();
    }
})

document.addEventListener('click', (e) => {
    if(e.target.closest('.close-modal-btn') || ) {
        modal.close();
    }
})