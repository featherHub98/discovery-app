'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import axios from 'axios';
import styles from './login.module.css';

interface FormType {
  username: string;
  password: string;
}

export default function Login() {
  const t = useTranslations('common');

  const [formData, setFormData] = useState<FormType>({
    username: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await axios.post('/api/auth/login', formData);
      console.log(result.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className={styles.main}>
      <Paper elevation={3} className={styles.paper}>
        <Typography variant="h5" component="h1" className={styles.title}>
          {t('loginTitle')}
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label={t('username')}
              variant="outlined"
              required
              fullWidth
              value={formData.username}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, username: e.target.value }))
              }
            />

            <TextField
              label={t('password')}
              type="password"
              variant="outlined"
              required
              fullWidth
              value={formData.password}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, password: e.target.value }))
              }
            />

            <Button type="submit" variant="contained" size="large" fullWidth>
              {t('login')}
            </Button>

            <Link href="/signup" className={styles.link}>
              {t('noAccount')}
            </Link>
          </Stack>
        </form>
      </Paper>
    </main>
  );
}