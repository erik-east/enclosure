import { IScoresState } from '../../types/IScores';

const scoresState: IScoresState = {
	highScores: undefined,
	requestingHighScores: false,
	requestingSetUserScore: false,
	requestingUserHighScore: false,
	userHighScore: undefined
};

export default scoresState;
