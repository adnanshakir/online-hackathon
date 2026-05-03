import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { config } from './config.js';

passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      callbackURL: config.GOOGLE_CALLBACK_URL,
    },
    (accessToken, refreshToken, profile, done) => {
      const user = {
        googleId: profile.id,
        name:
          profile.displayName ||
          profile.emails?.[0]?.value?.split('@')[0] ||
          'Google User',
        email: profile.emails?.[0]?.value,
        avatar: profile.photos?.[0]?.value || '',
      };

      return done(null, user);
    }
  )
);

export default passport;
