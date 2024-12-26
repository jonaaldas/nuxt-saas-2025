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
                <input
                  :id="uploadInputId"
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="
                    async (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (!file) return;
                      await compressImage(file);
                    }
                  " />
              </label>
            </div>
          </div>
          <div class="space-y-1 text-center sm:text-left">
            <h3 class="text-lg font-medium">Profile Picture</h3>
            <p class="text-sm text-muted-foreground">Upload a new avatar or remove the current one</p>
            <div class="flex justify-center sm:justify-start space-x-2 mt-2">
              <span v-if="isUpdating" class="text-sm text-muted-foreground">Updating...</span>
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
              <Label for="name">Name</Label>
              <Input
                id="name"
                v-model="name"
                type="text"
                :class="{ 'border-red-500': nameError }"
                placeholder="Enter your name"
                @blur="validateName" />
              <p v-if="nameError" class="text-sm text-red-500">{{ nameError }}</p>
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
            <Button type="submit" :disabled="isUpdatingInfo || !isNameValid">
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
                :class="{ 'border-red-500': passwordErrors.currentPassword }"
                placeholder="Enter your current password" />
              <p v-if="passwordErrors.currentPassword" class="text-sm text-red-500">
                {{ passwordErrors.currentPassword }}
              </p>
            </div>
            <div class="space-y-2">
              <Label for="newPassword">New Password</Label>
              <Input
                id="newPassword"
                v-model="newPassword"
                type="password"
                :class="{ 'border-red-500': passwordErrors.newPassword }"
                placeholder="Enter your new password"
                @blur="validatePasswords" />
              <p v-if="passwordErrors.newPassword" class="text-sm text-red-500">{{ passwordErrors.newPassword }}</p>
            </div>
            <div class="space-y-2">
              <Label for="confirmNewPassword">Confirm New Password</Label>
              <Input
                id="confirmNewPassword"
                v-model="confirmNewPassword"
                type="password"
                :class="{ 'border-red-500': passwordErrors.confirmNewPassword }"
                placeholder="Confirm your new password"
                @blur="validatePasswords" />
              <p v-if="passwordErrors.confirmNewPassword" class="text-sm text-red-500">
                {{ passwordErrors.confirmNewPassword }}
              </p>
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
import { z } from "zod";
import imageCompression from "browser-image-compression";

// Generate unique ID for file input
const uploadInputId = `file-upload-${Math.random().toString(36).substr(2, 9)}`;

const { toast } = useToast();
const { user, fetch: refreshSession } = useUserSession();

// Avatar state
const avatarUrl = ref(""); // Would be populated from user data
const avatarPreview = ref("");
const isUpdating = ref(false);
const name = ref(user.value?.name || "");
const email = ref(user.value?.email || "");
const nameError = ref("");

const isUpdatingInfo = ref(false);

const compressImage = async (file: File) => {
  const options = {
    maxSizeMB: 0.1,
    maxWidthOrHeight: 1024,
    useWebWorker: true,
  };

  try {
    const compressedFile = await imageCompression(file, options);
    console.log("Compressed file size:", compressedFile.size / 1024, "KB");
    await startUpload([compressedFile]);
    return compressedFile;
  } catch (error) {
    console.error("Image compression failed:", error);
  }
};

const { startUpload, isUploading } = useUploadThing("imageUploader", {
  async onClientUploadComplete(res) {
    isUpdating.value = true;
    console.log("Client upload complete", res);
    avatarUrl.value = res[0].url;
    await $fetch("/api/protected/profile", {
      method: "PUT",
      body: {
        avatarUrl: res[0].url,
      },
    });
    console.log("Avatar URL saved to database");
    const refreshResponse = await $fetch("/api/protected/refresh");
    if (refreshResponse.success) {
      toast({
        title: "Success",
        description: "Avatar updated successfully",
      });
    }
    isUpdating.value = false;
  },
});

// Zod Schemas
const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[!@#$%^&*]/, "Password must contain at least one special character (!@#$%^&*)"),
    confirmNewPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });

const currentPassword = ref("");
const newPassword = ref("");
const confirmNewPassword = ref("");
const passwordErrors = ref<Record<string, string>>({});
const isChangingPassword = ref(false);

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

const handleAvatarRemove = async () => {
  try {
    isUpdating.value = true;

    // Call the API to remove the avatar
    const response = await $fetch("/api/protected/profile", {
      method: "PUT",
      body: {
        avatarUrl: null,
      },
    });

    if (response.success) {
      // Refresh session with new data
      const refreshResponse = await $fetch("/api/protected/refresh");
      if (refreshResponse.success) {
        avatarUrl.value = "";
        avatarPreview.value = "";
        toast({
          title: "Success",
          description: "Avatar removed successfully",
        });
      }
    }
  } catch (error: any) {
    console.error("Error removing avatar:", error);
    toast({
      variant: "destructive",
      title: "Error",
      description: error?.data?.message || "Failed to remove avatar",
    });
  } finally {
    isUpdating.value = false;
  }
};

const validateName = () => {
  const value = name.value.trim();
\
  if (!value) {
    nameError.value = "Name is required";
  } else {
    nameError.value = "";
  }
};

const validatePasswords = () => {
  try {
    passwordSchema.parse({
      currentPassword: currentPassword.value,
      newPassword: newPassword.value,
      confirmNewPassword: confirmNewPassword.value,
    });
    passwordErrors.value = {};
    return true;
  } catch (error) {
    if (error instanceof z.ZodError) {
      passwordErrors.value = error.errors.reduce((acc, curr) => {
        const field = curr.path[0].toString();
        acc[field] = curr.message;
        return acc;
      }, {} as Record<string, string>);
    }
    return false;
  }
};

const isPasswordFormValid = computed(() => {
  return (
    currentPassword.value &&
    newPassword.value &&
    confirmNewPassword.value &&
    Object.keys(passwordErrors.value).length === 0
  );
});

const isNameValid = computed(() => {
  return name.value && !nameError.value;
});
console.log(isNameValid.value);

const handlePersonalInfoUpdate = async () => {
  validateName();

  if (!isNameValid.value) return;

  try {
    isUpdatingInfo.value = true;

    const nameVal = name.value.trim();
    const response = await $fetch("/api/protected/profile", {
      method: "PUT",
      body: {
        name: nameVal,
      },
    });

    if (response.success) {
      const refreshResponse = await $fetch("/api/protected/refresh");
      if (refreshResponse.success) {
        toaster("Success", "Profile updated successfully");
      }
    }
  } catch (error: any) {
    console.error("Error updating profile:", error);
    toaster("Error", error?.data?.message || "Failed to update profile", "destructive");
  } finally {
    isUpdatingInfo.value = false;
  }
};

const handlePasswordChange = async () => {
  if (!validatePasswords()) return;

  try {
    isChangingPassword.value = true;

    const response = await $fetch("/api/protected/change-password", {
      method: "POST",
      body: {
        currentPassword: currentPassword.value,
        newPassword: newPassword.value,
      },
    });

    if (response.success) {
      toast({
        title: "Success",
        description: "Password changed successfully",
      });
      // Clear form
      currentPassword.value = "";
      newPassword.value = "";
      confirmNewPassword.value = "";
      passwordErrors.value = {};
    }
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
  if (user.value?.avatarUrl) {
    avatarUrl.value = user.value.avatarUrl;
  }
});
</script>
