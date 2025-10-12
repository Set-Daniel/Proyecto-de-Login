// Elementos del DOM
const form = document.getElementById('loginForm');
const accessKey = document.getElementById('accessKey');
const togglePassword = document.getElementById('togglePassword');
const submitBtn = document.getElementById('submitBtn');
const messageContainer = document.getElementById('message-container');
const btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;
const btnLoader = submitBtn ? submitBtn.querySelector('.btn-loader') : null;

// Variables para control de intentos
let attempts = 0;
const maxAttempts = 2;
const correctKey = 'MBT2025';
let isBlocked = false;

// Función para mostrar mensajes
function showMessage(message, type = 'error') {
  if (messageContainer) {
    messageContainer.textContent = message;
    messageContainer.className = `message-container show ${type}`;
    
    setTimeout(() => {
      if (messageContainer) {
        messageContainer.classList.remove('show');
      }
    }, 5000);
  }
}

// Función para bloquear el formulario
function blockForm() {
  isBlocked = true;
  
  if (accessKey) {
    accessKey.disabled = true;
    accessKey.placeholder = 'Acceso bloqueado - Sin intentos disponibles';
  }
  
  if (submitBtn) {
    submitBtn.disabled = true;
    if (btnText) btnText.textContent = 'Acceso Bloqueado';
  }
  
  showMessage('❌ Acceso bloqueado. Ha excedido el número máximo de intentos.', 'error');
}

// Toggle de password
if (togglePassword && accessKey) {
  togglePassword.addEventListener('click', (e) => {
    if (isBlocked) return; // No permitir toggle si está bloqueado
    
    e.preventDefault();
    const type = accessKey.type === 'password' ? 'text' : 'password';
    accessKey.type = type;
    const ariaLabel = type === 'password' ? 'Mostrar contraseña' : 'Ocultar contraseña';
    togglePassword.setAttribute('aria-label', ariaLabel);
    
    const path = togglePassword.querySelector('path');
    if (path) {
      path.style.opacity = type === 'password' ? '1' : '0.7';
    }
  });

  togglePassword.addEventListener('keydown', (e) => {
    if (isBlocked) return; // No permitir toggle si está bloqueado
    
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      togglePassword.click();
    }
  });
}

// Submit del formulario
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Si está bloqueado, no hacer nada
    if (isBlocked) {
      showMessage('El acceso está bloqueado. No se permiten más intentos.', 'error');
      return;
    }
    
    const key = accessKey ? accessKey.value.trim() : '';
    
    // Resetear estado visual
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.classList.remove('loading');
    }
    if (messageContainer) {
      messageContainer.classList.remove('show');
    }
    
    // Validación básica
    if (key === '') {
      showMessage('Por favor, introduzca su llave de acceso.');
      if (accessKey) accessKey.focus();
      return;
    }
    
    // Estado de loading
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.classList.add('loading');
      if (btnText) btnText.textContent = 'Verificando...';
    }
    
    // Simular verificación
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Verificar clave
    if (key === correctKey) {
      showMessage('✅ Bienvenido al sistema MB Transfer Punta Cana 🚐', 'success');
      
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1500);
    } else {
      // Incrementar intentos
      attempts++;
      
      const remainingAttempts = maxAttempts - attempts;
      
      if (remainingAttempts > 0) {
        showMessage(`❌ Llave de acceso incorrecta. Le quedan ${remainingAttempts} intento(s).`);
      } else {
        // Bloquear después del último intento fallido
        blockForm();
      }
      
      if (accessKey) {
        accessKey.value = '';
        accessKey.focus();
      }
    }
    
    // Resetear botón (solo si no está bloqueado)
    if (submitBtn && !isBlocked) {
      submitBtn.disabled = false;
      submitBtn.classList.remove('loading');
      if (btnText) btnText.textContent = 'Acceder';
    }
  });
}

// Limpiar mensajes al escribir (solo si no está bloqueado)
if (accessKey && messageContainer) {
  accessKey.addEventListener('input', () => {
    if (!isBlocked) {
      messageContainer.classList.remove('show');
    }
  });
}

// Verificar estado de bloqueo al cargar la página
document.addEventListener('DOMContentLoaded', function() {
  if (isBlocked) {
    blockForm();
  }
});