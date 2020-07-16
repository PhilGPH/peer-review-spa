export const REGEX_PASSWORD = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}/;

export const UNAVAILABLE_WHEN_LOGGED = {
  slash: '/',
  doubleSlash: '//',
  home: '/home',
  login: '/login',
  register: '/register'
};

export const PATHS = {
  dashboard: 'dashboard',
  home: 'home',
  user: 'user',
  auth: {
    login: 'login',
    logout: 'logout',
    register: 'register',
  },
  team: {
    main: 'team',
    all: 'team/all',
    allInvitations: 'team/invitations',
    updateInvitation: 'team/invitation'
  },
  workItem: {
    main: 'work-item',
    own: 'work-item/own',
    review: 'work-item/review',
    ownReviews: 'work-item/own/reviews',
    comments: 'work-item/comment'
  }
};

export const API_URL_METHOD = (path: string, resource?: string): string => {
  const mainRoute = `http://localhost:3000/api/${path}`;
  return resource ? `${mainRoute}/${resource}` : mainRoute;
};

export const ICONS = {
  ACCEPTED: 'done',
  CHANGE_REQUESTED: 'error_outline',
  REJECTED: 'clear',
  PENDING: 'hourglass_empty'
};

export const STATUS_COLORS = {
  ACCEPTED: 'text-green',
  CHANGE_REQUESTED: 'text-yellow',
  REJECTED: 'text-red',
  PENDING: ''
};
