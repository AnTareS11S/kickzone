import * as z from 'zod';

export const resultFormSchema = () =>
  z.object({
    homeTeamScore: z.coerce.number().gte(0, 'Goals must be a positive number'),
    awayTeamScore: z.coerce.number().gte(0, 'Goals must be a positive number'),
  });

export const playerStatsFormSchema = () =>
  z.object({
    goals: z.coerce.number().gte(0, 'Goals must be a positive number'),
    assists: z.coerce.number().gte(0, 'Assists must be a positive number'),
    yellowCards: z.coerce
      .number()
      .gte(0)
      .lte(2, 'Yellow Cards must be a positive number and cannot exceed 2'),

    redCards: z.coerce
      .number()
      .gte(0)
      .lte(1, 'Red Cards must be a positive number and cannot exceed 1'),

    ownGoals: z.coerce.number().gte(0, 'Own Goals must be a positive number'),
    cleanSheets: z.coerce
      .number()
      .gte(0, 'Clean Sheets must be a positive number')
      .lte(1, 'Clean Sheets cannot exceed 1')
      .optional(),
    minutesPlayed: z.coerce
      .number()
      .gte(0, 'Minutes Played must be a positive number')
      .lte(90, 'Minutes Played cannot exceed 90'),
  });
