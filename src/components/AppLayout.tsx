import { AppHeader } from "@/components/AppHeader";

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main>{children}</main>
    </div>
  );
};