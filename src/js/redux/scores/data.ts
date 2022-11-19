import { AxiosPromise } from 'axios';

import { get, post } from '../../lib/request';

export function postUserScore(score: number, gameModifier: number, gameModeSlug: string, gameContentSlug: string): AxiosPromise {
	return post('scores/', {
		data: {
			game_content_slug: gameContentSlug,
			game_mode_slug: gameModeSlug,
			game_modifier: gameModifier,
			score
		}
	});
}

export function getHighScores(gameModifier: number, gameModeSlug: string, gameContentSlug: string): AxiosPromise {
	return get(`scores/high_scores?game_modifier=${gameModifier}&game_mode_slug=${gameModeSlug}&game_content_slug=${gameContentSlug}`);
}

export function getUserHighScore(gameModifier: number, gameModeSlug: string, gameContentSlug: string): AxiosPromise {
	return get(`scores/high_score?game_modifier=${gameModifier}&game_mode_slug=${gameModeSlug}&game_content_slug=${gameContentSlug}`);
}
