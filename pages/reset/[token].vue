<template>
  <div class="min-h-screen flex items-center justify-center bg-background">
    <Card class="w-[400px]">
      <CardHeader>
        <CardTitle class="text-2xl font-bold">Reset Password</CardTitle>
        <CardDescription class="text-base">
          {{ getHeaderDescription }}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <!-- Loading State -->
        <div v-if="isVerifying" class="py-8 text-center space-y-4">
          <div class="flex justify-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
          <p class="text-muted-foreground">Verifying reset token...</p>
        </div>

        <!-- Invalid Token State -->
        <div v-else-if="!isValidToken && !isVerifying" class="py-8 text-center space-y-4">
          <div class="flex justify-center mb-4">
            <div class="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
              <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
          <p class="text-muted-foreground">
            {{ errorMessage || "Invalid or expired reset token." }}
          </p>
          <p class="text-sm text-muted-foreground">Redirecting to home page in {{ redirectCountdown }} seconds...</p>
        </div>

        <!-- Reset Password Form -->
        <div v-else-if="!isSuccess" class="space-y-4">
          <form @submit.prevent="handlePasswordReset" class="space-y-4">
            <div class="space-y-2">
              <Label class="text-sm sm:text-base" for="password">New Password</Label>
              <Input
                id="password"
                v-model="password"
                type="password"
                :class="{ 'border-red-500': passwordError }"
                placeholder="Enter your new password"
                @blur="validatePassword"
                required />
              <p v-if="passwordError" class="text-sm text-red-500">{{ passwordError }}</p>
            </div>

            <div class="space-y-2">
              <Label class="text-sm sm:text-base" for="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                v-model="confirmPassword"
                type="password"
                :class="{ 'border-red-500': confirmPasswordError }"
                placeholder="Confirm your new password"
                @blur="validateConfirmPassword"
                required />
              <p v-if="confirmPasswordError" class="text-sm text-red-500">{{ confirmPasswordError }}</p>
            </div>

            <Button type="submit" class="w-full" :disabled="isSubmitting || !isFormValid">
              {{ isSubmitting ? "Resetting Password..." : "Reset Password" }}
            </Button>
            <p v-if="formError" class="text-sm text-red-500 text-center">{{ formError }}</p>
          </form>
        </div>

        <!-- Success State -->
        <div v-else class="py-8 text-center space-y-4">
          <div class="flex justify-center mb-4">
            <div class="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <p class="text-muted-foreground">Your password has been successfully reset.</p>
          <Button class="w-full" @click="router.push('/login')"> Login with New Password </Button>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "#components";
import { Button } from "#components";
import { Input } from "#components";
import { Label } from "#components";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const token = ref(route.params.token as string);
const isVerifying = ref(true);
const isValidToken = ref(false);
const isSuccess = ref(false);
const errorMessage = ref("");
const redirectCountdown = ref(5);

const password = ref("");
const confirmPassword = ref("");
const passwordError = ref("");
const confirmPasswordError = ref("");
const formError = ref("");
const isSubmitting = ref(false);

// Computed property for dynamic header description
const getHeaderDescription = computed(() => {
  if (isVerifying.value) return "Verifying your reset token";
  if (!isValidToken.value) return "Invalid Reset Token";
  if (isSuccess.value) return "Password Reset Successful";
  return "Enter your new password";
});

// Password validation
const validatePassword = () => {
  const password_value = password.value;

  if (!password_value) {
    passwordError.value = "Password is required";
    return;
  }

  if (password_value.length < 8) {
    passwordError.value = "Password must be at least 8 characters long";
    return;
  }

  if (!/[A-Z]/.test(password_value)) {
    passwordError.value = "Password must contain at least one uppercase letter";
    return;
  }

  if (!/[a-z]/.test(password_value)) {
    passwordError.value = "Password must contain at least one lowercase letter";
    return;
  }

  if (!/[0-9]/.test(password_value)) {
    passwordError.value = "Password must contain at least one number";
    return;
  }

  if (!/[!@#$%^&*]/.test(password_value)) {
    passwordError.value = "Password must contain at least one special character (!@#$%^&*)";
    return;
  }

  passwordError.value = "";
  validateConfirmPassword();
};

// Confirm password validation
const validateConfirmPassword = () => {
  if (!confirmPassword.value) {
    confirmPasswordError.value = "Please confirm your password";
  } else if (confirmPassword.value !== password.value) {
    confirmPasswordError.value = "Passwords do not match";
  } else {
    confirmPasswordError.value = "";
  }
};

const isFormValid = computed(() => {
  return password.value && confirmPassword.value && !passwordError.value && !confirmPasswordError.value;
});

// Simulate token verification
const verifyToken = async () => {
  try {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Simulate token validation (for demo purposes)
    // In reality, this would be an API call to verify the token
    if (token.value && token.value.length >= 10) {
      isValidToken.value = true;
    } else {
      errorMessage.value = "Invalid or expired reset token";
      startRedirectCountdown();
    }
  } catch (error) {
    errorMessage.value = "Error verifying reset token";
    startRedirectCountdown();
  } finally {
    isVerifying.value = false;
  }
};

// Handle password reset
const handlePasswordReset = async () => {
  formError.value = "";
  validatePassword();
  validateConfirmPassword();

  if (!isFormValid.value) {
    return;
  }

  try {
    isSubmitting.value = true;

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log("Password reset with:", {
      token: token.value,
      password: password.value,
    });

    isSuccess.value = true;
  } catch (error) {
    formError.value = "An error occurred while resetting your password. Please try again.";
  } finally {
    isSubmitting.value = false;
  }
};

// Countdown and redirect for invalid token
const startRedirectCountdown = () => {
  const interval = setInterval(() => {
    redirectCountdown.value--;
    if (redirectCountdown.value <= 0) {
      clearInterval(interval);
      router.push("/");
    }
  }, 1000);
};

// Initialize token verification
onMounted(() => {
  if (!token.value) {
    errorMessage.value = "No reset token provided";
    isVerifying.value = false;
    startRedirectCountdown();
  } else {
    verifyToken();
  }
});
</script>
