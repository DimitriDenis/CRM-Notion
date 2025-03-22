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
    console.log('=== Starting Notion Auth ===', {
      session: req.session,
      headers: req.headers,
      query: req.query
    });
    // La redirection vers Notion se fait automatiquement
  }

  @Get('notion/callback')
  @UseGuards(AuthGuard('notion'))
  async notionCallback(@Req() req, @Res() res) {
    try {
      console.log('=== CALLBACK STARTED ===');
      console.log('Headers:', {
        ...req.headers,
        authorization: req.headers.authorization ? 'present' : 'absent'
      });
      
      
      const { access_token, user } = await this.authService.login(req.user);
      console.log('3. Token et utilisateur générés:', { 
        accessTokenPresent: !!access_token, 
        user: {
          id: user?.id,
          email: user?.email,
          plan: user?.plan
        }
      });
      
      const frontendUrl = this.configService.get('FRONTEND_URL');
      console.log('4. URL frontend:', frontendUrl);
      
      const redirectUrl = new URL('/dashboard', frontendUrl);
      redirectUrl.searchParams.set('token', access_token);
      
      if (user.plan === 'pro') {
        redirectUrl.searchParams.set('premium', 'true');
      }

      console.log('5. Redirection vers:', redirectUrl.toString());
      res.redirect(redirectUrl.toString());
      
    } catch (error) {
      console.error('=== CALLBACK ERROR ===', {
        name: error.name,
        message: error.message,
        stack: error.stack,
        headers: {
          ...req.headers,
          authorization: req.headers.authorization ? 'present' : 'absent'
        },
        query: req.query,
        session: req.session
      });
      
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