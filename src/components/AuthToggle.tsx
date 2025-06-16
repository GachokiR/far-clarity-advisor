
interface AuthToggleProps {
  isLogin: boolean;
  onToggle: () => void;
}

export const AuthToggle = ({ isLogin, onToggle }: AuthToggleProps) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="text-blue-600 hover:text-blue-800 text-sm"
    >
      {isLogin 
        ? "Don't have an account? Sign up" 
        : "Already have an account? Sign in"
      }
    </button>
  );
};
