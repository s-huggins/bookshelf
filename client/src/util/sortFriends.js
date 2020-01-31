const sortFriends = (friends, on) => {
  switch (on) {
    // case 'date-added':
    case sortFriends.DATE_ADDED:
      return friends.sort(
        (f1, f2) => new Date(f2.dateAdded) - new Date(f1.dateAdded)
      );

    // case 'display-name':
    case sortFriends.DISPLAY_NAME:
      return friends.sort((f1, f2) =>
        f1.profile.displayName.localeCompare(
          f2.profile.displayName,
          undefined,
          { numeric: true }
        )
      );

    // case 'last-active':
    case sortFriends.LAST_ACTIVE:
    default:
      return friends.sort(
        (f1, f2) =>
          new Date(f2.profile.lastActive) - new Date(f1.profile.lastActive)
      );
  }
};

sortFriends.DATE_ADDED = 'DATE_ADDED';
sortFriends.DISPLAY_NAME = 'DISPLAY_NAME';
sortFriends.LAST_ACTIVE = 'LAST_ACTIVE';

export default sortFriends;
