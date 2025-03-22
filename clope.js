document.addEventListener('DOMContentLoaded', () => {
    const clope = document.querySelector('.clope');
    const briquet = document.querySelector('.briquet');

    let isDraggingClope = false;
    let isDraggingBriquet = false;
    let clopeX = 0;
    let clopeY = 0;
    let briquetX = 0;
    let briquetY = 0;

    // Initialisation des positions
    initPositions();

    // Gestion de la cigarette
    clope.addEventListener('mousedown', startDragClope);
    document.addEventListener('mousemove', dragClope);
    document.addEventListener('mouseup', endDragClope);

    // Gestion du briquet
    briquet.addEventListener('mousedown', startDragBriquet);
    document.addEventListener('mousemove', dragBriquet);
    document.addEventListener('mouseup', endDragBriquet);

    function initPositions() {
        clope.style.left = `${window.innerWidth / 2 - clope.offsetWidth / 2}px`;
        clope.style.top = `${window.innerHeight / 2 - clope.offsetHeight / 2}px`;
        briquet.style.right = '20px';
        briquet.style.bottom = '20px';
    }

    function startDragClope(e) {
        isDraggingClope = true;
        clope.style.cursor = 'grabbing';
        clopeX = e.clientX - clope.offsetLeft;
        clopeY = e.clientY - clope.offsetTop;
    }

    function dragClope(e) {
        if (isDraggingClope) {
            clope.style.left = `${e.clientX - clopeX}px`;
            clope.style.top = `${e.clientY - clopeY}px`;
        }
    }

    function endDragClope() {
        isDraggingClope = false;
        clope.style.cursor = 'grab';
    }

    function startDragBriquet(e) {
        isDraggingBriquet = true;
        briquet.style.cursor = 'grabbing';
        briquetX = e.clientX - briquet.offsetLeft;
        briquetY = e.clientY - briquet.offsetTop;
        briquet.classList.add('grabbing'); 
    }

    function dragBriquet(e) {
        if (isDraggingBriquet) {
            briquet.style.left = `${e.clientX - briquetX}px`;
            briquet.style.top = `${e.clientY - briquetY}px`;
        }
    }

    function endDragBriquet() {
        isDraggingBriquet = false;
        briquet.style.cursor = 'pointer';
        briquet.classList.remove('grabbing');
    }

    // Adaptation au redimensionnement de la fenêtre
    window.addEventListener('resize', () => {
        initPositions();
    });
});