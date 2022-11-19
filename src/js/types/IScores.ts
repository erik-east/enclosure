export interface IHighScore {
	date: string;
	game_content: string;
	game_mode: string;
	game_modifier: number;
	id: string;
	rank: number;
	score: number;
	username: string;
}

export interface IScoresActionPayload {
	gameContentSlug?: string;
	gameModeSlug?: string;
	gameModifier?: number;
	highScores?: Array<IHighScore>;
	score?: number;
	userHighScore?: any;
}

export interface IScoresState {
	highScores: Array<IHighScore>;
	requestingHighScores: boolean;
	requestingSetUserScore: boolean;
	requestingUserHighScore: boolean;
	userHighScore: any;
}
