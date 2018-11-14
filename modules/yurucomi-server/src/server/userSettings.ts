type UserSettings = {
  [TupleSpaceName: string]: {
    [UserName: string]: {
      props: {
        [PropsName: string]: Array<{ value: any; date: number }>;
      };
      memberSettings: {
        [MenmberName: string]: Array<any>;
      };
    };
  };
};

const userSettings: UserSettings = {
  // masuilab: {
  //   saji: {
  //     props: {
  //       where: [{ value: "aaa", date: 1 }, { value: "bbb", date: 2 }],
  //     },
  //     memberSettings: {
  //       shige: [],
  //     },
  //   },
  // },
};

const getUserProps = async (tsName: string, userName: string) => {
  if (!userSettings[tsName]) {
    userSettings[tsName] = {};
    userSettings[tsName][userName] = { props: {}, memberSettings: {} };
  } else if (!userSettings[tsName][userName]) {
    userSettings[tsName][userName] = { props: {}, memberSettings: {} };
  }
  return userSettings[tsName][userName].props;
};

export default userSettings;
export { getUserProps };
