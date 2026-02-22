'use client';

import { useState } from 'react';
import { Link, usePathname, useRouter } from '../../../i18n/routing';
import { useLocale, useTranslations } from 'next-intl';
import {
  Box, AppBar, Toolbar, Typography, Button, IconButton,
  Drawer, List, ListItem, ListItemText, Menu, MenuItem, Divider
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import TranslateIcon from '@mui/icons-material/Translate';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import styles from './Navbar.module.css'; 

export default function Navbar() {
  const t = useTranslations('Navbar');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLanguageMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLanguageMenuClose = () => {
    setAnchorEl(null);
  };

  const changeLocale = (newLocale: string) => {
    router.push(pathname, { locale: newLocale });
    handleLanguageMenuClose();
    setMobileOpen(false); 
  };

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' },
    { code: 'ar', name: 'العربية' },
  ];

  const navItems = [
    { label: t('home'), href: '/' },
    { label: t('login'), href: '/login' },
    { label: t('signup'), href: '/signup' },
  ];


  const renderDesktopNav = () => (
    <Box className={styles.desktopNav}>

      <IconButton
        color="inherit"
        onClick={handleLanguageMenuOpen}
      >
        <TranslateIcon />
      </IconButton>


      <Button
        component={Link}
        href={(pathname === '/login') ? '/signup' : '/login'}
        variant="outlined"
        className={styles.navButton}
      >
        {(pathname === '/login') ? t('signup') : t('login')}
      </Button>
    </Box>
  );

  const renderDrawerContent = () => (
    <Box className={styles.drawerContent} onClick={handleDrawerToggle}>
      <Typography variant="h6" className={styles.drawerTitle}>
        LibroFlow
      </Typography>
      <List className={styles.drawerList}>
        {navItems.map((item) => (
          <ListItem 
            component={Link} 
            href={item.href} 
            key={item.label}
            className={styles.drawerListItem}
          >
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
        
        <Divider sx={{ my: 1 }} />
        
    
        <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1, px: 2 }}>
          Language
        </Typography>
        {languages.map((lang) => (
          <ListItem 
            key={lang.code}
            className={`${styles.drawerLanguageItem} ${locale === lang.code ? styles.activeLanguage : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              changeLocale(lang.code);
            }}
          >
            <ListItemText primary={lang.name} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar component="nav" position="sticky" color="default" elevation={1} className={styles.appBar}>
        <Toolbar className={styles.toolbar}>
        
          <Link href="/" className={styles.logo}>
            <LocalLibraryIcon className={styles.logoIcon} />
            <Typography variant="h6">
              LibroFlow
            </Typography>
          </Link>

          {renderDesktopNav()}

          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="end"
            onClick={handleDrawerToggle}
            className={styles.mobileMenuButton}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleLanguageMenuClose}
      >
        {languages.map((lang) => (
          <MenuItem 
            key={lang.code} 
            onClick={() => changeLocale(lang.code)}
            selected={locale === lang.code}
          >
            {lang.name}
          </MenuItem>
        ))}
      </Menu>

      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
      >
        {renderDrawerContent()}
      </Drawer>
    </>
  );
}