type Variant = "default" | "destructive";
declare global {
  var toaster: (title: string, description: string, variant?: Variant) => void;
}

export {};
