import { isUuid } from '@shared/utils/helpers/uuid.helper';
import { v4 as uuid } from 'uuid';

describe('uuid helper', () => {
  it('should return true when value is a valid uuid', () => {
    const _uuid = uuid();
    expect(isUuid(_uuid)).toBeTruthy();
  });

  it('should return false when value is not a valid uuid', () => {
    const _uuid = uuid() + 'aaaaaaaaaaaaaaaaaaaaaaaaa';
    expect(isUuid(_uuid)).toBeFalsy();

    const uuid2 = '3f2504e0';
    expect(isUuid(uuid2)).toBeFalsy();

    const uuid3 = ' ';
    expect(isUuid(uuid3)).toBeFalsy();
  });
});
