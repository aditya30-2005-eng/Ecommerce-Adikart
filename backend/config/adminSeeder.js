// backend/config/adminSeeder.js
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

const ADMIN_EMAIL = 'admin@adikart.com';
const ADMIN_PASSWORD = 'adminpassword123'; // <-- The guaranteed login password

export const seedAdminUser = async () => {
    try {
        const adminUser = await User.findOne({ email: ADMIN_EMAIL });

        if (!adminUser) {
            // Case 1: User does not exist, create the user
            await User.create({
                name: 'Admin',
                email: ADMIN_EMAIL,
                password: ADMIN_PASSWORD, // Model hook will hash this
                role: 'admin',
            });
            console.log(`\n✅ Dev Admin User CREATED: ${ADMIN_EMAIL}\n   Password: ${ADMIN_PASSWORD}\n`);
            
        } else {
            // Case 2: User exists, CRITICALLY reset password for guaranteed login
            const isMatch = await bcrypt.compare(ADMIN_PASSWORD, adminUser.password);

            if (!isMatch || adminUser.role !== 'admin') {
                 // Save the password again, which triggers the pre('save') hook to rehash it.
                 adminUser.password = ADMIN_PASSWORD;
                 adminUser.role = 'admin';
                 await adminUser.save(); 
                 
                 console.log(`\n🔄 Existing Admin User Password RESET: ${ADMIN_EMAIL}\n   New Password: ${ADMIN_PASSWORD}\n`);
            } else {
                 console.log(`Admin user ${ADMIN_EMAIL} already exists and password is correct.`);
            }
        }
    } catch (error) {
        console.error("Admin Seeding/Reset Failed:", error);
    }
};