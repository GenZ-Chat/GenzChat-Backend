import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UsersService, CreateUserDto, UpdateUserDto } from './users.service';
import { FriendDTO } from './dto/friends_dto';

@Controller('api/users/')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.usersService.create(createUserDto);
      console.log('User created:', user);
      return user;
    } catch (error) {
      if (error.code === 11000) {
        throw new HttpException('Email already exists', HttpStatus.CONFLICT);
      }
      console.error('Error creating user:', error);
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  @Get('auth0/:id')
  async findByAuth0Id(@Param('id') id: string) {
    const user = await this.usersService.findByAuth0Id(id);
    console.log(user);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.usersService.update(id, updateUserDto);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const user = await this.usersService.remove(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return { message: 'User deleted successfully' };
  }

  // @Post(':id/friends/:friendId')
  // async addFriend(@Param('id') id: string, @Param('friendId') friendId: string) {
  //   try {
  //     const user = await this.usersService.addFriend(id, friendId);
  //     return user;
  //   } catch (error) {
  //     throw new HttpException((error as Error).message, HttpStatus.BAD_REQUEST);
  //   }
  // }

  // @Delete(':id/friends/:friendId')
  // async removeFriend(@Param('id') id: string, @Param('friendId') friendId: string) {
  //   try {
  //     const user = await this.usersService.removeFriend(id, friendId);
  //     return user;
  //   } catch (error) {
  //     throw new HttpException((error as Error).message, HttpStatus.BAD_REQUEST);
  //   }
  // }

  // @Get(':id/friends')
  // async getFriends(@Param('id') id: string): Promise<FriendDTO[]> {
  //   try {
  //       console.log(id)
  //     const friends = await this.usersService.getFriends(id);
  //     return friends;
  //   } catch (error) {
  //     throw new HttpException((error as Error).message, HttpStatus.BAD_REQUEST);
  //   }
  // }
}
