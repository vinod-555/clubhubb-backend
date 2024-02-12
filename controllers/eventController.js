import Event from "../models/eventModel.js";
import User from "../models/userModel.js";
import generateQRCode from "../helpers/qrCodeHelper.js";
import studentFormSchema from "../models/studentFormModel.js";
import { sendEventRegistrationConfirmationEmail } from "../helpers/emailHelper.js";
export const getEventList = async (req, res) => {
  try {
    // Get the current time
    const currentTime = new Date();

    // Find events that have not ended yet

    const events = await Event.find({
      "timings.endTime": { $gt: currentTime },
      status: true,
    });
    if (events.length === 0) {
      // No events found
      res.status(404).json({ message: "No events are available to see." });
    } else {
      // Events found
      res.status(200).json(events);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getEventById = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const registerEvent = async (req, res) => {
  try {
    console.log(req.body)
    const userId = req.user._id;
    const { teamSize , eventId } = req.body;
    console.log(teamSize);
    // Remove name and email from customizedData if they are present
    const { name, email, ...remainingData } = req.body.additionalInfo;
    const customizedData = remainingData;
    // Find user and event
    const user = await User.findById(userId);
    const event = await Event.findById(eventId);

    if (!user || !event) {
      return res.status(404).json({ error: "User or Event not found" });
    }

    // Check if the user is already registered for the event
    const isRegistered =
      user.eventsRegistered &&
      user.eventsRegistered.some((event) => event.eventId.equals(eventId));

    if (isRegistered) {
      return res
        .status(400)
        .json({ error: "User is already registered for the event" });
    }

    // Extract required fields from the event model
    const requiredFields = event.requiredInfoOfStudent;

    // According to the team size, add "team-member-index" to the required fields
    const updatedRequiredFields = [...requiredFields];
    if (teamSize > 1) {
      for (let i = 1; i <= teamSize; i++) {
        updatedRequiredFields.push(`team-member-${i}`);
      }
    }
    console.log(updatedRequiredFields);
    // Fetch user details from the User schema
    const extraFields = {};
    Object.entries(customizedData).forEach(([key, value]) => {
      extraFields[key] = value;
    });
    // Fetch user details from the User schema
    const userFormData = {
      name: name ? name : user.name,
      email: email ? email : user.email,
      extraFields: extraFields,
    };

    const filteredStudentFormData = { ...userFormData };
    // Only include required fields in the filteredStudentFormData
    const includedFields = {};

    updatedRequiredFields.forEach((field) => {
      if (filteredStudentFormData[field] !== undefined) {
        includedFields[field] = filteredStudentFormData[field];
      } else if (extraFields[field] !== undefined) {
        // Check if the field is in the extraFields, if yes, add it to includedFields.extraFields
        includedFields.extraFields = includedFields.extraFields || {};
        includedFields.extraFields[field] = extraFields[field];
      }
    });

    // Now includedFields will have the regular fields and extra fields categorized under extraFields

    // Check if all required fields (including regular and extra fields) are present
    // const missingFields = updatedRequiredFields.filter((field) => {
    //   if (includedFields[field] === undefined) {
    //     // Check if the field is in the extraFields, if yes, check if it's present in includedFields.extraFields
    //     return (
    //       extraFields[field] !== undefined &&
    //       includedFields.extraFields[field] === undefined
    //     );
    //   }
    //   return false;
    // });

    // if (missingFields.length > 0) {
    //   return res.status(400).json({
    //     error: `Required fields (${missingFields.join(', ')}) are missing for event registration`,
    //   });
    // }
    console.log(includedFields);
    // Generate QR code using the helper function
    const qrCode = await generateQRCode({
      userId: userId,
      eventId: eventId,
      timestamp: Date.now(),
    });
    // Store
    //iltered student form data in the event model
    event.registeredUserIds.push({
      userId: userId,
      studentFormData: includedFields,
      qrCode: qrCode,
    });
    user.eventsRegistered.push({
      eventId: eventId,
      qrCode: qrCode,
    });
    console.log(includedFields);
    // Save changes to the database
    await user.save();
    await event.save();
    console.log(event.amount)
    if(event.amount===0){
 
    res
      .status(200)
      .json({ message: "Event registration successful", qrCode: qrCode });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const unregisterEvent = async (req, res) => {
  try {
    const userId = req.userId;
    const eventId = req.params.eventId;

    // Find user and event
    const user = await User.findById(userId);
    const event = await Event.findById(eventId);
    console.log(user);
    console.log(event);

    if (!user || !event) {
      return res.status(404).json({ error: "User or Event not found" });
    }
    // Check if the user is registered for the event
    const registrationIndex = user.eventsRegistered.findIndex((registration) =>
      registration.eventId.equals(eventId)
    );

    if (registrationIndex === -1) {
      return res
        .status(404)
        .json({ error: "User is not registered for the event" });
    }

    // Remove user registration from the event
    event.registeredUserIds = event.registeredUserIds.filter(
      (registration) => !registration.userId.equals(userId)
    );

    // Remove event registration from the user
    user.eventsRegistered.splice(registrationIndex, 1);

    // // Save changes to the database
    await user.save();
    await event.save();

    res.status(200).json({ message: "Event unregistration successful" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getEventsByIds = async (req, res) => {
  try {
    // Extract event IDs from the request body
    const userId = req.user._id;

    const eventIds = req.user.eventsRegistered.map((event) => event.eventId);
    console.log(eventIds);

    // Validate that eventIds is an array of valid MongoDB ObjectId strings

    // Find events with IDs in the provided array
    const events = await Event.find({
      _id: { $in: eventIds },
      "timings.endTime": { $gt: new Date() },
    });

    if (events.length === 0) {
      // No events found
      res
        .status(404)
        .json({ message: "No events found for the provided IDs." });
    } else {
      // Events found
      res.status(200).json(events);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
