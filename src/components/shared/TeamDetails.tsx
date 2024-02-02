import { useState, ChangeEvent, useEffect } from 'react';
import { Button, FormControl, FormLabel, Input } from '@mui/material';

interface TeamDetailsProps {
  setAdditionalInfo: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
  minSize: number;
  maxSize: number;
  amount: number;
  teamSize: number;
  setTeamSize: React.Dispatch<React.SetStateAction<number>>;
}

const TeamDetails: React.FC<TeamDetailsProps> = ({
  setAdditionalInfo,
  minSize,
  maxSize,
  setTeamSize,
}) => {
  const [teamMembers, setTeamMembers] = useState<string[]>(Array(minSize).fill(''));
  const [isLastMemberEmpty, setIsLastMemberEmpty] = useState(false);
  useEffect(() => {



    // Set initial values for additionalInfo when the component mounts
    const initialAdditionalInfo: { [key: string]: string } = {};
    for (let i = 0; i < minSize; i++) {
      initialAdditionalInfo[`team-member-${i + 1}`] = '';
      setTeamSize((prevSize) => prevSize + 1);
    }

    setAdditionalInfo(initialAdditionalInfo);
  }, [minSize, setAdditionalInfo, setTeamSize]);

  const handleAddTeamMember = () => {
    const lastMember = teamMembers[teamMembers.length - 1];


    if (teamMembers.length < maxSize && lastMember.trim() !== '') {
      setTeamMembers((prevMembers) => [...prevMembers, '']);
      setIsLastMemberEmpty(false);

      // Add the new team member to additionalInfo with an empty string
      const newMemberIndex = teamMembers.length + 1;
      const key = `team-member-${newMemberIndex}`;
      setAdditionalInfo((prevInfo) => ({ ...prevInfo, [key]: '' }));
      // Update teamSize
      setTeamSize((prevSize) => prevSize + 1);
    } else {
      setIsLastMemberEmpty(true);
    }
  };
  const handleDeleteTeamMember = (index: number) => {
    if (teamMembers.length > minSize) {
      setTeamMembers((prevMembers) => prevMembers.filter((_, i) => i !== index));
      setIsLastMemberEmpty(false);

      // Remove the corresponding question from additionalInfo
      setAdditionalInfo((prevInfo) => {
        const keyToRemove = `team-member-${index + 1}`;
        const { [keyToRemove]: _, ...newInfo } = prevInfo;
        return newInfo;
      });

      // Update teamSize
      setTeamSize((prevSize) => prevSize - 1);
    }
  };


  const handleTeamMemberChange = (index: number, value: string) => {
    const key = `team-member-${index + 1}`;
    setTeamMembers((prevMembers) => {
      const newMembers = [...prevMembers];
      newMembers[index] = value;
      return newMembers;
    });
    setAdditionalInfo((prevInfo) => ({ ...prevInfo, [key]: value }));
  };

  const canAddTeamMember = teamMembers.length < maxSize;

  return (
    <div>
      <div className="card-container">
        <p>team members</p>
        {teamMembers.map((teamMember, index) => (
          <div key={index} className="mb-4">
            <FormControl fullWidth margin="normal">
              <FormLabel htmlFor={`team-member-${index + 1}`} className="block font-bold mb-2">
                {index === 0 ? 'Team Lead' : `Team Member ${index + 1}`}
              </FormLabel>

              <Input
                id={`team-member-${index + 1}`}
                type="text"
                value={teamMember}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleTeamMemberChange(index, e.target.value)
                }
              />
            </FormControl>
          </div>
        ))}
        {isLastMemberEmpty && (
          <div className="mb-2 text-red-500">
            Please fill in the field before adding another team member.
          </div>
        )}
        {maxSize > 1 && (
          <div className="flex flex-between">
            {canAddTeamMember && (
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
                onClick={handleAddTeamMember}
              >
                Add Team Member
              </button>
            )}
            {teamMembers.length > minSize && (
              <div className="mt-2 m-b-2">
                <Button onClick={() => handleDeleteTeamMember(teamMembers.length - 1)}>
                  Remove
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamDetails;
