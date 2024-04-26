import * as z from 'zod';

export const resultFormSchema = () =>
  z.object({
    homeTeamScore: z.any().refine(
      (value) => {
        const parsedValue =
          typeof value === 'string' ? parseInt(value, 10) : value;

        return !isNaN(parsedValue) && parsedValue >= 0;
      },
      {
        message: 'Goals must be a positive number',
      }
    ),

    awayTeamScore: z.any().refine(
      (value) => {
        const parsedValue =
          typeof value === 'string' ? parseInt(value, 10) : value;

        return !isNaN(parsedValue) && parsedValue >= 0;
      },
      {
        message: 'Goals must be a positive integer',
      }
    ),
  });

export const playerStatsFormSchema = () =>
  z.object({
    goals: z.any().refine(
      (value) => {
        const parsedValue =
          typeof value === 'string' ? parseInt(value, 10) : value;

        return !isNaN(parsedValue) && parsedValue >= 0;
      },
      {
        message: 'Goals must be a positive number',
      }
    ),
    assists: z.any().refine(
      (value) => {
        const parsedValue =
          typeof value === 'string' ? parseInt(value, 10) : value;

        return !isNaN(parsedValue) && parsedValue >= 0;
      },
      {
        message: 'Assists must be a positive number',
      }
    ),
    yellowCards: z.any().refine(
      (value) => {
        const parsedValue =
          typeof value === 'string' ? parseInt(value, 10) : value;

        return !isNaN(parsedValue) && parsedValue >= 0;
      },
      {
        message: 'Yellow Cards must be a positive number',
      }
    ),
    redCards: z.any().refine(
      (value) => {
        const parsedValue =
          typeof value === 'string' ? parseInt(value, 10) : value;

        return !isNaN(parsedValue) && parsedValue >= 0;
      },
      {
        message: 'Red Cards must be a positive number',
      }
    ),
    ownGoals: z.any().refine(
      (value) => {
        const parsedValue =
          typeof value === 'string' ? parseInt(value, 10) : value;

        return !isNaN(parsedValue) && parsedValue >= 0;
      },
      {
        message: 'Own Goals must be a positive number',
      }
    ),
    cleanSheets: z
      .any()
      .refine(
        (value) => {
          const parsedValue =
            typeof value === 'string' ? parseInt(value, 10) : value;

          return !isNaN(parsedValue) && parsedValue >= 0;
        },
        {
          message: 'Cleen Sheets must be a positive number',
        }
      )
      .optional(),
    minutesPlayed: z.any().refine(
      (value) => {
        const parsedValue =
          typeof value === 'string' ? parseInt(value, 10) : value;

        return !isNaN(parsedValue) && parsedValue >= 0;
      },
      {
        message: 'Minutes must be a positive number',
      }
    ),
  });
