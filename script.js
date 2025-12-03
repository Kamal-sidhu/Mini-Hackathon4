// Job Application Form Validation Script
// Provides full client-side validation, inline error handling,
// live feedback, accessibility support, and global success/error
// messaging for a job application form.

document.addEventListener("DOMContentLoaded", () => {

  // --- Form + feedback elements ---
  const form = document.getElementById("jobApplicationForm");
  const feedback = document.getElementById("formFeedback");

  // Improve accessibility by informing screen readers of updates
  if (feedback) {
    feedback.setAttribute("role", "status");
    feedback.setAttribute("aria-live", "polite");
  }

  // --- Form fields ---
  const fullName = document.getElementById("fullName");
  const email = document.getElementById("email");
  const phone = document.getElementById("phone");
  const position = document.getElementById("position");
  const skills = Array.from(document.querySelectorAll('input[name="skills"]'));
  const coverLetter = document.getElementById("coverLetter");

  // --- Error message containers ---
  const nameError = document.getElementById("nameError");
  const emailError = document.getElementById("emailError");
  const phoneError = document.getElementById("phoneError");
  const positionError = document.getElementById("positionError");
  const skillsError = document.getElementById("skillsError");
  const coverError = document.getElementById("coverError");


  // VALIDATION RULES
  // Each validator returns an empty string if valid,
  // otherwise returns the error message.
  

  const validators = {
    fullName(value) {
      const trimmed = value.trim();
      if (!trimmed) return "Please enter your full name.";
      if (trimmed.length < 2) return "Name must be at least 2 characters.";
      return "";
    },

    email(value) {
      const trimmed = value.trim();
      if (!trimmed) return "Please enter your email address.";
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      if (!re.test(trimmed)) return "Please enter a valid email address.";
      return "";
    },

    phone(value) {
      const trimmed = value.trim();
      if (!trimmed) return "Please enter your phone number.";
      const re = /^(?:\(\d{3}\)\s?|\d{3}[-.\s]?)\d{3}[-.\s]?\d{4}$/;
      if (!re.test(trimmed)) return "Please enter a valid phone number (e.g. 123-456-7890).";
      return "";
    },

    position(value) {
      if (!value) return "Please select a position.";
      return "";
    },

    skills(checkedCount) {
      if (checkedCount === 0) return "Please select at least one skill.";
      return "";
    },

    coverLetter(value) {
      const trimmed = value.trim();
      if (!trimmed) return "Please write a short cover letter.";
      if (trimmed.length < 30) return "Cover letter must be at least 30 characters.";
      return "";
    }
  };

  // ERROR DISPLAY HELPERS

  // Show or hide error for normal input fields
  function showError(control, errorElement, message) {
    if (!control || !errorElement) return;
    if (message) {
      errorElement.textContent = message;
      control.classList.add("error");
      errorElement.style.display = "block";
    } else {
      errorElement.textContent = "";
      control.classList.remove("error");
      errorElement.style.display = "none";
    }
  }

  // Specialized display for checkbox group (skills)
  function showErrorForCheckboxGroup(errorElement, message) {
    if (!errorElement) return;
    if (message) {
      errorElement.textContent = message;
      errorElement.style.display = "block";
    } else {
      errorElement.textContent = "";
      errorElement.style.display = "none";
    }
  }

  // FORM VALIDATION (RUNS ON SUBMIT)
  // Returns:
  //   valid: boolean
  //   firstInvalid: first element to focus


  function validateForm() {
    let valid = true;
    let firstInvalid = null;

    // Full Name
    const nameMsg = validators.fullName(fullName.value);
    if (nameMsg) {
      valid = false;
      firstInvalid = firstInvalid || fullName;
    }
    showError(fullName, nameError, nameMsg);

    // Email
    const emailMsg = validators.email(email.value);
    if (emailMsg) {
      valid = false;
      firstInvalid = firstInvalid || email;
    }
    showError(email, emailError, emailMsg);

    // Phone
    const phoneMsg = validators.phone(phone.value);
    if (phoneMsg) {
      valid = false;
      firstInvalid = firstInvalid || phone;
    }
    showError(phone, phoneError, phoneMsg);

    // Position dropdown
    const positionMsg = validators.position(position.value);
    if (positionMsg) {
      valid = false;
      firstInvalid = firstInvalid || position;
    }
    showError(position, positionError, positionMsg);

    // Skills (checkboxes)
    const checkedSkills = skills.filter(s => s.checked).length;
    const skillsMsg = validators.skills(checkedSkills);
    if (skillsMsg) valid = false;
    showErrorForCheckboxGroup(skillsError, skillsMsg);
    if (skillsMsg && !firstInvalid) {
      firstInvalid = skills[0];
    }

    // Cover Letter
    const coverMsg = validators.coverLetter(coverLetter.value);
    if (coverMsg) {
      valid = false;
      firstInvalid = firstInvalid || coverLetter;
    }
    showError(coverLetter, coverError, coverMsg);

    return { valid, firstInvalid };
  }

  // FEEDBACK MESSAGE HANDLERS
  

  function clearFeedback() {
    if (!feedback) return;
    feedback.textContent = "";
    feedback.classList.remove("success", "error");
  }

  function showFeedback(message, type = "error") {
    if (!feedback) return;
    feedback.textContent = message;
    feedback.classList.remove("success", "error");
    feedback.classList.add(type);
  }

  // FORM SUBMISSION HANDLER
 
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    clearFeedback();

    const { valid, firstInvalid } = validateForm();

    // If invalid: show feedback and focus first incorrect field
    if (!valid) {
      showFeedback("Please fix the errors below and resubmit the form.", "error");
      if (firstInvalid && typeof firstInvalid.focus === "function") {
        firstInvalid.focus();
      }
      return;
    }

    // Simulate successful submission
    showFeedback("Application submitted successfully — thank you!", "success");

    // Reset form & clear all inline errors
    form.reset();
    [fullName, email, phone, position, coverLetter].forEach(ctrl => ctrl.classList.remove("error"));
    [nameError, emailError, phoneError, positionError, skillsError, coverError].forEach(el => {
      el.textContent = "";
      el.style.display = "none";
    });

    // Focus feedback for accessibility
    feedback?.focus?.();
  });

  // RESET HANDLER
  // Clears errors after the form resets
 
 form.addEventListener("reset", () => {
    window.setTimeout(() => {
      clearFeedback();
      [fullName, email, phone, position, coverLetter].forEach(ctrl => ctrl.classList.remove("error"));
      [nameError, emailError, phoneError, positionError, skillsError, coverError].forEach(el => {
        el.textContent = "";
        el.style.display = "none";
      });
    }, 0);
  });

 
  // REAL-TIME VALIDATION EVENTS

  fullName.addEventListener("blur", () => {
    showError(fullName, nameError, validators.fullName(fullName.value));
  });

  email.addEventListener("blur", () => {
    showError(email, emailError, validators.email(email.value));
  });

  phone.addEventListener("blur", () => {
    showError(phone, phoneError, validators.phone(phone.value));
  });

  position.addEventListener("change", () => {
    showError(position, positionError, validators.position(position.value));
  });

  coverLetter.addEventListener("blur", () => {
    showError(coverLetter, coverError, validators.coverLetter(coverLetter.value));
  });

  // Validate skill checkboxes on each change
  skills.forEach(cb =>
    cb.addEventListener("change", () => {
      const checked = skills.filter(s => s.checked).length;
      showErrorForCheckboxGroup(skillsError, validators.skills(checked));
    })
  );

}); 
