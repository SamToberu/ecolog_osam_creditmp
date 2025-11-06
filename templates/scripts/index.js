
      // DOM Elements
      const signUpBtn = document.getElementById("signUpBtn");
      const signInBtn = document.getElementById("signInBtn");
      const closeModal = document.getElementById("closeModal");
      const signUpModal = document.getElementById("signUpModal");

      // Step navigation elements
      const step1Next = document.getElementById("step1Next");
      const step2Back = document.getElementById("step2Back");
      const step2Next = document.getElementById("step2Next");
      const step3Back = document.getElementById("step3Back");
      const step3Next = document.getElementById("step3Next");
      const step4Back = document.getElementById("step4Back");
      const step4Submit = document.getElementById("step4Submit");

      // Form steps
      const step1Form = document.getElementById("step1Form");
      const step2Form = document.getElementById("step2Form");
      const step3Form = document.getElementById("step3Form");
      const step4Form = document.getElementById("step4Form");

      // Progress elements
      const signupProgress = document.getElementById("signupProgress");
      const step1 = document.getElementById("step1");
      const step2 = document.getElementById("step2");
      const step3 = document.getElementById("step3");
      const step4 = document.getElementById("step4");

      // Verification code elements
      const codeInputs = document.querySelectorAll(".code-input");
      const resendCode = document.getElementById("resendCode");
      const countdown = document.getElementById("countdown");

      // Password elements
      const passwordInput = document.getElementById("password");
      const confirmPasswordInput = document.getElementById("confirmPassword");
      const passwordStrength = document.getElementById("passwordStrength");
      const passwordMatch = document.getElementById("passwordMatch");

      // Current step
      let currentStep = 1;

      // Generated verification code
      let verificationCode = "";

      // Event Listeners
      signUpBtn.addEventListener("click", () => {
        signUpModal.style.display = "block";
      });

      signInBtn.addEventListener("click", () => {
        alert("Sign In functionality would be implemented here");
      });

      closeModal.addEventListener("click", () => {
        signUpModal.style.display = "none";
        resetForm();
      });

      window.addEventListener("click", (e) => {
        if (e.target === signUpModal) {
          signUpModal.style.display = "none";
          resetForm();
        }
      });

      // Step Navigation
      step1Next.addEventListener("click", () => {
        if (validateStep1()) {
          goToStep(2);
        }
      });

      step2Back.addEventListener("click", () => {
        goToStep(1);
      });

      step2Next.addEventListener("click", () => {
        if (validateStep2()) {
          sendVerificationCode();
          goToStep(3);
          startCountdown();
        }
      });

      step3Back.addEventListener("click", () => {
        goToStep(2);
      });

      step3Next.addEventListener("click", () => {
        if (validateVerificationCode()) {
          goToStep(4);
        } else {
          alert("Invalid verification code. Please try again.");
        }
      });

      step4Back.addEventListener("click", () => {
        goToStep(3);
      });

      step4Submit.addEventListener("click", () => {
        if (validateStep4()) {
          // In a real application, you would submit the form data to a server
          alert("Account created successfully!");
          signUpModal.style.display = "none";
          resetForm();
        }
      });

      // Verification code input handling
      codeInputs.forEach((input, index) => {
        input.addEventListener("input", (e) => {
          // Move to next input if current input has a value
          if (e.target.value && index < codeInputs.length - 1) {
            codeInputs[index + 1].focus();
          }

          // Auto-submit if all inputs are filled
          if (index === codeInputs.length - 1 && e.target.value) {
            const allFilled = Array.from(codeInputs).every(
              (input) => input.value
            );
            if (allFilled) {
              step3Next.click();
            }
          }
        });

        input.addEventListener("keydown", (e) => {
          // Move to previous input on backspace if current input is empty
          if (e.key === "Backspace" && !e.target.value && index > 0) {
            codeInputs[index - 1].focus();
          }
        });
      });

      // Password strength checker
      passwordInput.addEventListener("input", checkPasswordStrength);
      confirmPasswordInput.addEventListener("input", checkPasswordMatch);

      // Resend code functionality
      resendCode.addEventListener("click", () => {
        if (!resendCode.classList.contains("disabled")) {
          sendVerificationCode();
          startCountdown();
        }
      });

      // Functions
      function goToStep(step) {
        // Hide all steps
        step1Form.classList.remove("active");
        step2Form.classList.remove("active");
        step3Form.classList.remove("active");
        step4Form.classList.remove("active");

        // Remove active class from all steps
        step1.classList.remove("active", "completed");
        step2.classList.remove("active", "completed");
        step3.classList.remove("active", "completed");
        step4.classList.remove("active", "completed");

        // Show current step
        if (step === 1) {
          step1Form.classList.add("active");
          step1.classList.add("active");
        } else if (step === 2) {
          step2Form.classList.add("active");
          step2.classList.add("active");
          step1.classList.add("completed");
        } else if (step === 3) {
          step3Form.classList.add("active");
          step3.classList.add("active");
          step1.classList.add("completed");
          step2.classList.add("completed");
        } else if (step === 4) {
          step4Form.classList.add("active");
          step4.classList.add("active");
          step1.classList.add("completed");
          step2.classList.add("completed");
          step3.classList.add("completed");
        }

        // Update progress bar
        signupProgress.style.width = `${(step - 1) * 33.33}%`;

        currentStep = step;
      }

      function validateStep1() {
        const lastName = document.getElementById("lastName").value;
        const firstName = document.getElementById("firstName").value;
        const country = document.getElementById("country").value;

        if (!lastName || !firstName || !country) {
          alert("Please fill in all required fields");
          return false;
        }

        return true;
      }

      function validateStep2() {
        const phoneNumber = document.getElementById("phoneNumber").value;

        if (!phoneNumber) {
          alert("Please enter your phone number");
          return false;
        }

        // Basic phone validation (could be more sophisticated)
        if (phoneNumber.length < 10) {
          alert("Please enter a valid phone number");
          return false;
        }

        return true;
      }

      function validateStep4() {
        const password = document.getElementById("password").value;
        const confirmPassword =
          document.getElementById("confirmPassword").value;

        if (!password || !confirmPassword) {
          alert("Please fill in both password fields");
          return false;
        }

        if (password !== confirmPassword) {
          alert("Passwords do not match");
          return false;
        }

        // Check password strength
        const strength = checkPasswordStrength();
        if (strength < 3) {
          alert("Please choose a stronger password");
          return false;
        }

        return true;
      }

      function sendVerificationCode() {
        // In a real application, this would send an actual SMS
        verificationCode = Math.floor(
          100000 + Math.random() * 900000
        ).toString();
        alert(`Verification code sent: ${verificationCode}`);
        console.log(`Verification code: ${verificationCode}`); // For testing
      }

      function validateVerificationCode() {
        const enteredCode = Array.from(codeInputs)
          .map((input) => input.value)
          .join("");

        return enteredCode === verificationCode;
      }

      function startCountdown() {
        let timeLeft = 60;
        resendCode.classList.add("disabled");
        resendCode.style.pointerEvents = "none";
        resendCode.style.color = "#999";

        const countdownInterval = setInterval(() => {
          countdown.textContent = timeLeft;
          timeLeft--;

          if (timeLeft < 0) {
            clearInterval(countdownInterval);
            resendCode.classList.remove("disabled");
            resendCode.style.pointerEvents = "auto";
            resendCode.style.color = "#2989d8";
            resendCode.innerHTML =
              "Didn't receive the code? <span>Resend</span>";
          }
        }, 1000);
      }

      function checkPasswordStrength() {
        const password = passwordInput.value;
        let strength = 0;

        // Check length
        if (password.length >= 8) {
          strength++;
          document.getElementById("reqLength").classList.add("met");
        } else {
          document.getElementById("reqLength").classList.remove("met");
        }

        // Check uppercase
        if (/[A-Z]/.test(password)) {
          strength++;
          document.getElementById("reqUppercase").classList.add("met");
        } else {
          document.getElementById("reqUppercase").classList.remove("met");
        }

        // Check lowercase
        if (/[a-z]/.test(password)) {
          strength++;
          document.getElementById("reqLowercase").classList.add("met");
        } else {
          document.getElementById("reqLowercase").classList.remove("met");
        }

        // Check numbers
        if (/[0-9]/.test(password)) {
          strength++;
          document.getElementById("reqNumber").classList.add("met");
        } else {
          document.getElementById("reqNumber").classList.remove("met");
        }

        // Check special characters
        if (/[^A-Za-z0-9]/.test(password)) {
          strength++;
          document.getElementById("reqSpecial").classList.add("met");
        } else {
          document.getElementById("reqSpecial").classList.remove("met");
        }

        // Update strength bar
        const strengthPercent = (strength / 5) * 100;
        passwordStrength.style.width = `${strengthPercent}%`;

        // Update color based on strength
        if (strength <= 2) {
          passwordStrength.style.background = "#dc3545"; // Red
        } else if (strength <= 4) {
          passwordStrength.style.background = "#ffc107"; // Yellow
        } else {
          passwordStrength.style.background = "#28a745"; // Green
        }

        return strength;
      }

      function checkPasswordMatch() {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if (confirmPassword === "") {
          passwordMatch.textContent = "";
          passwordMatch.style.color = "";
        } else if (password === confirmPassword) {
          passwordMatch.textContent = "Passwords match";
          passwordMatch.style.color = "#28a745";
        } else {
          passwordMatch.textContent = "Passwords do not match";
          passwordMatch.style.color = "#dc3545";
        }
      }

      function resetForm() {
        // Reset form fields
        document.getElementById("lastName").value = "";
        document.getElementById("middleName").value = "";
        document.getElementById("firstName").value = "";
        document.getElementById("country").value = "";
        document.getElementById("phoneNumber").value = "";
        document.getElementById("password").value = "";
        document.getElementById("confirmPassword").value = "";

        // Reset verification code inputs
        codeInputs.forEach((input) => (input.value = ""));

        // Reset progress
        goToStep(1);

        // Reset password strength indicators
        document.querySelectorAll(".requirement").forEach((req) => {
          req.classList.remove("met");
        });
        passwordStrength.style.width = "0%";
        passwordMatch.textContent = "";
      }

      // Initialize the form
      resetForm();
