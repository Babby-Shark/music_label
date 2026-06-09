/* ============================================
   MUSIC LABEL WEBSITE - MAIN JAVASCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
  initializeNavigation();
  initializeScrollAnimations();
  initializeForms();
  initializeFilters();
  initializeSearch();
});

window.addEventListener('scroll', function() {
  updateHeaderScroll();
  triggerScrollAnimations();
});

/* ============================================
   NAVIGATION
   ============================================ */

function initializeNavigation() {
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (navToggle) {
    navToggle.addEventListener('click', function() {
      navLinks.classList.toggle('active');
    });
  }

  // Close menu when link is clicked
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function() {
      navLinks.classList.remove('active');
      updateActiveNavLink();
    });
  });

  // Set active link based on current page
  updateActiveNavLink();
}

function updateActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

function updateHeaderScroll() {
  const header = document.querySelector('header');
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}

/* ============================================
   SCROLL ANIMATIONS
   ============================================ */

function initializeScrollAnimations() {
  const elements = document.querySelectorAll('.scroll-animate');
  
  elements.forEach(element => {
    observer.observe(element);
  });
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
});

function triggerScrollAnimations() {
  // Additional scroll-based animations can be added here
}

/* ============================================
   FORM HANDLING
   ============================================ */

function initializeForms() {
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', handleFormSubmit);
  });
}

function handleFormSubmit(e) {
  e.preventDefault();
  
  const form = e.target;
  const formData = new FormData(form);
  
  // Validate form
  if (!validateForm(form)) {
    return;
  }

  // Simulate form submission
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="spinner"></span> Sending...';

  // Simulate API call
  setTimeout(() => {
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
    
    showFormSuccess(form, 'Thank you! We will get back to you soon.');
    form.reset();
    clearFormErrors(form);
  }, 2000);
}

function validateForm(form) {
  let isValid = true;
  clearFormErrors(form);

  const inputs = form.querySelectorAll('input, textarea, select');
  
  inputs.forEach(input => {
    if (!validateField(input)) {
      isValid = false;
    }
  });

  return isValid;
}

function validateField(field) {
  const value = field.value.trim();
  const type = field.type;
  const name = field.name;
  let isValid = true;
  let errorMsg = '';

  // Required field validation
  if (field.hasAttribute('required') && !value) {
    isValid = false;
    errorMsg = 'This field is required';
  }

  // Email validation
  if (type === 'email' && value && !isValidEmail(value)) {
    isValid = false;
    errorMsg = 'Please enter a valid email';
  }

  // Phone validation
  if (type === 'tel' && value && !isValidPhone(value)) {
    isValid = false;
    errorMsg = 'Please enter a valid phone number';
  }

  // Min length validation
  if (field.hasAttribute('minlength')) {
    const minLength = parseInt(field.getAttribute('minlength'));
    if (value && value.length < minLength) {
      isValid = false;
      errorMsg = `Minimum ${minLength} characters required`;
    }
  }

  if (!isValid) {
    showFieldError(field, errorMsg);
  }

  return isValid;
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhone(phone) {
  const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
  return phoneRegex.test(phone);
}

function showFieldError(field, message) {
  field.classList.add('error');
  
  let errorDiv = field.nextElementSibling;
  if (!errorDiv || !errorDiv.classList.contains('form-error')) {
    errorDiv = document.createElement('div');
    errorDiv.className = 'form-error';
    field.parentNode.insertBefore(errorDiv, field.nextSibling);
  }
  
  errorDiv.textContent = message;
  errorDiv.classList.add('form-error');
}

function clearFormErrors(form) {
  form.querySelectorAll('.form-error').forEach(error => {
    error.remove();
  });
  form.querySelectorAll('input, textarea, select').forEach(field => {
    field.classList.remove('error');
  });
}

function showFormSuccess(form, message) {
  clearFormErrors(form);
  
  let successDiv = form.querySelector('.form-success');
  if (!successDiv) {
    successDiv = document.createElement('div');
    successDiv.className = 'form-success';
    form.insertBefore(successDiv, form.firstChild);
  }
  
  successDiv.textContent = message;
  successDiv.style.display = 'block';
  
  setTimeout(() => {
    successDiv.style.display = 'none';
  }, 5000);
}

/* ============================================
   FILTERING
   ============================================ */

function initializeFilters() {
  document.querySelectorAll('[data-filter]').forEach(filterBtn => {
    filterBtn.addEventListener('click', handleFilterClick);
  });
}

function handleFilterClick(e) {
  const filterValue = e.target.getAttribute('data-filter');
  const filterGroup = e.target.getAttribute('data-filter-group') || 'all';
  
  // Update active filter button
  document.querySelectorAll(`[data-filter-group="${filterGroup}"]`).forEach(btn => {
    btn.classList.remove('active');
  });
  e.target.classList.add('active');

  // Filter items
  filterItems(filterValue, filterGroup);
}

function filterItems(filterValue, filterGroup) {
  const items = document.querySelectorAll(`[data-filterable="${filterGroup}"]`);
  
  items.forEach(item => {
    if (filterValue === 'all' || item.getAttribute('data-filter-tag') === filterValue) {
      item.style.display = 'block';
      setTimeout(() => {
        item.style.opacity = '1';
      }, 10);
    } else {
      item.style.opacity = '0';
      setTimeout(() => {
        item.style.display = 'none';
      }, 300);
    }
  });
}

/* ============================================
   SEARCH FUNCTIONALITY
   ============================================ */

function initializeSearch() {
  const searchInputs = document.querySelectorAll('[data-search]');
  
  searchInputs.forEach(input => {
    input.addEventListener('input', handleSearch);
  });
}

function handleSearch(e) {
  const searchTerm = e.target.value.toLowerCase();
  const searchGroup = e.target.getAttribute('data-search');
  const items = document.querySelectorAll(`[data-searchable="${searchGroup}"]`);

  items.forEach(item => {
    const content = item.textContent.toLowerCase();
    
    if (content.includes(searchTerm) || searchTerm === '') {
      item.style.display = 'block';
      item.style.opacity = '1';
    } else {
      item.style.opacity = '0';
      setTimeout(() => {
        item.style.display = 'none';
      }, 300);
    }
  });

  // Show "no results" message if needed
  const visibleItems = Array.from(items).filter(item => item.style.display !== 'none');
  const container = document.querySelector(`[data-search-container="${searchGroup}"]`);
  
  if (container && visibleItems.length === 0 && searchTerm) {
    let noResults = container.querySelector('.no-results');
    if (!noResults) {
      noResults = document.createElement('div');
      noResults.className = 'no-results text-center py-3';
      noResults.innerHTML = '<p>No results found for "' + searchTerm + '"</p>';
      container.appendChild(noResults);
    }
  } else if (container) {
    const noResults = container.querySelector('.no-results');
    if (noResults) {
      noResults.remove();
    }
  }
}

/* ============================================
   SMOOTH SCROLL TO SECTIONS
   ============================================ */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href !== '#') {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
});

/* ============================================
   UTILITY FUNCTIONS
   ============================================ */

// Throttle function for performance
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
}

// Format date
function formatDate(date) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString('en-US', options);
}

// Add event delegation for dynamically created elements
function delegateEvent(eventType, selector, callback) {
  document.addEventListener(eventType, function(e) {
    if (e.target.matches(selector)) {
      callback.call(e.target, e);
    }
  });
}

// Local storage helpers
const Storage = {
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Storage error:', e);
    }
  },
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      console.error('Storage error:', e);
      return null;
    }
  },
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error('Storage error:', e);
    }
  }
};

// Lazy loading for images
function initializeLazyLoading() {
  const images = document.querySelectorAll('img[data-src]');
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.getAttribute('data-src');
        img.removeAttribute('data-src');
        observer.unobserve(img);
      }
    });
  });

  images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeLazyLoading);
} else {
  initializeLazyLoading();
}
