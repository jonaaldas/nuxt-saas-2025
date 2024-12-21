type Variant = "default" | "destructive";
declare global {
  var toaster: (title: string, variant?: Variant) => void;
}

export {};
