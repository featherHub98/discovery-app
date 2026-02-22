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
import styles from './signup.module.css';

interface FormType {
  username: string;
  email: string;
  password: string;
}

export default function Signup() {
  const [formData, setFormData] = useState<FormType>({
    username: '',
    email: '',
    password: ''
  });

  const t = useTranslations('common');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await axios.post('/api/auth/signup', formData);
      console.log(result.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className={styles.main}>
      <Paper elevation={3} className={styles.paper}>
        <Typography variant="h5" component="h1" className={styles.title}>
          {t('signupTitle')}
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
              label={t('email')}
              variant="outlined"
              required
              fullWidth
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
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
              {t('signup')}
            </Button>

            <Link href="/login" className={styles.link}>
              {t('alreadyHaveAccount')}
            </Link>
          </Stack>
        </form>
      </Paper>
    </main>
  );
}