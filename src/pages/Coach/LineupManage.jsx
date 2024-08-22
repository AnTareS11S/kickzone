import { useEffect, useRef, useState, useCallback } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { motion } from 'framer-motion';
import BackButton from '../../components/BackButton';
import { Separator } from '../../components/ui/separator';
import { useFetchTeamPlayers } from '../../components/hooks/useFetchTeamPlayers';
import { useFetchCoachByUserId } from '../../components/hooks/useFetchCoachByUserId';

const formations = [
  {
    name: '4-4-2',
    positions: [
      { name: 'GK', x: 6, y: 47 },
      { name: 'LB', x: 20, y: 20 },
      { name: 'CB1', x: 20, y: 37 },
      { name: 'CB2', x: 20, y: 57 },
      { name: 'RB', x: 20, y: 75 },
      { name: 'LM', x: 47.5, y: 20 },
      { name: 'CM1', x: 47.5, y: 37 },
      { name: 'CM2', x: 47.5, y: 57 },
      { name: 'RM', x: 47.5, y: 75 },
      { name: 'ST1', x: 75, y: 37 },
      { name: 'ST2', x: 75, y: 57 },
    ],
  },
  {
    name: '4-3-3',
    positions: [
      { name: 'GK', x: 6, y: 47 },
      { name: 'LB', x: 20, y: 20 },
      { name: 'CB1', x: 20, y: 37 },
      { name: 'CB2', x: 20, y: 57 },
      { name: 'RB', x: 20, y: 75 },
      { name: 'LM', x: 47.5, y: 30 },
      { name: 'CM', x: 47.5, y: 47.5 },
      { name: 'RM', x: 47.5, y: 65 },
      { name: 'ST1', x: 75, y: 30 },
      { name: 'ST2', x: 75, y: 48 },
      { name: 'ST3', x: 75, y: 65 },
    ],
  },
  // Add more formations as needed
];

const Player = ({ player, isPositioned }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'player',
    item: { player },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={isPositioned ? null : drag}
      className={`bg-gray-300 rounded-md p-2 cursor-pointer shadow-md transition-transform ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      {player}
    </div>
  );
};

const Position = ({ position, player, onDrop, onRemove, fieldDimensions }) => {
  const [{ canDrop, isOver }, drop] = useDrop({
    accept: 'player',
    drop: (item) => onDrop(position.name, item.player),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const isActive = canDrop && isOver;
  const { fieldWidth, fieldHeight } = fieldDimensions;
  const positionX = (position.x * fieldWidth) / 100;
  const positionY = (position.y * fieldHeight) / 100;

  return (
    <motion.div
      ref={drop}
      className={`absolute flex flex-col items-center transition-colors ${
        isActive ? 'border-green-500' : 'border-gray-300'
      }`}
      style={{
        top: `${positionY}px`,
        left: `${positionX}px`,
      }}
      onClick={() => onRemove(position.name)}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <div
        className={`bg-white border-2 rounded-full w-12 h-12 md:w-16 md:h-16 text-center flex items-center justify-center text-sm md:text-base font-semibold ${
          isActive ? 'border-green-500' : 'border-gray-300'
        }`}
      >
        {player ? player.slice(0, 2) : position.name}
      </div>
      <span className='mt-1 text-xs md:text-sm'>{player || 'Empty'}</span>
    </motion.div>
  );
};

const LineupManage = () => {
  const [selectedFormation, setSelectedFormation] = useState(formations[0]);
  const { coach } = useFetchCoachByUserId();
  const { playersToSelect: players, isLoading } = useFetchTeamPlayers(
    coach?.currentTeam
  );
  const [lineup, setLineup] = useState({});
  const [fieldDimensions, setFieldDimensions] = useState({
    fieldWidth: 0,
    fieldHeight: 0,
  });
  const fieldImageRef = useRef(null);

  useEffect(() => {
    const resetLineup = () => {
      setLineup(
        selectedFormation.positions.reduce((acc, pos) => {
          acc[pos.name] = null;
          return acc;
        }, {})
      );
    };

    resetLineup();
    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setFieldDimensions({ fieldWidth: width, fieldHeight: height });
    });

    if (fieldImageRef.current) {
      observer.observe(fieldImageRef.current);
    }

    return () => observer.disconnect();
  }, [selectedFormation]);

  const handleFormationChange = useCallback((event) => {
    const selectedFormationObj = formations.find(
      (formation) => formation.name === event.target.value
    );
    setSelectedFormation(selectedFormationObj);
  }, []);

  const handleDrop = useCallback((position, player) => {
    setLineup((prevLineup) => ({
      ...prevLineup,
      [position]: player,
    }));
  }, []);

  const handleRemove = useCallback((position) => {
    setLineup((prevLineup) => ({
      ...prevLineup,
      [position]: null,
    }));
  }, []);

  const handleSaveLineup = async () => {
    try {
      const response = await fetch('/api/saveLineup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lineup }),
      });
    } catch (error) {
      console.error('Error saving lineup:', error);
    }
  };

  const assignedPlayers = Object.values(lineup).filter(Boolean);

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        Loading...
      </div>
    );
  }

  return (
    <div className='space-y-6 p-4 max-w-7xl mx-auto'>
      <BackButton />
      <div>
        <h2 className='text-3xl font-bold'>Team Lineup</h2>
        <p className='text-gray-600'>
          Manage and customize your team's formation
        </p>
      </div>
      <Separator />

      <DndProvider backend={HTML5Backend}>
        <div className='flex flex-col lg:flex-row justify-between gap-8'>
          <div className='relative w-full lg:w-3/4 aspect-video border border-gray-300 rounded-lg overflow-hidden'>
            <img
              src='/stadium_draft.png'
              alt='soccer field'
              className='w-full h-full object-cover'
              ref={fieldImageRef}
            />
            <div className='absolute inset-0 flex items-center justify-center'>
              {selectedFormation.positions.map((pos) => (
                <Position
                  key={pos.name}
                  position={pos}
                  player={lineup[pos.name]}
                  onDrop={handleDrop}
                  onRemove={handleRemove}
                  fieldDimensions={fieldDimensions}
                />
              ))}
            </div>
          </div>
          <div className='flex flex-col w-full lg:w-1/4 space-y-6'>
            <div>
              <label
                htmlFor='formation-select'
                className='block font-bold mb-2'
              >
                Formation
              </label>
              <select
                id='formation-select'
                value={selectedFormation.name}
                onChange={handleFormationChange}
                className='w-full p-2 border border-gray-300 rounded-md'
              >
                {formations.map((formation) => (
                  <option key={formation.name} value={formation.name}>
                    {formation.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <h3 className='font-bold mb-2'>Available Players</h3>
              <div className='flex flex-wrap gap-2 max-h-64 overflow-y-auto'>
                {players
                  ?.filter(
                    (player) => !assignedPlayers.includes(player.split(':')[0])
                  )
                  .map((player) => (
                    <Player
                      key={player.split(':')[1]}
                      player={player.split(':')[0]}
                    />
                  ))}
              </div>
            </div>

            <motion.button
              className='bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded shadow-lg'
              onClick={handleSaveLineup}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Save Lineup
            </motion.button>
          </div>
        </div>
      </DndProvider>
    </div>
  );
};

export default LineupManage;
