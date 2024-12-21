import { useToast } from "../components/ui/toast/use-toast";
const { toast } = useToast();
export default defineNuxtPlugin((nuxtApp) => {
  const toaster = (title: string, variant: "default" | "destructive" | null | undefined) => {
    toast({
      title,
      variant,
    });
  };

  globalThis.toaster = toaster;

  return {
    provide: {
      toaster,
    },
  };
});
