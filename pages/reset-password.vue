<template>
  <div class="min-h-screen flex items-center justify-center bg-background">
    <Card class="w-[400px]">
      <CardHeader>
        <CardTitle class="text-2xl font-bold">Reset Password</CardTitle>
        <CardDescription class="text-base">
          {{ !emailSent ? "Enter your email to receive a password reset link" : "Check your email" }}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div v-if="!emailSent" class="space-y-4">
          <form @submit.prevent="handleResetRequest" class="space-y-4">
            <div class="space-y-2">
              <Label class="text-sm sm:text-base" for="email">Email</Label>
              <Input
                id="email"
                v-model="email"
                type="email"
                :class="{ 'border-red-500': emailError }"
                placeholder="Enter your email address"
                @blur="validateEmail"
                required />
              <p v-if="emailError" class="text-sm text-red-500">{{ emailError }}</p>
            </div>

            <Button type="submit" class="w-full" :disabled="isSubmitting || !isFormValid">
              {{ isSubmitting ? "Sending Reset Link..." : "Send Reset Link" }}
            </Button>
            <p v-if="formError" class="text-sm text-red-500 text-center">{{ formError }}</p>
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
              If an account exists for {{ email }}, you will receive a password reset link shortly.
            </p>
            <p class="text-sm text-muted-foreground">
              Please check your email and follow the instructions to reset your password.
            </p>
          </div>
          <Button class="w-full" variant="outline" @click="resetForm"> Try Different Email </Button>
        </div>
      </CardContent>
      <CardFooter>
        <p class="text-sm text-muted-foreground text-center w-full">
          Remember your password?
          <NuxtLink to="/login" class="text-primary hover:underline ml-1"> Login </NuxtLink>
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

const email = ref("");
const emailError = ref("");
const formError = ref("");
const isSubmitting = ref(false);
const emailSent = ref(false);

// Email validation
const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const sanitizedEmail = email.value.trim().toLowerCase();

  if (!sanitizedEmail) {
    emailError.value = "Email is required";
  } else if (!emailRegex.test(sanitizedEmail)) {
    emailError.value = "Please enter a valid email address";
  } else {
    emailError.value = "";
    email.value = sanitizedEmail;
  }
};

const isFormValid = computed(() => {
  return email.value && !emailError.value;
});

const resetForm = () => {
  email.value = "";
  emailError.value = "";
  formError.value = "";
  emailSent.value = false;
  isSubmitting.value = false;
};

const handleResetRequest = async () => {
  formError.value = "";
  validateEmail();

  if (!isFormValid.value) {
    return;
  }

  try {
    isSubmitting.value = true;

    const response = await $fetch<{ success: boolean }>("/api/auth/forgot", {
      method: "POST",
      body: {
        email: email.value,
      },
    });

    if (response.success) {
      emailSent.value = true;
      toaster("Check your email", "default");
    } else {
      emailSent.value = true;
      toaster("Check your email", "default");
    }
  } catch (error: any) {
    toaster("Request failed", "destructive");
  } finally {
    isSubmitting.value = false;
  }
};
</script>
