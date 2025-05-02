import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import { Request } from 'express';
  
  @Injectable()
  export class ViewGuard implements CanActivate {
    constructor(private readonly jwt: JwtService) {}
    canActivate(context: ExecutionContext): boolean {
      let request: Request = context.switchToHttp().getRequest();
      let token = request.headers.authorization?.split(' ')?.[1];
  
      if (!token) {
        return true
      }
  
      try {
        let data = this.jwt.verify(token);
        request['user-id'] = data.id;
        request['user-role'] = data.role;
        console.log(data.id,data.role)
        return true;
      } catch (error) {
        throw new UnauthorizedException('Wrong credentials!');
      }
    }
  }
  