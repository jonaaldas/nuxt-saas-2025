import { useToast } from "../components/ui/toast/use-toast";
const { toast } = useToast();
export default defineNuxtPlugin((nuxtApp) => {
  const toaster = (title: string, description: string, variant: "default" | "destructive" | null | undefined) => {
    toast({
      title,
      description,
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
