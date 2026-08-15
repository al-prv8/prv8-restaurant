import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        style: {
          background: "transparent",
          border: "none",
          boxShadow: "none",
          padding: 0,
          margin: 0,
          width: "auto",
        },
        classNames: {
          toast: "group toast font-sans bg-transparent border-none shadow-none p-0",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
