import { NavLink } from 'react-router-dom';
import styles from './Header.module.scss';

const Header = () => {
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
    </header>
  );
};

export default Header;
