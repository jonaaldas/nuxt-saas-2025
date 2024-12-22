<template>
  <div class="min-h-screen flex items-center justify-center bg-background">
    <Card class="w-[350px]">
      <CardHeader>
        <CardTitle class="text-2xl font-bold">Login</CardTitle>
        <CardDescription class="text-base">Enter your credentials to access your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="handleLogin" class="space-y-4">
          <div class="space-y-2">
            <Label class="text-sm sm:text-base" for="email">Email</Label>
            <Input
              id="email"
              v-model="email"
              type="email"
              :class="{ 'border-red-500': emailError }"
              placeholder="Enter your email"
              @blur="validateEmail"
              required />
            <p v-if="emailError" class="text-sm text-red-500">{{ emailError }}</p>
          </div>
          <div class="space-y-2">
            <Label class="text-sm sm:text-base" for="password">Password</Label>
            <Input
              id="password"
              v-model="password"
              type="password"
              :class="{ 'border-red-500': passwordError }"
              placeholder="Enter your password"
              @blur="validatePassword"
              required />
            <p v-if="passwordError" class="text-sm text-red-500">{{ passwordError }}</p>
          </div>
          <div class="flex justify-between items-center text-sm">
            <NuxtLink to="/reset-password" class="text-primary hover:underline"> Forgot password? </NuxtLink>
          </div>
          <Button type="submit" class="w-full" :disabled="isSubmitting || !isFormValid">
            {{ isSubmitting ? "Logging in..." : "Login" }}
          </Button>
          <p v-if="formError" class="text-sm text-red-500 text-center">{{ formError }}</p>
        </form>
      </CardContent>
      <CardFooter>
        <p class="text-sm text-muted-foreground text-center w-full">
          Don't have an account?
          <NuxtLink to="/register" class="text-primary hover:underline ml-1"> Sign up </NuxtLink>
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
const password = ref("");
const emailError = ref("");
const passwordError = ref("");
const formError = ref("");
const isSubmitting = ref(false);

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

// Password validation
const validatePassword = () => {
  if (!password.value) {
    passwordError.value = "Password is required";
    return;
  }
  passwordError.value = "";
};

const isFormValid = computed(() => {
  return email.value && password.value && !emailError.value && !passwordError.value;
});

const handleLogin = async () => {
  formError.value = "";

  // Validate both fields before submission
  validateEmail();
  validatePassword();

  if (!isFormValid.value) {
    return;
  }

  try {
    isSubmitting.value = true;

    const response = await $fetch("/api/auth/login", {
      method: "POST",
      body: {
        email: email.value,
        password: password.value,
      },
    });

    if (response.success) {
      toaster("Login successful!", "default");

      // Redirect to dashboard
      await navigateTo("/dashboard");
    }
  } catch (error: any) {
    console.error("Login error:", error);
    formError.value = error?.data?.message || "Invalid email or password";

    toaster(formError.value, "destructive");
  } finally {
    isSubmitting.value = false;
  }
};
</script>
