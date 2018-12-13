type UserSettings = {
  [TupleSpaceName: string]: {
    [UserName: string]: {
      [PropsName: string]: Array<{ value: any; date: number }>;
    };
  };
};

const userSettings: UserSettings = {};

const getUserProps = async (tsName: string, userName: string) => {
  if (!userSettings[tsName]) {
    userSettings[tsName] = {};
    userSettings[tsName][userName] = {};
  } else if (!userSettings[tsName][userName]) {
    userSettings[tsName][userName] = {};
  }
  return userSettings[tsName][userName];
};

export default userSettings;
export { getUserProps };
