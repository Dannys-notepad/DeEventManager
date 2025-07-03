const firstEventResTemp = [
    {
  "id": "evt_89ab3c7d201",
  "title": "Annual Tech Conference 2025",
  "description": "Join us for the biggest tech event of the year! Keynotes, workshops, and networking.",
  "status": "published",
  "organizer_id": "usr_5f8d3a1b67e",
  "date": "2025-07-15T09:00:00Z",
  "duration": 8, // in hours
  "location": {
    "type": "physical",
    "address": "Convention Center, 123 Tech Blvd, San Francisco",
    "map_link": "https://maps.example.com/conv-center"
  },
  "capacity": 200,
  "current_registrations": 142,
  "registration_open": true,
  "registration_deadline": "2025-07-10T23:59:59Z",
  "categories": ["technology", "networking"],
  "created_at": "2025-06-10T14:30:00Z",
  "updated_at": "2025-06-28T09:12:34Z",
  "notifications": {
    "attendee_confirmation": true,
    "reminder_24h": true,
    "capacity_alert": 80
  },
  "action_required": [
    "confirm_venue_deposit",
    "finalize_catering_menu"
  ],
  "_links": {
    "self": "/api/events/evt_89ab3c7d201",
    "registrations": "/api/events/evt_89ab3c7d201/registrations",
    "publish": "/api/events/evt_89ab3c7d201/publish",
    "cancel": "/api/events/evt_89ab3c7d201/cancel"
  }
}
]

const secondEventResTemp = [
    {
  "id": "evt_89ab3c7d201",
  "title": "Annual Tech Conference 2025",
  "description": "Join us for the biggest tech event of the year! Keynotes, workshops, and networking.",
  "status": "published",
  "organizerId": "usr_5f8d3a1b67e",
  "date": "2025-07-15T09:00:00Z",
  "duration": 8,
  "locationType": "physical",
  "address": "Convention Center, 123 Tech Blvd, San Francisco",
  "mapLink": "https://maps.example.com/conv-center",
  "capacity": 200,
  "currentRegistrations": 142,
  "registrationOpen": true,
  "registrationDeadline": "2025-07-10T23:59:59Z",
  "categories": ["technology", "networking"],
  "createdAt": "2025-06-10T14:30:00Z",
  "updatedAt": "2025-06-28T09:12:34Z",
  "notificationSettings": {
    "sendConfirmation": true,
    "sendReminder": true,
    "capacityAlertThreshold": 80
  },
  "actionRequired": ["confirm_venue_deposit", "finalize_catering_menu"],
  "_links": {
    "self": "/api/events/evt_89ab3c7d201",
    "registrations": "/api/events/evt_89ab3c7d201/registrations"
  }
}
]

const eventErrorMsg = [
    {
  "error": {
    "code": "event_not_found",
    "message": "Event with ID 'evt_invalid123' does not exist",
    "documentation": "https://api.yourservice.com/docs/errors#event_not_found"
  },
  "suggested_actions": [
    "Verify event ID",
    "Check your events: GET /api/events"
  ]
}
]

const emailNptificationPayload = [
    {
  "template": "registration_confirmation",
  "recipient": "attendee@example.com",
  "event_id": "evt_89ab3c7d201",
  "data": {
    "event_title": "Tech Conference 2025",
    "date": "July 15, 2025",
    "organizer": "Alex Johnson",
    "download_link": "https://.../tickets/12345"
  }
}
]

const userProfileResponse = [
    {
  "id": "usr_5f8d3a1b67e",
  "name": "Alex Johnson",
  "email": "alex@example.com",
  "avatarUrl": null,
  "accountType": "organizer",
  "organization": "Tech Innovators Inc",
  "createdAt": "2024-03-15T10:30:00Z",
  "updatedAt": "2025-06-28T14:22:11Z",
  "notificationPreferences": {
    "email": true,
    "sms": false,
    "eventReminders": true,
    "registrationUpdates": true
  },
  "_links": {
    "self": "/api/user/profile",
    "updateProfile": "/api/user/profile",
    "changePassword": "/api/user/password",
    "myEvents": "/api/events?organizer=usr_5f8d3a1b67e"
  }
}
]

