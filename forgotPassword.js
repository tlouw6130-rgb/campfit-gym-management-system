import {resetPassword} from "./authorisation.js";

export async function forgotPassword(email, newPassword) {
    try {
        await resetPassword(email, newPassword);
    } catch (error) {
        console.error("Error occurred while resetting password:", error);
    }
}

forgotPassword("tlouw6130@gmail.com", "newpassword123");