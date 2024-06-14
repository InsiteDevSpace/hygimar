import { Link } from 'react-router-dom';

// material-ui
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project import
import AuthWrapper from './AuthWrapper';
import AuthRegister from './auth-forms/AuthRegister';
import { Helmet } from 'react-helmet';

// ================================|| REGISTER ||================================ //

export default function Register() {
  return (
    <AuthWrapper>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Hygimar - Inscrire</title>
      </Helmet>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
            <Typography variant="h3">Inscrire</Typography>
            <Typography component={Link} to="/login" variant="body1" sx={{ textDecoration: 'none' }} color="primary">
              Vous avez déjà un compte?{' '}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <AuthRegister />
        </Grid>
      </Grid>
    </AuthWrapper>
  );
}
