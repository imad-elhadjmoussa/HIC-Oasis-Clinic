export const logoutUser = async (toast) => {
    try {
        // Clear local storage
        localStorage.removeItem("user");

        // Show success message
        toast.add({ severity: "success", summary: "Success", detail: "Logout successful!", life: 3000 });

        // Redirect to login page
        setTimeout(() => {
            // router.push("/login");
            // setRoutesAdded(false) 
            window.location.reload();

        }, 2000);
    } catch (error) {
        toast.add({ severity: "error", summary: "Logout Failed", detail: "Try again", life: 3000 });
    }
};