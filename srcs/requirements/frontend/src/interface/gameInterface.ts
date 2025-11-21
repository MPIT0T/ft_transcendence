interface Player {
  x: number;      // Position horizontale
  y: number;      // Position verticale
  width: number;  // Largeur de la raquette
  height: number; // Hauteur de la raquette
  vel_y: number;  // Vélocité verticale
}

interface Ball {
  x: number;      // Position horizontale
  y: number;      // Position verticale
  width: number;  // Largeur de la balle
  height: number; // Hauteur de la balle
  vel_x: number;  // Vélocité horizontale
  vel_y: number;  // Vélocité verticale
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
}

export type { Player, Ball, GameState , Page, StatsPage};
