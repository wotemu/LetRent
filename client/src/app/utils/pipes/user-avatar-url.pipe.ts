import { Pipe } from '@angular/core';
import { PropertyImage } from '../../models/property-image';
import { AppSetting } from '../../helpers/app-setting';
import { Account } from '../../models/account';

@Pipe({
  name: 'userAvatarUrl'
})
export class UserAvatarUrlPipe {
  transform(account: Account, args: string[]): string {
    if (account && account.avatarUrl) {
      return account.avatarUrl;
    }
    return AppSetting.NO_AVATAR_URL;
  }
}
