import { zodResolver } from "@hookform/resolvers/zod";
import { Trans } from "@lingui/react/macro";
import { useLingui } from "@lingui/react/macro";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { USER_ERRORS } from "@lasl/app-contracts/errors/user";
import { useState } from "react";
import { Button } from "@/src/shared/components/button/Button.tsx";
import { FormInputField } from "@/src/shared/components/form-input-field/FormInputField.tsx";
import { Modal } from "@/src/shared/components/modal/Modal.tsx";
import { SettingsCard } from "@/src/shared/components/settings-card/SettingsCard.tsx";
import { isAxiosError } from "axios";
import { useDeleteAccount } from "@/src/shared/hooks/api/useDeleteAccount.ts";
import { useUpdatePassword } from "@/src/shared/hooks/api/useUpdatePassword.ts";
import { useUpdateUser } from "@/src/shared/hooks/api/useUpdateUser.ts";
import { useAuthenticationContext } from "@/src/shared/hooks/useAuthenticationContext.tsx";
import { useI18nContext } from "@/src/shared/hooks/useI18nContext.tsx";
import {
  deleteUserSchema,
  updatePasswordSchema,
  type DeleteUserInput,
  type UpdatePasswordInput,
} from "@lasl/app-contracts/schemas/user";
import { useNavigate } from "@tanstack/react-router";
import { ROUTE_LOGIN } from "@/src/app/routes/_auth/login.tsx";
import { authApi } from "@/src/api/authApi.ts";
import "./ProfileSettingsPage.css";

const profileDetailsSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: USER_ERRORS.firstNameRequired })
    .max(50, { message: "errors.user.firstName.maxLength" }),
  lastName: z
    .string()
    .min(2, { message: USER_ERRORS.lastNameRequired })
    .max(50, { message: "errors.user.lastName.maxLength" }),
});

type ProfileDetailsInput = z.infer<typeof profileDetailsSchema>;

export const ProfileSettingsPage = () => {
  const { user } = useAuthenticationContext();
  const { isLoading } = useI18nContext();
  const { t } = useLingui();
  const { mutateAsync: updateUser, isPending: isUpdatingUser } =
    useUpdateUser();
  const { mutateAsync: updatePassword, isPending: isUpdatingPassword } =
    useUpdatePassword();
  const { mutateAsync: deleteAccount, isPending: isDeletingAccount } =
    useDeleteAccount();
  const navigate = useNavigate();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const profileForm = useForm<ProfileDetailsInput>({
    resolver: zodResolver(profileDetailsSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
    },
  });

  const onProfileSubmit = async (data: ProfileDetailsInput) => {
    if (!user) return;
    try {
      await updateUser({ id: user.id, data });
      // Show success indication if requested by design, otherwise rely on react-query invalidation
    } catch (error) {
      console.error("Failed to update profile", error);
    }
  };

  const passwordForm = useForm<UpdatePasswordInput>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      currentPassword: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  const onPasswordSubmit = async (data: UpdatePasswordInput) => {
    try {
      await updatePassword(data);
      passwordForm.reset();
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 403) {
        passwordForm.setError("currentPassword", {
          type: "manual",
          message: USER_ERRORS.passwordIncorrect,
        });
      } else {
        console.error("Failed to update password", error);
      }
    }
  };

  const deleteAccountForm = useForm<DeleteUserInput>({
    resolver: zodResolver(deleteUserSchema),
    defaultValues: {
      password: "",
    },
  });

  const onDeleteAccountSubmit = async (data: DeleteUserInput) => {
    try {
      await deleteAccount(data);
      await authApi.logout();
      navigate({ to: ROUTE_LOGIN });
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 403) {
        deleteAccountForm.setError("password", {
          type: "manual",
          message: USER_ERRORS.passwordIncorrect,
        });
      } else {
        console.error("Failed to delete account", error);
      }
    }
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    deleteAccountForm.reset();
  };

  return (
    <div className="ProfileSettingsPage">
      <h1 className="ProfileSettingsPageTitle">
        <Trans>Profile Settings</Trans>
      </h1>
      <div className="ProfileSettingsPageContent">
        <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
          <SettingsCard
            title={t`Profile details`}
            footer={
              <Button type="submit" loading={isUpdatingUser}>
                <Trans>Save Changes</Trans>
              </Button>
            }
          >
            <FormInputField
              id="firstName"
              type="text"
              label={t`First Name`}
              loading={isLoading}
              placeholder={t`First Name`}
              error={
                profileForm.formState.errors.firstName?.message
                  ? t({
                      id: profileForm.formState.errors.firstName.message,
                    })
                  : undefined
              }
              {...profileForm.register("firstName")}
            />
            <FormInputField
              id="lastName"
              type="text"
              label={t`Last Name`}
              loading={isLoading}
              placeholder={t`Last Name`}
              error={
                profileForm.formState.errors.lastName?.message
                  ? t({
                      id: profileForm.formState.errors.lastName.message,
                    })
                  : undefined
              }
              {...profileForm.register("lastName")}
            />
            <FormInputField
              id="email"
              type="email"
              placeholder=""
              name="email"
              label={t`Email Address`}
              loading={isLoading}
              disabled
              value={user?.email || ""}
            />
          </SettingsCard>
        </form>

        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}>
          <SettingsCard
            title={t`Change Password`}
            footer={
              <Button type="submit" loading={isUpdatingPassword}>
                <Trans>Update Password</Trans>
              </Button>
            }
          >
            <FormInputField
              id="currentPassword"
              type="password"
              label={t`Current Password`}
              loading={isLoading}
              placeholder="••••••••"
              error={
                passwordForm.formState.errors.currentPassword?.message
                  ? t({
                      id: passwordForm.formState.errors.currentPassword.message,
                    })
                  : undefined
              }
              {...passwordForm.register("currentPassword")}
            />
            <FormInputField
              id="password"
              type="password"
              label={t`New Password`}
              loading={isLoading}
              placeholder="••••••••"
              error={
                passwordForm.formState.errors.password?.message
                  ? t({
                      id: passwordForm.formState.errors.password.message,
                    })
                  : undefined
              }
              {...passwordForm.register("password")}
            />
            <FormInputField
              id="passwordConfirmation"
              type="password"
              label={t`Confirm New Password`}
              loading={isLoading}
              placeholder="••••••••"
              error={
                passwordForm.formState.errors.passwordConfirmation?.message
                  ? t({
                      id: passwordForm.formState.errors.passwordConfirmation.message,
                    })
                  : undefined
              }
              {...passwordForm.register("passwordConfirmation")}
            />
          </SettingsCard>
        </form>

        <SettingsCard
          title={t`Delete Account`}
          description={t`Permanently delete your account and all of your content.`}
        >
          <div className="ProfileSettingsPageDeleteSection">
            <Modal
              open={isDeleteModalOpen}
              onOpenChange={setIsDeleteModalOpen}
              title={t`Delete Account`}
              description={t`Are you sure you want to delete your account? This action is permanent and cannot be undone. Please enter your password to confirm.`}
              trigger={
                <Button variant="danger" disabled={isLoading}>
                  <Trans>Delete Account</Trans>
                </Button>
              }
            >
              <form
                onSubmit={deleteAccountForm.handleSubmit(onDeleteAccountSubmit)}
                className="ProfileSettingsPageDeleteForm"
              >
                <FormInputField
                  id="deletePassword"
                  type="password"
                  label={t`Current Password`}
                  loading={isLoading}
                  placeholder="••••••••"
                  error={
                    deleteAccountForm.formState.errors.password?.message
                      ? t({
                          id: deleteAccountForm.formState.errors.password
                            .message,
                        })
                      : undefined
                  }
                  {...deleteAccountForm.register("password")}
                />
                <div className="ProfileSettingsPageDeleteFormActions">
                  <Button variant="secondary" onClick={closeDeleteModal}>
                    <Trans>Cancel</Trans>
                  </Button>
                  <Button
                    type="submit"
                    variant="danger"
                    loading={isDeletingAccount}
                  >
                    <Trans>Confirm Deletion</Trans>
                  </Button>
                </div>
              </form>
            </Modal>
          </div>
        </SettingsCard>
      </div>
    </div>
  );
};