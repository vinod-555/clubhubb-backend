import Club from '../models/clubModel.js';

export const getClubList = async (req, res) => {
  try {
    // Retrieve the list of clubs
    const clubs = await Club.find();
    // Check if there are no clubs
    if (clubs.length === 0) {
      return res.status(404).json({ message: 'No clubs found.' });
    }
    // Send the list of clubs as a response
    res.status(200).json(clubs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const getSingleClub = async (req, res) => {
  try {
    const clubId = req.params.clubId;

    // Retrieve the details of a single club by its ID
    const club = await Club.findById(clubId);

    // Check if the club exists
    if (!club) {
      return res.status(404).json({ message: 'Club not found.' });
    }

    // Send the club details as a response
    res.status(200).json(club);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
