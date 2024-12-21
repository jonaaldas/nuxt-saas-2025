<template>
  <div class="min-h-screen flex items-center justify-center bg-background">
    <Card class="w-[400px]">
      <CardHeader>
        <CardTitle class="text-2xl font-bold">Create Account</CardTitle>
        <CardDescription class="text-base">Enter your information to get started</CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="handleRegister" class="space-y-4">
          <div class="flex gap-4">
            <div class="space-y-2 flex-1">
              <Label class="text-sm sm:text-base" for="firstName">First Name</Label>
              <Input
                id="firstName"
                v-model="firstName"
                type="text"
                :class="{ 'border-red-500': firstNameError }"
                placeholder="John"
                @blur="validateFirstName"
                required />
              <p v-if="firstNameError" class="text-sm text-red-500">{{ firstNameError }}</p>
            </div>
            <div class="space-y-2 flex-1">
              <Label class="text-sm sm:text-base" for="lastName">Last Name</Label>
              <Input
                id="lastName"
                v-model="lastName"
                type="text"
                :class="{ 'border-red-500': lastNameError }"
                placeholder="Doe"
                @blur="validateLastName"
                required />
              <p v-if="lastNameError" class="text-sm text-red-500">{{ lastNameError }}</p>
            </div>
          </div>

          <div class="space-y-2">
            <Label class="text-sm sm:text-base" for="email">Email</Label>
            <Input
              id="email"
              v-model="email"
              type="email"
              :class="{ 'border-red-500': emailError }"
              placeholder="john.doe@example.com"
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
              placeholder="Create a strong password"
              @blur="validatePassword"
              required />
            <p v-if="passwordError" class="text-sm text-red-500">{{ passwordError }}</p>
          </div>

          <div class="space-y-2">
            <Label class="text-sm sm:text-base" for="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              v-model="confirmPassword"
              type="password"
              :class="{ 'border-red-500': confirmPasswordError }"
              placeholder="Confirm your password"
              @blur="validateConfirmPassword"
              required />
            <p v-if="confirmPasswordError" class="text-sm text-red-500">{{ confirmPasswordError }}</p>
          </div>

          <Button type="submit" class="w-full" :disabled="isSubmitting || !isFormValid">
            {{ isSubmitting ? "Creating Account..." : "Create Account" }}
          </Button>
          <p v-if="formError" class="text-sm text-red-500 text-center">{{ formError }}</p>
        </form>
      </CardContent>
      <CardFooter>
        <p class="text-sm text-muted-foreground text-center w-full">
          Already have an account?
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
import { useRoute, useRouter } from "vue-router";

const firstName = ref("");
const lastName = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");

const firstNameError = ref("");
const lastNameError = ref("");
const emailError = ref("");
const passwordError = ref("");
const confirmPasswordError = ref("");
const formError = ref("");
const isSubmitting = ref(false);

const route = useRoute();
const router = useRouter();

// Get query parameters from pricing page
const selectedPlan = ref(route.query.plan as string);
const returnUrl = ref(route.query.returnUrl as string);

// Check if user came from pricing page
const isFromPricing = computed(() => {
  return Boolean(selectedPlan.value && returnUrl.value);
});

// Name validation
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
  validateConfirmPassword(); // Revalidate confirm password when password changes
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
  return (
    firstName.value &&
    lastName.value &&
    email.value &&
    password.value &&
    confirmPassword.value &&
    !firstNameError.value &&
    !lastNameError.value &&
    !emailError.value &&
    !passwordError.value &&
    !confirmPasswordError.value
  );
});

const handleRegister = async () => {
  formError.value = "";

  // Validate all fields before submission
  validateFirstName();
  validateLastName();
  validateEmail();
  validatePassword();
  validateConfirmPassword();

  if (!isFormValid.value) {
    return;
  }

  try {
    isSubmitting.value = true;

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("Registration attempt with:", {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      password: password.value,
      selectedPlan: selectedPlan.value,
    });

    if (email.value === "test@test.com") {
      formError.value = "This email is already registered";
      return;
    }

    // Handle post-registration navigation based on query parameters
    if (isFromPricing.value) {
      // If user came from pricing, redirect to the stripe checkout
      window.location.href = returnUrl.value;
    } else {
      // If direct registration, go to dashboard
      router.push("/dashboard");
    }
  } catch (error) {
    formError.value = "An error occurred during registration. Please try again.";
  } finally {
    isSubmitting.value = false;
  }
};
</script>
