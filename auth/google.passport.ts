import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import UsersService from '@users/users.service';
import type { User } from '@users/types/users';
import shortid from 'shortid';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists in the database
        let user: User | null = await UsersService.getUserByEmail(
          profile.emails?.[0].value || ''
        );

        if (user === null) {
          // Create a new user with Google profile info
          user = {
            _id: shortid.generate(),
            email: profile.emails?.[0].value || '',
            password: '',
            firstName: profile.name?.givenName || '',
            lastName: profile.name?.familyName || '',
            followingUsers: [],
            status: '',
            pictureSrc: profile.photos?.[0].value || '',
          };

          await UsersService.create(user);
        }
        done(null, user);
      } catch (err) {
        done(err, false);
      }
    }
  )
);

export default passport;
