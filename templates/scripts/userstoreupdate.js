// Update the sign-up form submission to use the storage system
step4Submit.addEventListener('click', () => {
    if (validateStep4()) {
        // Collect user data from the sign-up form
        const userData = {
            lastName: document.getElementById('lastName').value,
            middleName: document.getElementById('middleName').value,
            firstName: document.getElementById('firstName').value,
            country: document.getElementById('country').value,
            phoneNumber: document.getElementById('phoneNumber').value,
            password: document.getElementById('password').value
        };

        // Create user in storage
        const newUser = userStorage.createUser(userData);
        
        // In a real app, you would send the verification code via SMS
        console.log(`Verification code for ${newUser.account_info.username}: ${newUser.verification.verification_code}`);
        
        alert(`Account created successfully! Verification code: ${newUser.verification.verification_code}`);
        signUpModal.style.display = 'none';
        resetForm();
    }
});

// Update sign-in to use the storage system
signInSubmit.addEventListener('click', () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (!username || !password) {
        alert('Please enter both username and password');
        return;
    }
    
    const user = userStorage.findUserByUsername(username);
    
    if (user && userStorage.verifyPassword(password, user.account_info.password_hash)) {
        if (user.verification.phone_verified) {
            // Successful login
            userStorage.updateLastLogin(username);
            signInModal.style.display = 'none';
            autoFillBioDataForm(user);
            bioDataModal.style.display = 'block';
        } else {
            alert('Please verify your phone number before logging in.');
        }
    } else {
        alert('Invalid username or password. Please try again.');
    }
});