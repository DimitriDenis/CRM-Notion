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
    const { access_token, user } = await this.authService.login(req.user);
    
    // Redirige vers le frontend avec le token
    const frontendUrl = this.configService.get('FRONTEND_URL');
    res.redirect(`${frontendUrl}/auth/callback?token=${access_token}`);
  }
}