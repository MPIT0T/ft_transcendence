/**
 * @fileoverview Type definitions for game entities and page interfaces
 */

/**
 * Represents a player paddle in the game
 */
interface Player {
  /** X position of the paddle */
  x: number;
  /** Y position of the paddle */
  y: number;
  /** Width of the paddle */
  width: number;
  /** Height of the paddle */
  height: number;
  /** Vertical velocity of the paddle */
  vel_y: number;
}

/**
 * Represents the ball in the game
 */
interface Ball {
  /** X position of the ball */
  x: number;
  /** Y position of the ball */
  y: number;
  /** Width of the ball */
  width: number;
  /** Height of the ball */
  height: number;
  /** Horizontal velocity of the ball */
  vel_x: number;
  /** Vertical velocity of the ball */
  vel_y: number;
}

/**
 * Represents the complete game state
 */
interface GameState {
    /** Player 1 paddle state */
    p1: Player;
    /** Player 2 paddle state */
    p2: Player;
    /** Ball state */
    ball: Ball;
    /** Current player number (1 or 2) */
    player: number;
}

/**
 * Base interface for page components
 */
interface Page{
  /**
   * Renders the page HTML
   * @returns HTML string for the page
   */
  render(): string;
  /**
   * Mounts event listeners and initializes the page
   * @param root - Root element to mount into
   */
  mount(root: HTMLElement): void;
}

/**
 * Extended interface for the statistics page with profile and history features
 */
interface StatsPage extends Page {
  /** Renders the profile section HTML */
  renderProfile(): string;
  /** Renders the match history section HTML */
  renderHistory(): string;
  /** Mounts profile-related event listeners */
  mountProfileEvents(root: HTMLElement): void;
  /** Handles add friend button click */
  handleAddFriendClick(root: HTMLElement): void;
  /** Displays friend requests */
  showFriendRequest(root: HTMLElement): void;
  /** Displays online friends list */
  showOnlineFriends(root: HTMLElement): void;
  /** Displays offline friends list */
  showOfflineFriends(root: HTMLElement): void;
  /** Accepts a friend request */
  acceptFriendRequest(username: string, element: HTMLElement): void;
  /** Updates avatar with new image */
  changeNewAvatar(root: HTMLElement, newAvatar: string): void;
  /** Updates the user avatar */
  updateAvatar(): void;
  /** Updates the match history content */
  updateContentHistory() : void;
  /** Calculates matches played within a time period */
  playedTimesinHours(matches: any[], timesInHours: number): {
    matchesPlayed: number;
    timePlayed: number;
  };
  /** Updates time played display */
  updateTimeplayed(matches: any[]): void;
  /** Gets the full avatar path */
  getAvatarPath(avatar: string): string;
}

export type { Player, Ball, GameState , Page, StatsPage};
