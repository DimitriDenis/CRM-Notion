// src/modules/auth/auth.controller.ts
import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Get('notion')
  @UseGuards(AuthGuard('notion'))
  async notionAuth() {
    // Redirige vers Notion OAuth
  }

  @Get('notion/callback')
  @UseGuards(AuthGuard('notion'))
  async notionCallback(@Req() req, @Res() res) {
    try {
      const { access_token, user } = await this.authService.login(req.user);
      
      // Redirige vers le frontend avec le token
      const frontendUrl = this.configService.get('FRONTEND_URL');
      const redirectUrl = new URL('/auth/callback', frontendUrl);
      redirectUrl.searchParams.set('token', access_token);
      
      if (user.plan === 'pro') {
        redirectUrl.searchParams.set('premium', 'true');
      }

      res.redirect(redirectUrl.toString());
    } catch (error) {
      console.error('Auth callback error:', error);
      const frontendUrl = this.configService.get('FRONTEND_URL');
      res.redirect(`${frontendUrl}/auth/error?message=Authentication failed`);
    }
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Req() req) {
    return req.user;
  }

  
}