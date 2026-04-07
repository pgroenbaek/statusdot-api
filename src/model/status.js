export const Status = Object.freeze({
  OFFLINE: 0,
  ONLINE: 1,
  AWAY: 2,
  BUSY: 3,
});

export const StatusColors = Object.freeze({
  [Status.OFFLINE]: "#FF0000",
  [Status.ONLINE]: "#00FF00",
  [Status.AWAY]: "#FFA500",
  [Status.BUSY]: "#FF0000",
});