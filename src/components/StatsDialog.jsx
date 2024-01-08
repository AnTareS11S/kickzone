/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from 'react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Label } from './ui/label';

import { PlusCircledIcon, MinusCircledIcon } from '@radix-ui/react-icons';

const StatsDialog = ({ row }) => {
  const [updatedRow, setUpdatedRow] = useState({ ...row });

  const statistics = [
    { label: 'Games Played', value: 'gamesPlayed' },
    { label: 'Wins', value: 'wins' },
    { label: 'Draws', value: 'draws' },
    { label: 'Losses', value: 'losses' },
    { label: 'Goals For', value: 'goalsFor' },
    { label: 'Goals Against', value: 'goalsAgainst' },
  ];

  const addStat = async (stat) => {
    try {
      //   if (canAddStat(updatedRow)) {
      const res = await fetch('/api/team/add-stat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          teamId: row.team,
          stat: stat,
        }),
      });

      if (res.ok) {
        setUpdatedRow((prevRow) => ({
          ...prevRow,
          [stat]: prevRow[stat] + 1,
        }));
      } else {
        console.error('Error adding stat');
      }
      //   }
    } catch (error) {
      console.log(error);
    }
  };

  const removeStat = async (stat) => {
    try {
      if (canRemoveStat(updatedRow, stat)) {
        const res = await fetch('/api/team/remove-stat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            teamId: row.team,
            stat: stat,
          }),
        });

        if (res.ok) {
          setUpdatedRow((prevRow) => ({
            ...prevRow,
            [stat]: prevRow[stat] - 1,
          }));
        } else {
          console.error('Error removing stat');
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const canAddStat = (rowt) => {
    const { gamesPlayed, wins, draws, losses } = rowt;

    // Ensure that the sum of wins, draws, and losses does not exceed the total games played
    return gamesPlayed === 0 || wins + draws + losses < gamesPlayed;
  };

  const canRemoveStat = (rowt, stat) => {
    return rowt[stat] > 0;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className='bg-primary-500 hover:bg-purple-600'>
          Add Statistics
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='text-heading4-medium mb-2'>
            Add Team Statistics
          </DialogTitle>
          <DialogDescription>{updatedRow.name}</DialogDescription>
        </DialogHeader>
        <div className='flex flex-col'>
          {statistics.map((stat) => (
            <div
              className='flex flex-row items-center justify-between mt-4'
              key={stat.label}
            >
              <Label className='font-bold w-24'>{stat.label}</Label>
              <MinusCircledIcon
                className='w-5 h-5 cursor-pointer'
                onClick={() => removeStat(stat.value)}
              />
              <Label className='w-6'>{updatedRow[stat.value]}</Label>
              <PlusCircledIcon
                className='w-5 h-5 cursor-pointer'
                onClick={() => addStat(stat.value)}
              />
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default StatsDialog;
