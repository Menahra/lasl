export const authRoutes = {
  home: "/",

  register: "/register",
  registerSuccess: "/register/success",
  registerVerify: (id: string, verificationCode: string) =>
    `/register/verify/${id}/${verificationCode}`,

  login: "/login",

  forgotPassword: "/forgot-password",
  forgotPasswordSent: "/forgot-password/sent",

  resetPassword: (id: string, passwordResetCode: string) =>
    `/reset-password/${id}/${passwordResetCode}`,
  resetPasswordSent: "/reset-password/sent",
} as const;
