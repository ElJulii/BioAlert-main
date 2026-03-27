import { PassportStrategy } from '@nestjs/passport'
import { Strategy, Profile } from 'passport-google-oauth20'
import { Injectable } from '@nestjs/common'

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "http://localhost:3001/auth/google/callback",
      scope: ['email', 'profile'],
      passReqToCallback: false,
      proxy: true
    })
  }

  authorizationParams() {
    return {
      prompt: 'select_account'
    }
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    return {
      googleId: profile.id,
      email: profile.emails?.[0]?.value || "",
      name: profile.name?.givenName || "",
      surname: profile.name?.familyName || "",
      picture: profile.photos?.[0].value || "",
    }
  }
}