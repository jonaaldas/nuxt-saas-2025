<script lang="ts" setup>
import { ref, computed } from "vue";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { ChevronsDown, Menu, User, CreditCard, LogOut } from "lucide-vue-next";

const { loggedIn, user, session, fetch, clear } = useUserSession();

interface RouteProps {
  href: string;
  label: string;
}

const routeList: RouteProps[] = [
  {
    href: "#features",
    label: "How It Works",
  },
  {
    href: "#pricing",
    label: "Pricing",
  },
  {
    href: "#contact",
    label: "Contact",
  },
  {
    href: "#faq",
    label: "FAQ",
  },
];

const isOpen = ref<boolean>(false);

const userInitials = computed(() => {
  if (!user.value) return "";
  return `${user.value.name}`.toUpperCase();
});

const handleLogout = () => {
  clear();
};

const handleBillingPortal = () => {
  window.open("https://billing.stripe.com/p/login/test_eVa00b6zKa4k7pm4gg", "_blank");
};

const handleProfileClick = () => {
  navigateTo(
    {
      path: "/dashboard",
    },
    { replace: true }
  );
  isOpen.value = false;
};

const handleLogin = () => {
  navigateTo("/login", { replace: true });
  isOpen.value = false;
};

const handleSignup = () => {
  navigateTo("/register", { replace: true });
  isOpen.value = false;
};
</script>

<template>
  <header
    :class="{
      'w-[90%] md:w-[70%] lg:w-[75%] lg:max-w-screen-xl top-5 mx-auto sticky border z-40 rounded-2xl flex justify-between items-center p-2 bg-card shadow-md': true,
    }">
    <a href="/" class="font-bold text-lg flex items-center">
      <ChevronsDown
        class="bg-gradient-to-tr from-primary via-primary/70 to-primary rounded-lg w-9 h-9 mr-2 border text-white" />
      ShadcnVue</a
    >

    <!-- Mobile -->
    <div class="flex items-center md:!hidden">
      <Sheet v-model:open="isOpen">
        <SheetTrigger as-child>
          <Menu @click="isOpen = true" class="cursor-pointer" />
        </SheetTrigger>

        <SheetContent side="left" class="flex flex-col justify-between rounded-tr-2xl rounded-br-2xl bg-card">
          <div>
            <SheetHeader class="mb-4 ml-4">
              <SheetTitle class="flex items-center">
                <a href="/" class="flex items-center">
                  <ChevronsDown
                    class="bg-gradient-to-tr from-primary/70 via-primary to-primary/70 rounded-lg size-9 mr-2 border text-white" />
                  ShadcnVue
                </a>
              </SheetTitle>
            </SheetHeader>

            <!-- Navigation Links -->
            <div class="flex flex-col gap-2">
              <Button
                v-for="{ href, label } in routeList"
                :key="label"
                as-child
                variant="ghost"
                class="justify-start text-base">
                <a @click="isOpen = false" :href="href">
                  {{ label }}
                </a>
              </Button>
            </div>

            <!-- User Section for Mobile -->
            <div v-if="loggedIn" class="mt-4 border-t pt-4">
              <p class="px-2 text-sm font-medium text-muted-foreground mb-2">My Account</p>
              <div class="flex flex-col gap-2">
                <Button variant="ghost" class="justify-start" @click="handleProfileClick">
                  <User class="mr-2 h-4 w-4" />
                  Profile
                </Button>
                <Button v-if="user?.isPaid" variant="ghost" class="justify-start" @click="handleBillingPortal">
                  <CreditCard class="mr-2 h-4 w-4" />
                  Billing
                </Button>
                <Button variant="ghost" class="justify-start" @click="handleLogout">
                  <LogOut class="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>

            <!-- Auth Buttons for Mobile -->
            <div v-else class="mt-4 border-t pt-4 flex flex-col gap-2">
              <Button variant="ghost" class="justify-start" @click="handleLogin">Login</Button>
              <Button variant="default" @click="handleSignup">Sign up</Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>

    <!-- Desktop -->
    <NavigationMenu class="hidden md:block">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Button
              v-for="{ href, label } in routeList"
              :key="label"
              as-child
              variant="ghost"
              class="justify-start text-base">
              <a :href="href">
                {{ label }}
              </a>
            </Button>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>

    <div class="hidden md:flex items-center gap-2">
      <!-- User Dropdown -->
      <DropdownMenu v-if="loggedIn">
        <DropdownMenuTrigger class="flex items-center">
          <Avatar>
            <AvatarImage :src="`https://avatar.vercel.sh/${user?.email}.png`" alt="User avatar" />
            <AvatarFallback>{{ userInitials }}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuItem @click="handleProfileClick">
            <User class="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem v-if="user?.isPaid" @click="handleBillingPortal">
            <CreditCard class="mr-2 h-4 w-4" />
            Billing
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem @click="handleLogout">
            <LogOut class="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <!-- Login/Register Buttons -->
      <template v-else>
        <Button variant="ghost" @click="handleLogin">Login</Button>
        <Button variant="default" @click="handleSignup">Sign up</Button>
      </template>
    </div>
  </header>
</template>

<style scoped>
.shadow-light {
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.085);
}

.shadow-dark {
  box-shadow: inset 0 0 5px rgba(255, 255, 255, 0.141);
}
</style>
