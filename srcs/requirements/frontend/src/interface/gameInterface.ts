interface Player {
  x: number;
  y: number;
  width: number;
  height: number;
  vel_y: number;
}

interface Ball {
  x: number;
  y: number;
  width: number;
  height: number;
  vel_x: number;
  vel_y: number;
}

interface GameState {
    p1: Player;
    p2: Player;
    ball: Ball;
    player: number;
}

interface Page{
  render(): string;
  mount(root: HTMLElement): void;
}

interface StatsPage extends Page {
  renderProfile(): string;
  renderHistory(): string;
  mountProfileEvents(root: HTMLElement): void;
  handleAddFriendClick(root: HTMLElement): void;
  showFriendRequest(root: HTMLElement): void;
  showOnlineFriends(root: HTMLElement): void;
  showOfflineFriends(root: HTMLElement): void;
  acceptFriendRequest(username: string, element: HTMLElement): void;
  changeNewAvatar(root: HTMLElement, newAvatar: string): void;
  updateAvatar(): void;
  updateContentHistory() : void;
  playedTimesinHours(matches: any[], timesInHours: number): {
    matchesPlayed: number;
    timePlayed: number;
  };
  updateTimeplayed(matches: any[]): void;
  getAvatarPath(avatar: string): string;
}

export type { Player, Ball, GameState , Page, StatsPage};
