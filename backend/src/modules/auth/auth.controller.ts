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
  async notionAuth(@Req() req) {
    
    // La redirection vers Notion se fait automatiquement
  }

  @Get('notion/callback')
  @UseGuards(AuthGuard('notion'))
  async notionCallback(@Req() req, @Res() res) {
    try {
      const { access_token, user } = await this.authService.login(req.user);
      
      let frontendUrl = this.configService.get('FRONTEND_URL');
      
      // Construire l'URL avec le token
      const redirectUrl = new URL('/dashboard', frontendUrl);
      redirectUrl.searchParams.set('token', access_token);
      
      if (user.plan === 'pro') {
        redirectUrl.searchParams.set('premium', 'true');
      }

      console.log('Redirecting to:', redirectUrl.toString());
      res.redirect(redirectUrl.toString());
      
    } catch (error) {
      console.error('Auth callback error:', error);
      const frontendUrl = this.configService.get('FRONTEND_URL');
      const errorMessage = encodeURIComponent(error.message || 'Authentication failed');
      res.redirect(`${frontendUrl}/auth/error?message=${errorMessage}`);
    }
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Req() req) {
    return req.user;
  }
}