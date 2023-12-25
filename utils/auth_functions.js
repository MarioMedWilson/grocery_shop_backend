// Function to reset the user's password.
function resetPassword(username) {
  const user = userDatabase[username];
  if (!user) {
    throw new Error("User not found");
  }

  
  // For simplicity, we'll just generate a new random password.
  const newPassword = generateRandomString(10);
  user.password = newPassword;

  console.log(`Password reset successfully for user ${username}. New password: ${newPassword}`);
}


// Function to check if the given email is available for registration.
function isEmailAvailable(email) {
  
  // For simplicity, we'll assume the email is available if not already used.
  for (const user of Object.values(userDatabase)) {
    if (user.email === email) {
      return false;
    }
  }
  return true;
}

// Helper function to generate a random string of a given length.
function generateRandomString(length) {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = '';
  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return result;
}
