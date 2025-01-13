// src/modules/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateNotionUser(profile: any): Promise<User> {
    let user = await this.usersService.findByNotionUserId(profile.id);
    
    if (!user) {
      user = await this.usersService.createUser({
        notionUserId: profile.id,
        email: profile.email,
        name: profile.name,
        notionAccessToken: profile.accessToken,
        notionWorkspaceId: profile.workspaceId,
        isActive: true,
      });
    } else {
      user = await this.usersService.updateUser(user.id, {
        notionAccessToken: profile.accessToken,
        isActive: true,
      });
    }

    return user;
  }

  async login(user: User) {
    const payload = { 
      sub: user.id,
      email: user.email,
      plan: user.plan 
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        plan: user.plan,
      },
    };
  }
}