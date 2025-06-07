
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { User } from 'lucide-react';

const AuthButton = () => {
  const { user, signOut } = useAuth();

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <Link to="/profile">
          <Button variant="outline" size="sm" className="border-gold text-gold hover:bg-gold hover:text-white">
            <User className="w-4 h-4 mr-2" />
            Profile
          </Button>
        </Link>
        <Button 
          onClick={signOut} 
          variant="outline" 
          size="sm"
          className="border-navy text-navy hover:bg-navy hover:text-white"
        >
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <Link to="/auth">
      <Button className="bg-gold hover:bg-gold/90">
        Sign In
      </Button>
    </Link>
  );
};

export default AuthButton;
