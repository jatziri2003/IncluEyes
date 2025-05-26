// Load navbar component
async function loadNavbar() {
  try {
    const response = await fetch("components/navbar.html")
    const navbarHTML = await response.text()
    document.getElementById("navbar-container").innerHTML = navbarHTML
  } catch (error) {
    console.error("Error loading navbar:", error)
  }
}

// Initialize navbar when page loads
document.addEventListener("DOMContentLoaded", () => {
  loadNavbar().then(() => {
    // Initialize all functionality after navbar is loaded
    initializeNavbar()
    initDropdownFunctionality()
    setActiveNavItem()
    initSmoothScrolling()
    initNavbarScrollEffect()
    initAnimations()
    animateNumbers()
    initLazyLoading()
    initClickOutside()
    initKeyboardNavigation()
  })
})

// Initialize navbar functionality
function initializeNavbar() {
  const navLinks = document.querySelectorAll(".nav-links a")
  const navLinksContainer = document.getElementById("navLinks")
  const mobileBtn = document.querySelector(".mobile-menu-btn")

  // Add click listeners to nav links
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (navLinksContainer) {
        navLinksContainer.classList.remove("mobile-open")
      }
      if (mobileBtn) {
        mobileBtn.classList.remove("active")
      }
      // Close dropdowns when clicking nav links
      closeAllDropdowns()
    })
  })
}

// Initialize dropdown functionality
function initDropdownFunctionality() {
  const dropdownToggles = document.querySelectorAll(".dropdown-toggle")

  dropdownToggles.forEach((toggle) => {
    toggle.addEventListener("click", (event) => {
      toggleDropdown(event)
    })
  })
}

// Set active navigation item based on current page
function setActiveNavItem() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html"
  const navLinks = document.querySelectorAll(".nav-links a[href]")

  navLinks.forEach((link) => {
    const href = link.getAttribute("href")

    // Remove existing active classes
    link.classList.remove("active")

    // Check if this link matches current page
    if (
      href === currentPage ||
      (currentPage === "" && href === "index.html") ||
      (currentPage === "index.html" && href === "/index.html") ||
      href.includes(currentPage)
    ) {
      link.classList.add("active")
    }

    // Special handling for dropdown items
    if (href === "interprete.html" && currentPage === "interprete.html") {
      link.classList.add("active")
      // Also highlight the Services dropdown
      const servicesToggle = document.querySelector(".dropdown-toggle")
      if (servicesToggle) {
        servicesToggle.classList.add("active")
      }
    }

    if (href === "traductor.html" && currentPage === "traductor.html") {
      link.classList.add("active")
      // Also highlight the Services dropdown
      const servicesToggle = document.querySelector(".dropdown-toggle")
      if (servicesToggle) {
        servicesToggle.classList.add("active")
      }
    }
  })
}

// Toggle mobile menu
function toggleMobileMenu() {
  const navLinks = document.getElementById("navLinks")
  const mobileBtn = document.querySelector(".mobile-menu-btn")

  if (navLinks && mobileBtn) {
    navLinks.classList.toggle("mobile-open")
    mobileBtn.classList.toggle("active")

    // Close dropdowns when opening mobile menu
    if (navLinks.classList.contains("mobile-open")) {
      closeAllDropdowns()
    }
  }
}

// Toggle dropdown menu
function toggleDropdown(event) {
  event.preventDefault()
  event.stopPropagation()

  const dropdown = event.target.closest(".dropdown")
  const isActive = dropdown.classList.contains("active")

  // Close all other dropdowns
  closeAllDropdowns()

  // Toggle current dropdown
  if (!isActive) {
    dropdown.classList.add("active")

    // Add animation delay for items
    const items = dropdown.querySelectorAll(".dropdown-item")
    items.forEach((item, index) => {
      item.style.animationDelay = `${(index + 1) * 0.1}s`
    })
  }
}

// Close all dropdowns
function closeAllDropdowns() {
  const dropdowns = document.querySelectorAll(".dropdown")
  dropdowns.forEach((dropdown) => {
    dropdown.classList.remove("active")
  })
}

// Initialize click outside functionality
function initClickOutside() {
  document.addEventListener("click", (event) => {
    const navbar = document.querySelector(".navbar")
    const navLinks = document.getElementById("navLinks")
    const mobileBtn = document.querySelector(".mobile-menu-btn")

    // Check if click is outside navbar
    if (navbar && !navbar.contains(event.target)) {
      // Close mobile menu
      if (navLinks && navLinks.classList.contains("mobile-open")) {
        navLinks.classList.remove("mobile-open")
        if (mobileBtn) {
          mobileBtn.classList.remove("active")
        }
      }

      // Close dropdowns
      closeAllDropdowns()
    }

    // Close dropdown if clicking outside of it
    const dropdown = event.target.closest(".dropdown")
    if (!dropdown) {
      closeAllDropdowns()
    }
  })
}

// Initialize keyboard navigation
function initKeyboardNavigation() {
  document.addEventListener("keydown", (event) => {
    // Close dropdowns and mobile menu on Escape
    if (event.key === "Escape") {
      closeAllDropdowns()

      const navLinks = document.getElementById("navLinks")
      const mobileBtn = document.querySelector(".mobile-menu-btn")

      if (navLinks && navLinks.classList.contains("mobile-open")) {
        navLinks.classList.remove("mobile-open")
        if (mobileBtn) {
          mobileBtn.classList.remove("active")
        }
      }
    }

    // Handle Enter and Space for dropdown toggles
    if (event.key === "Enter" || event.key === " ") {
      const target = event.target
      if (target.classList.contains("dropdown-toggle")) {
        event.preventDefault()
        toggleDropdown(event)
      }
    }
  })
}

// Scroll suave para enlaces de navegación
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href")
      if (href === "#" || href === "#login" || href === "#servicios") {
        e.preventDefault()
        return
      }

      const target = document.querySelector(href)
      if (target) {
        e.preventDefault()
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })
}

// Efecto de sombra en navbar al hacer scroll
function initNavbarScrollEffect() {
  window.addEventListener("scroll", () => {
    const navbar = document.querySelector(".navbar")
    if (navbar) {
      if (window.scrollY > 50) {
        navbar.classList.add("scrolled")
        navbar.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
      } else {
        navbar.classList.remove("scrolled")
        navbar.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.1)"
      }
    }
  })
}

// Animaciones de entrada para elementos
function initAnimations() {
  const observerOptions = {
    threshold: 0.5,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1"
        entry.target.style.transform = "translateY(0)"
      }
    })
  }, observerOptions)

  // Observar estadísticas y tarjetas de características
  document.querySelectorAll(".stat-item, .benefit-card, .tech-card, .mode-card, .feature-item").forEach((el) => {
    el.style.opacity = "0"
    el.style.transform = "translateY(20px)"
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease"
    observer.observe(el)
  })
}

// Toggle mode details con funcionalidades mejoradas
function toggleModeDetails(button) {
  const modeCard = button.closest(".mode-card")
  const details = modeCard.querySelector(".mode-details")
  const btnText = button.querySelector(".btn-text")
  const btnIcon = button.querySelector(".btn-icon")

  // Cerrar otros detalles abiertos
  closeOtherModeDetails(button)

  if (details.style.display === "none" || details.style.display === "") {
    // Mostrar detalles
    details.style.display = "block"
    details.classList.remove("hide")
    details.classList.add("show")
    btnText.textContent = "Leer menos"
    btnIcon.textContent = "▲"
    button.classList.add("expanded")

    // Scroll suave hacia la tarjeta expandida
    setTimeout(() => {
      modeCard.scrollIntoView({
        behavior: "smooth",
        block: "center",
      })
    }, 150)
  } else {
    // Ocultar detalles
    details.classList.remove("show")
    details.classList.add("hide")
    btnText.textContent = "Leer más"
    btnIcon.textContent = "▼"
    button.classList.remove("expanded")

    setTimeout(() => {
      details.style.display = "none"
      details.classList.remove("hide")
    }, 300)
  }
}

// Función para cerrar todos los detalles de modos excepto el actual
function closeOtherModeDetails(currentButton) {
  const allButtons = document.querySelectorAll(".read-more-btn")

  allButtons.forEach((button) => {
    if (button !== currentButton && button.classList.contains("expanded")) {
      const modeCard = button.closest(".mode-card")
      const details = modeCard.querySelector(".mode-details")
      const btnText = button.querySelector(".btn-text")
      const btnIcon = button.querySelector(".btn-icon")

      details.classList.remove("show")
      details.classList.add("hide")
      btnText.textContent = "Leer más"
      btnIcon.textContent = "▼"
      button.classList.remove("expanded")

      setTimeout(() => {
        details.style.display = "none"
        details.classList.remove("hide")
      }, 300)
    }
  })
}

// Función para animar números (contador)
function animateNumbers() {
  const statNumbers = document.querySelectorAll(".stat-number")

  const observerOptions = {
    threshold: 0.5,
    rootMargin: "0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const stat = entry.target
        const finalNumber = stat.textContent
        const numericValue = Number.parseInt(finalNumber.replace(/\D/g, ""))
        const suffix = finalNumber.replace(/[\d.]/g, "")

        let currentNumber = 0
        const increment = numericValue / 50

        const timer = setInterval(() => {
          currentNumber += increment
          if (currentNumber >= numericValue) {
            stat.textContent = finalNumber
            clearInterval(timer)
          } else {
            stat.textContent = Math.floor(currentNumber) + suffix
          }
        }, 30)

        observer.unobserve(stat)
      }
    })
  }, observerOptions)

  statNumbers.forEach((stat) => observer.observe(stat))
}

// Función para mostrar notificaciones
function showNotification(message, type = "info") {
  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`
  notification.textContent = message

  // Estilos de la notificación
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 16px 24px;
    border-radius: 8px;
    color: white;
    font-weight: 500;
    z-index: 1000;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  `

  // Colores según el tipo
  const colors = {
    info: "#3b82f6",
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
  }

  notification.style.backgroundColor = colors[type] || colors.info

  document.body.appendChild(notification)

  // Mostrar notificación
  setTimeout(() => {
    notification.style.transform = "translateX(0)"
  }, 100)

  // Ocultar después de 3 segundos
  setTimeout(() => {
    notification.style.transform = "translateX(100%)"
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification)
      }
    }, 300)
  }, 3000)
}

// Función para validar formularios
function validateForm(formElement) {
  const inputs = formElement.querySelectorAll("input[required], textarea[required]")
  let isValid = true

  inputs.forEach((input) => {
    if (!input.value.trim()) {
      input.style.borderColor = "#ef4444"
      input.style.boxShadow = "0 0 0 1px #ef4444"
      isValid = false
    } else {
      input.style.borderColor = "#d1d5db"
      input.style.boxShadow = "none"
    }
  })

  return isValid
}

// Función para lazy loading de imágenes
function initLazyLoading() {
  const images = document.querySelectorAll("img[data-src]")

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target
        img.src = img.dataset.src
        img.classList.remove("lazy")
        imageObserver.unobserve(img)
      }
    })
  })

  images.forEach((img) => imageObserver.observe(img))
}

// Función para manejar el scroll hacia arriba
function initScrollToTop() {
  // Crear botón de scroll to top
  const scrollBtn = document.createElement("button")
  scrollBtn.innerHTML = "↑"
  scrollBtn.className = "scroll-to-top"
  scrollBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: #3b82f6;
    color: white;
    border: none;
    font-size: 20px;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 1000;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  `

  document.body.appendChild(scrollBtn)

  // Mostrar/ocultar botón según scroll
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      scrollBtn.style.opacity = "1"
      scrollBtn.style.visibility = "visible"
    } else {
      scrollBtn.style.opacity = "0"
      scrollBtn.style.visibility = "hidden"
    }
  })

  // Scroll to top al hacer click
  scrollBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  })
}

// Función para manejar el resize de ventana
function initResponsiveHandlers() {
  let resizeTimer

  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(() => {
      // Cerrar menú móvil si se cambia a desktop
      if (window.innerWidth > 768) {
        const navLinks = document.getElementById("navLinks")
        const mobileBtn = document.querySelector(".mobile-menu-btn")

        if (navLinks && mobileBtn) {
          navLinks.classList.remove("mobile-open")
          mobileBtn.classList.remove("active")
        }
        // Close dropdowns when resizing to desktop
        closeAllDropdowns()
      }
    }, 250)
  })
}

// Inicializar scroll to top y handlers responsivos
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    initScrollToTop()
    initResponsiveHandlers()
  }, 1000)
})

// Utility functions for external use
window.NavbarUtils = {
  toggleMobileMenu,
  toggleDropdown,
  closeAllDropdowns,
  setActiveNavItem,
  closeMobileMenu: () => {
    const navLinks = document.getElementById("navLinks")
    const mobileBtn = document.querySelector(".mobile-menu-btn")

    if (navLinks) navLinks.classList.remove("mobile-open")
    if (mobileBtn) mobileBtn.classList.remove("active")
    closeAllDropdowns()
  },
}

// Exportar funciones para uso global
window.IncluyesApp = {
  showNotification,
  validateForm,
  animateNumbers,
  toggleModeDetails,
  loadNavbar,
  toggleDropdown,
  closeAllDropdowns,
  setActiveNavItem,
}

// Debug function
function debugNavbar() {
  console.log("Navbar Debug Info:", {
    currentPage: window.location.pathname.split("/").pop(),
    mobileMenuOpen: document.getElementById("navLinks")?.classList.contains("mobile-open"),
    activeDropdowns: document.querySelectorAll(".dropdown.active").length,
    windowWidth: window.innerWidth,
  })
}

// Función de utilidad para debugging
function debugLog(message, data = null) {
  if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    console.log(`[InclúYes Debug]: ${message}`, data)
  }
}

// Export for debugging
window.debugNavbar = debugNavbar
window.debugLog = debugLog

// Función para abrir el panel de accesibilidad
function openAccessibilityPanel() {
    console.log("🎯 Abriendo panel de accesibilidad...")
    
    const windowFeatures = [
        "width=600",
        "height=800", 
        "scrollbars=yes",
        "resizable=yes",
        "left=" + (screen.width - 650),
        "top=50"
    ].join(",")
    
    const accessibilityWindow = window.open(
        "accesibilidad.html",
        "accessibilityPanel",
        windowFeatures
    )
    
    if (accessibilityWindow) {
        accessibilityWindow.focus()
        console.log("✅ Panel de accesibilidad abierto")
    } else {
        alert("⚠️ Por favor, permite las ventanas emergentes para usar el panel de accesibilidad")
        console.log("❌ Ventana emergente bloqueada")
    }
}