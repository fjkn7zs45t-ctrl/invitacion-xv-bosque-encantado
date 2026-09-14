// ===== VARIABLES GLOBALES =====
let isBookOpen = false;

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', () => {
    initializeParticles();
    attachEventListeners();
});

// ===== PARTÍCULAS DEL FONDO =====
function initializeParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = window.innerWidth > 768 ? 30 : 15;

    for (let i = 0; i < particleCount; i++) {
        createFloatingParticle(particlesContainer);
    }

    // Crear nuevas partículas periódicamente
    setInterval(() => {
        if (particlesContainer.children.length < particleCount) {
            createFloatingParticle(particlesContainer);
        }
    }, 3000);
}

function createFloatingParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';

    const dot = document.createElement('div');
    dot.className = 'particle-dot';
    particle.appendChild(dot);

    const startX = Math.random() * window.innerWidth;
    const startY = window.innerHeight;
    const randomDelay = Math.random() * 5;

    particle.style.left = startX + 'px';
    particle.style.top = startY + 'px';
    particle.style.animationDelay = randomDelay + 's';
    particle.style.animationDuration = (6 + Math.random() * 4) + 's';

    container.appendChild(particle);

    // Eliminar partículas cuando termina la animación
    particle.addEventListener('animationend', () => {
        particle.remove();
    });
}

// ===== EVENT LISTENERS =====
function attachEventListeners() {
    const bookClosed = document.getElementById('bookClosed');
    const goldenKey = document.getElementById('goldenKey');

    // Click en el libro
    bookClosed.addEventListener('click', openBook);

    // También permitir click en cualquier parte del contenedor del libro
    document.getElementById('bookContainer').addEventListener('click', (e) => {
        if (e.target.closest('#bookClosed') && !isBookOpen) {
            openBook();
        }
    });

    // Touch para móviles
    bookClosed.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (!isBookOpen) {
            openBook();
        }
    });
}

// ===== ANIMACIÓN DE APERTURA DEL LIBRO =====
function openBook() {
    if (isBookOpen) return;
    isBookOpen = true;

    const bookClosed = document.getElementById('bookClosed');
    const bookOpen = document.getElementById('bookOpen');
    const goldenKey = document.getElementById('goldenKey');

    // 1. Llave desaparece
    goldenKey.classList.add('disappear');

    // 2. Crear explosión de partículas mágicas
    setTimeout(() => {
        createMagicBurst();
    }, 200);

    // 3. Libro se abre
    setTimeout(() => {
        bookClosed.style.opacity = '0';
        bookClosed.style.pointerEvents = 'none';
        bookOpen.classList.add('active');
        
        // Crear efecto de luz dorada
        createGoldenFlash();
        
        // Crear partículas mágicas flotantes
        createMagicalLeaves();
    }, 800);
}

// ===== EXPLOSIÓN DE PARTÍCULAS MÁGICAS =====
function createMagicBurst() {
    const container = document.getElementById('magicParticles');
    const bookContainer = document.getElementById('bookContainer');
    const rect = bookContainer.getBoundingClientRect();
    
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const particleCount = 20;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'magic-particle burst-particle';

        const spark = document.createElement('div');
        spark.className = 'magic-spark';
        particle.appendChild(spark);

        // Ángulo aleatorio
        const angle = (Math.PI * 2 * i) / particleCount;
        const distance = 100 + Math.random() * 50;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;

        particle.style.left = centerX + 'px';
        particle.style.top = centerY + 'px';
        particle.style.setProperty('--tx', tx + 'px');
        particle.style.setProperty('--ty', ty + 'px');

        container.appendChild(particle);

        // Eliminar después de la animación
        particle.addEventListener('animationend', () => {
            particle.remove();
        });
    }
}

// ===== EFECTO DE LUZ DORADA =====
function createGoldenFlash() {
    const container = document.getElementById('magicParticles');
    const flash = document.createElement('div');
    
    flash.style.position = 'absolute';
    flash.style.left = '50%';
    flash.style.top = '50%';
    flash.style.width = '100px';
    flash.style.height = '100px';
    flash.style.background = 'radial-gradient(circle, rgba(255, 215, 0, 0.8) 0%, transparent 70%)';
    flash.style.transform = 'translate(-50%, -50%)';
    flash.style.pointerEvents = 'none';
    flash.style.animation = 'golden-flash 0.8s ease-out';

    container.appendChild(flash);

    // Agregar animación
    const style = document.createElement('style');
    if (!document.getElementById('golden-flash-style')) {
        style.id = 'golden-flash-style';
        style.textContent = `
            @keyframes golden-flash {
                0% {
                    width: 100px;
                    height: 100px;
                    opacity: 1;
                }
                100% {
                    width: 400px;
                    height: 400px;
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    setTimeout(() => {
        flash.remove();
    }, 800);
}

// ===== HOJAS Y PARTÍCULAS MÁGICAS FLOTANTES =====
function createMagicalLeaves() {
    const container = document.getElementById('magicParticles');
    const bookContainer = document.getElementById('bookContainer');
    const rect = bookContainer.getBoundingClientRect();
    
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const leafCount = 15;

    for (let i = 0; i < leafCount; i++) {
        setTimeout(() => {
            const leaf = document.createElement('div');
            leaf.className = 'magic-particle';

            const spark = document.createElement('div');
            spark.className = 'magic-spark';
            leaf.appendChild(spark);

            // Posición aleatoria
            const angle = Math.random() * Math.PI * 2;
            const distance = 30 + Math.random() * 60;
            const startX = centerX + Math.cos(angle) * distance;
            const startY = centerY + Math.sin(angle) * distance;

            leaf.style.left = startX + 'px';
            leaf.style.top = startY + 'px';

            // Movimiento aleatorio
            const endAngle = Math.random() * Math.PI * 2;
            const endDistance = 150 + Math.random() * 100;
            const tx = Math.cos(endAngle) * endDistance;
            const ty = Math.sin(endAngle) * endDistance;

            leaf.style.setProperty('--tx', tx + 'px');
            leaf.style.setProperty('--ty', ty + 'px');
            leaf.style.animation = `magic-burst ${2 + Math.random() * 1.5}s ease-out forwards`;

            container.appendChild(leaf);

            leaf.addEventListener('animationend', () => {
                leaf.remove();
            });
        }, i * 100);
    }
}

// ===== MANEJO DE REDIMENSIONAMIENTO =====
window.addEventListener('resize', () => {
    // Recrear partículas si es necesario
    const particlesContainer = document.getElementById('particles');
    
    if (window.innerWidth > 768 && particlesContainer.children.length < 30) {
        for (let i = particlesContainer.children.length; i < 30; i++) {
            createFloatingParticle(particlesContainer);
        }
    }
});

// ===== CONFETTI PERSONALIZADO (OPCIONAL) =====
function createConfetti() {
    const container = document.getElementById('magicParticles');
    const confettiCount = 50;

    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.position = 'absolute';
            confetti.style.width = '3px';
            confetti.style.height = '3px';
            confetti.style.background = ['#ffd700', '#d4af37', '#f5d5e8'][Math.floor(Math.random() * 3)];
            confetti.style.borderRadius = '50%';
            confetti.style.left = Math.random() * window.innerWidth + 'px';
            confetti.style.top = '-10px';
            confetti.style.pointerEvents = 'none';
            confetti.style.boxShadow = '0 0 4px rgba(212, 175, 55, 0.6)';

            container.appendChild(confetti);

            let x = parseFloat(confetti.style.left);
            let y = 0;
            let vx = (Math.random() - 0.5) * 4;
            let vy = 2 + Math.random() * 3;

            function animate() {
                x += vx;
                y += vy;
                vy += 0.1; // Gravedad

                confetti.style.left = x + 'px';
                confetti.style.top = y + 'px';

                if (y < window.innerHeight) {
                    requestAnimationFrame(animate);
                } else {
                    confetti.remove();
                }
            }

            animate();
        }, i * 20);
    }
}

// ===== FUNCIONES ADICIONALES DE UTILIDAD =====

// Función para configurar los detalles de la invitación
function setInvitationDetails(options) {
    const defaults = {
        fecha: '[Tu fecha]',
        hora: '[Tu hora]',
        lugar: '[Tu lugar]',
        contacto: '[Tu contacto]'
    };

    const config = { ...defaults, ...options };

    const details = document.querySelector('.details');
    if (details) {
        details.innerHTML = `
            <p><strong>Fecha:</strong> ${config.fecha}</p>
            <p><strong>Hora:</strong> ${config.hora}</p>
            <p><strong>Lugar:</strong> ${config.lugar}</p>
            ${config.contacto ? `<p><strong>Contacto:</strong> ${config.contacto}</p>` : ''}
        `;
    }
}

// Función para cambiar el nombre
function setGuestName(name) {
    const h1 = document.querySelector('.book-title h1');
    if (h1) {
        h1.textContent = name;
    }
}

// Función para manejar confirmación
document.addEventListener('DOMContentLoaded', () => {
    const confirmBtn = document.querySelector('.confirm-btn');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', (e) => {
            e.preventDefault();
            handleConfirmation();
        });
    }
});

function handleConfirmation() {
    // Crear efecto de celebración
    createConfetti();
    
    // Aquí puedes agregar lógica para enviar confirmación
    console.log('Asistencia confirmada');
    
    // Ejemplo: mostrar mensaje
    alert('¡Gracias por confirmar tu asistencia! 🎉');
}

// ===== EXPORTAR FUNCIONES PARA USO EXTERNO =====
window.setInvitationDetails = setInvitationDetails;
window.setGuestName = setGuestName;
window.handleConfirmation = handleConfirmation;
