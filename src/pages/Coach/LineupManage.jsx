import { useEffect, useRef, useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import BackButton from '../../components/BackButton';
import { Separator } from '../../components/ui/separator';

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

const players = [
  { id: 1, name: 'Player 1' },
  { id: 2, name: 'Player 2' },
  { id: 3, name: 'Player 3' },
  // Add more players as needed
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
      {player.name}
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
    <div
      ref={drop}
      className={`absolute flex flex-col items-center justify-center transition-colors ${
        isActive ? 'border-green-500' : 'border-gray-300'
      }`}
      style={{
        top: `${positionY}px`,
        left: `${positionX}px`,
      }}
      onClick={() => onRemove(position.name)}
    >
      <div
        className={`bg-white border-2 rounded-full p-2 text-center flex items-center justify-center transition-colors ${
          isActive ? 'border-green-500' : 'border-gray-300'
        }`}
        style={{
          width: '40px',
          height: '40px',
        }}
      >
        {player ? player.name.slice(0, 2) : ''}
      </div>
      <span className='mt-1 '>{player?.name}</span>
    </div>
  );
};

const LineupManage = () => {
  const [selectedFormation, setSelectedFormation] = useState(formations[0]);
  const [lineup, setLineup] = useState(
    selectedFormation.positions.reduce((acc, pos) => {
      acc[pos.name] = null;
      return acc;
    }, {})
  );

  const [fieldDimensions, setFieldDimensions] = useState({
    fieldWidth: 0,
    fieldHeight: 0,
  });
  const fieldImageRef = useRef(null);

  useEffect(() => {
    const fieldImage = fieldImageRef.current;

    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setFieldDimensions({ fieldWidth: width, fieldHeight: height });
    });

    observer.observe(fieldImage);

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleFormationChange = (event) => {
    const selectedFormationObj = formations.find(
      (formation) => formation.name === event.target.value
    );
    setSelectedFormation(selectedFormationObj);
    setLineup(
      selectedFormationObj.positions.reduce((acc, pos) => {
        acc[pos.name] = null;
        return acc;
      }, {})
    );
  };

  const handleDrop = (position, player) => {
    setLineup((prevLineup) => ({
      ...prevLineup,
      [position]: player,
    }));
  };

  const handleRemove = (position) => {
    setLineup((prevLineup) => ({
      ...prevLineup,
      [position]: null,
    }));
  };

  const assignedPlayers = Object.values(lineup).filter(Boolean);

  return (
    <div className='space-y-6 p-4'>
      <BackButton />
      <div>
        <h2 className='text-2xl font-bold'>Team Lineup</h2>
        <p className='text-gray-600'>Manage team lineup.</p>
      </div>
      <Separator />

      <DndProvider backend={HTML5Backend}>
        <div className='flex flex-col md:flex-row justify-around h-screen w-full'>
          <div className='relative w-full md:w-3/4 h-1/2 md:h-full border-gray-300 rounded-lg overflow-hidden bg-contain bg-center'>
            <img
              src='/stadium_draft.png'
              alt='soccer field'
              className='w-full h-full object-contain'
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
          <div className='flex flex-col w-full md:w-1/4 p-4 mt-4 md:mt-0'>
            <div className='mb-4'>
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
              <h3 className='font-bold mb-2'>Players</h3>
              <div className='flex flex-wrap gap-2'>
                {players
                  .filter((player) => !assignedPlayers.includes(player))
                  .map((player) => (
                    <Player key={player.id} player={player} />
                  ))}
              </div>
            </div>
          </div>
        </div>
      </DndProvider>
    </div>
  );
};

export default LineupManage;
