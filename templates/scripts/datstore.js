// userStorage.js - Utility functions for user data management

class UserStorage {
    constructor() {
        this.users = this.loadUsers();
        this.currentId = this.getNextId();
    }

    // Load users from localStorage or initialize empty array
    loadUsers() {
        const storedUsers = localStorage.getItem('osamca_users');
        if (storedUsers) {
            return JSON.parse(storedUsers);
        }
        return [];
    }

    // Save users to localStorage
    saveUsers() {
        localStorage.setItem('osamca_users', JSON.stringify(this.users));
    }

    // Get next available user ID
    getNextId() {
        if (this.users.length === 0) return 1;
        return Math.max(...this.users.map(user => user.id)) + 1;
    }

    // Generate username from last name and phone number
    generateUsername(lastName, phoneNumber) {
        return lastName.toLowerCase() + phoneNumber;
    }

    // Hash password (in a real app, use proper hashing like bcrypt)
    hashPassword(password) {
        // This is a simple hash for demonstration
        // In production, use: bcrypt.hashSync(password, 10)
        return btoa(password + 'osamca_salt');
    }

    // Verify password
    verifyPassword(password, hash) {
        // In production, use: bcrypt.compareSync(password, hash)
        return hash === btoa(password + 'osamca_salt');
    }

    // Generate 6-digit verification code
    generateVerificationCode() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    // Create new user during sign-up
    createUser(userData) {
        const newUser = {
            id: this.currentId++,
            personal_info: {
                last_name: userData.lastName,
                middle_name: userData.middleName,
                first_name: userData.firstName,
                country: userData.country,
                phone_number: userData.phoneNumber
            },
            account_info: {
                username: this.generateUsername(userData.lastName, userData.phoneNumber),
                password_hash: this.hashPassword(userData.password),
                account_status: "active",
                registration_date: new Date().toISOString(),
                last_login: null
            },
            verification: {
                phone_verified: false,
                verification_code: this.generateVerificationCode(),
                verification_attempts: 0,
                verified_at: null
            },
            bio_data: null,
            application_status: {
                status: "not_submitted",
                submitted_date: null,
                last_updated: new Date().toISOString(),
                assigned_officer: null,
                review_notes: []
            }
        };

        this.users.push(newUser);
        this.saveUsers();
        return newUser;
    }

    // Find user by username
    findUserByUsername(username) {
        return this.users.find(user => user.account_info.username === username);
    }

    // Find user by phone number
    findUserByPhone(phoneNumber) {
        return this.users.find(user => user.personal_info.phone_number === phoneNumber);
    }

    // Verify phone number with code
    verifyPhone(username, code) {
        const user = this.findUserByUsername(username);
        if (user && user.verification.verification_code === code) {
            user.verification.phone_verified = true;
            user.verification.verified_at = new Date().toISOString();
            this.saveUsers();
            return true;
        }
        
        if (user) {
            user.verification.verification_attempts++;
            this.saveUsers();
        }
        return false;
    }

    // Update user bio data
    updateBioData(username, bioData) {
        const user = this.findUserByUsername(username);
        if (user) {
            user.bio_data = {
                personal_info: {
                    last_name: bioData.lastName,
                    middle_name: bioData.middleName,
                    first_name: bioData.firstName,
                    phone_number: bioData.phoneNumber
                },
                address_info: {
                    business_address: bioData.businessAddress,
                    home_address: bioData.homeAddress
                },
                business_info: {
                    enterprise_type: bioData.enterpriseType,
                    business_name: bioData.businessName || ""
                },
                loan_info: {
                    loan_amount: parseFloat(bioData.loanAmount),
                    loan_purpose: bioData.loanPurpose,
                    loan_duration: parseInt(bioData.loanDuration),
                    monthly_repayment: parseFloat(bioData.monthlyRepayment),
                    currency: "NGN"
                },
                guarantors: [
                    {
                        full_name: bioData.guarantor1Name,
                        staff_id: bioData.guarantor1Id,
                        phone_number: bioData.guarantor1Phone,
                        office_address: bioData.guarantor1Address
                    },
                    {
                        full_name: bioData.guarantor2Name,
                        staff_id: bioData.guarantor2Id,
                        phone_number: bioData.guarantor2Phone,
                        office_address: bioData.guarantor2Address
                    }
                ],
                additional_info: {
                    comments: bioData.comments || "",
                    submission_date: new Date().toISOString()
                },
                facial_photo: {
                    photo_data: bioData.facialPhotoData,
                    capture_date: new Date().toISOString(),
                    photo_verified: false
                }
            };

            user.application_status = {
                status: "pending",
                submitted_date: new Date().toISOString(),
                last_updated: new Date().toISOString(),
                assigned_officer: null,
                review_notes: []
            };

            this.saveUsers();
            return true;
        }
        return false;
    }

    // Update last login time
    updateLastLogin(username) {
        const user = this.findUserByUsername(username);
        if (user) {
            user.account_info.last_login = new Date().toISOString();
            this.saveUsers();
        }
    }

    // Get user statistics
    getUserStats() {
        const totalUsers = this.users.length;
        const activeUsers = this.users.filter(user => 
            user.account_info.account_status === "active"
        ).length;
        const pendingApplications = this.users.filter(user => 
            user.application_status.status === "pending"
        ).length;
        const approvedApplications = this.users.filter(user => 
            user.application_status.status === "approved"
        ).length;
        const rejectedApplications = this.users.filter(user => 
            user.application_status.status === "rejected"
        ).length;

        return {
            total_users: totalUsers,
            active_users: activeUsers,
            pending_applications: pendingApplications,
            approved_applications: approvedApplications,
            rejected_applications: rejectedApplications,
            last_updated: new Date().toISOString()
        };
    }

    // Export all users data as JSON
    exportUsersData() {
        return {
            users: this.users,
            metadata: this.getUserStats()
        };
    }

    // Import users data from JSON
    importUsersData(data) {
        if (data && data.users) {
            this.users = data.users;
            this.currentId = this.getNextId();
            this.saveUsers();
            return true;
        }
        return false;
    }
}

// Initialize user storage
const userStorage = new UserStorage();

// Example usage in sign-up process:
/*
// Sign up new user
const newUser = userStorage.createUser({
    lastName: "Adeyemi",
    middleName: "Oluwaseun",
    firstName: "Tunde",
    country: "Nigeria",
    phoneNumber: "08012345678",
    password: "SecurePass123!"
});

// Verify phone
const verified = userStorage.verifyPhone("adeyemi08012345678", "123456");

// Update bio data after login
userStorage.updateBioData("adeyemi08012345678", {
    lastName: "Adeyemi",
    middleName: "Oluwaseun",
    firstName: "Tunde",
    phoneNumber: "08012345678",
    businessAddress: "123 Market Street, Abeokuta",
    homeAddress: "45 Residential Area, Ogun State",
    enterpriseType: "agriculture",
    businessName: "Adeyemi Farms Ltd",
    loanAmount: "500000",
    loanPurpose: "equipment",
    loanDuration: "12",
    monthlyRepayment: "45000",
    guarantor1Name: "John Okoro",
    guarantor1Id: "OSAMCA001",
    guarantor1Phone: "08098765432",
    guarantor1Address: "OSAMCA Head Office, Abeokuta",
    guarantor2Name: "Mary Johnson",
    guarantor2Id: "OSAMCA002",
    guarantor2Phone: "08055556666",
    guarantor2Address: "OSAMCA Branch Office, Ijebu-Ode",
    comments: "Looking to purchase new farming equipment",
    facialPhotoData: "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
});
*/