<template>
  <div class="max-w-3xl mx-auto p-6">
    <Card class="mb-8">
      <CardHeader>
        <CardTitle class="text-2xl font-bold">Profile Settings</CardTitle>
        <CardDescription>Manage your account settings and preferences</CardDescription>
      </CardHeader>
      <CardContent>
        <!-- Avatar Section -->
        <div class="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
          <div class="relative">
            <div class="h-24 w-24 rounded-full overflow-hidden bg-muted">
              <img
                v-if="avatarPreview || avatarUrl"
                :src="avatarPreview || avatarUrl"
                alt="Profile"
                class="h-full w-full object-cover" />
              <div v-else class="h-full w-full flex items-center justify-center bg-muted">
                <UserCircle class="h-12 w-12 text-muted-foreground" />
              </div>
            </div>
            <div v-if="!avatarPreview && !avatarUrl" class="absolute -bottom-2 -right-2 rounded-full">
              <label
                class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-primary text-white shadow-sm hover:bg-primary/90"
                :for="uploadInputId">
                <Camera color="white" :size="20" />
                <input :id="uploadInputId" type="file" accept="image/*" class="hidden" @change="handleAvatarChange" />
              </label>
            </div>
          </div>
          <div class="space-y-1 text-center sm:text-left">
            <h3 class="text-lg font-medium">Profile Picture</h3>
            <p class="text-sm text-muted-foreground">Upload a new avatar or remove the current one</p>
            <div class="flex justify-center sm:justify-start space-x-2 mt-2">
              <Button variant="outline" size="sm" :disabled="isUpdating" @click="handleAvatarUpload">
                {{ isUpdating ? "Updating..." : "Update" }}
              </Button>
              <Button variant="outline" size="sm" :disabled="isUpdating || !avatarUrl" @click="handleAvatarRemove">
                Remove
              </Button>
            </div>
          </div>
        </div>

        <!-- Personal Information Form -->
        <form @submit.prevent="handlePersonalInfoUpdate" class="space-y-6 mb-8">
          <h3 class="text-lg font-medium">Personal Information</h3>
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div class="space-y-2">
              <Label for="firstName">First Name</Label>
              <Input
                id="firstName"
                v-model="firstName"
                type="text"
                :class="{ 'border-red-500': firstNameError }"
                placeholder="Enter your first name"
                @blur="validateFirstName" />
              <p v-if="firstNameError" class="text-sm text-red-500">{{ firstNameError }}</p>
            </div>
            <div class="space-y-2">
              <Label for="lastName">Last Name</Label>
              <Input
                id="lastName"
                v-model="lastName"
                type="text"
                :class="{ 'border-red-500': lastNameError }"
                placeholder="Enter your last name"
                @blur="validateLastName" />
              <p v-if="lastNameError" class="text-sm text-red-500">{{ lastNameError }}</p>
            </div>
          </div>
          <div class="space-y-2">
            <Label for="email">Email</Label>
            <Input id="email" v-model="email" type="email" disabled class="bg-muted" />
            <p class="text-sm text-muted-foreground">
              Email cannot be changed. Contact support if you need to update it.
            </p>
          </div>
          <div class="flex justify-center sm:justify-start">
            <Button type="submit" :disabled="isUpdatingInfo || !isPersonalInfoValid">
              {{ isUpdatingInfo ? "Saving Changes..." : "Save Changes" }}
            </Button>
          </div>
        </form>

        <!-- Password Change Form -->
        <form @submit.prevent="handlePasswordChange" class="space-y-6">
          <h3 class="text-lg font-medium">Change Password</h3>
          <div class="space-y-4">
            <div class="space-y-2">
              <Label for="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                v-model="currentPassword"
                type="password"
                :class="{ 'border-red-500': currentPasswordError }"
                placeholder="Enter your current password" />
              <p v-if="currentPasswordError" class="text-sm text-red-500">{{ currentPasswordError }}</p>
            </div>
            <div class="space-y-2">
              <Label for="newPassword">New Password</Label>
              <Input
                id="newPassword"
                v-model="newPassword"
                type="password"
                :class="{ 'border-red-500': newPasswordError }"
                placeholder="Enter your new password"
                @blur="validateNewPassword" />
              <p v-if="newPasswordError" class="text-sm text-red-500">{{ newPasswordError }}</p>
            </div>
            <div class="space-y-2">
              <Label for="confirmNewPassword">Confirm New Password</Label>
              <Input
                id="confirmNewPassword"
                v-model="confirmNewPassword"
                type="password"
                :class="{ 'border-red-500': confirmNewPasswordError }"
                placeholder="Confirm your new password"
                @blur="validateConfirmNewPassword" />
              <p v-if="confirmNewPasswordError" class="text-sm text-red-500">{{ confirmNewPasswordError }}</p>
            </div>
          </div>
          <div class="flex justify-center sm:justify-start">
            <Button type="submit" variant="outline" :disabled="isChangingPassword || !isPasswordFormValid">
              {{ isChangingPassword ? "Changing Password..." : "Change Password" }}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, UserCircle } from "lucide-vue-next";
import { useToast } from "@/components/ui/toast/use-toast";

// Generate unique ID for file input
const uploadInputId = `file-upload-${Math.random().toString(36).substr(2, 9)}`;

const { toast } = useToast();
const { user, fetch: refreshSession } = useUserSession();

// Avatar state
const avatarUrl = ref(""); // Would be populated from user data
const avatarPreview = ref("");
const isUpdating = ref(false);

// Personal info state
const firstName = ref("");
const lastName = ref("");
const email = ref(user.value?.email || "");
const firstNameError = ref("");
const lastNameError = ref("");
const isUpdatingInfo = ref(false);

// Password change state
const currentPassword = ref("");
const newPassword = ref("");
const confirmNewPassword = ref("");
const currentPasswordError = ref("");
const newPasswordError = ref("");
const confirmNewPasswordError = ref("");
const isChangingPassword = ref(false);

// Avatar handlers
const handleAvatarChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      alert("File size should not exceed 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      avatarPreview.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
};

const handleAvatarUpload = async () => {
  if (!avatarPreview.value) {
    toast({
      variant: "destructive",
      title: "Error",
      description: "Please select an image",
    });
    return;
  }

  try {
    isUpdating.value = true;
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API call
    avatarUrl.value = avatarPreview.value;
    avatarPreview.value = "";
    toast({
      title: "Success",
      description: "Avatar updated successfully",
    });
  } catch (error) {
    console.error("Error updating avatar:", error);
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to update avatar",
    });
  } finally {
    isUpdating.value = false;
  }
};

const handleAvatarRemove = async () => {
  try {
    isUpdating.value = true;
    await new Promise((resolve) => setTimeout(resolve, 1000));
    avatarUrl.value = "";
    avatarPreview.value = "";
    toast({
      title: "Success",
      description: "Avatar removed successfully",
    });
  } catch (error) {
    console.error("Error removing avatar:", error);
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to remove avatar",
    });
  } finally {
    isUpdating.value = false;
  }
};

// Personal info validation
const validateFirstName = () => {
  const value = firstName.value.trim();
  if (!value) {
    firstNameError.value = "First name is required";
  } else if (value.length < 2) {
    firstNameError.value = "First name must be at least 2 characters";
  } else if (!/^[a-zA-Z\s-']+$/.test(value)) {
    firstNameError.value = "First name can only contain letters, spaces, hyphens, and apostrophes";
  } else {
    firstNameError.value = "";
    firstName.value = value;
  }
};

const validateLastName = () => {
  const value = lastName.value.trim();
  if (!value) {
    lastNameError.value = "Last name is required";
  } else if (value.length < 2) {
    lastNameError.value = "Last name must be at least 2 characters";
  } else if (!/^[a-zA-Z\s-']+$/.test(value)) {
    lastNameError.value = "Last name can only contain letters, spaces, hyphens, and apostrophes";
  } else {
    lastNameError.value = "";
    lastName.value = value;
  }
};

const isPersonalInfoValid = computed(() => {
  return firstName.value && lastName.value && !firstNameError.value && !lastNameError.value;
});

// Password validation
const validateNewPassword = () => {
  const password = newPassword.value;

  if (!password) {
    newPasswordError.value = "New password is required";
    return;
  }

  if (password === currentPassword.value) {
    newPasswordError.value = "New password must be different from current password";
    return;
  }

  if (password.length < 8) {
    newPasswordError.value = "Password must be at least 8 characters long";
    return;
  }

  if (!/[A-Z]/.test(password)) {
    newPasswordError.value = "Password must contain at least one uppercase letter";
    return;
  }

  if (!/[a-z]/.test(password)) {
    newPasswordError.value = "Password must contain at least one lowercase letter";
    return;
  }

  if (!/[0-9]/.test(password)) {
    newPasswordError.value = "Password must contain at least one number";
    return;
  }

  if (!/[!@#$%^&*]/.test(password)) {
    newPasswordError.value = "Password must contain at least one special character (!@#$%^&*)";
    return;
  }

  newPasswordError.value = "";
  validateConfirmNewPassword();
};

const validateConfirmNewPassword = () => {
  if (!confirmNewPassword.value) {
    confirmNewPasswordError.value = "Please confirm your new password";
  } else if (confirmNewPassword.value !== newPassword.value) {
    confirmNewPasswordError.value = "Passwords do not match";
  } else {
    confirmNewPasswordError.value = "";
  }
};

const isPasswordFormValid = computed(() => {
  return (
    currentPassword.value &&
    newPassword.value &&
    confirmNewPassword.value &&
    !newPasswordError.value &&
    !confirmNewPasswordError.value
  );
});

// Form submission handlers
const handlePersonalInfoUpdate = async () => {
  validateFirstName();
  validateLastName();

  if (!isPersonalInfoValid.value) return;

  try {
    isUpdatingInfo.value = true;

    const fullName = `${firstName.value} ${lastName.value}`.trim();
    const response = await $fetch("/api/protected/profile", {
      method: "PUT",
      body: {
        name: fullName,
      },
    });

    if (response.success) {
      await refreshSession();
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    }
  } catch (error: any) {
    console.error("Error updating profile:", error);
    toast({
      variant: "destructive",
      title: "Error",
      description: error?.data?.message || "Failed to update profile",
    });
  } finally {
    isUpdatingInfo.value = false;
  }
};

const handlePasswordChange = async () => {
  currentPasswordError.value = "";
  validateNewPassword();
  validateConfirmNewPassword();

  if (!isPasswordFormValid.value) return;

  try {
    isChangingPassword.value = true;
    // Password change API call will be implemented later
    toast({
      variant: "destructive",
      title: "Not Implemented",
      description: "Password change functionality will be added soon",
    });
  } catch (error: any) {
    console.error("Password change error:", error);
    toast({
      variant: "destructive",
      title: "Error",
      description: error?.data?.message || "Failed to change password",
    });
  } finally {
    isChangingPassword.value = false;
  }
};

// Initialize form with user data
onMounted(() => {
  if (user.value?.name) {
    const [first, ...rest] = user.value.name.split(" ");
    firstName.value = first;
    lastName.value = rest.join(" ");
  }
  if (user.value?.avatarUrl) {
    avatarUrl.value = user.value.avatarUrl;
  }
});
</script>
