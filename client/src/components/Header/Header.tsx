import { NavLink } from 'react-router-dom';
import styles from './Header.module.scss';
import Button from '@mui/material/Button';

interface HeaderProps {
  onCreateIssue?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onCreateIssue }) => {
  return (
    <header className={styles.header}>
      <nav>
        <NavLink
          to="/boards"
          className={({ isActive }: { isActive: boolean }) =>
            isActive ? styles.active : ''
          }
        >
          Проекты
        </NavLink>
        <NavLink
          to="/issues"
          className={({ isActive }: { isActive: boolean }) =>
            isActive ? styles.active : ''
          }
        >
          Все задачи
        </NavLink>
      </nav>
      <Button
        variant="contained"
        color="primary"
        onClick={onCreateIssue}
        sx={{ ml: 'auto' }}
      >
        Создать задачу
      </Button>
    </header>
  );
};

export default Header;
