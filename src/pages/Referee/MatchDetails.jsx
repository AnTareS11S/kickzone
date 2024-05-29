import { useParams } from 'react-router-dom';
import BackButton from '../../components/BackButton';
import { Separator } from '../../components/ui/separator';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Card, CardContent } from '../../components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';

const MatchDetails = () => {
  const leagueId = useParams().id;
  const { currentUser } = useSelector((state) => state.user);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const getRefereeMatches = async () => {
      try {
        const response = await fetch(
          `/api/referee/referee-matches/${leagueId}?userId=${currentUser._id}`
        );
        const data = await response.json();
        setMatches(data);
      } catch (error) {
        console.error(error);
      }
    };
    getRefereeMatches();
  }, [leagueId, currentUser._id]);

  const handleDownloadPDF = async (id, name) => {
    try {
      const res = await fetch(`/api/referee/download-match-details-pdf/${id}`);

      if (!res.ok) {
        throw new Error(`Failed to download PDF. Status: ${res.status}`);
      }

      const blob = await res.blob();
      const fileName = sanitizeFileName(name);
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${fileName}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };

  const polishToEnglish = {
    ą: 'a',
    ć: 'c',
    ę: 'e',
    ł: 'l',
    ń: 'n',
    ó: 'o',
    ś: 's',
    ż: 'z',
    ź: 'z',
  };

  const sanitizeFileName = (fileName) => {
    return fileName.replace(
      /[ąćęłńóśżź]/g,
      (match) => polishToEnglish[match] || match
    );
  };

  const handleDownloadXLSX = async (id, name) => {
    const res = await fetch(`/api/referee/download-match-details-xlsx/${id}`);
    const blob = await res.blob();
    const url = window.URL.createObjectURL(new Blob([blob]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${name}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  };

  const handleDownloadDocx = async (id, name) => {
    const res = await fetch(`/api/referee/download-match-details-docx/${id}`);
    const blob = await res.blob();
    const url = window.URL.createObjectURL(new Blob([blob]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${name}.docx`);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  };

  return (
    <div className='container mx-auto py-8 px-4 md:px-6 lg:px-8'>
      <BackButton />
      <div className='mb-6'>
        <h1 className='text-2xl font-bold mb-2'>Match Details</h1>
        <p className='text-gray-600'>
          Download match details here before the match starts.
        </p>
      </div>
      <Separator />
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {matches?.map((match) => (
          <Card key={match._id} className='bg-white rounded-lg shadow-md'>
            <CardContent className='flex flex-col p-6'>
              <div className='mb-4'>
                <h2 className='text-lg font-bold'>
                  {match.homeTeam?.name} vs {match.awayTeam?.name}
                </h2>
                <p className='text-gray-600'>
                  {new Date(match.startDate).toLocaleString('en-US', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                  })}
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger className='inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'>
                  Download
                </DropdownMenuTrigger>
                <DropdownMenuContent className='bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                  <DropdownMenuLabel className='px-4 py-2 text-sm font-medium text-gray-700'>
                    Match Details
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup className='p-1 '>
                    <DropdownMenuItem
                      onClick={() =>
                        handleDownloadDocx(
                          match?._id,
                          match.homeTeam?.name +
                            ' vs ' +
                            match.awayTeam?.name +
                            ' Match Details'
                        )
                      }
                    >
                      Download in Word
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        handleDownloadPDF(
                          match?._id,
                          match.homeTeam?.name +
                            ' vs ' +
                            match.awayTeam?.name +
                            ' Match Details'
                        )
                      }
                    >
                      Download in PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        handleDownloadXLSX(
                          match?._id,
                          match.homeTeam?.name +
                            ' vs ' +
                            match.awayTeam?.name +
                            ' Match Details'
                        )
                      }
                    >
                      Download in Excel
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MatchDetails;
