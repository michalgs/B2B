## Feature: Company registration
### As a company representative I want to register my company on the website, so that I can create offerings.
### Scenario #1 - Successful registration
- **GIVEN**: User redirects to the register page
- **WHEN**: User enters valid: NIP, name and company address
- **AND**: Clicks 'Register' button
- **THEN**: User is logged into the system and receives a success toast

### Scenario #2 - Unsuccessful registration (invalid data)
- **GIVEN**: User redirects to the register page
- **WHEN**: User enters invalid: NIP, name or company address
- **AND**: Clicks 'Register' button
- **THEN**: User sees the invalid fields marked in red and receives a failure toast

### Scenario #3 - Unsuccessful registration (company already registered)
- **GIVEN**: User redirects to the register page
- **WHEN**: User enters valid company data, but company already exists
- **AND**: Clicks 'Register' button
- **THEN**: User sees the fields marked in red and receives a failure toast

### Scenario #4 - Profile customization
- **GIVEN**: User is logged in as a company representative
- **AND**: User clicks on the profile page
- **WHEN**: User clicks on the 'Edit' button
- **AND**: User uploads a company icon and updates company description
- **AND**: User clicks the 'Confirm' button
- **THEN**: Changes to the company profile are persisted to the database and are available for other users to see.

### Scenario #5 - Negotiation preferences
- TODO

## Feature: Sending negotiations
### As a company representative I want to invite other companies to negotiations and present the initial offering
### Scenario #1 - Successful invitation sendout
- **GIVEN**: User is logged in as a company representative
- **AND**: User clicks the 'New offering' button
- **WHEN**: User selects the recipient from the dropdown
- **AND**: User types in the offer title, description, valid price and deadline
- **THEN**: Offering is persisted to the database and the other company can see the invitation to the negotiations

### Scenario #2 - Unsuccessful invitation sendout (invalid data)
- **GIVEN**: User is logged in as a company representative
- **AND**: User clicks the 'New offering' button
- **WHEN**: User selects the recipient from the dropdown
- **AND**: User types in the offer title, description, invalid price or deadline
- **THEN**: User sees the fields marked in red and receives a failure toast

## Feature: Handling negotiations
### As a user I want to accept or decline incoming negotiations
### Scenario #1 - Show the initial offering
- **GIVEN**: User is logged in as a company representative which is the recipient of the initial offering
- **AND**: User is on the company dashboard
- **WHEN**: User clicks on the offer
- **AND**: Modal is displayed
- **THEN**: User sees the initial offering's details

### Scenario #2 - Accept the negotiation invitation
- **GIVEN**: User is logged in as a company representative which is the recipient of the initial offering
- **AND**: User is on the company dashboard
- **AND**: Initial offer's modal is displayed
- **WHEN**: User clicks on the 'Accept offer' button
- **THEN**: User is redirected to the accepted negotiation's screen
- **AND**: Decision is persisted to the database
- **AND**: Inviter can see the recipient's decision

### Scenario #3 - Reject the negotiation invitation
- **GIVEN**: User is logged in as a company representative which is the recipient of the initial offering
- **AND**: User is on the company dashboard
- **AND**: Initial offer's modal is displayed
- **WHEN**: User clicks on the 'Decline offer' button
- **THEN**: Decision is persisted to the database
- **AND**: Inviter can see the recipient's decision

### Scenario #4 - Do not accept duplicated negotiation decisions (Accept)
- **GIVEN**: User is logged in as a company representative which is the recipient of the initial offering
- **AND**: User is on the company dashboard
- **AND**: Initial offer's modal is displayed
- **AND**: The decision was already made
- **WHEN**: User clicks on the 'Accept offer' button
- **THEN**: User sees the toast saying that the negotiations have already started

### Scenario #5 - Do not accept duplicated negotiation decisions (Decline)
- **GIVEN**: User is logged in as a company representative which is the recipient of the initial offering
- **AND**: User is on the company dashboard
- **AND**: Initial offer's modal is displayed
- **AND**: The decision was already made
- **WHEN**: User clicks on the 'Decline offer' button
- **THEN**: User sees the toast saying that the offer was already declined


## Feature: Counteroffers
### As a user receiving an offer I want to be able to send a counteroffer
### Scenario #1 - Successful counteroffer submission
- **GIVEN**: User is logged in as a company representative which is the recipient of the initial offering
- **AND**: User is on the negotiation screen
- **WHEN**: User modifies the price, quantity or deadline
- **AND**: User clicks the 'Submit counteroffer' button
- **THEN**: Counteroffer is persisted to the database as a new version of the offer
- **AND**: The other party is notified about the counteroffer

### Scenario #2 - Unsuccessful counteroffer submission (invalid data)
- **GIVEN**: User is logged in as a company representative which is the recipient of the initial offering
- **AND**: User is on the negotiation screen
- **WHEN**: User enters an invalid price, quantity or deadline
- **AND**: User clicks the 'Submit counteroffer' button
- **THEN**: User sees the invalid fields marked in red and receives a failure toast

### Scenario #3 - Counteroffer submitted on already resolved negotiation
- **GIVEN**: User is logged in as a company representative which is the recipient of the initial offering
- **AND**: User is on the negotiation screen
- **AND**: The negotiation has already been accepted or declined
- **WHEN**: User clicks the 'Submit counteroffer' button
- **THEN**: User sees a toast saying that the negotiation is already resolved and no counteroffer can be submitted

### Scenario #4 - View counteroffer as the initiator
- **GIVEN**: User is logged in as a company representative which is the initiator of the negotiation
- **AND**: User is on the negotiation screen
- **WHEN**: The other party submits a counteroffer
- **THEN**: User sees the updated offer parameters and is notified about the new counteroffer version