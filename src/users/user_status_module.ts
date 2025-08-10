import { Global, Module } from "@nestjs/common";
import { UserStatusService } from "./service/users.service.user_status_service";

@Global()
@Module({
  providers: [UserStatusService],
  exports: [UserStatusService],
})
export class UserStatusModule {}