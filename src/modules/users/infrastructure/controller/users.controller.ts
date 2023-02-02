import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpCode,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from '../../dto/create-user.dto';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '../../application/use-cases/createUser';
import { UsersQueryRepository } from '../repository/users.query.repository';
import { QueryParamsDto } from '../../../../common/pipes/query-params.dto';
import { RemoveUserCommand } from '../../application/use-cases/removeUser';
import { BasicAuthGuard } from '../../../auth/strategies/basic.strategy';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersQueryRepository: UsersQueryRepository,
    private commandBus: CommandBus,
  ) {}

  @UseGuards(BasicAuthGuard)
  @Post()
  @HttpCode(201)
  async create(@Body() createUserDto: CreateUserDto) {
    const createdUserId = await this.commandBus.execute(
      new CreateUserCommand(createUserDto),
    );
    return this.usersQueryRepository.findById(createdUserId);
  }
  @UseGuards(BasicAuthGuard)
  @Get()
  findAllUsers(@Query() queryParams: QueryParamsDto) {
    return this.usersQueryRepository.findAll(queryParams);
  }

  @UseGuards(BasicAuthGuard)
  @Delete(':userId')
  @HttpCode(204)
  async removeUser(@Param('userId', ParseUUIDPipe) userId: string) {
    await this.commandBus.execute(new RemoveUserCommand(userId));
  }
}
