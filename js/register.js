/**
 * register.js — OTP flow, emoji blocking, password validation
 * for Swad-e-Dil registration page
 */

// ─── Mock OTP (for demo) ─────────────────────────────────────────────────────
const MOCK_OTP = '1234';
let otpVerified = false;
let generatedOtp = null;

// ─── DOM References ───────────────────────────────────────────────────────────
const phoneInput       = document.getElementById('register-phone');
const getOtpBtn        = document.getElementById('get-otp-btn');
const otpGroup         = document.getElementById('otp-group');
const otpInput         = document.getElementById('register-otp');
const verifyOtpBtn     = document.getElementById('verify-otp-btn');
const otpStatus        = document.getElementById('otp-status');

const passwordInput    = document.getElementById('register-password');
const confirmInput     = document.getElementById('register-password-confirm');
const passwordError    = document.getElementById('password-error');
const confirmError     = document.getElementById('confirm-error');

const togglePassword   = document.getElementById('toggle-password');
const toggleConfirm    = document.getElementById('toggle-confirm-password');

const registerForm     = document.getElementById('register-form');

// ─── Emoji Detection ──────────────────────────────────────────────────────────
function containsEmoji(str) {
  const emojiRegex = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FEFF}]/u;
  return emojiRegex.test(str);
}

// ─── Phone Validation ─────────────────────────────────────────────────────────
// Only allow numeric input in phone field
phoneInput.addEventListener('input', () => {
  phoneInput.value = phoneInput.value.replace(/\D/g, '').slice(0, 10);
});

// ─── Get OTP Button ───────────────────────────────────────────────────────────
getOtpBtn.addEventListener('click', () => {
  const phone = phoneInput.value.trim();

  if (phone.length !== 10) {
    phoneInput.style.borderColor = '#dc2626';
    phoneInput.focus();
    showToast('Please enter a valid 10-digit phone number.', 'error');
    return;
  }

  phoneInput.style.borderColor = '';

  // Simulate OTP sent
  generatedOtp = MOCK_OTP;
  otpVerified = false;
  otpStatus.textContent = '';
  otpStatus.className = 'otp-status';
  otpInput.value = '';

  // Show OTP field
  otpGroup.style.display = 'flex';
  otpGroup.style.flexDirection = 'column';

  // Disable phone + Get OTP, update button text
  phoneInput.disabled = true;
  getOtpBtn.disabled = true;
  getOtpBtn.textContent = 'Sent ✓';

  otpInput.focus();
  showToast(`OTP sent to +91 ${phone} (Demo OTP: ${MOCK_OTP})`, 'success');
});

// ─── Verify OTP Button ────────────────────────────────────────────────────────
verifyOtpBtn.addEventListener('click', () => {
  const enteredOtp = otpInput.value.trim();

  if (enteredOtp === generatedOtp) {
    otpVerified = true;
    otpStatus.innerHTML = '<i class="fas fa-check-circle"></i> Verified!';
    otpStatus.className = 'otp-status verified';
    otpInput.disabled = true;
    verifyOtpBtn.disabled = true;
    verifyOtpBtn.textContent = '✓';
  } else {
    otpVerified = false;
    otpStatus.innerHTML = '<i class="fas fa-times-circle"></i> Incorrect OTP. Try again.';
    otpStatus.className = 'otp-status invalid';
    otpInput.style.borderColor = '#dc2626';
    otpInput.focus();
  }
});

// Only allow numeric OTP input
otpInput.addEventListener('input', () => {
  otpInput.value = otpInput.value.replace(/\D/g, '').slice(0, 4);
  otpInput.style.borderColor = '';
});

// ─── Password: block emojis in real-time ─────────────────────────────────────
passwordInput.addEventListener('input', () => {
  if (containsEmoji(passwordInput.value)) {
    // Strip emojis
    passwordInput.value = passwordInput.value.replace(
      /[\u{1F300}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FEFF}]/gu, ''
    );
    passwordError.textContent = 'Emojis are not allowed in passwords.';
  } else {
    passwordError.textContent = '';
  }

  // If confirm is already filled, re-check match
  if (confirmInput.value) {
    validatePasswordMatch();
  }
});

// ─── Confirm Password ─────────────────────────────────────────────────────────
confirmInput.addEventListener('input', validatePasswordMatch);

function validatePasswordMatch() {
  if (confirmInput.value && confirmInput.value !== passwordInput.value) {
    confirmError.textContent = 'Passwords do not match.';
    return false;
  } else {
    confirmError.textContent = '';
    return true;
  }
}

// ─── Show/Hide Password Toggles ───────────────────────────────────────────────
function setupEyeToggle(btn, inputEl) {
  btn.addEventListener('click', () => {
    const isPassword = inputEl.type === 'password';
    inputEl.type = isPassword ? 'text' : 'password';
    btn.querySelector('i').className = isPassword ? 'fas fa-eye-slash' : 'fas fa-eye';
  });
}

setupEyeToggle(togglePassword, passwordInput);
setupEyeToggle(toggleConfirm, confirmInput);

// ─── Form Submission ──────────────────────────────────────────────────────────
registerForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name     = document.getElementById('register-name').value.trim();
  const gender   = document.querySelector('input[name="gender"]:checked');
  const phone    = phoneInput.value.trim();
  const email    = document.getElementById('register-email').value.trim();
  const password = passwordInput.value;
  const confirm  = confirmInput.value;

  // Validations
  if (!name) {
    showToast('Please enter your full name.', 'error'); return;
  }
  if (!gender) {
    showToast('Please select your gender.', 'error'); return;
  }
  if (phone.length !== 10) {
    showToast('Please enter a valid phone number.', 'error'); return;
  }
  if (!otpVerified) {
    showToast('Please verify your phone number via OTP.', 'error'); return;
  }
  if (!email) {
    showToast('Please enter your email address.', 'error'); return;
  }
  if (!password || password.length < 6) {
    showToast('Password must be at least 6 characters.', 'error'); return;
  }
  if (containsEmoji(password)) {
    showToast('Emojis are not allowed in passwords.', 'error'); return;
  }
  if (password !== confirm) {
    confirmError.textContent = 'Passwords do not match.';
    showToast('Passwords do not match.', 'error'); return;
  }

  // Build user object & save to localStorage
  const user = {
    name,
    gender: gender.value,
    phone,
    email,
    password,
    registeredAt: new Date().toISOString()
  };

  localStorage.setItem('swad_user', JSON.stringify(user));
  localStorage.setItem('swad_logged_in', 'true');

  showToast(`Welcome, ${name}! Redirecting...`, 'success');
  setTimeout(() => { window.location.href = 'index.html'; }, 1500);
});

// ─── Toast Helper (fallback if app.js doesn't provide one) ───────────────────
function showToast(msg, type = 'success') {
  // Use global showToast from app.js if available
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.className = `toast-message ${type === 'error' ? 'toast-error' : 'toast-success'}`;
  toast.classList.remove('hidden');
  setTimeout(() => { toast.classList.add('hidden'); }, 3000);
}
