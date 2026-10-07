import { zodResolver } from '@hookform/resolvers/zod';
import { LogIn } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { ADMIN_ROUTES, ROUTES } from '@/app/routes';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { LOGO_URL } from '@/data/photos';
import { useDocumentMeta } from '@/lib/hooks';
import { useAuth } from '../authContext';

const loginSchema = z.object({
  email: z.email('Masukkan email yang valid'),
  password: z.string().min(1, 'Kata sandi wajib diisi'),
});
type LoginValues = z.infer<typeof loginSchema>;

export function Login() {
  useDocumentMeta('Masuk admin');
  const { status, signIn, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [failed, setFailed] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema), defaultValues: { email: '', password: '' } });

  const destination = (location.state as { from?: string } | null)?.from ?? ADMIN_ROUTES.dashboard;
  if (status === 'admin') return <Navigate to={destination} replace />;

  const onSubmit = handleSubmit(async ({ email, password }) => {
    setFailed(false);
    const ok = await signIn(email.trim(), password);
    if (ok) void navigate(destination, { replace: true });
    else setFailed(true);
  });

  return (
    <main className="login">
      <div className="login__card">
        <img src={LOGO_URL} alt="" width={56} height={56} className="login__logo" />
        <h1>Masuk admin</h1>
        {status === 'forbidden' ? (
          <div className="login__notice" role="alert">
            <p>Akun ini tidak memiliki akses admin.</p>
            <Button variant="outline" onClick={() => void signOut()}>
              Keluar dari akun ini
            </Button>
          </div>
        ) : (
          <form className="form" onSubmit={(event) => void onSubmit(event)} noValidate>
            <Field label="Email" error={errors.email?.message}>
              {(c) => <input className="input" type="email" autoComplete="username" {...c} {...register('email')} />}
            </Field>
            <Field label="Kata sandi" error={errors.password?.message}>
              {(c) => (
                <input className="input" type="password" autoComplete="current-password" {...c} {...register('password')} />
              )}
            </Field>
            {failed && (
              <p className="form__error" role="alert">
                Email atau kata sandi salah.
              </p>
            )}
            <Button type="submit" icon={LogIn} size="lg" block disabled={isSubmitting}>
              {isSubmitting ? 'Memeriksa…' : 'Masuk'}
            </Button>
          </form>
        )}
        <Link to={ROUTES.home} className="link-arrow">
          Kembali ke situs
        </Link>
      </div>
    </main>
  );
}
