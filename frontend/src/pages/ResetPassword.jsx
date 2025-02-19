import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

/**
 * ResetPassword component allows users to reset their password by entering a new one.
 * It verifies the new password and confirmation match, validates the password length,
 * and then sends a POST request to reset the password.
 *
 * @component
 * @example
 * return (
 *   <ResetPassword />
 * )
 * @returns {JSX.Element} The rendered ResetPassword component.
 */
export default function ResetPassword() {
  /**
   * Token extracted from the URL, used to identify the user for password reset.
   * @type {string}
   */
  const { token } = useParams();

  const navigate = useNavigate();

  /**
   * Holds the new password entered by the user.
   * @type {string}
   */
  const [newPassword, setNewPassword] = useState("");

  /**
   * Holds the confirmed password entered by the user.
   * @type {string}
   */
  const [confirmPassword, setConfirmPassword] = useState("");

  /**
   * Indicates whether the form is being submitted.
   * @type {boolean}
   */
  const [loading, setLoading] = useState(false);

  /**
   * Holds any error message to be displayed to the user.
   * @type {string}
   */
  const [error, setError] = useState("");

  /**
   * Indicates whether the password reset was successful.
   * @type {boolean}
   */
  const [success, setSuccess] = useState(false);

  /**
   * Toggles the visibility of the new password field.
   * @type {boolean}
   */
  const [showNewPassword, setShowNewPassword] = useState(false);

  /**
   * Toggles the visibility of the confirm password field.
   * @type {boolean}
   */
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

 

  /**
   * Handles the form submission for resetting the password.
   * It checks if the new password and confirmation match, and sends a POST request to the server.
   *
   * @param {Object} e - The event object from the form submission.
   * @param {EventTarget} e.target - The form element that triggered the event.
   * @async
   * @returns {void}
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    // Validate password length (must be at least 8 characters long)
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);
    try {
      // Sending POST request to reset the password
      const response = await fetch(
        `http://localhost:3000/api/reset-password/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ newPassword }),
        }
      );

      const data = await response.json();

   

      if (!response.ok) {
        setError(
          data.error || "An unexpected error occurred. Please try again."
        );

        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);
    } catch (err) {
      setError("An error has occurred. Please try again.");
      setLoading(false);
    }
  };

  // If the password was reset successfully, show the success message
  if (success) {
    return (
      <div className="flex flex-col items-center justify-center max-screen p-10">
        <div className="bg-white bg-opacity-90 dark:bg-gray-800 p-8 mt-20 rounded-lg shadow-xl w-full max-w-md sm:max-w-lg transition-transform transform hover:scale-105">
          <h2 className="text-3xl font-semibold text-center mb-6 text-backgroundChatDark dark:text-textColorDark">
            Password reset successfully!
          </h2>
          <p className="text-gray-800 dark:text-gray-200 text-center mb-6">
            You can now log in with your new password.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="w-full py-3 bg-button text-white font-semibold rounded-lg hover:bg-blueCustom transition duration-300 ease-in-out">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // If not successful, render the reset password form
  return (
    <div className="flex flex-col items-center justify-center max-h-screen p-10">
      <div className="bg-white bg-opacity-90 dark:bg-gray-800 p-8 mt-20 rounded-lg shadow-xl w-full max-w-md sm:max-w-lg transition-transform transform hover:scale-105">
        <h2 className="text-3xl font-semibold text-center mb-6 text-backgroundChatDark dark:text-textColorDark">
          Reset Password
        </h2>

        {error && (
          <p className="flex items-center justify-center space-x-2 text-center text-error bg-red-100 p-4 rounded-lg shadow-md ring-2 ring-red-300 font-medium text-lg dark:bg-errorDark dark:text-red-100 mb-4">
            <FontAwesomeIcon
              icon={faInfoCircle}
              className="text-xl text-error dark:text-red-100"
            />
            <span>{error}</span>
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="newPassword"
              className="block text-lg font-medium text-title dark:text-gray-200">
              New Password
            </label>
            <input
              id="newPassword"
              type={showNewPassword ? "text" : "password"}
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg mt-2 p-3 focus:outline-none focus:ring-2 focus:ring-blueCustom dark:bg-gray-700 dark:text-gray-200"
              required
            />
            <button
              type="button"
              onClick={() => setShowNewPassword((prev) => !prev)}
              className="absolute right-12  text-gray-600">
              {showNewPassword ? (
                <FontAwesomeIcon
                  icon="fa-solid fa-eye-slash"
                  className="mt-6"
                />
              ) : (
                <FontAwesomeIcon icon="fa-solid fa-eye" className="mt-6" />
              )}
            </button>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-lg font-medium text-title dark:text-gray-200">
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              type={showConfirmNewPassword ? "text" : "password"}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg mt-2 p-3 focus:outline-none focus:ring-2 focus:ring-blueCustom dark:bg-gray-700 dark:text-gray-200"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmNewPassword((prev) => !prev)}
              className="absolute right-12  text-gray-600">
              {showConfirmNewPassword ? (
                <FontAwesomeIcon
                  icon="fa-solid fa-eye-slash"
                  className="mt-6"
                />
              ) : (
                <FontAwesomeIcon icon="fa-solid fa-eye" className="mt-6" />
              )}
            </button>
          </div>

          <button
            type="submit"
            className={`w-full py-3 mt-3 text-white font-semibold rounded-lg transition duration-300 ease-in-out ${
              loading ? "bg-gray-400" : "bg-button "
            }`}
            disabled={loading}>
            {loading ? "Loading..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}