<template>
  <div class="min-h-screen flex items-center justify-center bg-background">
    <Card class="w-[400px]">
      <CardHeader>
        <CardTitle class="text-2xl font-bold">Reset Password</CardTitle>
        <CardDescription class="text-base">
          {{ !isSuccess ? "Enter your new password" : "Password Reset Successful" }}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div v-if="!isSuccess" class="space-y-4">
          <form @submit.prevent="handleResetPassword" class="space-y-4">
            <div class="space-y-2">
              <Label class="text-sm sm:text-base" for="password">New Password</Label>
              <Input
                id="password"
                v-model="form.password"
                type="password"
                :class="{ 'border-red-500': errors.password }"
                placeholder="Enter your new password"
                required />
              <p v-if="errors.password" class="text-sm text-red-500">{{ errors.password }}</p>
            </div>

            <div class="space-y-2">
              <Label class="text-sm sm:text-base" for="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                v-model="form.confirmPassword"
                type="password"
                :class="{ 'border-red-500': errors.confirmPassword }"
                placeholder="Confirm your new password"
                required />
              <p v-if="errors.confirmPassword" class="text-sm text-red-500">{{ errors.confirmPassword }}</p>
            </div>

            <Button type="submit" class="w-full" :disabled="isSubmitting || !isFormValid">
              {{ isSubmitting ? "Resetting Password..." : "Reset Password" }}
            </Button>
          </form>
        </div>

        <div v-else class="space-y-4">
          <div class="text-center space-y-4">
            <div class="flex justify-center mb-4">
              <div class="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <p class="text-muted-foreground">
              Your password has been reset successfully. You will be redirected to the login page shortly.
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <p class="text-sm text-muted-foreground text-center w-full">
          Remember your password?
          <NuxtLink to="/login" class="text-primary hover:underline ml-1">Login</NuxtLink>
        </p>
      </CardFooter>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "#components";
import { Button } from "#components";
import { Input } from "#components";
import { Label } from "#components";
import { useToast } from "@/components/ui/toast/use-toast";
import { z } from "zod";

const route = useRoute();
const token = route.params.token as string;
const { toast } = useToast();

// Form state
const form = ref({
  password: "",
  confirmPassword: "",
});

const errors = ref({
  password: "",
  confirmPassword: "",
});

const isSubmitting = ref(false);
const isSuccess = ref(false);

// Zod schema matching backend validation
const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password must be less than 100 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Validate form using Zod
const validateForm = () => {
  const result = resetPasswordSchema.safeParse(form.value);

  // Reset errors
  errors.value = {
    password: "",
    confirmPassword: "",
  };

  if (!result.success) {
    // Map Zod errors to form errors
    result.error.errors.forEach((error) => {
      const field = error.path[0] as keyof typeof errors.value;
      errors.value[field] = error.message;
    });
    return false;
  }

  return true;
};

// Computed property for form validity
const isFormValid = computed(() => {
  return form.value.password && form.value.confirmPassword && !errors.value.password && !errors.value.confirmPassword;
});

const handleResetPassword = async () => {
  if (!validateForm()) return;

  try {
    isSubmitting.value = true;

    const response = await $fetch("/api/auth/reset-password", {
      method: "POST",
      body: {
        token,
        password: form.value.password,
      },
    });

    if (response.success) {
      isSuccess.value = true;
      toast({
        title: "Success",
        description: "Your password has been reset successfully.",
      });

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigateTo("/login");
      }, 2000);
    }
  } catch (error: any) {
    console.error("Password reset error:", error);

    toast({
      variant: "destructive",
      title: "Error",
      description: error?.data?.message || "Failed to reset password",
    });
  } finally {
    isSubmitting.value = false;
  }
};
</script>
